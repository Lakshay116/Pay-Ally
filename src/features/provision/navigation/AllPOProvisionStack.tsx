import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProvisionListScreen from '../screens/ProvisionListScreen';
import ProvisionDetails from '../screens/ProvisionDetails';

const Stack = createNativeStackNavigator();

export default function AllPOProvisionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AllPOProvision"
        options={{ title: 'PO Provision' }}
        children={() => (
          <ProvisionListScreen scope="all" type="po" title="PO Provisions" />
        )}
      />
      <Stack.Screen name="ProvisionDetails" component={ProvisionDetails} />
    </Stack.Navigator>
  );
}
