import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyReimbursement from '../screens/MyReimbursement';
import ReimbursementDetails from '../screens/ReimbursementDetails';

const Stack = createNativeStackNavigator();

export default function MyReimbursementStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyReimbursement"
        component={MyReimbursement}
        options={{
          title: 'My Reimbursement',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReimbursementDetails"
        component={ReimbursementDetails}
        options={({ route }) => ({
          title: route?.params?.reimbursement?.ReimbursementId
            ? `${route.params.reimbursement.ReimbursementId}`
            : 'Reimbursement Details',
        })}
      />
    </Stack.Navigator>
  );
}
