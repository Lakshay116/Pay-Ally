import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllReimbursement from '../screens/AllReimbursement';
import ReimbursementDetails from '../screens/ReimbursementDetails';

const Stack = createNativeStackNavigator();

export default function AllReimbursementStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllReimbursement"
        component={AllReimbursement}
        options={{
          title: 'All Reimbursement',
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
