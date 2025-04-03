
export type CalendarViewType = "month" | "week" | "day";

export type TaskPriority = "low" | "medium" | "high";

export type TaskCategory = 
  | "work" 
  | "personal" 
  | "shopping" 
  | "health" 
  | "finance" 
  | "education" 
  | "social" 
  | "entertainment"
  | "gaming"
  | "music"
  | "other";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string; // ISO string format
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}
