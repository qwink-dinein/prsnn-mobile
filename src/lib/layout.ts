import { useWindowDimensions } from 'react-native';

/**
 * The app is a phone layout. On tablets, foldables and desktop browsers it
 * runs in a centred column this wide instead of stretching edge to edge.
 */
export const MAX_APP_WIDTH = 560;

/** Width of the app column (the window on phones, MAX_APP_WIDTH on wide screens). */
export function useAppWidth() {
  const { width, height } = useWindowDimensions();
  return { width: Math.min(width, MAX_APP_WIDTH), height, wide: width > MAX_APP_WIDTH, windowWidth: width };
}
