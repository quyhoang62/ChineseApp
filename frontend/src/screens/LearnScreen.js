import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatPill } from "../components/StatPill";
import { COLORS } from "../constants/theme";
import { useVocabulary } from "../context/VocabularyContext";
import { COMMON } from "../styles/commonStyles";

const LEVELS = [
  {
    key: "HSK 1",
    subtitle: "Sơ cấp",
    description: "Nền tảng giao tiếp cơ bản hằng ngày.",
    vocabTarget: 150,
    icon: "star",
  },
  {
    key: "HSK 2",
    subtitle: "Sơ cấp 2",
    description: "Mở rộng phản xạ hội thoại và mẫu câu thường dùng.",
    vocabTarget: 300,
    icon: "school-outline",
  },
  {
    key: "HSK 3",
    subtitle: "Trung cấp 1",
    description: "Củng cố nền tảng ngữ pháp và mở rộng vốn từ đời thường.",
    vocabTarget: 600,
    icon: "book-outline",
  },
  {
    key: "HSK 4",
    subtitle: "Trung cấp 2",
    description: "Giao tiếp lưu loát về các chủ đề chuyên sâu hơn.",
    vocabTarget: 1200,
    icon: "language-outline",
  },
  {
    key: "Khác",
    subtitle: "Nâng cao",
    description: "Từ vựng kinh tế, công nghệ, y khoa và ôn thi nâng cao.",
    vocabTarget: null,
    icon: "ellipsis-horizontal",
  },
];

function parseLessonKey(key) {
  const match = key.match(/^HSK(\d+)-Lesson(\d+)$/i);
  if (!match) {
    return null;
  }

  return {
    hsk: Number(match[1]),
    lesson: Number(match[2]),
  };
}

function getLevelKeyFromLesson(lessonKey) {
  const parsed = parseLessonKey(lessonKey);
  if (!parsed) {
    return "Khác";
  }

  if (parsed.hsk >= 1 && parsed.hsk <= 4) {
    return `HSK ${parsed.hsk}`;
  }

  return "Khác";
}

function compareLessons(a, b) {
  const pa = parseLessonKey(a.key);
  const pb = parseLessonKey(b.key);

  if (pa && pb) {
    if (pa.hsk !== pb.hsk) {
      return pa.hsk - pb.hsk;
    }
    return pa.lesson - pb.lesson;
  }

  if (pa) {
    return -1;
  }

  if (pb) {
    return 1;
  }

  return a.key.localeCompare(b.key, "vi", { numeric: true });
}

function formatLessonName(lessonKey) {
  const parsed = parseLessonKey(lessonKey);
  if (!parsed) {
    return lessonKey;
  }

  return `Lesson ${String(parsed.lesson).padStart(2, "0")}`;
}

function ProgressRing({ progress }) {
  return (
    <View style={styles.ringOuter}>
      <View style={styles.ringInner}>
        <Text style={styles.ringText}>{progress}%</Text>
      </View>
    </View>
  );
}

export function LearnScreen() {
  const { words, hydrated, setLearned } = useVocabulary();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const lessons = useMemo(() => {
    const grouped = words.reduce((acc, word) => {
      const lesson = word.lesson?.trim() || "Chưa phân loại";
      if (!acc[lesson]) {
        acc[lesson] = { key: lesson, total: 0, learned: 0 };
      }
      acc[lesson].total += 1;
      if (word.learned) {
        acc[lesson].learned += 1;
      }
      return acc;
    }, {});

    return Object.values(grouped)
      .map((lesson) => ({
        ...lesson,
        level: getLevelKeyFromLesson(lesson.key),
        progress: lesson.total
          ? Math.round((lesson.learned / lesson.total) * 100)
          : 0,
      }))
      .sort(compareLessons);
  }, [words]);

  const levelSummaries = useMemo(() => {
    return LEVELS.map((level) => {
      const levelLessons = lessons.filter(
        (lesson) => lesson.level === level.key,
      );
      const totalWords = levelLessons.reduce(
        (sum, lesson) => sum + lesson.total,
        0,
      );
      const learnedWords = levelLessons.reduce(
        (sum, lesson) => sum + lesson.learned,
        0,
      );
      const progress = totalWords
        ? Math.round((learnedWords / totalWords) * 100)
        : 0;

      return {
        ...level,
        totalWords,
        learnedWords,
        progress,
        lessons: levelLessons,
      };
    });
  }, [lessons]);

  const selectedLevelSummary = useMemo(
    () => levelSummaries.find((level) => level.key === selectedLevel) || null,
    [levelSummaries, selectedLevel],
  );

  const lessonWords = useMemo(() => {
    if (!selectedLesson) {
      return [];
    }

    return words
      .filter(
        (word) => (word.lesson?.trim() || "Chưa phân loại") === selectedLesson,
      )
      .sort((a, b) => Number(a.id) - Number(b.id));
  }, [selectedLesson, words]);

  const lessonLearnedCount = useMemo(
    () => lessonWords.filter((word) => word.learned).length,
    [lessonWords],
  );

  const lessonProgress = useMemo(() => {
    if (!lessonWords.length) {
      return 0;
    }

    return Math.round((lessonLearnedCount / lessonWords.length) * 100);
  }, [lessonLearnedCount, lessonWords.length]);

  const currentWord = useMemo(() => {
    if (!lessonWords.length) {
      return null;
    }

    return lessonWords[currentIndex % lessonWords.length];
  }, [currentIndex, lessonWords]);

  const flipToFront = () => {
    setFlipped(false);
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    setCurrentIndex(0);
    flipToFront();
    swipeX.setValue(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLesson]);

  const goNext = () => {
    if (!lessonWords.length) {
      return;
    }

    setCurrentIndex((prev) => (prev + 1) % lessonWords.length);
    swipeX.setValue(0);
    flipToFront();
  };

  const markCurrentWord = async (learned) => {
    if (!currentWord) {
      return;
    }

    try {
      await setLearned(currentWord.id, learned);
      goNext();
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể cập nhật trạng thái. Hãy kiểm tra backend.",
      );
    }
  };

  const toggleFlip = () => {
    const next = !flipped;
    setFlipped(next);

    Animated.timing(flipAnim, {
      toValue: next ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const resetCardPosition = () => {
    Animated.spring(swipeX, {
      toValue: 0,
      useNativeDriver: true,
      speed: 14,
      bounciness: 8,
    }).start();
  };

  const handleCardSwipe = (dx) => {
    if (!currentWord) {
      return;
    }

    const threshold = 72;
    if (dx > threshold) {
      Animated.timing(swipeX, {
        toValue: 240,
        duration: 120,
        useNativeDriver: true,
      }).start(async () => {
        await markCurrentWord(true);
        swipeX.setValue(0);
      });
      return;
    }

    if (dx < -threshold) {
      Animated.timing(swipeX, {
        toValue: -240,
        duration: 120,
        useNativeDriver: true,
      }).start(async () => {
        await markCurrentWord(false);
        swipeX.setValue(0);
      });
      return;
    }

    resetCardPosition();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => {
          return (
            Math.abs(gesture.dx) > 8 &&
            Math.abs(gesture.dx) > Math.abs(gesture.dy)
          );
        },
        onPanResponderMove: (_, gesture) => {
          swipeX.setValue(gesture.dx);
        },
        onPanResponderRelease: (_, gesture) => {
          handleCardSwipe(gesture.dx);
        },
        onPanResponderTerminate: resetCardPosition,
      }),
    [currentWord, swipeX],
  );

  const swipeCardStyle = {
    transform: [
      { translateX: swipeX },
      {
        rotate: swipeX.interpolate({
          inputRange: [-220, 0, 220],
          outputRange: ["-10deg", "0deg", "10deg"],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const frontStyle = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backStyle = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  if (!hydrated) {
    return (
      <SafeAreaView edges={["bottom"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu từ vựng...</Text>
      </SafeAreaView>
    );
  }

  const showLevelOverview = !selectedLevel && !selectedLesson;
  const showLessonList = !!selectedLevel && !selectedLesson;

  return (
    <SafeAreaView edges={["bottom"]} style={styles.screen}>
      {showLevelOverview && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerWrap}>
            <Text style={styles.headerTitle}>Chọn cấp độ học</Text>
            <Text style={styles.headerSubtitle}>
              Khám phá lộ trình học từ vựng tiếng Trung theo tiêu chuẩn quốc tế.
            </Text>
          </View>

          {levelSummaries.map((level) => {
            return (
              <Pressable
                key={level.key}
                style={styles.levelCard}
                onPress={() => setSelectedLevel(level.key)}
              >
                <View style={styles.levelHeadRow}>
                  <View>
                    <Text style={styles.levelSubtitle}>
                      {level.subtitle.toUpperCase()}
                    </Text>
                    <Text style={styles.levelTitle}>{level.key}</Text>
                  </View>

                  <View style={styles.levelIconWrap}>
                    <Ionicons
                      name={level.icon}
                      size={20}
                      color={COLORS.primaryDark}
                    />
                  </View>
                </View>

                {!!level.vocabTarget && (
                  <View style={styles.levelProgressWrap}>
                    <View style={styles.levelProgressTop}>
                      <Text style={styles.levelProgressText}>
                        {level.learnedWords}/{level.vocabTarget} từ vựng
                      </Text>
                      <Text style={styles.levelProgressValue}>
                        {level.progress}%
                      </Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${level.progress}%` },
                        ]}
                      />
                    </View>
                  </View>
                )}

                {!level.vocabTarget && (
                  <Text style={styles.levelDescription}>
                    {level.description}
                  </Text>
                )}

                <Text style={styles.continueText}>Tiếp tục học →</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {showLessonList && selectedLevelSummary && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBarRow}>
            <Pressable
              style={styles.topIconButton}
              onPress={() => setSelectedLevel(null)}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={COLORS.primaryDark}
              />
            </Pressable>
            <Text style={styles.topTitle}>{selectedLevelSummary.key}</Text>
            <Pressable style={styles.topIconButton}>
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={COLORS.primaryDark}
              />
            </Pressable>
          </View>

          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Tổng quan tiến độ</Text>
            <View style={styles.overviewMainRow}>
              <Text style={styles.overviewTitle}>
                {selectedLevelSummary.key} - Bài học
              </Text>
              <Text style={styles.overviewPercent}>
                {selectedLevelSummary.progress}%
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${selectedLevelSummary.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.overviewDetail}>
              Đã học {selectedLevelSummary.learnedWords} /{" "}
              {selectedLevelSummary.totalWords} từ vựng
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Danh sách bài học</Text>

          {!selectedLevelSummary.lessons.length ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Cấp độ này chưa có lesson</Text>
              <Text style={styles.emptyText}>
                Hãy nạp seed dữ liệu để hiển thị lesson.
              </Text>
            </View>
          ) : (
            selectedLevelSummary.lessons.map((lesson) => (
              <Pressable
                key={lesson.key}
                style={styles.lessonItem}
                onPress={() => setSelectedLesson(lesson.key)}
              >
                <ProgressRing progress={lesson.progress} />
                <View style={styles.lessonBody}>
                  <Text style={styles.lessonName}>
                    {formatLessonName(lesson.key)}
                  </Text>
                  <Text style={styles.lessonMeta}>
                    {lesson.learned}/{lesson.total} từ
                  </Text>
                </View>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}

      {selectedLesson && (
        <>
          <View style={styles.studyHeaderRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => setSelectedLesson(null)}
            >
              <Text style={styles.backButtonText}>← Danh sách lesson</Text>
            </Pressable>
            <Text style={styles.currentLesson}>{selectedLesson}</Text>
          </View>

          <View style={styles.statsRow}>
            <StatPill label="Tổng số từ" value={lessonWords.length} />
            <StatPill label="Đã thuộc" value={lessonLearnedCount} />
            <StatPill label="Tiến độ" value={`${lessonProgress}%`} />
          </View>

          <View style={styles.lessonBarTrack}>
            <View
              style={[styles.lessonBarFill, { width: `${lessonProgress}%` }]}
            />
          </View>

          <View style={styles.cardWrapper}>
            {!currentWord ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Lesson này chưa có từ</Text>
                <Text style={styles.emptyText}>
                  Hãy chọn lesson khác để học tiếp.
                </Text>
              </View>
            ) : (
              <Animated.View
                style={[styles.cardPressArea, swipeCardStyle]}
                {...panResponder.panHandlers}
              >
                <Pressable onPress={toggleFlip} style={styles.cardPressArea}>
                  <Animated.View
                    style={[styles.cardFace, styles.cardFront, frontStyle]}
                  >
                    <Text style={styles.hanzi}>{currentWord.hanzi}</Text>
                    <Text style={styles.pinyinHint}>
                      {currentWord.pinyin || ""}
                    </Text>
                    <Text style={styles.tapHint}>Chạm để lật thẻ</Text>
                    <View style={styles.badgeWrap}>
                      <Text
                        style={[
                          styles.badge,
                          currentWord.learned && styles.badgeLearned,
                        ]}
                      >
                        {currentWord.learned ? "Đã thuộc" : "Chưa thuộc"}
                      </Text>
                    </View>
                  </Animated.View>

                  <Animated.View
                    style={[styles.cardFace, styles.cardBack, backStyle]}
                  >
                    <Text style={styles.answerLine}>
                      Pinyin: {currentWord.pinyin || "---"}
                    </Text>
                    <Text style={styles.answerLine}>
                      Nghĩa: {currentWord.meaning}
                    </Text>
                    <Text style={styles.answerExample}>
                      Ví dụ: {currentWord.example || "Chưa có câu ví dụ."}
                    </Text>
                    <View style={styles.badgeWrap}>
                      <Text
                        style={[
                          styles.badge,
                          currentWord.learned && styles.badgeLearned,
                        ]}
                      >
                        {currentWord.learned ? "Đã thuộc" : "Chưa thuộc"}
                      </Text>
                    </View>
                  </Animated.View>
                </Pressable>
              </Animated.View>
            )}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionCircle, styles.actionCircleDanger]}
              onPress={() => markCurrentWord(false)}
              disabled={!currentWord}
            >
              <Ionicons name="close" size={22} color={COLORS.primaryDark} />
            </Pressable>

            <Pressable
              style={styles.nextButton}
              onPress={goNext}
              disabled={!currentWord}
            >
              <Text style={styles.nextButtonText}>TIẾP THEO</Text>
            </Pressable>

            <Pressable
              style={[styles.actionCircle, styles.actionCircleSuccess]}
              onPress={() => markCurrentWord(true)}
              disabled={!currentWord}
            >
              <Ionicons name="star-outline" size={20} color={COLORS.success} />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...COMMON.screen,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF8F5",
  },
  scrollContent: {
    paddingTop: 6,
    paddingBottom: 14,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F5",
  },
  loadingText: {
    marginTop: 12,
    color: "#574240",
    fontSize: 14,
  },
  headerWrap: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 44,
    fontWeight: "800",
    color: "#1E1B18",
  },
  headerSubtitle: {
    marginTop: 6,
    color: "#574240",
    lineHeight: 26,
    fontSize: 16,
  },
  levelCard: {
    ...COMMON.surfaceCard,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DDC0BD",
    backgroundColor: "#FFFFFF",
  },
  levelHeadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  levelSubtitle: {
    color: "#8A716F",
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  levelTitle: {
    marginTop: 6,
    color: "#1E1B18",
    fontSize: 42,
    fontWeight: "800",
  },
  levelIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#F5ECE7",
    alignItems: "center",
    justifyContent: "center",
  },
  levelProgressWrap: {
    marginTop: 14,
    gap: 8,
  },
  levelProgressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelProgressText: {
    color: "#574240",
    fontSize: 15,
    fontWeight: "500",
  },
  levelProgressValue: {
    color: "#5E060C",
    fontSize: 26,
    fontWeight: "800",
  },
  progressTrack: {
    marginTop: 2,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#EFE6E2",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#86BA93",
  },
  levelDescription: {
    marginTop: 16,
    color: "#574240",
    lineHeight: 24,
    fontSize: 16,
  },
  continueText: {
    marginTop: 16,
    color: "#5E060C",
    fontSize: 23,
    fontWeight: "700",
  },
  topBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  topIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5ECE7",
  },
  topTitle: {
    color: "#5E060C",
    fontSize: 42,
    fontWeight: "800",
  },
  overviewCard: {
    ...COMMON.surfaceCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DDC0BD",
    backgroundColor: "#FFFFFF",
  },
  overviewLabel: {
    color: "#8A716F",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "700",
  },
  overviewMainRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overviewTitle: {
    color: "#1E1B18",
    fontSize: 23,
    fontWeight: "700",
  },
  overviewPercent: {
    color: "#5E060C",
    fontSize: 28,
    fontWeight: "800",
  },
  overviewDetail: {
    marginTop: 12,
    color: "#1E5031",
    fontSize: 17,
    fontWeight: "600",
  },
  sectionLabel: {
    color: "#8A716F",
    fontSize: 24,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  lessonItem: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded24,
    borderWidth: 1,
    borderColor: "#DDC0BD",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  lessonBody: {
    flex: 1,
  },
  lessonName: {
    fontSize: 34,
    color: "#1E1B18",
    fontWeight: "700",
  },
  lessonMeta: {
    marginTop: 2,
    color: "#574240",
    fontSize: 15,
  },
  arrowCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#5E060C",
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 4,
    borderColor: "#E9E1DC",
    justifyContent: "center",
    alignItems: "center",
  },
  ringInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  ringText: {
    color: "#5E060C",
    fontWeight: "700",
    fontSize: 14,
  },
  studyHeaderRow: {
    marginTop: 4,
    marginBottom: 6,
    gap: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#F5ECE7",
  },
  backButtonText: {
    color: "#5E060C",
    fontSize: 12,
    fontWeight: "700",
  },
  currentLesson: {
    color: "#1E1B18",
    fontWeight: "800",
    fontSize: 28,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  lessonBarTrack: {
    marginTop: 10,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#EFE6E2",
    overflow: "hidden",
  },
  lessonBarFill: {
    height: "100%",
    backgroundColor: "#86BA93",
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  cardPressArea: {
    minHeight: 360,
  },
  cardFace: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded24,
    minHeight: 360,
    padding: 26,
    borderWidth: 1,
    borderColor: "#DDC0BD",
    backfaceVisibility: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  cardFront: {
    position: "relative",
  },
  cardBack: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  hanzi: {
    fontSize: 78,
    color: "#5E060C",
    fontWeight: "700",
  },
  pinyinHint: {
    marginTop: 4,
    color: "#8A716F",
    fontWeight: "700",
  },
  tapHint: {
    marginTop: 26,
    color: "#574240",
    fontWeight: "600",
  },
  answerLine: {
    width: "100%",
    fontSize: 22,
    color: "#1E1B18",
    fontWeight: "700",
    marginBottom: 10,
  },
  answerExample: {
    width: "100%",
    marginTop: 2,
    color: "#574240",
    lineHeight: 24,
    fontSize: 16,
  },
  badgeWrap: {
    marginTop: 20,
  },
  badge: {
    ...COMMON.badgePill,
    backgroundColor: "#FFE5E2",
    color: "#5E060C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 13,
  },
  badgeLearned: {
    backgroundColor: "#D8F2DE",
    color: "#1E5031",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    paddingBottom: 4,
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  actionCircleDanger: {
    backgroundColor: "#FFF0EE",
    borderColor: "#7D1F1F",
  },
  actionCircleSuccess: {
    backgroundColor: "#ECF6EE",
    borderColor: "#1E5031",
  },
  nextButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 24,
    backgroundColor: "#5E060C",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  emptyCard: {
    ...COMMON.surfaceCard,
    ...COMMON.rounded24,
    padding: 24,
    minHeight: 220,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDC0BD",
  },
  emptyTitle: {
    fontSize: 20,
    color: "#1E1B18",
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 12,
    color: "#574240",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
