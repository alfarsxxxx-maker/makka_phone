import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function prepareAlertChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("makkaphone-alerts", {
    name: "تنبيهات مكة فون",
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: "#E10600",
    vibrationPattern: [0, 180, 120, 180],
  });
}

export async function notifyWalletAlert(title: string, body: string): Promise<void> {
  if (Platform.OS === "web") return;
  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) return;
  await Notifications.scheduleNotificationAsync({ content: { title, body, color: "#E10600" }, trigger: null });
}
