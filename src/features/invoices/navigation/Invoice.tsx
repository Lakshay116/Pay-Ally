import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MyPOInvoice from './MyPOInStack';
import AllPOInvoiceStack from './AllPOInStack';

const Tab = createBottomTabNavigator();

export default function Invoice() {
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
        name="MyPOInvoice"
        component={MyPOInvoice}
        options={{
          title: 'My PO Invoices',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-check" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AllPOInvoice"
        component={AllPOInvoiceStack}
        options={{
          title: 'All PO Invoices',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
