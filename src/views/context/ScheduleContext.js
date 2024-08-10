import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [schedule, setSchedule] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const savedSchedule = await AsyncStorage.getItem('schedule');
        // Removed console log
        // console.log('Loaded schedule:', savedSchedule); 
        if (savedSchedule) {
          setSchedule(JSON.parse(savedSchedule));
        } else {
          // Initialize an empty schedule if nothing is saved
          const emptySchedule = weekdays.reduce((acc, day) => {
            acc[day] = [];
            return acc;
          }, {});
          setSchedule(emptySchedule);
        }
      } catch (error) {
        console.error('Failed to load schedule:', error);
      }
    };

    loadSchedule();
  }, []);

  useEffect(() => {
    const saveSchedule = async () => {
      try {
        // Removed console log
        // console.log('Saving schedule:', schedule); 
        await AsyncStorage.setItem('schedule', JSON.stringify(schedule));
      } catch (error) {
        console.error('Failed to save schedule:', error);
      }
    };

    saveSchedule();
  }, [schedule]);

  return (
    <ScheduleContext.Provider value={{ schedule, setSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
};
