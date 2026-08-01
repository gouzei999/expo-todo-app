import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/idGenerator';
import { Task, Category } from '../types/task';
import { DEFAULT_BACKGROUND_COLOR } from '../constants';
import { PRESET_COLORS } from '../utils/colors';

const MAX_TITLE_LENGTH = 200;

interface TaskState {
  tasks: Task[];
  addTask: (title: string, category: Category, weekStart: string, backgroundColor?: string) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  hardDeleteTask: (id: string) => void;
  moveTask: (id: string, siblingIds: string[], direction: 'up' | 'down') => void;
  updateSortOrder: (reorderedTasks: Task[]) => void;
  updateBackgroundColor: (id: string, color: string) => void;
  updateTaskTitle: (id: string, title: string) => void;
  updateTask: (id: string, updates: { title?: string; category?: Category; backgroundColor?: string }) => void;
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
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, isDeleted: true } : t)),
        });
      },

      hardDeleteTask: (id: string) => {
        set({
          tasks: get().tasks.filter((t) => t.id !== id),
        });
      },

      moveTask: (
        id: string,
        siblingIds: string[],
        direction: 'up' | 'down'
      ) => {
        const currentIndex = siblingIds.indexOf(id);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= siblingIds.length) return;

        const state = get();
        const currentTask = state.tasks.find((t) => t.id === id);
        const targetTask = state.tasks.find((t) => t.id === siblingIds[targetIndex]);
        if (!currentTask || !targetTask) return;

        const currentOrder = currentTask.sortOrder;
        const targetOrder = targetTask.sortOrder;

        set({
          tasks: state.tasks.map((t) => {
            if (t.id === id) return { ...t, sortOrder: targetOrder };
            if (t.id === targetTask.id) return { ...t, sortOrder: currentOrder };
            return t;
          }),
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
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, title: trimmed } : t)),
        });
      },

      updateTask: (
        id: string,
        updates: { title?: string; category?: Category; backgroundColor?: string }
      ) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return;

        const safeTitle =
          updates.title !== undefined
            ? updates.title.trim().slice(0, MAX_TITLE_LENGTH)
            : task.title;
        if (safeTitle.length === 0) return;

        const safeColor =
          updates.backgroundColor !== undefined &&
          PRESET_COLORS.includes(updates.backgroundColor)
            ? updates.backgroundColor
            : undefined;

        set({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...(updates.title !== undefined ? { title: safeTitle } : {}),
                  ...(updates.category !== undefined ? { category: updates.category } : {}),
                  ...(safeColor !== undefined ? { backgroundColor: safeColor } : {}),
                }
              : t
          ),
        });
      },
    }),
    {
      name: 'todo-tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
