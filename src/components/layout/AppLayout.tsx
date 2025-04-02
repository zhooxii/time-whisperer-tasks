
import React, { useState } from 'react';
import { CalendarViewType } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { Calendar, ChevronLeft, ChevronRight, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { selectedDate, setSelectedDate, calendarView, setCalendarView } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    switch (calendarView) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    switch (calendarView) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const viewOptions: { label: string; value: CalendarViewType }[] = [
    { label: '月', value: 'month' },
    { label: '周', value: 'week' },
    { label: '日', value: 'day' },
  ];

  const getDateTitle = () => {
    switch (calendarView) {
      case 'day':
        return format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN });
      case 'week':
        return `${format(selectedDate, 'yyyy年MM月', { locale: zhCN })}第${format(selectedDate, 'w', { locale: zhCN })}周`;
      case 'month':
        return format(selectedDate, 'yyyy年MM月', { locale: zhCN });
      default:
        return format(selectedDate, 'yyyy年MM月', { locale: zhCN });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" /> 时间管理
                </h2>
                <Separator className="my-4" />
                <TaskList closeSidebar={() => setIsMobileSidebarOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl font-semibold flex items-center ml-2 md:ml-0">
            <Calendar className="mr-2 h-5 w-5 hidden md:inline-block" /> 时间管理
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="rounded-full">
                <Plus className="h-4 w-4 mr-1" /> 新建任务
              </Button>
            </SheetTrigger>
            <SheetContent>
              <TaskForm onClose={() => setIsTaskFormOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only visible on desktop */}
        <aside className="w-64 border-r bg-white p-4 hidden md:block overflow-y-auto">
          <TaskList />
        </aside>

        {/* Calendar Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Calendar Controls */}
          <div className="p-4 flex items-center justify-between border-b bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleToday}>
                今天
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium ml-2">{getDateTitle()}</h2>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {viewOptions.find(option => option.value === calendarView)?.label || '月'}视图
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {viewOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setCalendarView(option.value)}
                    className={calendarView === option.value ? "bg-accent" : ""}
                  >
                    {option.label}视图
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Calendar Content */}
          <div className="p-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
