import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MyPurchaseRequestStack from './MyPurchaseRequestStack';
import AllPurchaseRequestStack from './AllPurchaseRequestStack';

const Tab = createBottomTabNavigator();

export default function PurchaseRequisitionTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#b91c1c',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="MyPurchaseRequests"
        component={MyPurchaseRequestStack}
        options={{
          title: 'My Purchase Requests',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-check" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AllPurchaseRequests"
        component={AllPurchaseRequestStack}
        options={{
          title: 'All Purchase Requests',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
