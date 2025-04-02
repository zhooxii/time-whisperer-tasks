
import React, { useState } from 'react';
import { format, isToday, isTomorrow, isBefore } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
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
import { Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import TaskForm from './TaskForm';

interface TaskListProps {
  closeSidebar?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ closeSidebar }) => {
  const { tasks, toggleTaskCompletion, deleteTask, setSelectedDate } = useTaskContext();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
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
          task.completed ? 'bg-gray-50' : 'bg-white'
        }`}
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
              {format(taskDate, 'HH:mm', { locale: zhCN })}
              <span className="mx-1">·</span>
              <Calendar className="h-3 w-3 mr-1" />
              {format(taskDate, 'MM月dd日', { locale: zhCN })}
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
                {task.priority === 'high' ? '高' : 
                 task.priority === 'medium' ? '中' : '低'}
              </Badge>
              <Badge variant="outline">
                {task.category === 'work' ? '工作' :
                 task.category === 'personal' ? '个人' :
                 task.category === 'shopping' ? '购物' :
                 task.category === 'health' ? '健康' :
                 task.category === 'finance' ? '财务' :
                 task.category === 'education' ? '教育' :
                 task.category === 'social' ? '社交' : '其他'}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Sheet open={taskToEdit?.id === task.id} onOpenChange={(open) => !open && setTaskToEdit(null)}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => setTaskToEdit(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                {taskToEdit && (
                  <TaskForm 
                    task={taskToEdit} 
                    onClose={() => setTaskToEdit(null)} 
                  />
                )}
              </SheetContent>
            </Sheet>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" 
              onClick={() => setTaskToDelete(task)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderTaskSection = (title: string, tasksToRender: Task[], badge?: string) => {
    if (tasksToRender.length === 0) return null;
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="font-medium text-gray-700">{title}</h3>
          {badge && (
            <Badge variant="outline" className="ml-2">
              {tasksToRender.length}
            </Badge>
          )}
        </div>
        {tasksToRender.map(renderTask)}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {renderTaskSection('已过期', overdueTasks, 'red')}
        {renderTaskSection('今日任务', todayTasks)}
        {renderTaskSection('明日任务', tomorrowTasks)}
        {renderTaskSection('即将进行', futureTasks)}
        {renderTaskSection('已完成', completedTasks)}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>暂无任务</p>
            <p className="text-sm mt-1">点击右上角的"新建任务"来创建</p>
          </div>
        )}
      </div>
      
      <AlertDialog 
        open={taskToDelete !== null} 
        onOpenChange={(open) => !open && setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除任务 "{taskToDelete?.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (taskToDelete) {
                  deleteTask(taskToDelete.id);
                  setTaskToDelete(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskList;
