import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FlatList, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLiveCompanions } from '@/components/ui/states';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Chip, EmptyState, ErrorState, Loading, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { CompanionRow } from '@/components/companions';
import { CATEGORIES, type CategoryKey } from '@/domain/categories';
import { filterCompanions, SORTS, type Sort } from '@/domain/search';
import { errorMessage } from '@/lib/api';
import { CitySheet } from '@/components/PlacePicker';
import { areasFor } from '@/data/india-areas';
import { seeLabel } from '@/domain/privacy';
import { useSession } from '@/state/session';
import { AvailableTodayToggle } from '@/components/AvailableTodayToggle';
import { freeToday, toDateKey } from '@/domain/booking';
import { svc, qk } from '@/services';

/** Screen 7 · Search & filters (filters run on the device over the verified list). */
export default function SearchTab() {
  const params = useLocalSearchParams<{ category?: string }>();
  const q = useLiveCompanions();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CategoryKey | 'all'>('all');
  const [area, setArea] = useState<string | 'all'>('all');
  const [sort, setSort] = useState<Sort>('recommended');
  const [panel, setPanel] = useState<'none' | 'area' | 'sort'>('none');
  const user = useSession((s) => s.user);
  // Default to the member's own city; "All cities" clears it.
  const [city, setCity] = useState<string | null>(user?.city ?? null);
  const [cityOpen, setCityOpen] = useState(false);

  // A category tapped on Home arrives as a route param; adopt it whenever it changes (tab stays mounted).
  const [seenParam, setSeenParam] = useState<string | undefined>(undefined);
  if (params.category !== seenParam) {
    setSeenParam(params.category);
    if (params.category && CATEGORIES.some((c) => c.key === params.category)) setCategory(params.category as CategoryKey);
  }

  // Areas: the city's known list plus any area a companion there uses.
  const areas = useMemo(() => {
    const fromData = (q.data ?? []).filter((c) => !city || (c.city ?? '').toLowerCase() === city.toLowerCase()).map((c) => c.area).filter(Boolean) as string[];
    return Array.from(new Set([...fromData, ...areasFor(city)])).sort();
  }, [q.data, city]);
  const matches = useMemo(() => filterCompanions(q.data ?? [], text, category, area, sort, city), [q.data, text, category, area, sort, city]);

  // "Available today": the clock ticks each minute so people drop off once their last slot passes.
  const [today, setToday] = useState(false);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const day = toDateKey(now);
  const busy = useQuery({ queryKey: qk.companionsBusy(day), queryFn: () => svc.companionsBusy(day), staleTime: 60_000, refetchInterval: 120_000 });
  const free = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of matches) {
      const f = freeToday(c, busy.data?.[c.id] ?? [], now);
      if (f) m.set(c.id, f.label);
    }
    return m;
  }, [matches, busy.data, now]);
  const results = useMemo(() => (today ? matches.filter((c) => free.has(c.id)) : matches), [today, matches, free]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text variant="title2" style={styles.title} accessibilityRole="header">
        Search companions
      </Text>
      <View style={styles.search}>
        <Icon name="search" size={18} color={colors.gray500} />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Try a name, an area or ‘coffee’"
          placeholderTextColor={colors.gray400}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search companions"
          clearButtonMode="while-editing"
        />
        {text ? <IconButton name="close" label="Clear search" size={18} onPress={() => setText('')} /> : null}
      </View>

      <View style={styles.today}>
        <AvailableTodayToggle on={today} count={free.size} loading={busy.isLoading} onToggle={() => setToday((v) => !v)} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chips}>
        <Chip label={city ?? 'All cities'} icon="mapPin" selected={!!city} onPress={() => setCityOpen(true)} />
        <Chip label={area === 'all' ? 'Area' : area} selected={area !== 'all' || panel === 'area'} onPress={() => setPanel(panel === 'area' ? 'none' : 'area')} />
        <Chip label={SORTS.find((s) => s.key === sort)!.label} icon="sliders" selected={sort !== 'recommended' || panel === 'sort'} onPress={() => setPanel(panel === 'sort' ? 'none' : 'sort')} />
        <Chip label={`Showing ${seeLabel(user?.seeGender).toLowerCase()}`} icon="users" selected={!!user?.seeGender && user.seeGender !== 'everyone'} onPress={() => router.push('/privacy')} />
      </ScrollView>
      <CitySheet
        visible={cityOpen}
        allowAll
        onClose={() => setCityOpen(false)}
        onPick={(p) => {
          setCity(p?.city ?? null);
          setArea('all');
          setCityOpen(false);
        }}
      />

      {panel !== 'none' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chips}>
          {panel === 'area'
            ? [<Chip key="all" label="All areas" selected={area === 'all'} onPress={() => { setArea('all'); setPanel('none'); }} />].concat(
                areas.map((a) => <Chip key={a} label={a} selected={area === a} onPress={() => { setArea(a); setPanel('none'); }} />),
              )
            : SORTS.map((s) => <Chip key={s.key} label={s.label} selected={sort === s.key} onPress={() => { setSort(s.key); setPanel('none'); }} />)}
        </ScrollView>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chips}>
        <Chip label="All" selected={category === 'all'} onPress={() => setCategory('all')} />
        {CATEGORIES.map((c) => (
          <Chip key={c.key} label={c.title} selected={category === c.key} onPress={() => setCategory(category === c.key ? 'all' : c.key)} />
        ))}
      </ScrollView>

      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState message={errorMessage(q.error)} onRetry={() => q.refetch()} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: GUTTER - space.sm, paddingBottom: space.huge }}
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => <CompanionRow c={item} free={free.get(item.id)} />}
          ListHeaderComponent={
            <Text variant="footnote" muted style={{ paddingHorizontal: space.sm, paddingBottom: space.xs }} accessibilityLiveRegion="polite">
              {results.length} {results.length === 1 ? 'companion' : 'companions'}
              {today ? ' · free today' : ''}
            </Text>
          }
          ListEmptyComponent={
            today && matches.length ? (
              <EmptyState icon="clock" title="No one is free for the rest of today" body="Everyone here is booked or done for the day. See everyone and book for another day." action="Show everyone" onAction={() => setToday(false)} />
            ) : (
            <EmptyState
              icon="search"
              title={text ? `No one matches “${text}”` : 'No one matches these filters'}
              body={city ? `Try another word, all areas of ${city}, or another category. New companions join every week.` : 'Try another word or another category. New companions join every week.'}
              action="Clear filters"
              onAction={() => {
                setText('');
                setCategory('all');
                setArea('all');
                setCity(null);
                setSort('recommended');
                setToday(false);
              }}
            />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  title: { paddingHorizontal: GUTTER, paddingTop: space.sm },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: GUTTER, marginTop: space.md, minHeight: 50, paddingLeft: space.lg, paddingRight: space.xs, backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingVertical: 12 },
  today: { paddingHorizontal: GUTTER, paddingTop: space.md },
  chipRow: { flexGrow: 0, flexShrink: 0, minHeight: 54 },
  chips: { paddingHorizontal: GUTTER, gap: space.sm, paddingTop: space.md },
});
