import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyNonPOInvoice from '../screens/MyNonPOInvoice';
import NonPOInvoiceDetails from '../screens/InvoiceDetails';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyNonPOInvoice"
        component={MyNonPOInvoice}
        options={{
          title: 'My Non-PO Invoices',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NonPOInvoiceDetails"
        component={NonPOInvoiceDetails}
        options={({ route }) => ({
          title: route?.params?.invoice?.NonPOInvoiceNumber
            ? `${route.params.invoice.NonPOInvoiceNumber}`
            : 'Non PO Invoice Details',
        })}
      />
    </Stack.Navigator>
  );
}
