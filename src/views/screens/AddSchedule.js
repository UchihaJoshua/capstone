import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, ToastAndroid } from 'react-native';
import { Provider as PaperProvider, Card, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScheduleContext } from '../../context/ScheduleContext';

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const amPm = hours >= 12 ? 'PM' : 'AM';
  return `${formattedHours}:${formattedMinutes} ${amPm}`;
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AddSchedule = () => {
  const [className, setClassName] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [formattedStartTime, setFormattedStartTime] = useState(formatTime(new Date()));
  const [formattedEndTime, setFormattedEndTime] = useState(formatTime(new Date()));
  const [selectedDay, setSelectedDay] = useState(weekdays[0]);
  const [originalDay, setOriginalDay] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const { schedule, setSchedule } = useContext(ScheduleContext);

  const handleClassAction = () => {
    if (className) {
      const startTimeString = formatTime(selectedStartTime);
      const endTimeString = formatTime(selectedEndTime);
      const timeRange = `${startTimeString} - ${endTimeString}`;
      const newClass = { name: className, time: timeRange };

      if (editingClass) {
        const updatedSchedule = { ...schedule };
        if (originalDay && originalDay !== selectedDay) {
          updatedSchedule[originalDay].splice(editingIndex, 1);
        }
        updatedSchedule[selectedDay][editingIndex] = newClass;
        setSchedule(updatedSchedule);
        ToastAndroid.show('Schedule updated successfully', ToastAndroid.SHORT);
      } else {
        const isDuplicateTime = schedule[selectedDay].some(item => item.time === timeRange);
        if (!isDuplicateTime) {
          const updatedSchedule = { ...schedule };
          updatedSchedule[selectedDay].push(newClass);
          setSchedule(updatedSchedule);
          ToastAndroid.show('Schedule added successfully', ToastAndroid.SHORT);
        } else {
          Alert.alert('Error', 'Class with this time already exists.');
        }
      }

      setClassName('');
      setOriginalDay(null);
      setEditingClass(null);
      setEditingIndex(null);
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
    }
  };

  const startEditing = (day, index) => {
    const classToEdit = schedule[day][index];
    const [startTime, endTime] = classToEdit.time.split(' - ');
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    // Parse times correctly
    const startDate = new Date();
    startDate.setHours(parseInt(startHour), parseInt(startMinute), 0);
    const endDate = new Date();
    endDate.setHours(parseInt(endHour), parseInt(endMinute), 0);

    setSelectedStartTime(startDate);
    setSelectedEndTime(endDate);

    setFormattedStartTime(formatTime(startDate));
    setFormattedEndTime(formatTime(endDate));
    setClassName(classToEdit.name);
    setSelectedDay(day);
    setOriginalDay(day);
    setEditingClass(true);
    setEditingIndex(index);
  };

  const confirmDeleteClass = (day, index) => {
    Alert.alert(
      'Delete Schedule',
      'Are you sure you want to delete this schedule?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteClass(day, index),
        },
      ],
      { cancelable: false }
    );
  };

  const deleteClass = (day, index) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule[day].splice(index, 1);
    setSchedule(updatedSchedule);
    ToastAndroid.show('Schedule deleted successfully', ToastAndroid.SHORT);
  };

  const onStartTimeChange = (event, date) => {
    if (event.type === 'set' && date) {
      setSelectedStartTime(date);
      setFormattedStartTime(formatTime(date));
      setShowStartTimePicker(false);
    } else {
      setShowStartTimePicker(false);
    }
  };

  const onEndTimeChange = (event, date) => {
    if (event.type === 'set' && date) {
      setSelectedEndTime(date);
      setFormattedEndTime(formatTime(date));
      setShowEndTimePicker(false);
    } else {
      setShowEndTimePicker(false);
    }
  };

  const selectDay = (day) => {
    setSelectedDay(day);
    setShowDayPicker(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>{editingClass ? 'Edit Class Schedule' : 'Add Class Schedule'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Subject Name"
          value={className}
          onChangeText={setClassName}
        />
        <TextInput
          style={styles.input}
          placeholder="Selected Day"
          value={selectedDay}
          editable={false}
        />
        <TouchableOpacity style={styles.dayButton} onPress={() => setShowDayPicker(true)}>
          <Text style={styles.buttonText}>Select Day</Text>
        </TouchableOpacity>
        <Modal visible={showDayPicker} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {weekdays.map(day => (
                <TouchableOpacity key={day} onPress={() => selectDay(day)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
        <TextInput
          style={styles.input}
          placeholder="Start Time"
          value={formattedStartTime}
          editable={false}
        />
        <TouchableOpacity style={styles.startTimeButton} onPress={() => setShowStartTimePicker(true)}>
          <Text style={styles.buttonText}>Select Start Time</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={selectedStartTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onStartTimeChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="End Time"
          value={formattedEndTime}
          editable={false}
        />
        <TouchableOpacity style={styles.endTimeButton} onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.buttonText}>Select End Time</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={selectedEndTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onEndTimeChange}
          />
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleClassAction}>
          <Text style={styles.addButtonText}>{editingClass ? 'Update Class' : 'Add Class'}</Text>
        </TouchableOpacity>
        <ScrollView style={styles.calendarContainer}>
          {weekdays.map(day => (
            <Card key={day} style={styles.dayCard}>
              <Card.Title title={day} titleStyle={styles.dayTitle} />
              <Card.Content>
                {schedule[day] && schedule[day].length > 0 ? (
                  schedule[day].map((item, index) => (
                    <View key={index} style={styles.scheduleItem}>
                      <Text style={styles.scheduleText}>{item.name} - {item.time}</Text>
                      <View style={styles.buttonGroup}>
                        <IconButton 
                          icon="pencil" 
                          size={20} 
                          onPress={() => startEditing(day, index)} 
                        />
                        <IconButton 
                          icon="delete" 
                          size={20} 
                          onPress={() => confirmDeleteClass(day, index)} 
                        />
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noScheduleText}>No schedules for this day.</Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dayButton: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  startTimeButton: {
    backgroundColor: '#5bc0de',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  endTimeButton: {
    backgroundColor: '#5bc0de',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#5cb85c',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    fontSize: 18,
  },
  calendarContainer: {
    flex: 1,
  },
  dayCard: {
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  scheduleText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  noScheduleText: {
    textAlign: 'center',
    color: '#999',
  },
});

export default AddSchedule;
