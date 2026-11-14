import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Chip, EmptyState, ErrorState, Header, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/forms';
import { Notice, Skeleton } from '@/components/ui/states';
import { useConfirm } from '@/components/ui/confirm';
import { AdminGate } from '@/components/admin';
import { CATEGORIES, categoryTitle } from '@/domain/categories';
import { ALL_HOURS, priceFor } from '@/domain/pricing';
import { formatINR } from '@/domain/booking';
import { stateOf } from '@/domain/places';
import type { CityPlan } from '@/domain/types';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';

const EMPTY = { id: '', city: '', title: '', details: '', category: 'explore', hours: 4 };

/** Admin · City plans: the "Popular in <city>" cards members see. Place names belong here, never on category cards. */
export default function Plans() {
  const qc = useQueryClient();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['admin', 'plans'], queryFn: () => svc.admin.cityPlans() });
  const [form, setForm] = useState<typeof EMPTY | null>(null);
  const [tried, setTried] = useState(false);
  const save = useMutation({
    mutationFn: () => svc.admin.saveCityPlan({ ...(form!.id ? { id: form!.id } : {}), city: form!.city.trim(), state: stateOf(form!.city.trim()) ?? '', title: form!.title.trim(), details: form!.details.trim() || null, category: form!.category, hours: form!.hours }),
    onSuccess: () => {
      setForm(null);
      setTried(false);
      qc.invalidateQueries({ queryKey: ['admin', 'plans'] });
      qc.invalidateQueries({ queryKey: ['cityPlans'] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => svc.admin.deleteCityPlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'plans'] });
      qc.invalidateQueries({ queryKey: ['cityPlans'] });
    },
    onError: (e) => confirm({ title: 'Couldn’t remove', message: errorMessage(e) }),
  });
  const errs = form
    ? {
        city: !stateOf(form.city.trim()) ? 'Pick a city from the list of Indian cities (spelling as on the map).' : null,
        title: form.title.trim().length < 3 ? 'Give it a short title (3–60 letters).' : null,
      }
    : { city: null, title: null };

  const active = (q.data ?? []).filter((p) => p.active !== false);
  return (
    <AdminGate>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header title="City plans" right={<IconButton name="plus" label="Add a plan" onPress={() => setForm({ ...EMPTY })} />} />
        {form ? (
          <View style={styles.form}>
            <TextField label="City" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} placeholder="e.g. Hyderabad" autoCapitalize="words" error={tried ? errs.city : null} />
            <TextField label="Title" value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="e.g. Fort and heritage walk" maxLength={60} error={tried ? errs.title : null} />
            <TextField label="Details (optional)" value={form.details} onChangeText={(v) => setForm({ ...form, details: v })} placeholder="Places, what’s included, what’s extra" maxLength={120} />
            <Text variant="footnote" color={colors.gray600}>
              Category
            </Text>
            <View style={styles.chips}>
              {CATEGORIES.map((c) => (
                <Chip key={c.key} label={c.title} selected={form.category === c.key} onPress={() => setForm({ ...form, category: c.key })} />
              ))}
            </View>
            <Text variant="footnote" color={colors.gray600}>
              Hours
            </Text>
            <View style={styles.chips}>
              {ALL_HOURS.map((h) => (
                <Chip key={h} label={`${h} h`} selected={form.hours === h} onPress={() => setForm({ ...form, hours: h })} />
              ))}
            </View>
            {save.isError ? <Notice tone="danger" text={errorMessage(save.error)} /> : null}
            <View style={{ flexDirection: 'row', gap: space.sm }}>
              <Button label="Cancel" variant="ghost" style={{ flex: 1 }} onPress={() => setForm(null)} />
              <Button label="Save plan" style={{ flex: 1 }} loading={save.isPending} onPress={() => (setTried(true), !errs.city && !errs.title && save.mutate())} />
            </View>
          </View>
        ) : null}
        {q.isLoading ? (
          <View style={{ padding: GUTTER }}>
            <Skeleton rows={4} height={64} />
          </View>
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : (
          <FlatList
            data={active}
            keyExtractor={(p) => p.id}
            contentContainerStyle={{ padding: GUTTER, gap: space.sm, paddingBottom: space.huge }}
            refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
            renderItem={({ item }) => <Row p={item} onEdit={() => setForm({ id: item.id, city: item.city, title: item.title, details: item.details ?? '', category: item.category, hours: item.hours })} onRemove={async () => (await confirm({ title: `Remove “${item.title}”?`, message: 'Members in that city won’t see it any more.', confirmLabel: 'Remove', destructive: true })) && remove.mutate(item.id)} />}
            ListEmptyComponent={<EmptyState icon="mapPin" title="No city plans yet" body="Add a few popular outings per city. Members see them on Home and in each category." action="Add a plan" onAction={() => setForm({ ...EMPTY })} />}
          />
        )}
      </SafeAreaView>
    </AdminGate>
  );
}

function Row({ p, onEdit, onRemove }: { p: CityPlan; onEdit: () => void; onRemove: () => void }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text variant="headline">{p.title}</Text>
        <Text variant="footnote" muted>
          {p.city} · {categoryTitle(p.category)} · {p.hours} h · {formatINR(priceFor(p.hours) ?? 0)}
        </Text>
        {p.details ? (
          <Text variant="caption" muted numberOfLines={1}>
            {p.details}
          </Text>
        ) : null}
      </View>
      <IconButton name="edit" label={`Edit ${p.title}`} onPress={onEdit} />
      <IconButton name="trash" label={`Remove ${p.title}`} color={colors.danger} onPress={onRemove} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  form: { marginHorizontal: GUTTER, padding: space.lg, gap: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
});
