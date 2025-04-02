
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
  Search,
  Sun,
  Moon
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
import SettingsDialog from '@/components/settings/SettingsDialog';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { selectedDate, setSelectedDate, calendarView, setCalendarView } = useTaskContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme } = useTheme();

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
    <div className={cn(
      "min-h-screen flex flex-col bg-background",
      theme === 'dark' ? 'dark' : ''
    )}>
      {/* Header */}
      <header className={cn(
        "border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm",
        theme === 'dark' ? 'bg-gray-900/50' : 'bg-blue-50/50'
      )}>
        <div className="flex items-center">
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "md:hidden hover:bg-blue-100 transition-colors",
                  theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600'
                )}
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 animate-slide-in-right">
              <div className="p-4">
                <h2 className={cn(
                  "text-xl font-semibold mb-4 flex items-center",
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                )}>
                  <Calendar className="mr-2 h-5 w-5" /> Time Management
                </h2>
                <Separator className="my-4" />
                <TaskList closeSidebar={() => setIsMobileSidebarOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className={cn(
            "text-xl font-semibold flex items-center ml-2 md:ml-0",
            theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
          )}>
            <Calendar className="mr-2 h-5 w-5 hidden md:inline-block" /> Time Management
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "hover:bg-blue-100 transition-colors animate-fade-in",
              theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600'
            )}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "hover:bg-blue-100 transition-colors",
              theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600'
            )}
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "hover:bg-blue-100 transition-colors",
              theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600'
            )}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          <Sheet open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <SheetTrigger asChild>
              <Button 
                size="sm" 
                className={cn(
                  "rounded-full tech-button animate-fade-in",
                  theme === 'dark' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                )}
              >
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
        <aside className={cn(
          "w-64 border-r p-4 hidden md:block overflow-y-auto",
          theme === 'dark' ? 'bg-gray-900/30' : 'bg-blue-50/30'
        )}>
          <TaskList />
        </aside>

        {/* Calendar Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Calendar Controls */}
          <div className={cn(
            "p-4 flex items-center justify-between border-b sticky top-0 z-10 shadow-sm",
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          )}>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleToday}
                className={cn(
                  "transition-colors",
                  theme === 'dark' ? 'border-gray-700 text-blue-400 hover:bg-gray-800' : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                )}
              >
                Today
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrevious}
                className={cn(
                  "hover:bg-blue-50 transition-colors",
                  theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNext}
                className={cn(
                  "hover:bg-blue-50 transition-colors",
                  theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600'
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className={cn(
                "text-lg font-medium ml-2 date-number",
                theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
              )}>
                <Calendar className={cn(
                  "inline-block h-4 w-4 mr-1",
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                )} />
                {getDateTitle()}
              </h2>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "transition-colors flex items-center gap-1",
                    theme === 'dark' ? 'border-gray-700 text-blue-400 hover:bg-gray-800' : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                  )}
                >
                  {viewOptions.find(option => option.value === calendarView)?.icon}
                  {viewOptions.find(option => option.value === calendarView)?.label} View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className={cn(
                  "shadow-md animate-scale-in",
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'
                )}
              >
                {viewOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setCalendarView(option.value)}
                    className={cn(
                      "flex items-center cursor-pointer",
                      calendarView === option.value 
                        ? theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-700'
                        : theme === 'dark' ? 'hover:bg-gray-700 hover:text-blue-400' : 'hover:bg-blue-50 hover:text-blue-700'
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
      
      {/* Settings Dialog */}
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
};

export default AppLayout;
