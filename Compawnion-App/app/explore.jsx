import { View, Text } from 'react-native'
import React from 'react'
import ColorList from '../components/ColorList'
import ClinicMap from '../components/ClinicMap'

const Explore = () => {
  return (
    <View style={{ flex: 1 }}>
      <ClinicMap />
    </View>
  )
}

export default Explore