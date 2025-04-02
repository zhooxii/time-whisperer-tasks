import { Task, TaskPriority, TaskCategory } from "@/types";

// Keywords for priority detection
const priorityKeywords: Record<string, TaskPriority> = {
  "重要": "high",
  "紧急": "high",
  "优先": "high",
  "立即": "high",
  "必须": "high",
  "高优先级": "high",
  "中等": "medium",
  "一般": "medium",
  "普通": "medium",
  "中优先级": "medium",
  "不急": "low",
  "低优先级": "low",
  "有空": "low",
  "次要": "low",
  "不重要": "low"
};

// Keywords for category detection
const categoryKeywords: Record<string, TaskCategory> = {
  "工作": "work",
  "项目": "work",
  "开会": "work",
  "汇报": "work",
  "客户": "work",
  "报告": "work",
  "个人": "personal",
  "私人": "personal",
  "家庭": "personal",
  "家": "personal",
  "购物": "shopping",
  "买": "shopping",
  "采购": "shopping",
  "超市": "shopping",
  "健康": "health",
  "医生": "health",
  "药": "health",
  "锻炼": "health",
  "运动": "health",
  "财务": "finance",
  "钱": "finance",
  "银行": "finance",
  "存款": "finance",
  "贷款": "finance",
  "投资": "finance",
  "学习": "education",
  "课程": "education",
  "班": "education",
  "考试": "education",
  "研究": "education",
  "社交": "social",
  "聚会": "social",
  "朋友": "social",
  "约会": "social",
  "聚餐": "social"
};

// Day of week in Chinese
const dayOfWeekMap: Record<string, number> = {
  "星期一": 1,
  "周一": 1,
  "下周一": 8,
  "下下周一": 15,
  "星期二": 2,
  "周二": 2,
  "下周二": 9,
  "下下周二": 16,
  "星期三": 3,
  "周三": 3,
  "下周三": 10,
  "下下周三": 17,
  "星期四": 4,
  "周四": 4,
  "下周四": 11,
  "下下周四": 18,
  "星期五": 5,
  "周五": 5,
  "下周五": 12,
  "下下周五": 19,
  "星期六": 6,
  "周六": 6,
  "下周六": 13,
  "下下周六": 20,
  "星期日": 0,
  "周日": 0,
  "下周日": 14,
  "下下周日": 21,
  "星期天": 0,
  "周天": 0,
  "下周天": 14,
  "下下周天": 21,
  "今天": 0,
  "明天": 1,
  "后天": 2,
  "大后天": 3
};

// Time keywords in Chinese
const timeKeywords: Record<string, number> = {
  "早上": 8,
  "早晨": 8,
  "上午": 10,
  "中午": 12,
  "下午": 14,
  "傍晚": 17,
  "晚上": 19,
  "深夜": 22
};

// Parse natural language input for task creation
export const parseNaturalLanguage = (input: string): Partial<Task> => {
  let title = input.trim();
  let dueDate: Date | null = null;
  let priority: TaskPriority = "medium";
  let category: TaskCategory = "other";
  
  // Extract priority
  for (const [keyword, value] of Object.entries(priorityKeywords)) {
    if (input.includes(keyword)) {
      priority = value;
      title = title.replace(keyword, "").trim();
      break;
    }
  }
  
  // Extract category
  for (const [keyword, value] of Object.entries(categoryKeywords)) {
    if (input.includes(keyword)) {
      category = value;
      break;
    }
  }
  
  // Extract date and time
  const today = new Date();
  
  // Check for specific day of week
  for (const [dayName, daysToAdd] of Object.entries(dayOfWeekMap)) {
    if (input.includes(dayName)) {
      const targetDate = new Date();
      
      if (dayName.startsWith("下周") || dayName.startsWith("下下周")) {
        // For next week or the week after, calculate days to add
        targetDate.setDate(today.getDate() + daysToAdd);
      } else if (dayName === "今天") {
        // Today, keep date as is
      } else if (dayName === "明天") {
        targetDate.setDate(today.getDate() + 1);
      } else if (dayName === "后天") {
        targetDate.setDate(today.getDate() + 2);
      } else if (dayName === "大后天") {
        targetDate.setDate(today.getDate() + 3);
      } else {
        // For specific day of week within current week
        const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        let dayOfWeek = daysToAdd === 0 ? 7 : daysToAdd; // Adjust Sunday from 0 to 7
        
        // Calculate days to add
        let daysToTargetDay = dayOfWeek - currentDay;
        if (daysToTargetDay <= 0) {
          daysToTargetDay += 7; // Move to next week if the day has passed
        }
        
        targetDate.setDate(today.getDate() + daysToTargetDay);
      }
      
      dueDate = targetDate;
      title = title.replace(dayName, "").trim();
      break;
    }
  }
  
  // Parse time of day
  let hour = -1;
  
  // Check for specific hour mentioned (like "9点" or "15:00")
  const hourRegex = /(\d{1,2})[点|:|：](\d{0,2})/;
  const hourMatch = input.match(hourRegex);
  
  if (hourMatch) {
    hour = parseInt(hourMatch[1], 10);
    const minutes = hourMatch[2] ? parseInt(hourMatch[2], 10) : 0;
    
    if (dueDate) {
      dueDate.setHours(hour, minutes, 0, 0);
    } else {
      dueDate = new Date();
      dueDate.setHours(hour, minutes, 0, 0);
    }
    
    title = title.replace(hourMatch[0], "").trim();
  } else {
    // Check for time keywords
    for (const [keyword, value] of Object.entries(timeKeywords)) {
      if (input.includes(keyword)) {
        hour = value;
        
        if (dueDate) {
          dueDate.setHours(hour, 0, 0, 0);
        } else {
          dueDate = new Date();
          dueDate.setHours(hour, 0, 0, 0);
        }
        
        title = title.replace(keyword, "").trim();
        break;
      }
    }
  }
  
  // If no dueDate found, set to today
  if (!dueDate) {
    dueDate = new Date();
    // If no specific hour was mentioned, set a reasonable default time
    if (hour === -1) {
      dueDate.setHours(9, 0, 0, 0); // Default to 9 AM
    }
  }
  
  return {
    title,
    dueDate: dueDate.toISOString(),
    priority,
    category
  };
};

// Recommend best time for a task
export const recommendBestTime = (taskTitle: string, existingTasks: Task[]): Date => {
  const now = new Date();
  const workHoursStart = 9; // 9 AM
  const workHoursEnd = 17; // 5 PM
  
  // Default to today at 9 AM
  const recommendedTime = new Date();
  recommendedTime.setHours(workHoursStart, 0, 0, 0);
  
  // If it's already past work hours, recommend tomorrow morning
  if (now.getHours() >= workHoursEnd) {
    recommendedTime.setDate(recommendedTime.getDate() + 1);
  }
  
  // Get all the hours that already have tasks
  const busyHours = new Set<string>();
  
  existingTasks.forEach(task => {
    const taskDate = new Date(task.dueDate);
    if (taskDate.getDate() === recommendedTime.getDate() && 
        taskDate.getMonth() === recommendedTime.getMonth() && 
        taskDate.getFullYear() === recommendedTime.getFullYear()) {
      busyHours.add(taskDate.getHours().toString());
    }
  });
  
  // Find a free hour during work hours
  for (let hour = workHoursStart; hour <= workHoursEnd; hour++) {
    if (!busyHours.has(hour.toString())) {
      recommendedTime.setHours(hour, 0, 0, 0);
      return recommendedTime;
    }
  }
  
  // If all work hours are busy, try to find time on the next day
  recommendedTime.setDate(recommendedTime.getDate() + 1);
  recommendedTime.setHours(workHoursStart, 0, 0, 0);
  
  return recommendedTime;
};
