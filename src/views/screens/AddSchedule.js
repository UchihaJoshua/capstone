import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';


const AddSchedule = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addSchedule } = useContext(ScheduleContext);

  useEffect(() => {
    axios.get('http://192.168.101.13:8000/api/subs')
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setSubjects(response.data.data);
        } else {
          console.error('Unexpected data format:', response.data);
          Alert.alert('Error', 'Failed to load subjects.');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
        Alert.alert('Error', 'Failed to load subjects.');
        setLoading(false);
      });
  }, []);

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleAddSchedule = () => {
    if (!selectedSubject) {
      Alert.alert('Validation Error', 'Please select a subject.');
      return;
    }

    const schedule = {
      subject: selectedSubject.name,
      subjectCode: selectedSubject.code,
      section: selectedSubject.section,
      description: selectedSubject.description,
      startTime: selectedSubject.start_time,
      endTime: selectedSubject.end_time,
    };
    addSchedule(schedule);
    Alert.alert('Success', 'Schedule added successfully!');
  };

  const renderSubjectRow = (subject) => (
    <TouchableOpacity
      key={subject.id}
      style={[
        styles.tableRow,
        selectedSubject && selectedSubject.id === subject.id ? styles.selectedRow : null,
      ]}
      onPress={() => setSelectedSubject(subject)}
    >
      <Text style={[styles.tableCell, styles.subjectName]}>{subject.name}</Text>
      <Text style={[styles.tableCell, styles.subjectCode]}>{subject.code}</Text>
      <Text style={[styles.tableCell, styles.timeCell]}>{formatTime(subject.start_time)}</Text>
      <Text style={[styles.tableCell, styles.timeCell]}>{formatTime(subject.end_time)}</Text>
      <Text style={[styles.tableCell, styles.sectionCell]}>{subject.section}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Subject</Text>
      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.subjectName]}>Subject Name</Text>
            <Text style={[styles.tableHeaderCell, styles.subjectCode]}>Code</Text>
            <Text style={[styles.tableHeaderCell, styles.timeCell]}>Start Time</Text>
            <Text style={[styles.tableHeaderCell, styles.timeCell]}>End Time</Text>
            <Text style={[styles.tableHeaderCell, styles.sectionCell]}>Section</Text>
          </View>
          {subjects.map(renderSubjectRow)}
        </View>
      </ScrollView>

      {/* Display detailed information of the selected subject */}
      {selectedSubject && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailTitle}>{selectedSubject.name}</Text>
          <Text style={styles.detailText}>Code: {selectedSubject.code}</Text>
          <Text style={styles.detailText}>Time: {formatTime(selectedSubject.start_time)} to {formatTime(selectedSubject.end_time)}</Text>
          <Text style={styles.detailText}>Section: {selectedSubject.section}</Text>
          <Text style={styles.detailText}>{selectedSubject.description}</Text>
          <Text style={styles.readMore}>Read more →</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddSchedule} disabled={!selectedSubject}>
        <Text style={styles.buttonText}>Add Schedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    padding: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    padding: 10,
    textAlign: 'center',
  },
  subjectName: {
    flex: 2,
    minWidth: 200,
  },
  subjectCode: {
    flex: 1,
    minWidth: 80,
  },
  timeCell: {
    flex: 1,
    minWidth: 80,
  },
  sectionCell: {
    flex: 1,
    minWidth: 80,
  },
  selectedRow: {
    backgroundColor: '#e0e0e0',
  },
  detailContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
  },
  readMore: {
    marginTop: 10,
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
});

export default AddSchedule;
