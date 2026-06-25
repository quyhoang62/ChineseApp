import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { wordApi } from "../services/wordApi";

const VocabularyContext = createContext(null);

const initialState = {
  words: [],
  hydrated: false,
};

function vocabularyReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        words: action.payload,
        hydrated: true,
      };
    case "ADD_WORD":
      return {
        ...state,
        words: [action.payload, ...state.words],
      };
    case "DELETE_WORD":
      return {
        ...state,
        words: state.words.filter((word) => word.id !== action.payload),
      };
    case "TOGGLE_LEARNED":
      return {
        ...state,
        words: state.words.map((word) =>
          word.id === action.payload
            ? { ...word, learned: !word.learned }
            : word,
        ),
      };
    case "MARK_LEARNED":
      return {
        ...state,
        words: state.words.map((word) =>
          word.id === action.payload ? { ...word, learned: true } : word,
        ),
      };
    case "UPDATE_WORD":
      return {
        ...state,
        words: state.words.map((word) =>
          word.id === action.payload.id ? action.payload : word,
        ),
      };
    default:
      return state;
  }
}

export function VocabularyProvider({ children }) {
  const [state, dispatch] = useReducer(vocabularyReducer, initialState);

  useEffect(() => {
    async function loadWords() {
      try {
        const words = await wordApi.list();
        dispatch({ type: "HYDRATE", payload: words });
      } catch (error) {
        console.warn("Khong the tai du lieu tu backend:", error);
        dispatch({ type: "HYDRATE", payload: [] });
      }
    }

    loadWords();
  }, []);

  const addWord = useCallback(async (wordData) => {
    const createdWord = await wordApi.create(wordData);
    dispatch({ type: "ADD_WORD", payload: createdWord });
  }, []);

  const deleteWord = useCallback(async (id) => {
    await wordApi.remove(id);
    dispatch({ type: "DELETE_WORD", payload: id });
  }, []);

  const toggleLearned = useCallback(
    async (id) => {
      const currentWord = state.words.find((word) => word.id === id);
      if (!currentWord) {
        return;
      }

      const updatedWord = await wordApi.updateLearned(id, !currentWord.learned);
      dispatch({ type: "UPDATE_WORD", payload: updatedWord });
    },
    [state.words],
  );

  const markLearned = useCallback(
    async (id) => {
      const currentWord = state.words.find((word) => word.id === id);
      if (!currentWord || currentWord.learned) {
        return;
      }

      const updatedWord = await wordApi.updateLearned(id, true);
      dispatch({ type: "UPDATE_WORD", payload: updatedWord });
    },
    [state.words],
  );

  const learnedCount = useMemo(
    () => state.words.filter((word) => word.learned).length,
    [state.words],
  );

  const progress = useMemo(() => {
    if (!state.words.length) {
      return 0;
    }

    return Math.round((learnedCount / state.words.length) * 100);
  }, [learnedCount, state.words.length]);

  const value = useMemo(
    () => ({
      words: state.words,
      hydrated: state.hydrated,
      addWord,
      deleteWord,
      toggleLearned,
      markLearned,
      learnedCount,
      progress,
    }),
    [
      addWord,
      deleteWord,
      toggleLearned,
      markLearned,
      learnedCount,
      progress,
      state.hydrated,
      state.words,
    ],
  );

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);

  if (!context) {
    throw new Error(
      "useVocabulary phai duoc dung ben trong VocabularyProvider",
    );
  }

  return context;
}
