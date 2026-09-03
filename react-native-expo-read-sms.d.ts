declare module "@maniac-tech/react-native-expo-read-sms" {
  export function startReadSMS(callback: (status: "success" | "error", sms: unknown, error?: string) => void): Promise<void>;
  export function stopReadSMS(): void;
}
