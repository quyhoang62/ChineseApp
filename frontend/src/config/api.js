import { Platform } from "react-native";

// For Android emulator use 10.0.2.2, for iOS simulator and web use localhost.
const HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const API_BASE_URL = `http://${HOST}:4000/api`;
