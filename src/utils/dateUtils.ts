
import { format, parse, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import { zhCN } from 'date-fns/locale';

// Format a date to a string
export const formatDate = (date: Date, formatString: string = "yyyy-MM-dd"): string => {
  return format(date, formatString, { locale: zhCN });
};

// Parse a string to a date
export const parseDate = (dateString: string, formatString: string = "yyyy-MM-dd"): Date => {
  return parse(dateString, formatString, new Date());
};

// Get start of week
export const getStartOfWeek = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
};

// Get end of week
export const getEndOfWeek = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 1 }); // End week on Sunday
};

// Get start of month
export const getStartOfMonth = (date: Date): Date => {
  return startOfMonth(date);
};

// Get end of month
export const getEndOfMonth = (date: Date): Date => {
  return endOfMonth(date);
};

// Check if two dates are the same day
export const isSameDayFn = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

// Check if two dates are in the same week
export const isSameWeekFn = (date1: Date, date2: Date): boolean => {
  return isSameWeek(date1, date2, { weekStartsOn: 1 });
};

// Check if two dates are in the same month
export const isSameMonthFn = (date1: Date, date2: Date): boolean => {
  return isSameMonth(date1, date2);
};

// Generate an array of dates for a week
export const getDaysInWeek = (date: Date): Date[] => {
  const start = getStartOfWeek(date);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }

  return days;
};

// Generate an array of dates for a month
export const getDaysInMonth = (date: Date): Date[] => {
  const start = getStartOfMonth(date);
  const end = getEndOfMonth(date);
  const days: Date[] = [];

  let currentDate = getStartOfWeek(start);
  const endWeek = getEndOfWeek(end);

  while (currentDate <= endWeek) {
    days.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return days;
};

// Function to get hours array (0-23)
export const getHoursInDay = (): number[] => {
  return Array.from({ length: 24 }, (_, i) => i);
};
