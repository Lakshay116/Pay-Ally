import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllPurchaseRequests from '../screens/AllPurchaseRequests';
import PurchaseRequestDetails from '../screens/PurchaseRequestDetails';

const Stack = createNativeStackNavigator();

export default function AllPurchaseRequestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllPurchaseRequestsHome"
        component={AllPurchaseRequests}
        options={{
          title: 'All Purchase Requests',
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
