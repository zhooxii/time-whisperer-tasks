
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskPriority, TaskCategory, CalendarViewType } from "@/types";
import { getTasks, saveTasks } from "@/utils/localStorage";
import { parseNaturalLanguage, recommendBestTime } from "@/utils/nlpUtils";
import { toast } from "@/components/ui/use-toast";

interface TaskContextType {
  tasks: Task[];
  selectedDate: Date;
  calendarView: CalendarViewType;
  addTask: (taskData: Partial<Task>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  parseTask: (input: string) => Partial<Task>;
  setSelectedDate: (date: Date) => void;
  setCalendarView: (view: CalendarViewType) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = getTasks();
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Add a new task
  const addTask = (taskData: Partial<Task>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title || "New Task",
      description: taskData.description || "",
      completed: taskData.completed || false,
      dueDate: taskData.dueDate || now,
      priority: taskData.priority || "medium",
      category: taskData.category || "other",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast({
      title: "任务已创建",
      description: `"${newTask.title}" 已添加到任务列表`,
    });
  };

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      )
    );
    toast({
      title: "任务已更新",
      description: `"${updatedTask.title}" 已更新`,
    });
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    if (taskToDelete) {
      toast({
        title: "任务已删除",
        description: `"${taskToDelete.title}" 已从任务列表中删除`,
      });
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  // Parse natural language input for task creation
  const parseTask = (input: string): Partial<Task> => {
    const parsedTask = parseNaturalLanguage(input);
    
    // If no specific time was provided, recommend a time
    if (parsedTask.dueDate) {
      const dueDate = new Date(parsedTask.dueDate);
      if (dueDate.getHours() === 9 && dueDate.getMinutes() === 0) {
        const recommendedTime = recommendBestTime(input, tasks);
        parsedTask.dueDate = recommendedTime.toISOString();
      }
    }
    
    return parsedTask;
  };

  const value = {
    tasks,
    selectedDate,
    calendarView,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    parseTask,
    setSelectedDate,
    setCalendarView,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
