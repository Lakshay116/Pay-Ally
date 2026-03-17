import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyRFQ from '../screens/MyRFQ';
import RFQDetails from '../screens/RFQDetails';

const Stack = createNativeStackNavigator();

export default function MyRFQStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyRFQScreen" component={MyRFQ} />
      <Stack.Screen name="RFQDetails" component={RFQDetails} />
    </Stack.Navigator>
  );
}
