import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyRFQStack from './MyRFQStack';
import AllRFQStack from './AllRFQStack';

const BottomTab = createBottomTabNavigator();

export default function RFQTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C63D2F',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontWeight: '700', marginBottom: 4 },
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'MyRFQStack' ? 'account-clock-outline' : 'format-list-bulleted';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTab.Screen
        name="MyRFQStack"
        component={MyRFQStack}
        options={{ title: 'My RFQ' }}
      />
      <BottomTab.Screen
        name="AllRFQStack"
        component={AllRFQStack}
        options={{ title: 'All RFQ' }}
      />
    </BottomTab.Navigator>
  );
}
