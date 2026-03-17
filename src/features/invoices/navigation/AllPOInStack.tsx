import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllPOInvoice from '../screens/AllPOInvoice';
import POInvoiceDetails from '../screens/POInvoiceDetails';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllPOInvoice"
        component={AllPOInvoice}
        options={{
          title: 'All PO Invoices',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="POInvoiceDetails"
        component={POInvoiceDetails}
        options={({ route }) => ({
          title: route?.params?.invoice?.Invoice_Number
            ? `${route.params.invoice.Invoice_Number}`
            : 'PO Invoice Details',
        })}
      />
    </Stack.Navigator>
  );
}
