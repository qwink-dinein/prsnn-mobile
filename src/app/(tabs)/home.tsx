import { useAppWidth } from '@/lib/layout';
import { useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { Screen, Section, Logo, IconButton, Avatar, EmptyState, ErrorState, Loading } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { CompanionCard } from '@/components/companions';
import { CompanionDashboard } from '@/components/fellow/Dashboard';
import { CATEGORIES } from '@/domain/booking';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

const PLANS: { label: string; image: number; category: string }[] = [
  { label: 'Coffee', image: require('../../../assets/images/coffee.jpg'), category: 'coffee' },
  { label: 'Events', image: require('../../../assets/images/events.jpg'), category: 'events' },
  { label: 'City walks', image: require('../../../assets/images/walks.jpg'), category: 'walks' },
  { label: 'Study', image: require('../../../assets/images/study.jpg'), category: 'study' },
];

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
  const city = user?.city ?? q.data?.find((c) => c.city)?.city ?? 'Hyderabad';
  // Your city first, then everyone else you can see.
  const popular = useMemo(() => {
    const list = q.data ?? [];
    const here = list.filter((c) => (c.city ?? '').toLowerCase() === city.toLowerCase());
    return [...here, ...list.filter((c) => !here.includes(c))].slice(0, 10);
  }, [q.data, city]);

  return (
    <Screen padded={false} refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}>
      <View style={styles.top}>
        <Logo size={28} />
        <View style={styles.topRight}>
          <View style={styles.city} accessibilityLabel={`City: ${city}`}>
            <Icon name="mapPin" size={16} color={colors.moss} />
            <Text variant="subhead">{city}</Text>
          </View>
          <View>
            <IconButton name="bell" label={unread ? `Notifications, ${unread} unread` : 'Notifications'} onPress={() => router.push('/notifications')} />
            {unread ? <View style={styles.badge} /> : null}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Your profile" onPress={() => router.push('/profile')}>
            <Avatar uri={user?.profilePhoto} name={user?.fullName} size={36} />
          </Pressable>
        </View>
      </View>

      <Pressable accessibilityRole="search" accessibilityLabel="Search companions and activities" onPress={() => router.push('/search')} style={styles.search}>
        <Icon name="search" size={18} color={colors.gray500} />
        <Text variant="callout" color={colors.gray400}>
          Search companions, activities…
        </Text>
      </Pressable>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cats}
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" accessibilityLabel={item.label} onPress={() => router.push({ pathname: '/search', params: { category: item.key } })} style={styles.cat}>
            <View style={styles.catIcon}>
              <Icon name={item.icon as IconName} size={24} color={colors.moss} />
            </View>
            <Text variant="caption" color={colors.gray600}>
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      <Section title="Popular near you" action="See all" onAction={() => router.push('/search')} style={{ paddingHorizontal: GUTTER }}>
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
        ) : popular.length === 0 ? (
          <EmptyState icon="users" title="No companions yet" body="New companions are joining your city. Check back soon." />
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

      <Section title="Plan something special" style={{ paddingHorizontal: GUTTER }}>
        <View style={styles.plans}>
          {PLANS.map((p) => (
            <Pressable
              key={p.label}
              accessibilityRole="button"
              accessibilityLabel={`${p.label} companions`}
              onPress={() => router.push({ pathname: '/search', params: { category: p.category } })}
              style={[styles.plan, { width: Math.floor((width - GUTTER * 2 - space.md) / 2) }]}
            >
              <Image source={p.image} style={StyleSheet.absoluteFill} contentFit="cover" />
              <LinearGradient colors={['rgba(14,17,13,0)', 'rgba(14,17,13,0.65)']} style={StyleSheet.absoluteFill} />
              <Text variant="headline" color={colors.paper} style={styles.planLabel}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: GUTTER, paddingTop: space.sm },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  city: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: space.sm },
  badge: { position: 'absolute', top: 11, right: 12, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.clay, borderWidth: 1.5, borderColor: colors.mist },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: GUTTER, marginTop: space.lg, minHeight: 50, paddingHorizontal: space.lg, backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  cats: { paddingHorizontal: GUTTER, gap: space.lg, paddingTop: space.xl },
  cat: { alignItems: 'center', gap: 6, minWidth: 56 },
  catIcon: { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  plans: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  plan: { height: 120, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.mistDeep },
  planLabel: { padding: space.md },
});
