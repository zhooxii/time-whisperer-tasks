
import { TaskProvider } from '@/context/TaskContext';
import AppLayout from '@/components/layout/AppLayout';
import CalendarView from '@/components/calendar/CalendarView';
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <TaskProvider>
      <AppLayout>
        <CalendarView />
      </AppLayout>
      <Toaster />
    </TaskProvider>
  );
};

export default Index;
