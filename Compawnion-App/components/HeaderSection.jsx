import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera'; 
import { useRouter } from 'expo-router'; 


const HeaderSection = () => {
  const [permission, requestPermission] = useCameraPermissions(); 
  const router = useRouter(); 

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const openCamera = async () => {
    const { status } = await requestPermission();
    if (status === 'granted') {
      router.push('/camera'); 
    } else {
      Alert.alert('Permission needed', 'Camera permission is required.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello there, Pawrent</Text>
        <View style={styles.icons}>
          <Feather name="plus" size={24} color="black" />
        </View>
      </View>
      
      <TouchableOpacity style={styles.scanBox} onPress={openCamera}>
        <Ionicons name="scan" size={20} color="#923F44" />
        <Text style={styles.scanText}>Scan and Predict your pet’s skin condition</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#923F44',
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    marginRight: 8,
  },
  scanBox: {
    marginTop: 16,
    backgroundColor: '#EEF8EE',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanText: {
    color: '#923F44',
    fontWeight: '600',
    fontSize: 14,
  }
});

export default HeaderSection;
