import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '@/theme/tokens';
import { Text } from './Text';
import { Button } from './Button';

export interface ConfirmOptions {
  title: string;
  message?: string;
  /** Omit for an information message with a single OK button. */
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

type Ask = (o: ConfirmOptions) => Promise<boolean>;
const Ctx = createContext<Ask>(async () => false);

/**
 * In-app confirmation sheet. Used instead of Alert.alert because the system
 * alert has no buttons on the web (preview), and the hosted preview blocks
 * window.confirm. Destructive choices are red; Cancel is always there.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const ask = useCallback<Ask>(
    (o) =>
      new Promise<boolean>((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setOpts(o);
      }),
    [],
  );

  const close = (v: boolean) => {
    resolver.current?.(v);
    resolver.current = null;
    setOpts(null);
  };

  return (
    <Ctx.Provider value={ask}>
      {children}
      <Modal visible={!!opts} transparent animationType="fade" onRequestClose={() => close(false)}>
        <Pressable style={styles.backdrop} onPress={() => close(false)} accessibilityLabel="Dismiss" />
        <View style={styles.wrap} pointerEvents="box-none">
          <View style={styles.card} accessibilityViewIsModal accessibilityRole="alert">
            <Text variant="title3" center>
              {opts?.title}
            </Text>
            {opts?.message ? (
              <Text variant="callout" muted center>
                {opts.message}
              </Text>
            ) : null}
            <View style={{ gap: space.sm, marginTop: space.sm }}>
              {opts?.confirmLabel ? (
                <>
                  <Button label={opts.confirmLabel} variant={opts.destructive ? 'danger' : 'primary'} onPress={() => close(true)} />
                  <Button label={opts.cancelLabel ?? 'Cancel'} variant="ghost" onPress={() => close(false)} />
                </>
              ) : (
                <Button label="OK" onPress={() => close(true)} />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Ctx.Provider>
  );
}

export const useConfirm = () => useContext(Ctx);

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(24,27,52,0.4)' },
  wrap: { flex: 1, justifyContent: 'center', padding: space.xl },
  card: { backgroundColor: colors.paper, borderRadius: radius.xl, padding: space.xl, gap: space.sm, maxWidth: 420, width: '100%', alignSelf: 'center' },
});
