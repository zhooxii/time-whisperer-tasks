
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTaskContext } from '@/context/TaskContext';
import { getHoursInDay } from '@/utils/dateUtils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import TaskForm from '@/components/tasks/TaskForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const DayView: React.FC = () => {
  const { tasks, selectedDate } = useTaskContext();
  const [taskFormOpen, setTaskFormOpen] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState<number | null>(null);
  
  const hours = getHoursInDay();
  const isToday = isSameDay(selectedDate, new Date());
  
  const getTasksByHour = (hour: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, selectedDate) && taskDate.getHours() === hour;
    });
  };
  
  const handleCellClick = (hour: number) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hour, 0, 0, 0);
    setSelectedHour(hour);
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
  }, [selectedDate]);

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <div className="border-b sticky top-0 bg-white z-10 p-3 text-center">
        <div className="text-lg font-medium">
          {format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
        </div>
      </div>
      
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="grid grid-cols-[60px_1fr]">
          {hours.map(hour => {
            const currentHour = new Date().getHours();
            const isCurrentHour = isToday && hour === currentHour;
            const hourTasks = getTasksByHour(hour);
            
            return (
              <React.Fragment key={hour}>
                <div className="border-r border-b p-2 text-xs text-right text-gray-500 sticky left-0 bg-white">
                  {hour}:00
                </div>
                <div 
                  className={cn(
                    "border-b p-2 relative min-h-[80px]",
                    isCurrentHour ? "bg-blue-50" : ""
                  )}
                  onClick={() => handleCellClick(hour)}
                  ref={isCurrentHour ? currentTimeRef : null}
                >
                  {hourTasks.map(task => (
                    <div 
                      key={task.id}
                      className={cn(
                        "p-2 mb-2 rounded border-l-2",
                        task.completed ? "line-through text-gray-400 bg-gray-100 border-gray-300" :
                        task.priority === 'high' ? "bg-red-100 border-task-high" :
                        task.priority === 'medium' ? "bg-amber-100 border-task-medium" :
                        "bg-green-100 border-task-low"
                      )}
                    >
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {task.category === 'work' ? '工作' :
                         task.category === 'personal' ? '个人' :
                         task.category === 'shopping' ? '购物' :
                         task.category === 'health' ? '健康' :
                         task.category === 'finance' ? '财务' :
                         task.category === 'education' ? '教育' :
                         task.category === 'social' ? '社交' : '其他'}
                      </div>
                    </div>
                  ))}
                  
                  {isCurrentHour && isToday && (
                    <div className="absolute left-0 right-0 border-t-2 border-red-500 z-10" style={{ top: `${Math.floor((new Date().getMinutes() / 60) * 100)}%` }}>
                      <div className="h-3 w-3 rounded-full bg-red-500 absolute -left-1 -top-1.5"></div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
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

export default DayView;
