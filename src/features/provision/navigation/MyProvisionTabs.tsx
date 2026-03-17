import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyPOProvisionStack from './MyPOProvisionStack';
import MyNonPOProvisionStack from './MyNonPOProvisionStack';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const BottomTab = createBottomTabNavigator();

export default function MyProvisionTabs() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
      }}
    >
      <BottomTab.Screen
        name="MyPOProvisionStack"
        component={MyPOProvisionStack}
        options={{
          title: 'PO Provision',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-check" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="MyNonPOProvisionStack"
        component={MyNonPOProvisionStack}
        options={{
          title: 'Non-PO Provision',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={22} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
