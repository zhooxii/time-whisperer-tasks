
import React from 'react';
import { format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { getDaysInMonth } from '@/utils/dateUtils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import TaskForm from '@/components/tasks/TaskForm';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Tag, CheckCircle2 } from 'lucide-react';

const MonthView: React.FC = () => {
  const { tasks, selectedDate, setSelectedDate } = useTaskContext();
  const [taskFormOpen, setTaskFormOpen] = React.useState(false);
  const [cellDate, setCellDate] = React.useState<Date | null>(null);
  
  const days = getDaysInMonth(selectedDate);
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  
  // Get days of week names
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
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
      <div className="grid grid-cols-7 border-b bg-blue-50/50">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="p-2 text-center text-sm font-medium border-r last:border-r-0 text-blue-700">
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
                "border-r border-b p-1 relative calendar-cell transition-all hover:shadow-md",
                isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400",
                isSelectedDay ? "bg-blue-100/70" : "",
                isTodayDate ? "calendar-today" : ""
              )}
              onClick={() => handleCellClick(day)}
            >
              <div className="flex justify-between items-start">
                <div 
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-full date-number text-lg transition-all",
                    isSelectedDay ? "bg-blue-500 text-white shadow-lg animate-pulse" : 
                    isTodayDate ? "border-2 border-blue-500 text-blue-500" : ""
                  )}
                >
                  {format(day, 'd')}
                </div>
                {dayTasks.length > 0 && (
                  <div className="bg-blue-100 text-blue-700 rounded-full h-5 w-5 flex items-center justify-center text-xs animate-fade-in">
                    {dayTasks.length}
                  </div>
                )}
              </div>
              
              <div className="mt-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                {dayTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "text-xs mb-1 p-1 rounded truncate flex items-center gap-1 task-item hover:scale-[1.02] transition-all duration-200 animate-fade-in",
                      task.completed ? "line-through text-gray-400 bg-gray-100" :
                      task.priority === 'high' ? "bg-red-100 border-l-2 border-task-high" :
                      task.priority === 'medium' ? "bg-amber-100 border-l-2 border-task-medium" :
                      "bg-green-100 border-l-2 border-task-low"
                    )}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-3 w-3 text-gray-400" />
                    ) : (
                      <Clock className="h-3 w-3 text-blue-500" />
                    )}
                    <span>{format(new Date(task.dueDate), 'HH:mm')} {task.title}</span>
                  </div>
                ))}
                
                {dayTasks.length > 3 && (
                  <div className="text-xs text-blue-500 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>+{dayTasks.length - 3} more</span>
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
