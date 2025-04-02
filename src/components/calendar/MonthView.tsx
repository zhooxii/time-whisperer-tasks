
import React from 'react';
import { format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTaskContext } from '@/context/TaskContext';
import { getDaysInMonth } from '@/utils/dateUtils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import TaskForm from '@/components/tasks/TaskForm';
import { cn } from '@/lib/utils';

const MonthView: React.FC = () => {
  const { tasks, selectedDate, setSelectedDate } = useTaskContext();
  const [taskFormOpen, setTaskFormOpen] = React.useState(false);
  const [cellDate, setCellDate] = React.useState<Date | null>(null);
  
  const days = getDaysInMonth(selectedDate);
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  
  // Get days of week names
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i + 1); // Start from Monday
    return format(date, 'E', { locale: zhCN });
  });
  
  const handleCellClick = (date: Date) => {
    setSelectedDate(date);
    setCellDate(date);
    setTaskFormOpen(true);
  };
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-7 border-b">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="p-2 text-center text-sm font-medium border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 grid-rows-6 h-[calc(100vh-12rem)]">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isSelectedDay = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const dayTasks = getTasksForDate(day);
          
          return (
            <div 
              key={index} 
              className={cn(
                "border-r border-b p-1 relative cursor-pointer overflow-hidden",
                isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
              )}
              onClick={() => handleCellClick(day)}
            >
              <div className="flex justify-between items-start">
                <div 
                  className={cn(
                    "h-6 w-6 flex items-center justify-center text-sm rounded-full",
                    isSelectedDay ? "bg-primary text-white" : 
                    isTodayDate ? "border border-primary text-primary" : ""
                  )}
                >
                  {format(day, 'd')}
                </div>
              </div>
              
              <div className="mt-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                {dayTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "text-xs mb-1 p-1 rounded truncate",
                      task.completed ? "line-through text-gray-400 bg-gray-100" :
                      task.priority === 'high' ? "bg-red-100 border-l-2 border-task-high" :
                      task.priority === 'medium' ? "bg-amber-100 border-l-2 border-task-medium" :
                      "bg-green-100 border-l-2 border-task-low"
                    )}
                  >
                    {format(new Date(task.dueDate), 'HH:mm')} {task.title}
                  </div>
                ))}
                
                {dayTasks.length > 3 && (
                  <div className="text-xs text-blue-500">
                    +{dayTasks.length - 3} 更多
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <Sheet open={taskFormOpen} onOpenChange={setTaskFormOpen}>
        <SheetContent>
          <TaskForm onClose={() => setTaskFormOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MonthView;
