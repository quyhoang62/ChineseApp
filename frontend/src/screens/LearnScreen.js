import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatPill } from "../components/StatPill";
import { COLORS } from "../constants/theme";
import { useVocabulary } from "../context/VocabularyContext";
import { COMMON } from "../styles/commonStyles";

export function LearnScreen() {
  const { words, hydrated, learnedCount, progress, markLearned } =
    useVocabulary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentWord = useMemo(() => {
    if (!words.length) {
      return null;
    }

    return words[currentIndex % words.length];
  }, [currentIndex, words]);

  const handleNextWord = () => {
    if (!words.length) {
      return;
    }

    setCurrentIndex((prev) => (prev + 1) % words.length);
    setShowAnswer(false);
  };

  const handleMarkLearned = async () => {
    if (!currentWord) {
      return;
    }

    try {
      await markLearned(currentWord.id);
    } catch (error) {
      // Keep flow simple for beginners and show a direct message.
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái. Hãy kiểm tra backend.");
    }
  };

  if (!hydrated) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu từ vựng...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.screen}>
      <View style={styles.statsRow}>
        <StatPill label="Tổng số từ" value={words.length} />
        <StatPill label="Đã thuộc" value={learnedCount} />
        <StatPill label="Tiến độ" value={`${progress}%`} />
      </View>

      <View style={styles.cardWrapper}>
        {!currentWord ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Chưa có từ vựng nào</Text>
            <Text style={styles.emptyText}>
              Hãy vào tab Thêm từ để bắt đầu xây dựng bộ từ vựng của bạn.
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.hanzi}>{currentWord.hanzi}</Text>
            {showAnswer ? (
              <View style={styles.answerBlock}>
                <Text style={styles.answerLine}>
                  Pinyin: {currentWord.pinyin || "---"}
                </Text>
                <Text style={styles.answerLine}>
                  Nghĩa: {currentWord.meaning}
                </Text>
                <Text style={styles.answerExample}>
                  Ví dụ: {currentWord.example || "Chưa có câu ví dụ."}
                </Text>
              </View>
            ) : (
              <Text style={styles.hint}>
                Bấm hiện đáp án để xem pinyin và nghĩa.
              </Text>
            )}

            <View style={styles.badgeWrap}>
              <Text
                style={[
                  styles.badge,
                  currentWord.learned && styles.badgeLearned,
                ]}
              >
                {currentWord.learned ? "Đã thuộc" : "Đang học"}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowAnswer((prev) => !prev)}
          disabled={!currentWord}
        >
          <Text style={styles.secondaryButtonText}>
            {showAnswer ? "Ẩn đáp án" : "Hiện đáp án"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={handleMarkLearned}
          disabled={!currentWord}
        >
          <Text style={styles.primaryButtonText}>Đánh dấu đã thuộc</Text>
        </Pressable>

        <Pressable
          style={styles.nextButton}
          onPress={handleNextWord}
          disabled={!currentWord}
        >
          <Text style={styles.nextButtonText}>Từ tiếp theo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...COMMON.screen,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded24,
    padding: 24,
    minHeight: 320,
    justifyContent: "center",
  },
  emptyCard: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded24,
    padding: 24,
    minHeight: 220,
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 22,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  hanzi: {
    textAlign: "center",
    fontSize: 56,
    color: COLORS.primaryDark,
    fontWeight: "800",
  },
  hint: {
    marginTop: 16,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  answerBlock: {
    marginTop: 18,
    gap: 8,
    backgroundColor: "#FFF9F1",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  answerLine: {
    fontSize: 17,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  answerExample: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  badgeWrap: {
    alignItems: "center",
    marginTop: 18,
  },
  badge: {
    ...COMMON.badgePill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FCE9E5",
    color: COLORS.danger,
  },
  badgeLearned: {
    backgroundColor: "#E4F4EA",
    color: COLORS.success,
  },
  actions: {
    gap: 10,
    marginBottom: 2,
  },
  primaryButton: {
    ...COMMON.primaryButton,
  },
  primaryButtonText: {
    ...COMMON.primaryButtonText,
  },
  secondaryButton: {
    ...COMMON.softButton,
    minHeight: 48,
  },
  secondaryButtonText: {
    color: COLORS.primaryDark,
    fontSize: 15,
    fontWeight: "700",
  },
  nextButton: {
    ...COMMON.darkButton,
    minHeight: 48,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
