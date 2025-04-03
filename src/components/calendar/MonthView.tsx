
import React from 'react';
import { format, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { getDaysInMonth } from '@/utils/dateUtils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import TaskForm from '@/components/tasks/TaskForm';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Tag, CheckCircle2, Film, Briefcase, Home, Music, Book, ShoppingCart, Gamepad, Coffee, Utensils } from 'lucide-react';
import { TaskCategory } from '@/types';

// Function to get background color based on category
const getCategoryBackgroundColor = (category: TaskCategory) => {
  switch (category) {
    case 'work':
      return 'bg-blue-100 border-l-2 border-blue-400';
    case 'personal':
      return 'bg-purple-100 border-l-2 border-purple-400';
    case 'shopping':
      return 'bg-green-100 border-l-2 border-green-400';
    case 'health':
      return 'bg-rose-100 border-l-2 border-rose-400';
    case 'finance':
      return 'bg-slate-100 border-l-2 border-slate-400';
    case 'education':
      return 'bg-indigo-100 border-l-2 border-indigo-400';
    case 'social':
      return 'bg-amber-100 border-l-2 border-amber-400';
    case 'entertainment':
      return 'bg-pink-100 border-l-2 border-pink-400';
    case 'gaming':
      return 'bg-cyan-100 border-l-2 border-cyan-400';
    case 'music':
      return 'bg-violet-100 border-l-2 border-violet-400';
    default:
      return 'bg-gray-100 border-l-2 border-gray-400';
  }
};

// Function to get icon based on category
const getCategoryIcon = (category: TaskCategory) => {
  switch (category) {
    case 'work':
      return <Briefcase className="h-3 w-3 mr-0.5 text-blue-600" />;
    case 'personal':
      return <Home className="h-3 w-3 mr-0.5 text-purple-600" />;
    case 'shopping':
      return <ShoppingCart className="h-3 w-3 mr-0.5 text-green-600" />;
    case 'health':
      return <Coffee className="h-3 w-3 mr-0.5 text-rose-600" />;
    case 'finance':
      return <Briefcase className="h-3 w-3 mr-0.5 text-slate-600" />;
    case 'education':
      return <Book className="h-3 w-3 mr-0.5 text-indigo-600" />;
    case 'social':
      return <Utensils className="h-3 w-3 mr-0.5 text-amber-600" />;
    case 'entertainment':
      return <Film className="h-3 w-3 mr-0.5 text-pink-600" />;
    case 'gaming':
      return <Gamepad className="h-3 w-3 mr-0.5 text-cyan-600" />;
    case 'music':
      return <Music className="h-3 w-3 mr-0.5 text-violet-600" />;
    default:
      return <Clock className="h-3 w-3 mr-0.5 text-gray-600" />;
  }
};

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
                      task.completed ? "line-through text-gray-400 bg-gray-100" : getCategoryBackgroundColor(task.category as TaskCategory)
                    )}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-3 w-3 text-gray-400" />
                    ) : (
                      getCategoryIcon(task.category as TaskCategory)
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
