import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from 'expo-router';
import { useDraft } from '@/components/ui/states';

/**
 * A multi-step flow (member setup, companion sign-up) that:
 * - treats every "back" (header arrow, Android back button, iOS swipe) as "previous step",
 *   so nobody falls out of setup onto the login or mobile-number screen;
 * - remembers the step on the phone, so a closed app, a crash or a restored session reopens
 *   on the same step (the answers are kept by the screen's own draft);
 * - on the first step, calls `onLeave` (the screen asks "Finish setting up?") instead of leaving.
 */
export function useStepFlow({
  key,
  count,
  initial,
  onLeave,
  ready = true,
  maxStep,
}: {
  key: string;
  count: number;
  initial: number;
  onLeave: () => void;
  /** False until the screen's own answers have loaded; the step is restored only after that. */
  ready?: boolean;
  /** The furthest step the saved answers support (the first unanswered one): never restore past it. */
  maxStep?: number;
}) {
  const navigation = useNavigation();
  const [saved, setSaved, clearSaved, restored] = useDraft(`${key}.step`, { step: initial });
  const [i, setIState] = useState(initial);
  const applied = useRef(false);

  // Restore the remembered step once both it and the answers have loaded. If the person has
  // already moved (tapped before storage answered), their tap wins.
  useEffect(() => {
    if (restored && ready && !applied.current) {
      applied.current = true;
      const limit = Math.min(count - 1, maxStep ?? count - 1);
      setIState(Math.max(0, Math.min(limit, saved.step)));
    }
  }, [restored, ready, saved.step, count, maxStep]);

  const setI = useCallback(
    (n: number | ((p: number) => number)) =>
      setIState((cur) => {
        applied.current = true; // a step the person chose is never overwritten by the restore
        const v = Math.max(0, Math.min(count - 1, typeof n === 'function' ? n(cur) : n));
        setSaved({ step: v });
        return v;
      }),
    [count, setSaved],
  );
  const next = useCallback(() => setI((x) => x + 1), [setI]);
  const back = useCallback(() => (i > 0 ? setI(i - 1) : onLeave()), [i, setI, onLeave]);

  // iOS swipe-back would skip the steps: turn it off on this screen.
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  // Android back button and any other "go back": step back instead of leaving.
  const iRef = useRef(i);
  const leaveRef = useRef(onLeave);
  useEffect(() => {
    iRef.current = i;
    leaveRef.current = onLeave;
  });
  useEffect(() => {
    // expo-router's useNavigation is untyped for stack events; beforeRemove carries the action.
    type BeforeRemove = { preventDefault: () => void; data: { action: { type: string } } };
    const nav = navigation as unknown as { addListener: (ev: 'beforeRemove', cb: (e: BeforeRemove) => void) => () => void };
    const sub = nav.addListener('beforeRemove', (e) => {
      const type = e.data.action.type;
      if (type !== 'GO_BACK' && type !== 'POP') return; // forward navigation (finishing) is fine
      e.preventDefault();
      if (iRef.current > 0) setI(iRef.current - 1);
      else leaveRef.current();
    });
    return sub;
  }, [navigation, setI]);

  return { i, setI, next, back, clearStep: clearSaved };
}
