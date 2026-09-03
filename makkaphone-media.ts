import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

export async function persistProductImage(uri: string): Promise<string> {
  if (Platform.OS === "web" || !FileSystem.documentDirectory) return uri;
  const directory = `${FileSystem.documentDirectory}makkaphone-products/`;
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  const extension = uri.split(".").pop()?.split("?")[0] || "jpg";
  const target = `${directory}product-${Date.now()}.${extension}`;
  await FileSystem.copyAsync({ from: uri, to: target });
  return target;
}

export async function dataUrlFromImage(uri: string, mimeType = "image/jpeg"): Promise<string> {
  if (uri.startsWith("data:image")) return uri;
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  return `data:${mimeType};base64,${base64}`;
}
