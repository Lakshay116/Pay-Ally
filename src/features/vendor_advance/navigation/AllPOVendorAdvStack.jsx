import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllPOVendorAdvance from '../screens/AllPOVendorAdvance';
import POVendorAdvanceDetails from '../screens/POVenderAdvanceDetails';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllPOVendorAdvance"
        component={AllPOVendorAdvance}
        options={{
          title: 'All PO Vendor Advance',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VendorAdvanceDetails"
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
