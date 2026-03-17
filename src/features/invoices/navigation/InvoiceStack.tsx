import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Invoice from './Invoice';
import NonPOInvoice from './NonPOInvoice';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="POInvoice"
        component={Invoice}
        options={{ title: 'PO Invoice' }}
      />
      <Stack.Screen
        name="NonPOInvoice"
        component={NonPOInvoice}
        options={{ title: 'Non-PO Invoice' }}
      />
    </Stack.Navigator>
  );
}
