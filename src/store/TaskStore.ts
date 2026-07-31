import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/idGenerator';
import { Task, Category } from '../types/task';
import { DEFAULT_BACKGROUND_COLOR } from '../constants';
import { PRESET_COLORS } from '../utils/colors';

const MAX_TITLE_LENGTH = 200;

function isValidTask(task: unknown): task is Task {
  if (!task || typeof task !== 'object') return false;
  const t = task as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    t.id.length > 0 &&
    typeof t.title === 'string' &&
    t.title.length <= MAX_TITLE_LENGTH &&
    (t.category === 'work' || t.category === 'life') &&
    typeof t.weekStart === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(t.weekStart) &&
    typeof t.isCompleted === 'boolean' &&
    (t.completedAt === null || typeof t.completedAt === 'string') &&
    typeof t.backgroundColor === 'string' &&
    typeof t.sortOrder === 'number' &&
    typeof t.createdAt === 'string' &&
    typeof t.isDeleted === 'boolean'
  );
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string, category: Category, weekStart: string, backgroundColor?: string) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  hardDeleteTask: (id: string) => void;
  moveTask: (id: string, weekStart: string, category: Category, direction: 'up' | 'down') => void;
  updateSortOrder: (reorderedTasks: Task[]) => void;
  updateBackgroundColor: (id: string, color: string) => void;
  updateTaskTitle: (id: string, title: string) => void;
  getActiveTasksByCategory: (weekStart: string, category: Category) => Task[];
  getCompletedTasks: () => Task[];
  getWeeklyTasks: (weekStart: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (
        title: string,
        category: Category,
        weekStart: string,
        backgroundColor?: string
      ) => {
        const trimmedTitle = title.trim().slice(0, MAX_TITLE_LENGTH);
        if (trimmedTitle.length === 0) return;

        // Validate color is from preset list
        const safeColor =
          backgroundColor && PRESET_COLORS.includes(backgroundColor)
            ? backgroundColor
            : DEFAULT_BACKGROUND_COLOR;

        const state = get();
        const existingTasks = state.tasks.filter(
          (t) => t.weekStart === weekStart && t.category === category && !t.isDeleted
        );
        const maxOrder = existingTasks.reduce((max, t) => Math.max(max, t.sortOrder), -1);

        const newTask: Task = {
          id: generateId(),
          title: trimmedTitle,
          category,
          weekStart,
          isCompleted: false,
          completedAt: null,
          backgroundColor: safeColor,
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

      moveTask: (
        id: string,
        weekStart: string,
        category: Category,
        direction: 'up' | 'down'
      ) => {
        const state = get();
        // Get sorted active tasks in the same category/week
        const siblings = state
          .getActiveTasksByCategory(weekStart, category)
          .map((t) => ({ ...t }));

        const currentIndex = siblings.findIndex((t) => t.id === id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= siblings.length) return;

        // Swap sort orders
        const currentOrder = siblings[currentIndex].sortOrder;
        const targetOrder = siblings[targetIndex].sortOrder;
        siblings[currentIndex].sortOrder = targetOrder;
        siblings[targetIndex].sortOrder = currentOrder;

        // Update in the full tasks array
        const updatedMap = new Map<string, number>();
        siblings.forEach((t) => updatedMap.set(t.id, t.sortOrder));

        set({
          tasks: state.tasks.map((t) =>
            updatedMap.has(t.id) ? { ...t, sortOrder: updatedMap.get(t.id)! } : t
          ),
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
        if (!PRESET_COLORS.includes(color)) return;
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, backgroundColor: color } : t
          ),
        });
      },

      updateTaskTitle: (id: string, title: string) => {
        const trimmed = title.trim().slice(0, MAX_TITLE_LENGTH);
        if (trimmed.length === 0) return;
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, title: trimmed } : t
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
              return (
                new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
              );
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
