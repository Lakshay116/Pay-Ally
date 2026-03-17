import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyNonPOVendorAdvance from '../screens/MyNonPOVendorAdvance';
import VendorAdvanceDetails from '../screens/VendorAdvanceDetails';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyNonPOVendorAdvance"
        component={MyNonPOVendorAdvance}
        options={{
          title: 'My Non PO Vendor Advance',
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
