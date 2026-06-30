import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import { useVocabulary } from "../context/VocabularyContext";
import { COMMON } from "../styles/commonStyles";

function normalize(value) {
  return value.trim().toLowerCase();
}

function getLessonNumber(value) {
  const match = String(value || "").match(/lesson\s*0*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function getMatchScore(word, query) {
  const normalizedLesson = normalize(word.lesson || "");
  const lessonNumberFromQuery = getLessonNumber(query);
  const lessonNumberFromWord = getLessonNumber(normalizedLesson);

  // Highest priority: exact lesson number, e.g. lesson1 -> Lesson01.
  if (
    lessonNumberFromQuery !== null &&
    lessonNumberFromWord !== null &&
    lessonNumberFromQuery === lessonNumberFromWord
  ) {
    return 0;
  }

  const fields = [
    normalize(word.hanzi || ""),
    normalize(word.pinyin || ""),
    normalize(word.meaning || ""),
    normalizedLesson,
  ];

  if (fields.some((field) => field === query)) {
    return 1;
  }

  if (fields.some((field) => field.startsWith(query))) {
    return 2;
  }

  if (fields.some((field) => field.includes(query))) {
    return 3;
  }

  return Number.POSITIVE_INFINITY;
}

export function SearchScreen() {
  const { words, toggleLearned, deleteWord } = useVocabulary();
  const [query, setQuery] = useState("");

  const filteredWords = useMemo(() => {
    const q = normalize(query);

    if (!q) {
      return words;
    }

    return words
      .map((word) => ({
        word,
        score: getMatchScore(word, q),
      }))
      .filter((item) => Number.isFinite(item.score))
      .sort((a, b) => {
        if (a.score !== b.score) {
          return a.score - b.score;
        }

        // Keep deterministic order for same score: newest id first.
        return Number(b.word.id) - Number(a.word.id);
      })
      .map((item) => item.word);
  }, [query, words]);

  const confirmDelete = (word) => {
    Alert.alert("Xóa từ vựng", `Bạn có chắc muốn xóa từ ${word.hanzi}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteWord(word.id);
            Alert.alert("Đã xóa", "Từ vựng đã được xóa khỏi danh sách.");
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa từ vựng. Hãy kiểm tra backend.");
          }
        },
      },
    ]);
  };

  const handleToggleLearned = async (word) => {
    try {
      await toggleLearned(word.id);
      Alert.alert(
        "Cập nhật",
        word.learned
          ? "Đã chuyển về trạng thái đang học."
          : "Đã đánh dấu đã thuộc.",
      );
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể cập nhật trạng thái. Hãy kiểm tra backend.",
      );
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.screen}>
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo Chữ Hán, pinyin, nghĩa, lesson..."
          placeholderTextColor="#A88F80"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {!filteredWords.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptyText}>
              Hãy thử từ khóa khác hoặc thêm từ mới trong tab Thêm từ.
            </Text>
          </View>
        ) : (
          filteredWords.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemTop}>
                <Text style={styles.hanzi}>{item.hanzi}</Text>
                <Text
                  style={[
                    styles.status,
                    item.learned ? styles.statusLearned : styles.statusLearning,
                  ]}
                >
                  {item.learned ? "Đã thuộc" : "Chưa thuộc"}
                </Text>
              </View>

              <Text style={styles.detail}>Pinyin: {item.pinyin || "---"}</Text>
              <Text style={styles.detail}>Nghĩa: {item.meaning}</Text>
              <Text style={styles.detail}>
                Lesson: {item.lesson || "Chưa phân loại"}
              </Text>

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.toggleBtn}
                  onPress={() => handleToggleLearned(item)}
                >
                  <Text style={styles.toggleBtnText}>
                    {item.learned ? "Đánh dấu chưa thuộc" : "Đánh dấu đã thuộc"}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(item)}
                >
                  <Text style={styles.deleteBtnText}>Xóa</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...COMMON.screen,
    paddingHorizontal: 16,
  },
  searchWrap: {
    paddingTop: 6,
  },
  searchInput: {
    ...COMMON.input,
    minHeight: 48,
    borderRadius: 16,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  emptyState: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded20,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 8,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  itemCard: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded20,
    padding: 16,
  },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hanzi: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  status: {
    ...COMMON.badgePill,
  },
  statusLearned: {
    backgroundColor: "#E4F4EA",
    color: COLORS.success,
  },
  statusLearning: {
    backgroundColor: "#FDE9E6",
    color: COLORS.danger,
  },
  detail: {
    marginTop: 6,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    ...COMMON.softButton,
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
  },
  toggleBtnText: {
    color: COLORS.primaryDark,
    fontWeight: "700",
    fontSize: 13,
  },
  deleteBtn: {
    ...COMMON.darkButton,
    minWidth: 72,
    minHeight: 42,
    borderRadius: 12,
  },
  deleteBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
