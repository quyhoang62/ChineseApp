import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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

const initialForm = {
  hanzi: "",
  pinyin: "",
  meaning: "",
  lesson: "",
  example: "",
  note: "",
};

function Field({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#AA9688"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

export function AddWordScreen() {
  const { words, addWord } = useVocabulary();
  const [form, setForm] = useState(initialForm);

  const recentWords = useMemo(() => words.slice(0, 3), [words]);

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.hanzi.trim() || !form.meaning.trim()) {
      Alert.alert(
        "Thiếu thông tin",
        "Bạn cần nhập Chữ Hán và Nghĩa tiếng Việt.",
      );
      return;
    }

    try {
      await addWord(form);
      setForm(initialForm);
      Alert.alert("Thành công", "Đã lưu từ vựng mới.");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu từ vựng. Hãy kiểm tra backend.");
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thêm từ vựng mới</Text>
            <Text style={styles.cardSubtitle}>
              Điền thông tin cơ bản để lưu lại và học lại bằng flashcard.
            </Text>

            <Field
              label="Chữ Hán"
              required
              value={form.hanzi}
              onChangeText={(value) => setValue("hanzi", value)}
              placeholder="Ví dụ: 学习"
            />
            <Field
              label="Pinyin"
              value={form.pinyin}
              onChangeText={(value) => setValue("pinyin", value)}
              placeholder="Ví dụ: xue xi"
            />
            <Field
              label="Nghĩa tiếng Việt"
              required
              value={form.meaning}
              onChangeText={(value) => setValue("meaning", value)}
              placeholder="Ví dụ: học tập"
            />
            <Field
              label="Lesson / Chủ đề"
              value={form.lesson}
              onChangeText={(value) => setValue("lesson", value)}
              placeholder="Ví dụ: Lesson 1"
            />
            <Field
              label="Câu ví dụ"
              value={form.example}
              onChangeText={(value) => setValue("example", value)}
              placeholder="Ví dụ: 我学习中文。"
              multiline
            />
            <Field
              label="Ghi chú"
              value={form.note}
              onChangeText={(value) => setValue("note", value)}
              placeholder="Ghi chú thêm nếu cần"
              multiline
            />

            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lưu từ vựng</Text>
            </Pressable>
          </View>

          <View style={styles.recentCard}>
            <Text style={styles.recentTitle}>Từ mới thêm gần đây</Text>
            {!recentWords.length ? (
              <Text style={styles.emptyRecent}>Chưa có dữ liệu.</Text>
            ) : (
              recentWords.map((item) => (
                <View key={item.id} style={styles.recentItem}>
                  <Text style={styles.recentHanzi}>{item.hanzi}</Text>
                  <Text style={styles.recentMeta}>
                    {item.pinyin || "---"} | {item.meaning}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...COMMON.screen,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded24,
    padding: 18,
  },
  cardTitle: {
    ...COMMON.sectionTitle,
  },
  cardSubtitle: {
    ...COMMON.sectionSubtitle,
    marginTop: 6,
    marginBottom: 12,
  },
  fieldWrap: {
    marginTop: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  required: {
    color: COLORS.danger,
  },
  input: {
    ...COMMON.input,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 12,
  },
  saveButton: {
    ...COMMON.primaryButton,
    marginTop: 14,
  },
  saveButtonText: {
    ...COMMON.primaryButtonText,
    fontWeight: "800",
  },
  recentCard: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded20,
    padding: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  emptyRecent: {
    marginTop: 10,
    color: COLORS.textSecondary,
  },
  recentItem: {
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0E3D7",
  },
  recentHanzi: {
    fontSize: 24,
    color: COLORS.primaryDark,
    fontWeight: "700",
  },
  recentMeta: {
    marginTop: 2,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
});
