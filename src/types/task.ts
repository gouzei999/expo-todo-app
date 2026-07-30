export type Category = 'work' | 'life';

export interface Task {
  id: string;
  title: string;
  category: Category;
  weekStart: string; // YYYY-MM-DD (Monday of the week)
  isCompleted: boolean;
  completedAt: string | null; // ISO 8601
  backgroundColor: string; // hex color
  sortOrder: number;
  createdAt: string; // ISO 8601
  isDeleted: boolean;
}
