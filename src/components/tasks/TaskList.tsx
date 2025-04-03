import React, { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, isBefore } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { Task, TaskCategory, TaskPriority } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, Calendar, Film, Briefcase, 
  Home, Music, Book, ShoppingCart, Gamepad, Coffee, 
  Utensils, ChevronDown, ChevronUp 
} from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Edit, Trash2 } from 'lucide-react';

interface TaskListProps {
  closeSidebar?: () => void;
}

// Function to get icon based on category
const getCategoryIcon = (category: TaskCategory) => {
  switch (category) {
    case 'work':
      return <Briefcase className="h-3 w-3 mr-1" />;
    case 'personal':
      return <Home className="h-3 w-3 mr-1" />;
    case 'shopping':
      return <ShoppingCart className="h-3 w-3 mr-1" />;
    case 'health':
      return <Coffee className="h-3 w-3 mr-1" />;
    case 'finance':
      return <Briefcase className="h-3 w-3 mr-1" />;
    case 'education':
      return <Book className="h-3 w-3 mr-1" />;
    case 'social':
      return <Utensils className="h-3 w-3 mr-1" />;
    case 'entertainment':
      return <Film className="h-3 w-3 mr-1" />;
    case 'gaming':
      return <Gamepad className="h-3 w-3 mr-1" />;
    case 'music':
      return <Music className="h-3 w-3 mr-1" />;
    default:
      return <Calendar className="h-3 w-3 mr-1" />;
  }
};

// Function to get background color based on category
const getCategoryBackgroundColor = (category: TaskCategory) => {
  switch (category) {
    case 'work':
      return 'bg-blue-50 border-l-2 border-blue-400';
    case 'personal':
      return 'bg-purple-50 border-l-2 border-purple-400';
    case 'shopping':
      return 'bg-green-50 border-l-2 border-green-400';
    case 'health':
      return 'bg-rose-50 border-l-2 border-rose-400';
    case 'finance':
      return 'bg-slate-50 border-l-2 border-slate-400';
    case 'education':
      return 'bg-indigo-50 border-l-2 border-indigo-400';
    case 'social':
      return 'bg-amber-50 border-l-2 border-amber-400';
    case 'entertainment':
      return 'bg-pink-50 border-l-2 border-pink-400';
    case 'gaming':
      return 'bg-cyan-50 border-l-2 border-cyan-400';
    case 'music':
      return 'bg-violet-50 border-l-2 border-violet-400';
    default:
      return 'bg-gray-50 border-l-2 border-gray-400';
  }
};

const TaskList: React.FC<TaskListProps> = ({ closeSidebar }) => {
  const { tasks, toggleTaskCompletion, deleteTask, setSelectedDate, addTask } = useTaskContext();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  // State to track which sections are open
  const [openSections, setOpenSections] = useState({
    overdue: false,
    today: true,
    tomorrow: false,
    upcoming: false,
    completed: false
  });
  
  // Toggle section open/closed state
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };
  
  // Add sample tasks if no tasks exist
  useEffect(() => {
    if (tasks.length === 0) {
      const now = new Date();
      
      // Sample entertainment tasks
      const entertainmentTasks = [
        {
          title: "Watch new movie release",
          description: "Check out the latest blockbuster",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 19, 0).toISOString(),
          priority: "medium" as TaskPriority,
          category: "entertainment" as TaskCategory
        },
        {
          title: "Netflix series marathon",
          description: "Watch the new season of favorite show",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 20, 0).toISOString(),
          priority: "low" as TaskPriority,
          category: "entertainment" as TaskCategory
        },
        {
          title: "Gaming session with friends",
          description: "Play the new multiplayer game",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0).toISOString(),
          priority: "medium" as TaskPriority,
          category: "gaming" as TaskCategory
        },
        {
          title: "Listen to new album release",
          description: "Check out the latest songs from favorite artist",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 16, 0).toISOString(),
          priority: "low" as TaskPriority,
          category: "music" as TaskCategory
        }
      ];
      
      // Sample work tasks
      const workTasks = [
        {
          title: "Weekly team meeting",
          description: "Discuss project progress and roadblocks",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
          priority: "high" as TaskPriority,
          category: "work" as TaskCategory
        },
        {
          title: "Finish quarterly report",
          description: "Complete the Q2 performance analysis",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0).toISOString(),
          priority: "high" as TaskPriority,
          category: "work" as TaskCategory
        },
        {
          title: "Client presentation preparation",
          description: "Prepare slides for next week's client meeting",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 14, 0).toISOString(),
          priority: "medium" as TaskPriority,
          category: "work" as TaskCategory
        },
        {
          title: "Email follow-ups",
          description: "Respond to pending emails",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(),
          priority: "medium" as TaskPriority,
          category: "work" as TaskCategory
        }
      ];
      
      // Sample life tasks
      const lifeTasks = [
        {
          title: "Grocery shopping",
          description: "Get fresh vegetables and fruits for the week",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0).toISOString(),
          priority: "medium" as TaskPriority,
          category: "shopping" as TaskCategory
        },
        {
          title: "Morning yoga session",
          description: "30-minute yoga routine",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0).toISOString(),
          priority: "low" as TaskPriority,
          category: "health" as TaskCategory
        },
        {
          title: "Dinner with family",
          description: "At favorite restaurant",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 19, 0).toISOString(),
          priority: "medium" as TaskPriority,
          category: "social" as TaskCategory
        },
        {
          title: "Read new book chapter",
          description: "Continue reading the novel",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0).toISOString(),
          priority: "low" as TaskPriority,
          category: "education" as TaskCategory
        },
        {
          title: "Pay monthly bills",
          description: "Rent, utilities, and subscriptions",
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0).toISOString(),
          priority: "high" as TaskPriority,
          category: "finance" as TaskCategory
        }
      ];
      
      // Add all sample tasks
      [...entertainmentTasks, ...workTasks, ...lifeTasks].forEach(task => {
        addTask(task);
      });
    }
  }, [tasks.length, addTask]);
  
  // Group tasks by their status and due date
  const overdueTasks = tasks.filter(
    (task) => !task.completed && isBefore(new Date(task.dueDate), new Date()) && !isToday(new Date(task.dueDate))
  );
  
  const todayTasks = tasks.filter(
    (task) => isToday(new Date(task.dueDate))
  );
  
  const tomorrowTasks = tasks.filter(
    (task) => isTomorrow(new Date(task.dueDate))
  );
  
  const futureTasks = tasks.filter(
    (task) => 
      !isToday(new Date(task.dueDate)) && 
      !isTomorrow(new Date(task.dueDate)) && 
      !isBefore(new Date(task.dueDate), new Date())
  );
  
  const completedTasks = tasks.filter((task) => task.completed);
  
  const renderTask = (task: Task) => {
    const taskDate = new Date(task.dueDate);
    
    const handleTaskClick = () => {
      setSelectedDate(taskDate);
      if (closeSidebar) {
        closeSidebar();
      }
    };

    return (
      <div 
        key={task.id} 
        className={`p-3 border rounded-md mb-2 ${
          task.completed ? 'bg-gray-50' : getCategoryBackgroundColor(task.category as TaskCategory)
        } hover:shadow-md transition-all duration-200 animate-fade-in`}
      >
        <div className="flex items-start gap-2">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            className="mt-1" 
          />
          <div 
            className="flex-1 cursor-pointer"
            onClick={handleTaskClick}
          >
            <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {format(taskDate, 'HH:mm')}
              <span className="mx-1">·</span>
              <Calendar className="h-3 w-3 mr-1" />
              {format(taskDate, 'MM/dd')}
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex gap-1 mt-2">
              <Badge 
                variant="outline" 
                className={`
                  ${task.priority === 'high' ? 'border-task-high text-task-high' : 
                    task.priority === 'medium' ? 'border-task-medium text-task-medium' : 
                    'border-task-low text-task-low'}
                `}
              >
                {task.priority === 'high' ? 'High' : 
                 task.priority === 'medium' ? 'Medium' : 'Low'}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                {getCategoryIcon(task.category as TaskCategory)}
                {task.category === 'work' ? 'Work' :
                 task.category === 'personal' ? 'Personal' :
                 task.category === 'shopping' ? 'Shopping' :
                 task.category === 'health' ? 'Health' :
                 task.category === 'finance' ? 'Finance' :
                 task.category === 'education' ? 'Education' :
                 task.category === 'social' ? 'Social' :
                 task.category === 'entertainment' ? 'Entertainment' :
                 task.category === 'gaming' ? 'Gaming' :
                 task.category === 'music' ? 'Music' : 'Other'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTaskSection = (title: string, tasksToRender: Task[], sectionKey: keyof typeof openSections, badge?: string) => {
    if (tasksToRender.length === 0) return null;
    
    return (
      <div className="mb-3 animate-fade-in">
        <Collapsible 
          open={openSections[sectionKey]} 
          onOpenChange={() => toggleSection(sectionKey)}
          className="border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 bg-background hover:bg-muted cursor-pointer">
              <div className="flex items-center">
                <h3 className="font-medium text-gray-700">{title}</h3>
                {badge && (
                  <Badge variant="outline" className="ml-2">
                    {tasksToRender.length}
                  </Badge>
                )}
              </div>
              {openSections[sectionKey] ? 
                <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                <ChevronDown className="h-4 w-4 text-gray-500" />
              }
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-2">
            <div className="mt-2 space-y-2">
              {tasksToRender.map(renderTask)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-2">
        {renderTaskSection('Overdue', overdueTasks, 'overdue', 'red')}
        {renderTaskSection('Today', todayTasks, 'today')}
        {renderTaskSection('Tomorrow', tomorrowTasks, 'tomorrow')}
        {renderTaskSection('Upcoming', futureTasks, 'upcoming')}
        {renderTaskSection('Completed', completedTasks, 'completed')}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            <p>No tasks</p>
            <p className="text-sm mt-1">Click "New Task" in the top right to create one</p>
          </div>
        )}
      </div>
      
      <AlertDialog 
        open={taskToDelete !== null} 
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the task "{taskToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (taskToDelete) {
                  deleteTask(taskToDelete.id);
                  setTaskToDelete(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskList;
