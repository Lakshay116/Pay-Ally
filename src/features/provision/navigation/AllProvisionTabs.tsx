import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AllPOProvisionStack from './AllPOProvisionStack';
import AllNonPOProvisionStack from './AllNonPOProvisionStack';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const BottomTab = createBottomTabNavigator();

export default function AllProvisionTabs() {
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
        name="AllPOProvisionStack"
        component={AllPOProvisionStack}
        options={{
          title: 'PO Provision',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-check" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="AllNonPOProvisionStack"
        component={AllNonPOProvisionStack}
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
