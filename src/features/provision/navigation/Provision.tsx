import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyProvisionTabs from './MyProvisionTabs';
import AllProvisionTabs from './AllProvisionTabs';

const TopTab = createMaterialTopTabNavigator();

export default function Provision() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#C63D2F' },
        tabBarLabelStyle: { fontWeight: '700' },
      }}
    >
      <TopTab.Screen
        name="MyProvision"
        component={MyProvisionTabs}
        options={{ title: 'My Provisions' }}
      />
      <TopTab.Screen
        name="AllProvision"
        component={AllProvisionTabs}
        options={{ title: 'All Provisions' }}
      />
    </TopTab.Navigator>
  );
}
