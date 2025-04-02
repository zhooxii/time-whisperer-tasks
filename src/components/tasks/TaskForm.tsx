
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
import { zhCN } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: '低优先级' },
  { value: 'medium', label: '中优先级' },
  { value: 'high', label: '高优先级' },
];

const categoryOptions: { value: TaskCategory; label: string }[] = [
  { value: 'work', label: '工作' },
  { value: 'personal', label: '个人' },
  { value: 'shopping', label: '购物' },
  { value: 'health', label: '健康' },
  { value: 'finance', label: '财务' },
  { value: 'education', label: '教育' },
  { value: 'social', label: '社交' },
  { value: 'other', label: '其他' },
];

const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: `${i.toString().padStart(2, '0')}:00`,
}));

const taskFormSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: '请选择日期',
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
        <h2 className="text-lg font-semibold">{task ? '编辑任务' : '创建新任务'}</h2>
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
                    <FormLabel>输入自然语言描述</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="比如：下周一早上9点写周报"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" className="w-full">
                  解析
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowNaturalLanguageInput(false)} 
                  className="w-full"
                >
                  手动输入
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
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder="任务标题" {...field} />
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
                  <FormLabel>描述（选填）</FormLabel>
                  <FormControl>
                    <Textarea placeholder="任务描述" {...field} rows={3} />
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
                    <FormLabel>截止日期</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="pl-3 text-left font-normal h-10 w-full"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'yyyy-MM-dd', { locale: zhCN })
                            ) : (
                              <span>选择日期</span>
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
                    <FormLabel>时间</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择时间" />
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
                    <FormLabel>优先级</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择优先级" />
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
                    <FormLabel>分类</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择分类" />
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
                {task ? '取消' : '自然语言'}
              </Button>
              <Button type="submit">{task ? '更新' : '创建'}</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default TaskForm;
