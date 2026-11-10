import { useAppWidth } from '@/lib/layout';
import { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Screen, Section, Logo, IconButton, EmptyState, ErrorState } from '@/components/ui/layout';
import { Enter, PressScale } from '@/components/ui/motion';
import { Notice, Skeleton } from '@/components/ui/states';
import { CategoryCard } from '@/components/CategoryTiles';
import { formatINR } from '@/domain/booking';
import { priceFor } from '@/domain/pricing';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { CompanionCard } from '@/components/companions';
import { CompanionDashboard } from '@/components/fellow/Dashboard';
import { CATEGORIES, categoryOf } from '@/domain/categories';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

/** Screen 6 · Home / Discover (companions see their dashboard here instead). */
export default function HomeTab() {
  const isCompanion = useSession((s) => s.user?.role === 'companion');
  return isCompanion ? <CompanionDashboard /> : <Discover />;
}

function Discover() {
  const user = useSession((s) => s.user);
  const { width } = useAppWidth();
  const q = useQuery({ queryKey: qk.companions, queryFn: svc.companions });
  const notes = useQuery({ queryKey: qk.notifications, queryFn: svc.notifications });
  const unread = (notes.data ?? []).filter((n) => !n.isRead).length;
  const cardW = Math.floor(Math.min((width - GUTTER * 2 - space.md) / 2, 200));
  const city = user?.city ?? q.data?.find((c) => c.city)?.city ?? '';
  const plans = useQuery({ queryKey: ['cityPlans', city], queryFn: () => svc.cityPlans(city), enabled: !!city, staleTime: 10 * 60_000 });
  // Your city first, then everyone else you can see.
  const popular = useMemo(() => {
    const list = q.data ?? [];
    const here = list.filter((c) => (c.city ?? '').toLowerCase() === city.toLowerCase());
    return [...here, ...list.filter((c) => !here.includes(c))].slice(0, 10);
  }, [q.data, city]);
  const loved = CATEGORIES.find((c) => c.key === 'loved_one')!;

  return (
    <Screen padded={false} refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void Promise.all([q.refetch(), plans.refetch(), notes.refetch()])} tintColor={colors.moss} />}>
      <View style={styles.top}>
        <Logo size={28} />
        <View style={styles.topRight}>
          <Pressable style={styles.city} accessibilityRole="button" accessibilityLabel={`Your area: ${user?.area || city || 'not set'}. Change it`} onPress={() => router.push('/edit-profile')}>
            <Icon name="mapPin" size={16} color={colors.moss} />
            <Text variant="subhead" numberOfLines={1} style={{ maxWidth: 120 }}>
              {(user?.area ?? '').split(' · ')[0] || city || 'Set area'}
            </Text>
            <Icon name="chevronDown" size={14} color={colors.gray500} />
          </Pressable>
          <View>
            <IconButton name="bell" label={unread ? `Notifications, ${unread} unread` : 'Notifications'} onPress={() => router.push('/notifications')} />
            {unread ? <View style={styles.badge} /> : null}
          </View>
        </View>
      </View>

      <Enter index={0}>
        <View style={styles.hero}>
          <Image source={require('../../../assets/images/together.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={['rgba(14,17,13,0.05)', 'rgba(14,17,13,0.78)']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroText}>
            <Text variant="title1" color={colors.paper}>
              Good company, from ₹399
            </Text>
            <Text variant="footnote" color={colors.paper} style={{ opacity: 0.92 }}>
              People near you · pay safely · public places only
            </Text>
          </View>
        </View>
      </Enter>

      {user?.photoStatus === 'pending' || user?.photoStatus === 'changes_requested' ? (
        <View style={{ paddingHorizontal: GUTTER, marginTop: space.md }}>
          <Notice
            tone="warning"
            text={user.photoStatus === 'pending' ? 'Your photo is being reviewed. You can book meanwhile.' : 'Our team asked for a new photo.'}
            action={user.photoStatus === 'changes_requested' ? 'Fix' : undefined}
            onAction={() => router.push({ pathname: '/fix', params: { target: 'photo' } })}
          />
        </View>
      ) : null}

      <Section title="What would you like to do?" style={{ paddingHorizontal: GUTTER, marginTop: space.xl }}>
        <View style={styles.cats}>
          {CATEGORIES.map((c, i) => (
            <Enter key={c.key} index={i + 1} style={i === 0 ? { width: '100%' } : styles.catCell}>
              <CategoryCard c={c} showPrice wide={i === 0} onPress={() => router.push(`/category/${c.key}`)} />
            </Enter>
          ))}
        </View>
      </Section>

      {plans.data?.length ? (
        <>
          <Section title={`Popular in ${city}`} style={{ paddingHorizontal: GUTTER }}>
            <View />
          </Section>
          <FlatList
            horizontal
            data={plans.data}
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.md }}
            renderItem={({ item }) => (
              <PressScale accessibilityRole="button" accessibilityLabel={`${item.title}, ${item.hours} hours, ${formatINR(priceFor(item.hours) ?? 0)}`} onPress={() => router.push({ pathname: '/category/[key]', params: { key: item.category, plan: item.title } })} innerStyle={styles.plan}>
                <Image source={categoryOf(item.category)?.image} style={styles.planPhoto} contentFit="cover" />
                <View style={{ padding: space.md, gap: 2 }}>
                  <Text variant="headline" numberOfLines={1}>
                    {item.title}
                  </Text>
                  {item.details ? (
                    <Text variant="caption" muted numberOfLines={1}>
                      {item.details}
                    </Text>
                  ) : null}
                  <Text variant="subhead" color={colors.moss}>
                    {item.hours} hrs · {formatINR(priceFor(item.hours) ?? 0)}
                  </Text>
                </View>
              </PressScale>
            )}
          />
        </>
      ) : null}

      <Section title={city ? `Near you in ${city}` : 'Near you'} action="See all" onAction={() => router.push('/search')} style={{ paddingHorizontal: GUTTER, marginTop: space.xl }}>
        {q.isLoading ? (
          <Skeleton rows={1} height={220} />
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : popular.length === 0 ? (
          <EmptyState icon="users" title="Companions are joining your city" body="We’re approving new companions every day. Meanwhile, book for a loved one in another city, or turn on notifications to hear first." action="Book for a loved one" onAction={() => router.push('/category/loved_one')} />
        ) : null}
      </Section>
      {popular.length ? (
        <FlatList
          horizontal
          data={popular}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: GUTTER, gap: space.md }}
          renderItem={({ item }) => <CompanionCard c={item} width={cardW} />}
        />
      ) : null}

      <View style={{ paddingHorizontal: GUTTER, marginTop: space.xl, gap: space.md }}>
        <PressScale accessibilityRole="button" accessibilityLabel="Book company for a loved one" onPress={() => router.push('/category/loved_one')} innerStyle={styles.loved}>
          <View style={styles.lovedIcon}>
            <Icon name="heart" size={22} color={colors.moss} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="headline">Can’t be there for mum or dad?</Text>
            <Text variant="footnote" muted>
              {loved.line}. Friendly company for a loved one, paid from anywhere.
            </Text>
          </View>
          <Icon name="chevronRight" size={18} color={colors.moss} />
        </PressScale>

        <View style={styles.how}>
          <Text variant="headline">How prsnn works</Text>
          {['Pick what you’d like to do, a time and a companion', 'Pay securely — UPI, cards or net banking', 'They confirm and chat opens (numbers stay hidden)', 'Meet in a public place. Panic button on during the session'].map((t, i) => (
            <View key={t} style={styles.howRow}>
              <View style={styles.num}>
                <Text variant="caption" color={colors.onMoss}>
                  {i + 1}
                </Text>
              </View>
              <Text variant="footnote" style={{ flex: 1 }}>
                {t}
              </Text>
            </View>
          ))}
        </View>
        <View style={[styles.how, { backgroundColor: colors.green50 }]}>
          <View style={styles.howRow}>
            <Icon name="shieldCheck" size={20} color={colors.moss} />
            <Text variant="headline">Safety, built in</Text>
          </View>
          <Text variant="footnote" muted>
            Every companion is approved by our team and ID-checked before you meet. Public places only, numbers hidden in chat, a panic button during every session, and full refunds if nobody can make it.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER, paddingTop: space.sm },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  city: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: space.sm },
  badge: { position: 'absolute', top: 11, right: 12, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.clay, borderWidth: 1.5, borderColor: colors.mist },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: GUTTER, marginTop: space.lg, minHeight: 50, paddingHorizontal: space.lg, backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  hero: { height: 150, marginHorizontal: GUTTER, marginTop: space.lg, borderRadius: radius.xl, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.mistDeep },
  heroText: { padding: space.lg, gap: 2 },
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  catCell: { width: '48.5%', flexGrow: 1 },
  plan: { width: 200, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  planPhoto: { width: '100%', height: 96, backgroundColor: colors.mistDeep },
  loved: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.green50, borderWidth: 1, borderColor: colors.mossSoft },
  lovedIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  how: { gap: space.sm, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  num: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
});
