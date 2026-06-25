import { COLORS, SHADOW } from "../constants/theme";

// Shared style tokens: screens can compose these with local styles.
export const COMMON = {
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  surfaceCard: {
    backgroundColor: COLORS.surface,
    ...SHADOW,
  },
  rounded20: {
    borderRadius: 20,
  },
  rounded24: {
    borderRadius: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  input: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFF9F3",
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  softButton: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "#FDEEE7",
    borderColor: "#F3D8CB",
  },
  darkButton: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#211C19",
  },
  badgePill: {
    fontSize: 12,
    fontWeight: "700",
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
};
