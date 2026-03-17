import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPurchaseRequests from '../screens/MyPurchaseRequests';
import PurchaseRequestDetails from '../screens/PurchaseRequestDetails';

const Stack = createNativeStackNavigator();

export default function MyPurchaseRequestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPurchaseRequestsHome"
        component={MyPurchaseRequests}
        options={{
          title: 'My Purchase Requests',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PurchaseRequestDetails"
        component={PurchaseRequestDetails}
        options={({ route }) => ({
          title: route?.params?.purchaseRequest?.Purchase_Request_Number
            ? `${route.params.purchaseRequest.Purchase_Request_Number}`
            : 'Purchase Request Details',
        })}
      />
    </Stack.Navigator>
  );
}
