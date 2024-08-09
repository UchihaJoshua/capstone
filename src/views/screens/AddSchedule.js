import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { ScheduleContext } from '../context/ScheduleContext';

const AddSchedule = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const { addSchedule } = useContext(ScheduleContext);

  useEffect(() => {
    // Fetch subjects from Laravel API
    axios.get('http://192.168.101.6:8000/api/subs')
      .then(response => {
        console.log('Fetched subjects:', response.data); // Log fetched subjects
        if (response.data && Array.isArray(response.data.data)) {
          setSubjects(response.data.data); // Access the data inside `data` key
        } else {
          console.error('Unexpected data format:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      });
  }, []);

  const handleAddSchedule = () => {
    if (selectedSubject) {
      const schedule = {
        subject: selectedSubject,
        startTime,
        endTime,
      };
      addSchedule(schedule);
      // Optionally, navigate back or show a success message here
    } else {
      alert('Please select a subject.');
    }
  };

  const onStartTimeChange = (event, selectedDate) => {
    setShowStartTimePicker(false);
    const currentDate = selectedDate || startTime;
    setStartTime(currentDate);
  };

  const onEndTimeChange = (event, selectedDate) => {
    setShowEndTimePicker(false);
    const currentDate = selectedDate || endTime;
    setEndTime(currentDate);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Subject</Text>
      {subjects.length > 0 ? (
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(itemValue) => setSelectedSubject(itemValue)}
          style={styles.picker}
        >
          {subjects.map((subject) => (
            <Picker.Item label={subject.name} value={subject.id} key={subject.id} />
          ))}
        </Picker>
      ) : (
        <Text>No subjects available. Please try again later.</Text>
      )}

      <Text style={styles.label}>Select Start Time</Text>
      <Button title={`Start Time: ${startTime.toLocaleTimeString()}`} onPress={() => setShowStartTimePicker(true)} />
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onStartTimeChange}
        />
      )}

      <Text style={styles.label}>Select End Time</Text>
      <Button title={`End Time: ${endTime.toLocaleTimeString()}`} onPress={() => setShowEndTimePicker(true)} />
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onEndTimeChange}
        />
      )}

      <Button title="Add Schedule" onPress={handleAddSchedule} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
});

export default AddSchedule;
