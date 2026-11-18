import { create } from 'zustand';
import type { ComponentRef } from 'react';
import type { View } from 'react-native';
import type { Companion } from '@/domain/types';

/** Where the tapped photo sits on screen (window coordinates), so the viewer can grow out of it. */
export type Origin = { x: number; y: number; width: number; height: number; radius: number };

type Target = {
  c: Pick<Companion, 'id' | 'fullName' | 'profilePhoto' | 'area' | 'city' | 'idVerified' | 'packages'>;
  origin: Origin | null;
  /** "Free today · till 9 PM" when known. */
  free?: string;
  /** Show View profile / Book (off on the profile itself). */
  actions: boolean;
};

export const usePhotoViewer = create<{ target: Target | null; show: (t: Target) => void; hide: () => void }>((set) => ({
  target: null,
  show: (target) => set({ target }),
  hide: () => set({ target: null }),
}));

/**
 * Opens the full-screen photo for a companion, growing it out of `from` (the tapped photo).
 * Locked or missing photos never open: the caller only offers this for a visible photo.
 */
export function openPhoto(from: ComponentRef<typeof View> | null, c: Target['c'], opts: { radius?: number; free?: string; actions?: boolean } = {}) {
  if (!c.profilePhoto) return;
  const show = (origin: Origin | null) => usePhotoViewer.getState().show({ c, origin, free: opts.free, actions: opts.actions ?? true });
  if (!from) return show(null);
  from.measureInWindow((x: number, y: number, width: number, height: number) => show(width && height ? { x, y, width, height, radius: opts.radius ?? 0 } : null));
}
