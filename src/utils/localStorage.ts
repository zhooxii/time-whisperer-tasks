
import { Task } from "@/types";

// Keys for localStorage
const TASKS_KEY = "time-whisperer-tasks";

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

// Get tasks from localStorage
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error getting tasks from localStorage:", error);
    return [];
  }
};

// Add a new task to localStorage
export const addTask = (task: Task): void => {
  const tasks = getTasks();
  saveTasks([...tasks, task]);
};

// Update a task in localStorage
export const updateTask = (updatedTask: Task): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasks(updatedTasks);
};

// Delete a task from localStorage
export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) => task.id !== taskId);
  saveTasks(filteredTasks);
};

// Toggle task completion status
export const toggleTaskCompletion = (taskId: string): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks(updatedTasks);
};
