import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Chip, EmptyState, ErrorState, Loading, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { CompanionRow } from '@/components/companions';
import { CATEGORIES, type CategoryKey } from '@/domain/booking';
import { filterCompanions, SORTS, type Sort } from '@/domain/search';
import { svc, qk } from '@/services';
import { errorMessage } from '@/lib/api';

/** Screen 7 · Search & filters (filters run on the device over the verified list). */
export default function SearchTab() {
  const params = useLocalSearchParams<{ category?: string }>();
  const q = useQuery({ queryKey: qk.companions, queryFn: svc.companions });
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CategoryKey | 'all'>('all');
  const [area, setArea] = useState<string | 'all'>('all');
  const [sort, setSort] = useState<Sort>('recommended');
  const [panel, setPanel] = useState<'none' | 'area' | 'sort'>('none');

  // A category tapped on Home arrives as a route param; adopt it whenever it changes (tab stays mounted).
  const [seenParam, setSeenParam] = useState<string | undefined>(undefined);
  if (params.category !== seenParam) {
    setSeenParam(params.category);
    if (params.category && CATEGORIES.some((c) => c.key === params.category)) setCategory(params.category as CategoryKey);
  }

  const areas = useMemo(() => Array.from(new Set((q.data ?? []).map((c) => c.area).filter(Boolean) as string[])).sort(), [q.data]);
  const results = useMemo(() => filterCompanions(q.data ?? [], text, category, area, sort), [q.data, text, category, area, sort]);

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
          placeholder="Try ‘coffee’, ‘walks’, ‘Banjara Hills’"
          placeholderTextColor={colors.gray400}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search companions"
          clearButtonMode="while-editing"
        />
        {text ? <IconButton name="close" label="Clear search" size={18} onPress={() => setText('')} /> : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={styles.chips}>
        <Chip label={area === 'all' ? 'Location' : area} icon="mapPin" selected={area !== 'all' || panel === 'area'} onPress={() => setPanel(panel === 'area' ? 'none' : 'area')} />
        <Chip label={SORTS.find((s) => s.key === sort)!.label} icon="sliders" selected={sort !== 'recommended' || panel === 'sort'} onPress={() => setPanel(panel === 'sort' ? 'none' : 'sort')} />
      </ScrollView>

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
          <Chip key={c.key} label={c.label} selected={category === c.key} onPress={() => setCategory(category === c.key ? 'all' : c.key)} />
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
          renderItem={({ item }) => <CompanionRow c={item} />}
          ListHeaderComponent={
            <Text variant="footnote" muted style={{ paddingHorizontal: space.sm, paddingBottom: space.xs }} accessibilityLiveRegion="polite">
              {results.length} {results.length === 1 ? 'companion' : 'companions'}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="search"
              title="No matches"
              body="Try another word or clear the filters."
              action="Clear filters"
              onAction={() => {
                setText('');
                setCategory('all');
                setArea('all');
                setSort('recommended');
              }}
            />
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
  chipRow: { flexGrow: 0 },
  chips: { paddingHorizontal: GUTTER, gap: space.sm, paddingTop: space.md },
});
