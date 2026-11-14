import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { IconButton } from './ui/layout';
import { Button } from './ui/Button';
import { Skeleton } from './ui/states';
import { searchPlaces, STATE_NAMES } from '@/domain/places';
import { svc } from '@/services';
import { errorMessage } from '@/lib/api';
import type { Locality } from '@/domain/types';

export interface LocationValue {
  state: string;
  city: string;
  area: string;
}

/**
 * State → city → area, three tappable dropdowns for all of India. Areas come
 * from the India Post directory on the server (every locality, with PIN code);
 * search by name or PIN. No maps or location permission involved.
 */
export function LocationFields({ value, onChange, error }: { value: LocationValue; onChange: (v: LocationValue) => void; error?: Partial<Record<keyof LocationValue, string | null>> }) {
  const [open, setOpen] = useState<null | 'state' | 'city' | 'area'>(null);
  return (
    <View style={{ gap: space.md }}>
      <Dropdown label="State" value={value.state} placeholder="Choose your state" onPress={() => setOpen('state')} error={error?.state} />
      <Dropdown label="City or town" value={value.city} placeholder={value.state ? `Choose a city in ${value.state}` : 'Choose the state first'} disabled={!value.state} onPress={() => setOpen('city')} error={error?.city} />
      <Dropdown
        label="Area or locality"
        value={value.area}
        placeholder={value.city ? `Search areas or PIN codes` : 'Choose the city first'}
        disabled={!value.city}
        onPress={() => setOpen('area')}
        error={error?.area}
        hint="Every area in India, with its PIN code."
      />

      <StateSheet visible={open === 'state'} selected={value.state} onClose={() => setOpen(null)} onPick={(state) => {
        setOpen(null);
        if (state !== value.state) onChange({ state, city: '', area: '' });
        setTimeout(() => setOpen('city'), 250);
      }} />
      <CitySheet visible={open === 'city'} state={value.state} selected={value.city} onClose={() => setOpen(null)} onPick={(city) => {
        setOpen(null);
        if (city !== value.city) onChange({ ...value, city, area: '' });
        setTimeout(() => setOpen('area'), 250);
      }} />
      <AreaSheet visible={open === 'area'} state={value.state} city={value.city} onClose={() => setOpen(null)} onPick={(area) => {
        setOpen(null);
        onChange({ ...value, area });
      }} />
    </View>
  );
}

function Dropdown({ label, value, placeholder, onPress, disabled, error, hint }: { label: string; value: string; placeholder: string; onPress: () => void; disabled?: boolean; error?: string | null; hint?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text variant="footnote" color={colors.gray600}>
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || 'not chosen'}`}
        accessibilityHint={disabled ? placeholder : `Opens a list to choose your ${label.toLowerCase()}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [styles.field, value ? styles.fieldOn : null, error ? styles.fieldError : null, disabled && { opacity: 0.5 }, pressed && { backgroundColor: colors.green50 }]}
      >
        <Text variant="body" color={value ? colors.ink : colors.gray400} style={{ flex: 1 }} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Icon name="chevronDown" size={18} color={colors.gray500} />
      </Pressable>
      {error ? (
        <Text variant="footnote" color={colors.danger} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint && !value ? (
        <Text variant="caption" muted>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

function Sheet({ visible, title, onClose, query, setQuery, placeholder, children }: { visible: boolean; title: string; onClose: () => void; query: string; setQuery: (s: string) => void; placeholder: string; children: React.ReactNode }) {
  const ref = useRef<React.ComponentRef<typeof TextInput>>(null);
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.sheet} edges={['top', 'bottom']}>
        <View style={styles.sheetHead}>
          <IconButton name="close" label="Close" onPress={onClose} />
          <Text variant="headline" style={{ flex: 1, textAlign: 'center', marginRight: 48 }}>
            {title}
          </Text>
        </View>
        <Pressable onPress={() => ref.current?.focus()} style={styles.search}>
          <Icon name="search" size={18} color={colors.gray500} />
          <TextInput ref={ref} value={query} onChangeText={setQuery} placeholder={placeholder} placeholderTextColor={colors.gray400} style={styles.input} autoCorrect={false} autoCapitalize="words" accessibilityLabel={placeholder} />
          {query ? <IconButton name="close" label="Clear search" size={16} onPress={() => setQuery('')} /> : null}
        </Pressable>
        {children}
      </SafeAreaView>
    </Modal>
  );
}

function Row({ title, sub, onPress, on }: { title: string; sub?: string; onPress: () => void; on?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={sub ? `${title}, ${sub}` : title} onPress={onPress} style={({ pressed }) => [styles.row, on && styles.rowOn, pressed && { backgroundColor: colors.mistDeep }]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="callout">{title}</Text>
        {sub ? (
          <Text variant="caption" muted>
            {sub}
          </Text>
        ) : null}
      </View>
      {on ? <Icon name="check" size={18} color={colors.moss} /> : <Icon name="chevronRight" size={16} color={colors.gray400} />}
    </Pressable>
  );
}

const fold = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, '');

function StateSheet({ visible, selected, onClose, onPick }: { visible: boolean; selected: string; onClose: () => void; onPick: (s: string) => void }) {
  const [q, setQ] = useState('');
  const list = useMemo(() => STATE_NAMES.filter((s) => fold(s).includes(fold(q))).sort(), [q]);
  return (
    <Sheet visible={visible} title="Choose your state" onClose={onClose} query={q} setQuery={setQ} placeholder="Search states and territories">
      <FlatList
        data={list}
        keyExtractor={(s) => s}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <Row title={item} on={item === selected} onPress={() => onPick(item)} />}
        ListEmptyComponent={<NoMatch q={q} what="state" />}
      />
    </Sheet>
  );
}

function CitySheet({ visible, state, selected, onClose, onPick }: { visible: boolean; state: string; selected: string; onClose: () => void; onPick: (c: string) => void }) {
  const [q, setQ] = useState('');
  const list = useMemo(() => searchPlaces(q, { state, limit: 400 }), [q, state]);
  const typed = q.trim();
  return (
    <Sheet visible={visible} title={`City or town in ${state || 'your state'}`} onClose={onClose} query={q} setQuery={setQ} placeholder="Search cities and towns">
      <FlatList
        data={list}
        keyExtractor={(p) => p.city}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <Row title={item.city} on={item.city === selected} onPress={() => onPick(item.city)} />}
        ListEmptyComponent={<NoMatch q={q} what="city" onUse={typed.length >= 2 ? () => onPick(titleCase(typed)) : undefined} />}
      />
    </Sheet>
  );
}

const titleCase = (s: string) => s.replace(/\s+/g, ' ').trim().replace(/\b\p{L}/gu, (m) => m.toUpperCase());

function AreaSheet({ visible, state, city, onClose, onPick }: { visible: boolean; state: string; city: string; onClose: () => void; onPick: (a: string) => void }) {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);
  const res = useQuery({
    queryKey: ['localities', state, city, debounced],
    queryFn: () => svc.searchLocalities(state, debounced, city),
    enabled: visible && !!state,
    staleTime: 10 * 60_000,
    placeholderData: (prev) => prev,
  });
  const typed = q.trim();
  const label = (l: Locality) => `${l.name} · ${l.pincode}`;
  return (
    <Sheet visible={visible} title={`Area in ${city || 'your city'}`} onClose={onClose} query={q} setQuery={setQ} placeholder="Type an area name or a PIN code">
      {res.isLoading ? (
        <View style={styles.list}>
          <Skeleton rows={6} height={52} />
        </View>
      ) : res.isError ? (
        <View style={[styles.list, { gap: space.md, paddingTop: space.xl }]}>
          <Text variant="headline" center>
            Couldn’t load areas
          </Text>
          <Text variant="callout" muted center>
            {errorMessage(res.error)} You can type your area instead.
          </Text>
          <Button label="Try again" variant="secondary" onPress={() => res.refetch()} />
          {typed.length >= 2 ? <Button label={`Use “${titleCase(typed)}”`} variant="ghost" onPress={() => onPick(titleCase(typed))} /> : undefined}
        </View>
      ) : (
        <FlatList
          data={res.data ?? []}
          keyExtractor={(l) => `${l.name}|${l.pincode}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListHeaderComponent={!debounced ? <Text variant="caption" muted style={{ paddingVertical: space.sm }}>Popular areas in {city}. Type to search every area, or a PIN code.</Text> : undefined}
          renderItem={({ item }) => <Row title={item.name} sub={`${item.district} · PIN ${item.pincode}`} onPress={() => onPick(label(item))} />}
          ListEmptyComponent={<NoMatch q={typed} what="area" hint="Try fewer letters, a nearby landmark, or your 6-digit PIN code." onUse={typed.length >= 2 ? () => onPick(titleCase(typed)) : undefined} />}
          ListFooterComponent={debounced && (res.data?.length ?? 0) > 0 && typed.length >= 2 ? <Button label={`Not listed? Use “${titleCase(typed)}”`} variant="ghost" compact onPress={() => onPick(titleCase(typed))} /> : undefined}
        />
      )}
    </Sheet>
  );
}

/** No results: say so, suggest a next step, never a dead end. */
function NoMatch({ q, what, hint, onUse }: { q: string; what: string; hint?: string; onUse?: () => void }) {
  return (
    <View style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.xxl }}>
      <Icon name="search" size={26} color={colors.gray400} />
      <Text variant="headline" center>
        {q ? `No ${what} matches “${q}”` : `Start typing to find your ${what}`}
      </Text>
      <Text variant="callout" muted center style={{ maxWidth: 300 }}>
        {hint ?? 'Check the spelling or try fewer letters.'}
      </Text>
      {onUse ? <Button label={`Use “${titleCase(q)}”`} variant="secondary" compact onPress={onUse} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 54, paddingHorizontal: space.lg, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line },
  fieldOn: { borderColor: colors.mossSoft },
  fieldError: { borderColor: colors.danger },
  sheet: { flex: 1, backgroundColor: colors.mist },
  sheetHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.xs, minHeight: 52 },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: GUTTER, marginBottom: space.sm, minHeight: 50, paddingLeft: space.lg, backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingVertical: 12 },
  list: { paddingHorizontal: GUTTER, paddingBottom: space.huge },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowOn: { backgroundColor: colors.green50 },
});
