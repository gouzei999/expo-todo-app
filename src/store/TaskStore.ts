import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Task, Category } from '../types/task';
import { getWeekStart, formatDate } from '../utils/weekHelper';
import { DEFAULT_BACKGROUND_COLOR } from '../constants';

interface TaskState {
  tasks: Task[];
  // Actions
  addTask: (title: string, category: Category, weekStart: string, backgroundColor?: string) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void; // soft delete (mark as deleted)
  hardDeleteTask: (id: string) => void; // permanently remove
  updateSortOrder: (reorderedTasks: Task[]) => void;
  updateBackgroundColor: (id: string, color: string) => void;
  updateTaskTitle: (id: string, title: string) => void;
  // Selectors
  getActiveTasksByCategory: (weekStart: string, category: Category) => Task[];
  getCompletedTasks: () => Task[];
  getWeeklyTasks: (weekStart: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (title: string, category: Category, weekStart: string, backgroundColor?: string) => {
        const state = get();
        // Find max sortOrder for this week + category
        const existingTasks = state.tasks.filter(
          (t) => t.weekStart === weekStart && t.category === category && !t.isDeleted
        );
        const maxOrder = existingTasks.reduce((max, t) => Math.max(max, t.sortOrder), -1);

        const newTask: Task = {
          id: uuidv4(),
          title,
          category,
          weekStart,
          isCompleted: false,
          completedAt: null,
          backgroundColor: backgroundColor || DEFAULT_BACKGROUND_COLOR,
          sortOrder: maxOrder + 1,
          createdAt: new Date().toISOString(),
          isDeleted: false,
        };

        set({ tasks: [...state.tasks, newTask] });
      },

      toggleComplete: (id: string) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  isCompleted: !t.isCompleted,
                  completedAt: !t.isCompleted ? new Date().toISOString() : null,
                }
              : t
          ),
        });
      },

      deleteTask: (id: string) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, isDeleted: true } : t
          ),
        });
      },

      hardDeleteTask: (id: string) => {
        set({
          tasks: get().tasks.filter((t) => t.id !== id),
        });
      },

      updateSortOrder: (reorderedTasks: Task[]) => {
        set({
          tasks: get().tasks.map((t) => {
            const updated = reorderedTasks.find((r) => r.id === t.id);
            return updated ? { ...t, sortOrder: updated.sortOrder } : t;
          }),
        });
      },

      updateBackgroundColor: (id: string, color: string) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, backgroundColor: color } : t
          ),
        });
      },

      updateTaskTitle: (id: string, title: string) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, title } : t
          ),
        });
      },

      getActiveTasksByCategory: (weekStart: string, category: Category) => {
        return get()
          .tasks.filter(
            (t) =>
              t.weekStart === weekStart &&
              t.category === category &&
              !t.isCompleted &&
              !t.isDeleted
          )
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },

      getCompletedTasks: () => {
        return get()
          .tasks.filter((t) => t.isCompleted && !t.isDeleted)
          .sort((a, b) => {
            if (a.completedAt && b.completedAt) {
              return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
            }
            return 0;
          });
      },

      getWeeklyTasks: (weekStart: string) => {
        return get()
          .tasks.filter((t) => t.weekStart === weekStart && !t.isDeleted)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },
    }),
    {
      name: 'todo-tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
