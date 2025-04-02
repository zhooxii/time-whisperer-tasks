
import React, { useState } from 'react';
import { CalendarViewType } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Plus, 
  LayoutGrid, 
  Columns, 
  CalendarDays, 
  Settings, 
  Search 
} from 'lucide-react';
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
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import SearchDialog from '@/components/search/SearchDialog';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { selectedDate, setSelectedDate, calendarView, setCalendarView } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const viewOptions: { label: string; value: CalendarViewType; icon: React.ReactNode }[] = [
    { label: 'Month', value: 'month', icon: <LayoutGrid className="h-4 w-4 mr-2" /> },
    { label: 'Week', value: 'week', icon: <Columns className="h-4 w-4 mr-2" /> },
    { label: 'Day', value: 'day', icon: <CalendarDays className="h-4 w-4 mr-2" /> },
  ];

  const getDateTitle = () => {
    switch (calendarView) {
      case 'day':
        return format(selectedDate, 'MM/dd EEEE');
      case 'week':
        return `${format(selectedDate, 'MM/yyyy')} Week ${format(selectedDate, 'w')}`;
      case 'month':
        return format(selectedDate, 'MM/yyyy');
      default:
        return format(selectedDate, 'MM/yyyy');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-blue-50/50 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-blue-600 hover:bg-blue-100 transition-colors">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 animate-slide-in-right">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
                  <Calendar className="mr-2 h-5 w-5" /> Time Management
                </h2>
                <Separator className="my-4" />
                <TaskList closeSidebar={() => setIsMobileSidebarOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl font-semibold flex items-center ml-2 md:ml-0 text-blue-700">
            <Calendar className="mr-2 h-5 w-5 hidden md:inline-block" /> Time Management
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-blue-600 hover:bg-blue-100 transition-colors animate-fade-in"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100 transition-colors">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Sheet open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 tech-button animate-fade-in">
                <Plus className="h-4 w-4 mr-1" /> New Task
              </Button>
            </SheetTrigger>
            <SheetContent className="animate-slide-in-right">
              <TaskForm onClose={() => setIsTaskFormOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only visible on desktop */}
        <aside className="w-64 border-r bg-blue-50/30 p-4 hidden md:block overflow-y-auto">
          <TaskList />
        </aside>

        {/* Calendar Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Calendar Controls */}
          <div className="p-4 flex items-center justify-between border-b bg-white sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleToday}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Today
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrevious}
                className="text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNext}
                className="text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium ml-2 text-blue-800 date-number">
                <Calendar className="inline-block h-4 w-4 mr-1 text-blue-600" />
                {getDateTitle()}
              </h2>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1"
                >
                  {viewOptions.find(option => option.value === calendarView)?.icon}
                  {viewOptions.find(option => option.value === calendarView)?.label} View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border-blue-100 shadow-md animate-scale-in">
                {viewOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setCalendarView(option.value)}
                    className={cn(
                      "flex items-center cursor-pointer",
                      calendarView === option.value ? "bg-blue-50 text-blue-700" : "hover:bg-blue-50 hover:text-blue-700"
                    )}
                  >
                    {option.icon}
                    {option.label} View
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

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
};

export default AppLayout;
