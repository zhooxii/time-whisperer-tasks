
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task, TaskPriority, TaskCategory } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
];

const categoryOptions: { value: TaskCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: `${i.toString().padStart(2, '0')}:00`,
}));

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: 'Please select a date',
  }),
  dueHour: z.string(),
  priority: z.string(),
  category: z.string(),
  naturalLanguage: z.string().optional(),
});

// Create a separate schema for natural language input
const nlFormSchema = z.object({
  naturalLanguage: z.string().optional(),
});

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { addTask, updateTask, parseTask } = useTaskContext();
  const [showNaturalLanguageInput, setShowNaturalLanguageInput] = useState(!task);

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task ? new Date(task.dueDate) : new Date(),
      dueHour: task ? new Date(task.dueDate).getHours().toString() : new Date().getHours().toString(),
      priority: task?.priority || 'medium',
      category: task?.category || 'other',
      naturalLanguage: '',
    },
  });

  // Separate form for natural language input to avoid FormContext issues
  const nlForm = useForm<z.infer<typeof nlFormSchema>>({
    resolver: zodResolver(nlFormSchema),
    defaultValues: {
      naturalLanguage: '',
    },
  });

  const handleNaturalLanguageSubmit = (values: z.infer<typeof nlFormSchema>) => {
    if (!values.naturalLanguage) return;
    
    const parsedTask = parseTask(values.naturalLanguage);
    
    if (parsedTask.title) {
      form.setValue('title', parsedTask.title);
    }
    
    if (parsedTask.dueDate) {
      const dueDate = new Date(parsedTask.dueDate);
      form.setValue('dueDate', dueDate);
      form.setValue('dueHour', dueDate.getHours().toString());
    }
    
    if (parsedTask.priority) {
      form.setValue('priority', parsedTask.priority);
    }
    
    if (parsedTask.category) {
      form.setValue('category', parsedTask.category);
    }
    
    setShowNaturalLanguageInput(false);
  };

  const onSubmit = (values: z.infer<typeof taskFormSchema>) => {
    const dueDate = new Date(values.dueDate);
    dueDate.setHours(parseInt(values.dueHour, 10), 0, 0, 0);

    if (task) {
      updateTask({
        ...task,
        title: values.title,
        description: values.description || '',
        dueDate: dueDate.toISOString(),
        priority: values.priority as TaskPriority,
        category: values.category as TaskCategory,
      });
    } else {
      addTask({
        title: values.title,
        description: values.description,
        dueDate: dueDate.toISOString(),
        priority: values.priority as TaskPriority,
        category: values.category as TaskCategory,
      });
    }
    
    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-1 py-2">
        <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'Create New Task'}</h2>
      </div>
      
      {showNaturalLanguageInput ? (
        <div className="mb-4">
          {/* Use the separate form context for natural language input */}
          <Form {...nlForm}>
            <form onSubmit={nlForm.handleSubmit(handleNaturalLanguageSubmit)} className="space-y-2">
              <FormField
                control={nlForm.control}
                name="naturalLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter natural language description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Weekly report next Monday at 9am"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" className="w-full">
                  Parse
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowNaturalLanguageInput(false)} 
                  className="w-full"
                >
                  Manual Input
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task description" {...field} rows={3} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="pl-3 text-left font-normal h-10 w-full"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'MM/dd')
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hoursOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" type="button" onClick={() => {
                if (!task) {
                  setShowNaturalLanguageInput(true);
                } else {
                  onClose();
                }
              }}>
                {task ? 'Cancel' : 'Natural Language'}
              </Button>
              <Button type="submit">{task ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TaskForm;
