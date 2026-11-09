import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, radius, space } from '@/theme/tokens';
import { Header, Screen, Segmented, Loading, ErrorState, Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextField } from '@/components/ui/forms';
import { useConfirm } from '@/components/ui/confirm';
import { AdminGate } from '@/components/admin';
import { BRAND_WORD } from '@/components/ui/Brand';
import type { BroadcastAudience } from '@/domain/types';
import { ago } from '@/domain/time';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Admin · Broadcast (superadmin): push to all members or all companions. */
export default function AdminBroadcast() {
  return (
    <AdminGate superOnly>
      <Broadcast />
    </AdminGate>
  );
}

const TITLE_MAX = 65;
const BODY_MAX = 240;

function Broadcast() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const [audience, setAudience] = useState<BroadcastAudience>('members');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const counts = useQuery({ queryKey: qk.admin.audience, queryFn: svc.admin.audience });
  const history = useQuery({ queryKey: qk.admin.broadcasts, queryFn: svc.admin.broadcasts });
  const send = useMutation({
    mutationFn: () => svc.admin.broadcast({ audience, title: title.trim(), body: body.trim() }),
    onSuccess: (r) => {
      setTitle('');
      setBody('');
      void qc.invalidateQueries({ queryKey: qk.admin.broadcasts });
      void confirm({ title: 'Sent', message: r.message });
    },
    onError: (e) => confirm({ title: 'Could not send', message: errorMessage(e) }),
  });
  const n = counts.data?.[audience];
  const valid = title.trim().length >= 2 && title.length <= TITLE_MAX && body.trim().length >= 2 && body.length <= BODY_MAX;
  const who = audience === 'members' ? 'members' : 'verified companions';

  return (
    <Screen
      padded={false}
      footer={
        <Button
          label={n === undefined ? 'Send' : `Send to ${n} device${n === 1 ? '' : 's'}`}
          icon="send"
          haptic
          disabled={!valid || n === 0}
          loading={send.isPending}
          onPress={async () => {
            if (await confirm({ title: `Send to all ${who}?`, message: `“${title.trim()}” goes to ${n ?? 'every'} device${n === 1 ? '' : 's'} now. This can’t be undone.`, confirmLabel: 'Send now' })) send.mutate();
          }}
        />
      }
    >
      <Header title="Broadcast" />
      <View style={{ paddingHorizontal: 20, gap: space.lg }}>
        <Segmented
          options={[
            { value: 'members', label: 'Members' },
            { value: 'companions', label: 'Companions' },
          ]}
          value={audience}
          onChange={setAudience}
        />
        <Text variant="footnote" muted>
          {counts.isLoading ? 'Counting devices…' : counts.isError ? errorMessage(counts.error) : `${n ?? 0} ${who} have notifications turned on. Pushes only reach the installed app (not Expo Go or the web).`}
        </Text>
        <TextField label={`Title (${title.length}/${TITLE_MAX})`} value={title} onChangeText={(t) => setTitle(t.slice(0, TITLE_MAX))} placeholder="Weekend slots are filling up" />
        <TextField label={`Message (${body.length}/${BODY_MAX})`} value={body} onChangeText={(t) => setBody(t.slice(0, BODY_MAX))} multiline placeholder="Book before Friday to get your favourite companion." />

        <View style={{ gap: space.xs }}>
          <Text variant="subhead" color={colors.gray600}>
            Preview
          </Text>
          <View style={styles.preview} accessible accessibilityLabel={`Preview: ${title || 'Title'}. ${body || 'Message'}`}>
            <View style={styles.appIcon}>
              <Icon name="sparkle" size={16} color={colors.onMoss} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="caption" muted>
                {BRAND_WORD} · now
              </Text>
              <Text variant="headline" numberOfLines={1}>
                {title || 'Title'}
              </Text>
              <Text variant="footnote" numberOfLines={4}>
                {body || 'Your message appears here.'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ gap: space.sm, marginBottom: space.xl }}>
          <Text variant="subhead" color={colors.gray600}>
            Sent before
          </Text>
          {history.isLoading ? (
            <Loading />
          ) : history.isError ? (
            <ErrorState message={errorMessage(history.error)} onRetry={() => history.refetch()} />
          ) : history.data?.length ? (
            history.data.map((b) => (
              <Card key={b._id} style={{ gap: 2, padding: space.md }}>
                <Text variant="caption" muted>
                  {b.audience === 'members' ? 'Members' : 'Companions'} · {ago(b.createdAt)} · {b.sent}/{b.recipients} delivered{b.failed ? ` · ${b.failed} failed` : ''}
                </Text>
                <Text variant="headline">{b.title}</Text>
                <Text variant="footnote" muted>
                  {b.body}
                </Text>
              </Card>
            ))
          ) : (
            <Text variant="footnote" muted>
              No broadcasts yet.
            </Text>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: { flexDirection: 'row', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  appIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
});
