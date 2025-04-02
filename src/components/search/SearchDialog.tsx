
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import TaskForm from '@/components/tasks/TaskForm';
import { Clock, CalendarIcon, Tag, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const { tasks, setSelectedDate } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recent-searches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage
  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(item => item !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recent-searches', JSON.stringify(updatedSearches));
  };

  // Filter tasks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query)
    );
    
    setFilteredTasks(filtered);
    
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
    }
  }, [searchQuery, tasks]);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setTaskFormOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden p-0 gap-0 rounded-xl shadow-lg animate-scale-in">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-blue-700 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Search Tasks
            </DialogTitle>
          </DialogHeader>
          
          <Command className="rounded-lg border border-none" shouldFilter={false}>
            <CommandInput 
              placeholder="Search for tasks..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-12 text-base"
            />
            
            <CommandList className="max-h-[50vh] overflow-y-auto p-4">
              {!searchQuery && recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches" className="p-2 mb-2">
                  {recentSearches.map((search, index) => (
                    <CommandItem 
                      key={index} 
                      onSelect={() => setSearchQuery(search)}
                      className="flex items-center gap-2 text-sm p-3 cursor-pointer hover:bg-blue-50 rounded-md transition-colors animate-fade-in"
                    >
                      <Clock className="h-4 w-4 text-blue-500" />
                      {search}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {searchQuery && filteredTasks.length === 0 && (
                <CommandEmpty className="py-6 text-center text-gray-500 animate-fade-in">
                  No tasks found for "{searchQuery}"
                </CommandEmpty>
              )}
              
              {filteredTasks.length > 0 && (
                <CommandGroup heading="Tasks" className="p-2">
                  {filteredTasks.map((task) => (
                    <CommandItem 
                      key={task.id}
                      onSelect={() => handleTaskSelect(task)}
                      className={cn(
                        "flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-blue-50 rounded-md transition-all animate-fade-in",
                        task.completed ? "border-l-2 border-gray-400" :
                        task.priority === 'high' ? "border-l-2 border-task-high" :
                        task.priority === 'medium' ? "border-l-2 border-task-medium" :
                        "border-l-2 border-task-low"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-blue-500" />
                        )}
                        <span className={cn(
                          "font-medium flex-1",
                          task.completed ? "text-gray-500 line-through" : ""
                        )}>
                          {task.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(task.dueDate), 'MM/dd')}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-gray-500 pl-6 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 pl-6">
                        <Tag className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-600">
                          {task.category}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
          
          <div className="p-4 border-t flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Sheet open={taskFormOpen} onOpenChange={setTaskFormOpen}>
        <SheetContent>
          <TaskForm 
            task={selectedTask} 
            onClose={() => setTaskFormOpen(false)} 
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SearchDialog;
