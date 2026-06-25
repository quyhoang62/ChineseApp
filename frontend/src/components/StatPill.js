import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

export function StatPill({ label, value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mutedSurface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
});
