import { View, Text } from 'react-native'
import { ScrollView, StyleSheet } from 'react-native';
import React from 'react'
import HeaderSection from '../components/HeaderSection'
import HealthCheckHistory from '../components/HealthCheckHistory'
import AlertsForToday from '../components/AlertsForToday'
import HowToUseCarousel from '../components/HowToUseCarousel'
import { GestureHandlerRootView } from 'react-native-gesture-handler'



const Home = () => {
  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingBottom: 20,backgroundColor: 'white'}}>
       <HeaderSection />
       <HowToUseCarousel /> 
       <HealthCheckHistory /> 
       <AlertsForToday/>
       {/*<GestureHandlerRootView style={{ flex: 1 }}><AlertsForToday /></GestureHandlerRootView> */}
       </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

export default Home