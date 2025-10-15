import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../components/TabBar'

const _layout = () => {
  return (
    <Tabs
        tabBar={props=> <TabBar {...props} />}
    >
        <Tabs.Screen
            name="index"
            options={{
                title: "Home",
                headerTitle: '',
            }}
        />
        <Tabs.Screen
            name="explore"
            options={{
                title: "Find a Vet",
                headerTitle: ''
            }}
        />
        <Tabs.Screen
            name="create"
            options={{
                title: "Saved",
                headerTitle: '',
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerTitle: ''
            }}
        />
         <Tabs.Screen
            name="camera"
            options={{
                title: "Scan",
                headerTitle: '',
                headerShown: false
            }}
        />
    </Tabs>
  )
}

export default _layout