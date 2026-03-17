import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllRFQ from '../screens/AllRFQ';
import RFQDetails from '../screens/RFQDetails';

const Stack = createNativeStackNavigator();

export default function AllRFQStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllRFQScreen" component={AllRFQ} />
      <Stack.Screen name="RFQDetails" component={RFQDetails} />
    </Stack.Navigator>
  );
}
