import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllNonPOVendorAdvance from '../screens/AllNonPOVendorAdvance';
import VendorAdvanceDetails from '../screens/VendorAdvanceDetails';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllNonPOVendorAdvance"
        component={AllNonPOVendorAdvance}
        options={{
          title: 'All Non PO Vendor Advance',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VendorAdvanceDetails"
        component={VendorAdvanceDetails}
        options={({ route }) => ({
          title: route?.params?.advance?.AdvanceReferenceNumber
            ? `${route.params.advance.AdvanceReferenceNumber}`
            : 'Vendor Advance Details',
        })}
      />
    </Stack.Navigator>
  );
}
