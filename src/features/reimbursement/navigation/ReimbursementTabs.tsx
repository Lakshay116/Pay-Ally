import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyReimbursementStack from './MyReimbursementStack';
import AllReimbursementStack from './AllReimbursementStack';

const TopTab = createMaterialTopTabNavigator();

export default function ReimbursementTabs() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#C63D2F' },
        tabBarLabelStyle: { fontWeight: '700' },
      }}
    >
      <TopTab.Screen
        name="MyReimbursement"
        component={MyReimbursementStack}
        options={{ title: 'My Reimbursement' }}
      />
      <TopTab.Screen
        name="AllReimbursement"
        component={AllReimbursementStack}
        options={{ title: 'All Reimbursement' }}
      />
    </TopTab.Navigator>
  );
}
