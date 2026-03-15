import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPOVendorAdvance from '../screens/MyPOVendorAdvance';
import POVendorAdvanceDetails from '../screens/POVenderAdvanceDetails';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPOVendorAdvance"
        component={MyPOVendorAdvance}
        options={{
          title: 'My PO Vendor Advance',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="POVendorAdvanceDetails"
        component={POVendorAdvanceDetails}
        options={({ route }) => ({
          title: route?.params?.advance?.AdvanceReferenceNumber
            ? `${route.params.advance.AdvanceReferenceNumber}`
            : 'Vendor Advance Details',
        })}
      />
    </Stack.Navigator>
  );
}
