import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPOInvoice from '../screens/MyPOInvoice';
import POInvoiceDetails from '../screens/POInvoiceDetails';

const Stack = createNativeStackNavigator();

export default function InvoiceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPOInvoice"
        component={MyPOInvoice}
        options={{ title: 'My PO Invoices', headerShown: false }}
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
