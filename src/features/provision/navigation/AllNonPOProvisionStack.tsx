import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProvisionListScreen from '../screens/ProvisionListScreen';
import ProvisionDetails from '../screens/ProvisionDetails';

const Stack = createNativeStackNavigator();

export default function AllNonPOProvisionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AllNonPOProvision"
        options={{ title: 'Non-PO Provision' }}
        children={() => (
          <ProvisionListScreen scope="all" type="nonpo" title="Non-PO Provisions" />
        )}
      />
      <Stack.Screen name="ProvisionDetails" component={ProvisionDetails} />
    </Stack.Navigator>
  );
}
