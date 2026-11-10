import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { EmptyState, ErrorState, IconButton, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { Enter, PressScale } from '@/components/ui/motion';
import { Skeleton } from '@/components/ui/states';
import { CompanionRow } from '@/components/companions';
import { CATEGORIES, categoryOf, offersCategory } from '@/domain/categories';
import { formatINR } from '@/domain/booking';
import { durationLine, hourlyFor, priceFor, savingFor, savingPercent } from '@/domain/pricing';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';
import { useSession } from '@/state/session';

/** A category: what it's for, the suggested booking, popular plans in your city, and who offers it near you. */
export default function CategoryPage() {
  const { key, plan } = useLocalSearchParams<{ key: string; plan?: string }>();
  const c = categoryOf(key);
  const user = useSession((s) => s.user);
  const city = user?.city ?? '';
  const q = useQuery({ queryKey: qk.companions, queryFn: svc.companions });
  const plans = useQuery({ queryKey: ['cityPlans', city], queryFn: () => svc.cityPlans(city), enabled: !!city, staleTime: 10 * 60_000 });
  const list = useMemo(() => {
    const all = (q.data ?? []).filter((x) => offersCategory(x.categories, c?.key));
    const here = all.filter((x) => (x.city ?? '').toLowerCase() === city.toLowerCase());
    return here.length ? here : all;
  }, [q.data, c?.key, city]);
  const nearby = list.some((x) => (x.city ?? '').toLowerCase() === city.toLowerCase());
  const myPlans = (plans.data ?? []).filter((p) => p.category === c?.key);

  if (!c) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.mist }}>
        <EmptyState icon="search" title="We couldn’t find that category" body="It may have moved. Pick one of these instead." action="See all categories" onAction={() => router.replace('/home')} />
      </SafeAreaView>
    );
  }
  const h = c.hours;

  return (
    <View style={{ flex: 1, backgroundColor: colors.mist }}>
      <FlatList
        data={q.isLoading || q.isError ? [] : list}
        keyExtractor={(x) => x.id}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={colors.moss} />}
        contentContainerStyle={{ paddingBottom: space.huge }}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Image source={c.image} style={StyleSheet.absoluteFill} contentFit="cover" />
              <LinearGradient colors={['rgba(14,17,13,0.35)', 'rgba(14,17,13,0.05)', 'rgba(14,17,13,0.8)']} style={StyleSheet.absoluteFill} />
              <SafeAreaView edges={['top']} style={{ paddingHorizontal: space.xs }}>
                <IconButton name="chevronLeft" label="Back" color={colors.paper} onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
              </SafeAreaView>
              <View style={styles.heroText}>
                <Text variant="largeTitle" color={colors.paper} accessibilityRole="header">
                  {c.title}
                </Text>
                <Text variant="callout" color={colors.paper} style={{ opacity: 0.92 }}>
                  {c.line}.
                </Text>
              </View>
            </View>
            <View style={styles.sheet}>
              <Enter index={0} style={{ gap: 6 }}>
                {c.bullets.map((b) => (
                  <View key={b} style={styles.row}>
                    <Icon name="check" size={16} color={colors.moss} strokeWidth={2.4} />
                    <Text variant="callout">{b}</Text>
                  </View>
                ))}
              </Enter>

              <Enter index={1} style={styles.suggest}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="caption" color={colors.moss} style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                    SUGGESTED
                  </Text>
                  <Text variant="title3">
                    {h} hours · {formatINR(priceFor(h) ?? 0)}
                  </Text>
                  <Text variant="footnote" muted>
                    {formatINR(hourlyFor(h))}/hr{savingFor(h) ? ` · save ${formatINR(savingFor(h))} (${savingPercent(h)}%)` : ''} · {durationLine(h)}
                  </Text>
                </View>
              </Enter>

              {myPlans.length ? (
                <Section title={`Popular in ${city}`} style={{ marginTop: space.lg }}>
                  <View style={{ gap: space.sm }}>
                    {myPlans.map((p) => (
                      <View key={p.id} style={[styles.plan, plan === p.title && styles.planOn]}>
                        <View style={{ flex: 1 }}>
                          <Text variant="headline">{p.title}</Text>
                          {p.details ? (
                            <Text variant="footnote" muted>
                              {p.details}
                            </Text>
                          ) : null}
                        </View>
                        <Text variant="subhead" color={colors.moss}>
                          {p.hours} hrs · {formatINR(priceFor(p.hours) ?? 0)}
                        </Text>
                      </View>
                    ))}
                    <Text variant="caption" muted>
                      Tickets, food and travel are paid by you on the day. The price is the companion’s time.
                    </Text>
                  </View>
                </Section>
              ) : null}

              <Section title={nearby ? `People in ${city} who offer this` : 'People who offer this'} style={{ marginTop: space.lg, marginBottom: 0 }}>
                {q.isLoading ? <Skeleton rows={3} height={84} /> : q.isError ? <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} /> : null}
                {!q.isLoading && !q.isError && list.length > 0 && !nearby && city ? (
                  <Text variant="footnote" muted>
                    No one in {city} offers this yet — here’s who does elsewhere. New companions join every week.
                  </Text>
                ) : null}
              </Section>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: GUTTER, marginBottom: space.sm }}>
            <CompanionRow c={item} onPress={() => router.push({ pathname: '/companion/[id]', params: { id: item.id, category: c.key } })} />
          </View>
        )}
        ListEmptyComponent={
          q.isLoading || q.isError ? undefined : (
            <View style={{ paddingHorizontal: GUTTER }}>
              <EmptyState icon="users" title={`No one offers ${c.title} yet`} body="Companions are joining every week. Try another category, or see everyone near you." action="See everyone near you" onAction={() => router.push('/search')} />
              <View style={styles.others}>
                {CATEGORIES.filter((x) => x.key !== c.key).map((x) => (
                  <PressScale key={x.key} accessibilityRole="button" onPress={() => router.replace(`/category/${x.key}`)} innerStyle={styles.chip}>
                    <Text variant="subhead">{x.title}</Text>
                  </PressScale>
                ))}
              </View>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 260, justifyContent: 'space-between', backgroundColor: colors.mistDeep },
  heroText: { padding: GUTTER, paddingBottom: space.xxl, gap: 4 },
  sheet: { marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.mist, padding: GUTTER, gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  suggest: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.green50, borderWidth: 2, borderColor: colors.moss },
  plan: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  planOn: { borderWidth: 2, borderColor: colors.moss },
  others: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  chip: { minHeight: 40, paddingHorizontal: 14, justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line },
});
