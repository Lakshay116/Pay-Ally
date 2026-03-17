import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MyTasks from '../screens/MyTasks';
import RecentUpdates from '../screens/RecentUpdates';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#b91c1c',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'My Tasks') iconName = 'check-circle';
          if (route.name === 'RecentUpdates') iconName = 'bell';

          return <Icon name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="My Tasks" component={MyTasks} />
      <Tab.Screen name="RecentUpdates" component={RecentUpdates} />
    </Tab.Navigator>
  );
}
