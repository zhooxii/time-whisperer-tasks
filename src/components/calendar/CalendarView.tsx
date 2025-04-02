
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

const CalendarView: React.FC = () => {
  const { calendarView } = useTaskContext();
  
  return (
    <div className="h-full">
      {calendarView === 'month' && <MonthView />}
      {calendarView === 'week' && <WeekView />}
      {calendarView === 'day' && <DayView />}
    </div>
  );
};

export default CalendarView;
