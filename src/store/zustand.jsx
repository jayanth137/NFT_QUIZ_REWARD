import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useQuestionStore = create(
  persist(
    (set) => ({
      question: [],
      userAnswer: [],
      error: null,
      totalTime: 0,
      trueAnswer: 0,
      falseAnswer: 0,
      page: 1,

      fetchQuestion: async (query) => {
        if (!query) {
          console.error('Query is missing');
          return set((state) => ({ ...state, error: 'Query is missing' }));
        }

        try {
          const response = await fetch(`https://opentdb.com/api.php${query}`);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          set((state) => ({ ...state, question: data.results }));
        } catch (error) {
          console.error('Error fetching questions:', error.message);
          set((state) => ({ ...state, error: error.message }));
        }
      },

      addAnswer: ({ question, answer }) =>
        set((state) => ({
          ...state,
          userAnswer: [...state.userAnswer, { question, answer }],
        })),

      trueAction: () =>
        set((state) => ({ ...state, trueAnswer: state.trueAnswer + 1 })),

      falseAction: () =>
        set((state) => ({ ...state, falseAnswer: state.falseAnswer + 1 })),

      resetQuestion: () =>
        set((state) => ({
          ...state,
          question: [],
          trueAnswer: 0,
          falseAnswer: 0,
          error: null,
          page: 1,
        })),

      setTimeStamp: (time) =>
        set((state) => ({
          ...state,
          totalTime: time,
        })),

      nextPage: () =>
        set((state) => ({
          ...state,
          page: state.page + 1,
        })),
    }),
    {
      name: 'question-storage',
    }
  )
);

export default useQuestionStore;
