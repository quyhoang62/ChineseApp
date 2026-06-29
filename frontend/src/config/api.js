import { Platform } from "react-native";

// IP LAN của máy tính đang chạy backend.
// Thay đổi khi đổi mạng Wi-Fi.
const LAN_IP = "192.168.1.18";

// Android emulator dùng 10.0.2.2, web dùng localhost, thiết bị thật dùng IP LAN.
const HOST =
  Platform.OS === "android" && !__DEV__
    ? "10.0.2.2"
    : Platform.OS === "web"
      ? "localhost"
      : LAN_IP;

export const API_BASE_URL = `http://${HOST}:4000/api`;
