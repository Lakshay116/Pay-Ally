// import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import MyPOVendorAdvance from './MyPOVendorAdvance';
// import MyNonPOVendorAdvance from './MyNonPOVendorAdvance';

// const TopTab = createMaterialTopTabNavigator();

// export default function MyVendorAdvanceTabs() {
//   return (
//     <TopTab.Navigator
//       screenOptions={{
//         tabBarIndicatorStyle: { backgroundColor: '#C63D2F' },
//         tabBarLabelStyle: { fontWeight: '700' },
//       }}
//     >
//       <TopTab.Screen
//         name="MyPO"
//         component={MyPOVendorAdvance}
//         options={{ title: 'PO Invoice' }}
//       />
//       <TopTab.Screen
//         name="MyNonPO"
//         component={MyNonPOVendorAdvance}
//         options={{ title: 'Non-PO Invoice' }}
//       />
//     </TopTab.Navigator>
//   );
// }

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyPOVendorAdvanceStack from './MyPOVendorAdvStack';
import MyNonPOVendorAdvanceStack from './MyNonPoVendorAdvStack';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const BottomTab = createBottomTabNavigator();

export default function MyVendorAdvanceTabs() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#b91c1c',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
      }}
    >
      <BottomTab.Screen
        name="MyPOVendorAdvanceStack"
        component={MyPOVendorAdvanceStack}
        options={{
          title: 'PO Invoice',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-check" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="MyNonPOVendorAdvance"
        component={MyNonPOVendorAdvanceStack}
        options={{
          title: 'Non-PO Invoice',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={22} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
