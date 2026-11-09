import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { UploadFile } from './api';

/**
 * Pick (or take) a photo for upload. Permission is asked only at this moment,
 * after the person tapped a button that explains why; if denied we point them
 * to Settings instead of failing silently.
 */
export async function pickImage({ camera = false, aspect }: { camera?: boolean; aspect?: [number, number] } = {}): Promise<UploadFile | null> {
  const perm = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert(
      camera ? 'Camera access is off' : 'Photo access is off',
      'You can turn it on in Settings to add photos.',
      [{ text: 'Not now', style: 'cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }],
    );
    return null;
  }
  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7, allowsEditing: !!aspect, aspect };
  const res = camera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
  if (res.canceled || !res.assets?.[0]) return null;
  const a = res.assets[0];
  const ext = (a.mimeType?.split('/')[1] ?? a.uri.split('.').pop() ?? 'jpg').toLowerCase();
  return { uri: a.uri, name: a.fileName ?? `photo.${ext}`, type: a.mimeType ?? `image/${ext === 'jpg' ? 'jpeg' : ext}` };
}
