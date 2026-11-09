import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { colors, GUTTER, radius, space } from '@/theme/tokens';
import { fonts } from '@/theme/fonts';
import { Avatar, IconButton } from '@/components/ui/layout';
import { Text } from '@/components/ui/Text';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { PressScale } from '@/components/ui/motion';
import { TextField } from '@/components/ui/forms';
import { SafeAreaView } from 'react-native-safe-area-context';
import { svc } from '@/services';
import { errorMessage, type UploadFile } from '@/lib/api';
import { goHome } from '@/lib/flow';
import { pickImage } from '@/lib/pickImage';
import { searchPlaces, stateOf, type Place } from '@/domain/places';
import { areasFor } from '@/data/india-areas';
import { defaultVisibility, GENDER_OPTIONS, SEE_OPTIONS, VISIBILITY_COPY } from '@/domain/privacy';
import type { Gender, SeeGender, Visibility } from '@/domain/types';
import { useSession } from '@/state/session';

type Step = 'name' | 'gender' | 'see' | 'visibility' | 'city' | 'area';

/**
 * First run (and once for older accounts), one question per screen.
 * Tapping an answer saves it and moves on — no confirm buttons. Only the
 * name needs typing ("Next" on the keyboard works too).
 * Tapping Open/Locked is the consent: the card says so in plain words.
 */
export default function SetupProfile() {
  const user = useSession((s) => s.user);
  const updateUser = useSession((s) => s.updateUser);
  const isCompanion = user?.role === 'companion';
  const steps: Step[] = isCompanion ? ['name', 'gender', 'visibility', 'city', 'area'] : ['name', 'gender', 'see', 'visibility', 'city', 'area'];
  const [i, setI] = useState(0);
  const step = steps[i];

  const [name, setName] = useState(user?.fullName ?? '');
  const [photo, setPhoto] = useState<UploadFile | null>(null);
  const [gender, setGender] = useState<Gender | undefined>(user?.gender);
  const [see, setSee] = useState<SeeGender | undefined>(user?.seeGender);
  const [visibility, setVisibility] = useState<Visibility | undefined>(user?.profileVisibility);
  const [place, setPlace] = useState<Place | null>(user?.city ? { city: user.city, state: stateOf(user.city) ?? '' } : null);
  const [q, setQ] = useState('');
  const [typedArea, setTypedArea] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = () => {
    setError(null);
    setQ('');
    setI((x) => Math.min(x + 1, steps.length - 1));
  };
  const back = () => (i > 0 ? (setError(null), setQ(''), setI(i - 1)) : undefined);

  const finish = async (area: string) => {
    if (!gender || !visibility || !place || (!isCompanion && !see)) return;
    setBusy(true);
    setError(null);
    try {
      await svc.updateProfile({ fullName: name.trim(), city: place.city, state: place.state, area: area.trim(), phoneNumber: user?.phone?.replace(/^91/, '') }, photo);
      await svc.updateIdentity({ gender, seeGender: isCompanion ? undefined : see, profileVisibility: visibility, visibilityConsent: true });
      await updateUser({ fullName: name.trim(), profilePhoto: photo?.uri ?? user?.profilePhoto, gender, seeGender: see, profileVisibility: visibility, city: place.city });
      if (user?.phone && !user.hasPin) router.replace({ pathname: '/pin', params: { mode: 'set' } });
      else goHome();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Step, string> = {
    name: 'What should we call you?',
    gender: 'I am',
    see: 'Show me',
    visibility: 'Who can see your photo?',
    city: 'Your city',
    area: `Your area in ${place?.city ?? 'your city'}`,
  };
  const subs: Partial<Record<Step, string>> = {
    name: isCompanion ? 'Members see your first name.' : 'Companions see your first name when you book.',
    see: 'You’ll only see companions of this gender. Change it any time in Profile.',
    visibility: 'Tap one to choose it. You can change this any time in Profile → Privacy.',
    city: 'Companions are shown from your city first.',
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.top}>
        {i > 0 ? <IconButton name="chevronLeft" label="Back" onPress={back} /> : <View style={{ width: 48 }} />}
        <View style={styles.dots} accessibilityLabel={`Step ${i + 1} of ${steps.length}`}>
          {steps.map((s, k) => (
            <View key={s} style={[styles.dot, k <= i && styles.dotOn]} />
          ))}
        </View>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.head}>
        <Text variant="title1" accessibilityRole="header">
          {titles[step]}
        </Text>
        {subs[step] ? (
          <Text variant="callout" muted>
            {subs[step]}
          </Text>
        ) : null}
      </View>

      {step === 'name' ? (
        <View style={styles.body}>
          <Pressable accessibilityRole="button" accessibilityLabel="Add a profile photo (optional)" onPress={async () => setPhoto((await pickImage({ aspect: [1, 1] })) ?? photo)} style={styles.photo}>
            <Avatar uri={photo?.uri} name={name || '?'} size={96} />
            <View style={styles.cam}>
              <Icon name="camera" size={16} color={colors.onMoss} />
            </View>
          </Pressable>
          <TextField
            label="Full name"
            value={name}
            onChangeText={setName}
            textContentType="name"
            autoComplete="name"
            autoCapitalize="words"
            returnKeyType="next"
            autoFocus={!name}
            onSubmitEditing={() => (name.trim().length >= 2 ? next() : setError('Please enter your name.'))}
            error={error}
          />
          <Button label="Next" iconRight="arrowRight" disabled={name.trim().length < 2} onPress={next} />
        </View>
      ) : step === 'gender' ? (
        <Options
          items={GENDER_OPTIONS.map((g) => ({ key: g.value, title: g.label, icon: 'user' as IconName }))}
          selected={gender}
          onPick={(v) => {
            setGender(v as Gender);
            if (!visibility) setVisibility(defaultVisibility(v as Gender));
            next();
          }}
        />
      ) : step === 'see' ? (
        <Options
          items={SEE_OPTIONS.map((g) => ({ key: g.value, title: g.label, icon: 'users' as IconName }))}
          selected={see}
          onPick={(v) => {
            setSee(v as SeeGender);
            next();
          }}
        />
      ) : step === 'visibility' ? (
        <Options
          items={(['open', 'locked'] as Visibility[]).map((v) => ({
            key: v,
            title: `${VISIBILITY_COPY[v].title}${gender && defaultVisibility(gender) === v ? ' · recommended' : ''}`,
            body: `${VISIBILITY_COPY[v].body} Tapping this means you agree to your profile being shown this way.`,
            icon: (v === 'locked' ? 'lock' : 'eye') as IconName,
          }))}
          selected={visibility}
          onPick={(v) => {
            setVisibility(v as Visibility);
            next();
          }}
        />
      ) : step === 'city' ? (
        <CityStep
          q={q}
          setQ={setQ}
          selected={place}
          onPick={(p) => {
            setPlace(p);
            setTypedArea('');
            next();
          }}
        />
      ) : (
        <AreaStep city={place?.city} q={q} setQ={setQ} typed={typedArea} setTyped={setTypedArea} busy={busy} onPick={finish} />
      )}

      {error && step !== 'name' ? (
        <Text variant="footnote" color={colors.danger} center style={{ padding: space.md }} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </SafeAreaView>
  );
}

/** Big tappable answers: one tap = chosen and on to the next question. */
function Options({ items, selected, onPick }: { items: { key: string; title: string; body?: string; icon: IconName }[]; selected?: string; onPick: (k: string) => void }) {
  return (
    <View style={[styles.body, { gap: space.sm }]} accessibilityRole="radiogroup">
      {items.map((it) => {
        const on = selected === it.key;
        return (
          <PressScale
            key={it.key}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            accessibilityLabel={it.body ? `${it.title}. ${it.body}` : it.title}
            onPress={() => onPick(it.key)}
            innerStyle={[styles.option, on && styles.optionOn]}
            pressedStyle={styles.optionPressed}
          >
            <View style={styles.optionIcon}>
              <Icon name={it.icon} size={20} color={colors.moss} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="headline">{it.title}</Text>
              {it.body ? (
                <Text variant="footnote" muted>
                  {it.body}
                </Text>
              ) : null}
            </View>
            <Icon name="chevronRight" size={18} color={on ? colors.moss : colors.gray400} />
          </PressScale>
        );
      })}
    </View>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (s: string) => void; placeholder: string }) {
  const ref = useRef<React.ComponentRef<typeof TextInput>>(null);
  return (
    <Pressable onPress={() => ref.current?.focus()} style={styles.search}>
      <Icon name="search" size={18} color={colors.gray500} />
      <TextInput ref={ref} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.gray400} style={styles.input} autoCorrect={false} accessibilityLabel={placeholder} />
    </Pressable>
  );
}

function CityStep({ q, setQ, selected, onPick }: { q: string; setQ: (s: string) => void; selected: Place | null; onPick: (p: Place) => void }) {
  const results = useMemo(() => searchPlaces(q, { limit: 40 }), [q]);
  return (
    <View style={{ flex: 1 }}>
      <SearchBox value={q} onChange={setQ} placeholder="Search 4,300+ cities" />
      <FlatList
        data={results}
        keyExtractor={(p) => `${p.city}|${p.state}`}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: space.huge }}
        renderItem={({ item }) => {
          const on = selected?.city === item.city && selected.state === item.state;
          return (
            <Pressable accessibilityRole="button" accessibilityLabel={`${item.city}, ${item.state}`} onPress={() => onPick(item)} style={({ pressed }) => [styles.listRow, on && styles.listRowOn, pressed && { backgroundColor: colors.mistDeep }]}>
              <View style={{ flex: 1 }}>
                <Text variant="callout">{item.city}</Text>
                <Text variant="caption" muted>
                  {item.state}
                </Text>
              </View>
              <Icon name="chevronRight" size={16} color={colors.gray400} />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function AreaStep({ city, q, setQ, typed, setTyped, busy, onPick }: { city?: string; q: string; setQ: (s: string) => void; typed: string; setTyped: (s: string) => void; busy: boolean; onPick: (a: string) => void }) {
  const areas = areasFor(city);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? areas.filter((a) => a.toLowerCase().includes(t)) : areas;
  }, [q, areas]);

  if (!areas.length) {
    return (
      <View style={styles.body}>
        <TextField label="Area" value={typed} onChangeText={setTyped} placeholder={`e.g. a locality in ${city}`} returnKeyType="done" onSubmitEditing={() => onPick(typed)} autoFocus />
        <Button label="Finish" onPress={() => onPick(typed)} loading={busy} />
        <Button label="Skip for now" variant="ghost" onPress={() => onPick('')} disabled={busy} />
      </View>
    );
  }
  const custom = q.trim();
  return (
    <View style={{ flex: 1 }}>
      <SearchBox value={q} onChange={setQ} placeholder="Search areas" />
      <FlatList
        data={results}
        keyExtractor={(a) => a}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: GUTTER, paddingBottom: space.huge }}
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" accessibilityLabel={item} disabled={busy} onPress={() => onPick(item)} style={({ pressed }) => [styles.listRow, pressed && { backgroundColor: colors.mistDeep }]}>
            <Text variant="callout" style={{ flex: 1 }}>
              {item}
            </Text>
            <Icon name="chevronRight" size={16} color={colors.gray400} />
          </Pressable>
        )}
        ListFooterComponent={
          <View style={{ gap: space.sm, paddingTop: space.md }}>
            {custom && !areas.some((a) => a.toLowerCase() === custom.toLowerCase()) ? (
              <Button label={`Use “${custom}”`} variant="secondary" icon="plus" onPress={() => onPick(custom)} loading={busy} />
            ) : null}
            <Button label="Skip for now" variant="ghost" onPress={() => onPick('')} disabled={busy} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xs, minHeight: 52 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 18, height: 4, borderRadius: 2, backgroundColor: colors.mistDeep },
  dotOn: { backgroundColor: colors.moss },
  head: { paddingHorizontal: GUTTER, gap: space.xs, marginTop: space.md, marginBottom: space.xl },
  body: { paddingHorizontal: GUTTER, gap: space.lg },
  photo: { alignSelf: 'center' },
  cam: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.mist },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 64, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: colors.line },
  optionOn: { borderColor: colors.moss, backgroundColor: colors.green50 },
  optionPressed: { backgroundColor: colors.green50, borderColor: colors.moss },
  optionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mossSoft, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginHorizontal: GUTTER, marginBottom: space.sm, minHeight: 50, paddingHorizontal: space.lg, backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, color: colors.ink, paddingVertical: 12 },
  listRow: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: space.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  listRowOn: { backgroundColor: colors.green50 },
});
