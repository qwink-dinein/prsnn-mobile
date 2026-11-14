import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from '@/components/ui/Text';
import { useConfirm } from '@/components/ui/confirm';
import { isStaff } from '@/domain/admin';
import type { SessionUser } from '@/domain/types';
import { DEMO } from '@/lib/config';
import { backend } from '@/services/backend';
import { resetDemo } from '@/services/demo';
import { setSampleMode } from '@/services';
import { useSession } from '@/state/session';

export type PreviewAs = 'member' | 'companion';
export type PreviewStart = 'home' | 'signup' | 'booking' | 'chat';

/** The sample people a preview runs as (they exist only in the sample data). */
function sampleUser(as: PreviewAs, start: PreviewStart): SessionUser {
  const base: SessionUser = {
    id: 'me',
    role: as === 'companion' ? 'companion' : 'user',
    is_verified: true,
    verification_status: 'verified',
    fullName: as === 'companion' ? 'Maya Iyer' : 'Sam Rivera',
    phone: '910000000000',
    hasPin: true,
    gender: as === 'companion' ? 'woman' : 'man',
    seeGender: 'everyone',
    profileVisibility: as === 'companion' ? 'locked' : 'open',
    city: 'Hyderabad',
    state: 'Telangana',
    area: 'Gachibowli',
    photoStatus: 'approved',
    approvalStatus: 'approved',
    categories: ['new_in_town', 'dont_go_alone'],
    contactPhone: '910000000000',
    country: 'India',
  };
  if (start !== 'signup') return base;
  // Sign-up from the start: an unanswered profile, so setup / companion onboarding opens.
  return as === 'companion'
    ? { ...base, verification_status: 'not_submitted', approvalStatus: 'draft', categories: [] }
    : { ...base, fullName: undefined, gender: undefined, seeGender: undefined, profileVisibility: undefined, categories: [], photoStatus: 'none' };
}

const routeFor = (as: PreviewAs, start: PreviewStart) => {
  if (start === 'signup') return as === 'companion' ? '/fellow/onboarding' : '/setup-profile';
  if (start === 'booking') return as === 'companion' ? '/booking/i2' : '/booking/b1';
  if (start === 'chat') return as === 'companion' ? '/chat/i2' : '/chat/b1';
  return '/home';
};

function go(href: string) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(href as never);
}

/**
 * Staff only. Opens the real app screens as a sample member or companion, on the sample data
 * service: nothing reaches the server (no payments, notifications or WhatsApp). The start is
 * written to the activity log first; if that fails the preview doesn't open.
 */
export async function startPreview(qc: QueryClient, as: PreviewAs, start: PreviewStart) {
  const st = useSession.getState();
  const real = st.preview?.real ?? st.user;
  if (!real || !isStaff(real.role)) throw new Error('Only the prsnn team can preview the app.');
  if (!DEMO) await backend.admin.logPreview(as, start);
  resetDemo();
  setSampleMode(true);
  qc.clear();
  useSession.setState({ preview: { as, real }, user: sampleUser(as, start) });
  go(routeFor(as, start));
}

/** Back to Admin with the staff member's own session; sample changes are thrown away. */
export function endPreview(qc: QueryClient) {
  const pv = useSession.getState().preview;
  if (!pv) return;
  setSampleMode(false);
  resetDemo();
  qc.clear();
  useSession.setState({ preview: null, user: pv.real });
  go('/admin');
}

/** Midnight strip on top of every screen during a preview: "Member preview · sample data · Exit". */
export function PreviewStrip() {
  const pv = useSession((s) => s.preview);
  const qc = useQueryClient();
  const confirm = useConfirm();
  if (!pv) return null;
  const exit = async () => {
    if (await confirm({ title: 'Exit preview?', message: 'You’ll go back to Admin. Sample changes are cleared.', confirmLabel: 'Exit', cancelLabel: 'Keep looking' })) endPreview(qc);
  };
  return (
    <SafeAreaView edges={['top']} style={styles.strip}>
      <View style={styles.row} accessibilityRole="summary">
        <View style={styles.dot} />
        <Text variant="caption" color={colors.porcelain} style={{ flex: 1, minWidth: 0 }} numberOfLines={1}>
          <Text variant="caption" color={colors.porcelain} style={{ fontFamily: fonts.semibold }}>
            {pv.as === 'companion' ? 'Companion preview' : 'Member preview'}
          </Text>
          {' · sample data'}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Exit preview" onPress={exit} hitSlop={10} style={styles.exit}>
          <Text variant="caption" color={colors.midnight} style={{ fontFamily: fonts.semibold }}>
            Exit
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  strip: { backgroundColor: colors.midnight },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 36, paddingHorizontal: space.lg },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.champagne },
  exit: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.champagne },
});
