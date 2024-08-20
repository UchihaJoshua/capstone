import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedButton, setSelectedButton] = useState('Overview');
  const [subjects, setSubjects] = useState([]);
  const [matchedSubjects, setMatchedSubjects] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [subjectInstructorMap, setSubjectInstructorMap] = useState({});
  const [instructorSubjectMap, setInstructorSubjectMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserData();
    fetchData();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUserDetails(parsedData);
      }
    } catch (error) {
      console.error("Failed to load user data", error);
    }
  };

  const fetchData = async () => {
    try {
      const subjectsResponse = await axios.get('http://172.18.97.29:8000/api/subs');
      const fetchedSubjects = subjectsResponse.data.data;
      setSubjects(fetchedSubjects);

      const subjectIdResponse = await axios.get('http://172.18.97.29:8000/api/linkedSubjects');
      const subjectIds = subjectIdResponse.data.data.map(item => item.subject_id);

      const instructorsResponse = await axios.get('http://172.18.97.29:8000/api/instructors');
      const fetchedInstructors = instructorsResponse.data.data;
      setInstructors(fetchedInstructors);

      const instructorSubjectResponse = await axios.get('http://172.18.97.29:8000/api/linkedSubjects');
      const instructorSubjects = instructorSubjectResponse.data.data;

      const subjectInstructorMap = {};
      const instructorSubjectMap = {};

      instructorSubjects.forEach(instructorSubject => {
        const subject = fetchedSubjects.find(sub => sub.id === instructorSubject.subject_id);
        const instructor = fetchedInstructors.find(inst => inst.id === instructorSubject.user_id);
        if (subject && instructor) {
          if (!subjectInstructorMap[subject.id]) {
            subjectInstructorMap[subject.id] = {
              ...subject,
              instructorName: instructor.username
            };
          }
          if (!instructorSubjectMap[instructor.id]) {
            instructorSubjectMap[instructor.id] = [];
          }
          instructorSubjectMap[instructor.id].push(subject);
        }
      });

      setSubjectInstructorMap(subjectInstructorMap);

      const filteredSubjects = fetchedSubjects.filter(subject => subjectIds.includes(subject.id));
      setMatchedSubjects(filteredSubjects);
      setInstructorSubjectMap(instructorSubjectMap);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error.message}</Text>;
  }

  const groupedSubjects = Object.keys(instructorSubjectMap).map(instructorId => ({
    instructorName: instructors.find(inst => inst.id === parseInt(instructorId)).username,
    subjects: instructorSubjectMap[instructorId]
  }));

  const renderContent = () => {
    switch (selectedButton) {
      case 'Overview':
        return (
          <ScrollView style={styles.scrollableContainer}>
            <Image
              source={require('../imglogo/ccslogo.png')}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Mac Laboratory</Text>
              <Text style={styles.subText}>COLLEGE OF COMPUTER STUDIES</Text>
            </View>
            <View style={styles.boxContainer}>
              <View style={styles.box}>
                <Text style={styles.boxText}>Centered Box</Text>
              </View>
              <Text style={styles.scheduleText}>MACLAB SCHEDULE</Text>
              {groupedSubjects.map(group => (
                <View key={group.instructorName} style={styles.group}>
                  <Text style={styles.instructorHeader}>{group.instructorName}</Text>
                  {group.subjects.map(subject => (
                    <View key={subject.id} style={styles.subjectContainer}>
                      <Text style={styles.subjectTitle}>{subject.name}</Text>
                      <Text style={styles.subjectCode}>Code: {subject.code}</Text>
                      <Text style={styles.subjectTime}>Time: {formatTime(subject.start_time)} - {formatTime(subject.end_time)}</Text>
                      <Text style={styles.subjectSection}>Section: {subject.section}</Text>
                      <Text style={styles.subjectDescription}>
                        {subject.description}
                        <TouchableOpacity>
                          <Text style={styles.readMore}> Read more →</Text>
                        </TouchableOpacity>
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        );
      case 'People':
        return <Text style={styles.contentText}>People Screen Content</Text>;
      default:
        return <Text style={styles.contentText}>Welcome to Home Screen</Text>;
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome, </Text>
        <Text style={styles.nameText}>{userDetails?.username || 'User'}</Text>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, selectedButton === 'Overview' && styles.selectedButton]}
          onPress={() => setSelectedButton('Overview')}
        >
          <Text style={[styles.navButtonText, selectedButton === 'Overview' && styles.selectedButtonText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, selectedButton === 'People' && styles.selectedButton]}
          onPress={() => setSelectedButton('People')}
        >
          <Text style={[styles.navButtonText, selectedButton === 'People' && styles.selectedButtonText]}>People</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: "#333",
  },
  nameText: {
    fontSize: 35,
    fontWeight: "700",
    color: "#333",
  },
  navbar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#e0e0e0',
    height: 35,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    minWidth: 100,
  },
  selectedButton: {
    backgroundColor: '#6200ea',
  },
  navButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  scrollableContainer: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    left: -110,
    top: 0,
    width: 280,
    height: 65,
    resizeMode: 'contain',
  },
  textContainer: {
    paddingTop: 2,
    paddingBottom: 15,
    alignItems: 'center',
  },
  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  boxContainer: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  box: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  boxText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  group: {
    marginBottom: 20,
  },
  instructorHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subjectContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subjectCode: {
    fontSize: 14,
    color: '#555',
  },
  subjectTime: {
    fontSize: 14,
    color: '#555',
  },
  subjectSection: {
    fontSize: 14,
    color: '#555',
  },
  subjectDescription: {
    fontSize: 14,
    color: '#555',
  },
  readMore: {
    color: '#6200ea',
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
  scheduleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },
  
});

export default HomeScreen;
