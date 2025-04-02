
import React from 'react';
import { format, isSameDay, isToday, parse } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTaskContext } from '@/context/TaskContext';
import { getDaysInWeek, getHoursInDay } from '@/utils/dateUtils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import TaskForm from '@/components/tasks/TaskForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const WeekView: React.FC = () => {
  const { tasks, selectedDate, setSelectedDate } = useTaskContext();
  const [taskFormOpen, setTaskFormOpen] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<{date: Date, hour: number} | null>(null);
  
  const days = getDaysInWeek(selectedDate);
  const hours = getHoursInDay();
  
  const getTasksByHour = (date: Date, hour: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date) && taskDate.getHours() === hour;
    });
  };
  
  const handleCellClick = (date: Date, hour: number) => {
    const newDate = new Date(date);
    newDate.setHours(hour, 0, 0, 0);
    setSelectedDate(newDate);
    setSelectedTime({ date: newDate, hour });
    setTaskFormOpen(true);
  };

  // Find current hour to scroll to
  const currentTimeRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (currentTimeRef.current && scrollAreaRef.current) {
      setTimeout(() => {
        currentTimeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, []);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
        <div className="p-2 text-center text-sm font-medium border-r"></div>
        {days.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={index} 
              className={cn(
                "p-2 text-center border-r last:border-r-0",
                isToday ? "bg-blue-50" : ""
              )}
            >
              <div className="text-sm font-medium">
                {format(day, 'E', { locale: zhCN })}
              </div>
              <div 
                className={cn(
                  "text-xs mt-1",
                  isToday ? "text-primary font-medium" : "text-gray-500"
                )}
              >
                {format(day, 'MM/dd')}
              </div>
            </div>
          );
        })}
      </div>
      
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="grid grid-cols-8">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="border-r border-b p-1 text-xs text-right text-gray-500 sticky left-0 bg-white">
                {hour}:00
              </div>
              
              {days.map((day, dayIndex) => {
                const isToday = isSameDay(day, new Date());
                const currentHour = new Date().getHours();
                const isCurrentHour = isToday && hour === currentHour;
                const hourTasks = getTasksByHour(day, hour);
                
                return (
                  <div 
                    key={`${day}-${hour}`} 
                    className={cn(
                      "border-r border-b p-1 relative min-h-[60px]",
                      isToday ? "bg-blue-50/30" : "",
                      isCurrentHour ? "bg-blue-50" : ""
                    )}
                    onClick={() => handleCellClick(day, hour)}
                    ref={isCurrentHour ? currentTimeRef : null}
                  >
                    {hourTasks.map(task => (
                      <div 
                        key={task.id}
                        className={cn(
                          "text-xs p-1 mb-1 rounded border-l-2",
                          task.completed ? "line-through text-gray-400 bg-gray-100 border-gray-300" :
                          task.priority === 'high' ? "bg-red-100 border-task-high" :
                          task.priority === 'medium' ? "bg-amber-100 border-task-medium" :
                          "bg-green-100 border-task-low"
                        )}
                      >
                        {task.title}
                      </div>
                    ))}
                    
                    {isCurrentHour && isToday && (
                      <div className="absolute left-0 right-0 border-t-2 border-red-500 z-10" style={{ top: `${Math.floor((new Date().getMinutes() / 60) * 100)}%` }}>
                        <div className="h-2 w-2 rounded-full bg-red-500 absolute -left-1 -top-1"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
      
      <Sheet open={taskFormOpen} onOpenChange={setTaskFormOpen}>
        <SheetContent>
          <TaskForm onClose={() => setTaskFormOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WeekView;
