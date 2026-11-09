import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Text } from './ui/Text';
import { Icon } from './ui/Icon';
import { Header } from './ui/layout';
import { TextField } from './ui/forms';
import { cityCount, searchPlaces, type Place } from '@/domain/places';
import { areasFor } from '@/data/india-areas';

/** A form row that looks like a field and opens a picker. */
function PickerField({ label, value, placeholder, onPress, hint }: { label: string; value?: string; placeholder: string; onPress: () => void; hint?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text variant="subhead" color={colors.gray600}>
        {label}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value || 'not chosen'}`} onPress={onPress} style={({ pressed }) => [styles.field, pressed && { borderColor: colors.moss }]}>
        <Icon name="mapPin" size={18} color={colors.gray500} />
        <Text variant="body" color={value ? colors.ink : colors.gray400} style={{ flex: 1 }} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Icon name="chevronDown" size={18} color={colors.gray500} />
      </Pressable>
      {hint ? (
        <Text variant="footnote" muted>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

/** Full-screen searchable list (sheet). */
function SearchSheet<T>({
  visible,
  title,
  placeholder,
  items,
  keyOf,
  render,
  onPick,
  onClose,
  query,
  setQuery,
  footer,
}: {
  visible: boolean;
  title: string;
  placeholder: string;
  items: T[];
  keyOf: (t: T) => string;
  render: (t: T) => { title: string; sub?: string };
  onPick: (t: T) => void;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  footer?: React.ReactNode;
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.sheet} edges={['top', 'bottom']}>
        <Header title={title} onBack={onClose} />
        <View style={styles.search}>
          <Icon name="search" size={18} color={colors.gray500} />
          <TextInput value={query} onChangeText={setQuery} placeholder={placeholder} placeholderTextColor={colors.gray400} style={styles.input} autoFocus autoCorrect={false} accessibilityLabel={placeholder} />
        </View>
        <FlatList
          data={items}
          keyExtractor={keyOf}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: space.huge }}
          renderItem={({ item }) => {
            const r = render(item);
            return (
              <Pressable accessibilityRole="button" accessibilityLabel={r.sub ? `${r.title}, ${r.sub}` : r.title} onPress={() => onPick(item)} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.mistDeep }]}>
                <View style={{ flex: 1 }}>
                  <Text variant="callout">{r.title}</Text>
                  {r.sub ? (
                    <Text variant="caption" muted>
                      {r.sub}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
          ListFooterComponent={footer ? <View style={{ paddingTop: space.lg }}>{footer}</View> : undefined}
          ListEmptyComponent={
            <Text variant="callout" muted center style={{ padding: space.xl }}>
              No matches. Check the spelling.
            </Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

/**
 * City picker over every Indian city/town (~4,300, bundled — works offline).
 * Empty search shows the big cities; typing searches all.
 */
export function CityPicker({ value, onChange, label = 'City', hint }: { value?: Place | null; onChange: (p: Place) => void; label?: string; hint?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const results = useMemo(() => searchPlaces(q), [q]);
  return (
    <>
      <PickerField label={label} value={value ? `${value.city}, ${value.state}` : ''} placeholder="Choose your city" onPress={() => setOpen(true)} hint={hint} />
      <SearchSheet
        visible={open}
        title={label}
        placeholder={`Search ${cityCount.toLocaleString('en-IN')} cities`}
        items={results}
        keyOf={(p) => `${p.city}|${p.state}`}
        render={(p) => ({ title: p.city, sub: p.state })}
        onPick={(p) => {
          onChange(p);
          setOpen(false);
          setQ('');
        }}
        onClose={() => setOpen(false)}
        query={q}
        setQuery={setQ}
      />
    </>
  );
}

/**
 * Area picker. Big metros have a list (still searchable, with "type it" for
 * anything missing); elsewhere it's a plain text field.
 */
export function AreaPicker({ city, value, onChange, label = 'Area' }: { city?: string | null; value: string; onChange: (a: string) => void; label?: string }) {
  const areas = areasFor(city);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? areas.filter((a) => a.toLowerCase().includes(t)) : areas;
  }, [q, areas]);

  if (!areas.length) {
    return <TextField label={label} value={value} onChangeText={onChange} placeholder={city ? `Your area in ${city}` : 'Choose a city first'} editable={!!city} />;
  }
  const typed = q.trim();
  return (
    <>
      <PickerField label={label} value={value} placeholder={`Choose an area in ${city}`} onPress={() => setOpen(true)} />
      <SearchSheet
        visible={open}
        title={`Area in ${city}`}
        placeholder="Search areas"
        items={results}
        keyOf={(a) => a}
        render={(a) => ({ title: a })}
        onPick={(a) => {
          onChange(a);
          setOpen(false);
          setQ('');
        }}
        onClose={() => setOpen(false)}
        query={q}
        setQuery={setQ}
        footer={
          typed && !areas.some((a) => a.toLowerCase() === typed.toLowerCase()) ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                onChange(typed);
                setOpen(false);
                setQ('');
              }}
              style={styles.useTyped}
            >
              <Icon name="plus" size={18} color={colors.moss} />
              <Text variant="callout" color={colors.moss}>
                Use “{typed}”
              </Text>
            </Pressable>
          ) : null
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 54, paddingHorizontal: space.lg, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.lineStrong },
  sheet: { flex: 1, backgroundColor: colors.mist },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: GUTTER, marginBottom: space.sm, minHeight: 50, paddingHorizontal: space.lg, backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingVertical: 12 },
  row: { minHeight: 52, justifyContent: 'center', paddingHorizontal: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  useTyped: { flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: colors.green50 },
});

/** The city search sheet on its own, for chip-style triggers (Search filters). */
export function CitySheet({ visible, onPick, onClose, allowAll }: { visible: boolean; onPick: (p: Place | null) => void; onClose: () => void; allowAll?: boolean }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchPlaces(q), [q]);
  return (
    <SearchSheet
      visible={visible}
      title="City"
      placeholder={`Search ${cityCount.toLocaleString('en-IN')} cities`}
      items={results}
      keyOf={(p) => `${p.city}|${p.state}`}
      render={(p) => ({ title: p.city, sub: p.state })}
      onPick={(p) => {
        onPick(p);
        setQ('');
      }}
      onClose={onClose}
      query={q}
      setQuery={setQ}
      footer={
        allowAll ? (
          <Pressable accessibilityRole="button" onPress={() => onPick(null)} style={styles.useTyped}>
            <Icon name="globe" size={18} color={colors.moss} />
            <Text variant="callout" color={colors.moss}>
              All cities
            </Text>
          </Pressable>
        ) : null
      }
    />
  );
}
