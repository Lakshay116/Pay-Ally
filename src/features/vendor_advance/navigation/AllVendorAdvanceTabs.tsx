// import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import AllPOVendorAdvance from './AllPOVendorAdvance';
// import AllNonPOVendorAdvance from './AllNonPOVendorAdvance';

// const TopTab = createMaterialTopTabNavigator();

// export default function AllVendorAdvanceTabs() {
//   return (
//     <TopTab.Navigator
//       screenOptions={{
//         tabBarIndicatorStyle: { backgroundColor: '#C63D2F' },
//         tabBarLabelStyle: { fontWeight: '700' },
//       }}
//     >
//       <TopTab.Screen
//         name="AllPO"
//         component={AllPOVendorAdvance}
//         options={{ title: 'PO Invoice' }}
//       />
//       <TopTab.Screen
//         name="AllNonPO"
//         component={AllNonPOVendorAdvance}
//         options={{ title: 'Non-PO Invoice' }}
//       />
//     </TopTab.Navigator>
//   );
// }

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AllPOVendorAdvanceStack from './AllPOVendorAdvStack';
import AllNonPOVendorAdvanceStack from './AllNonPOVendorAdvStack';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

const BottomTab = createBottomTabNavigator();

export default function AllVendorAdvanceTabs() {
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
        name="AllPOVendorAdvanceStack"
        component={AllPOVendorAdvanceStack}
        options={{
          title: 'PO Invoice',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user-check" color={color} size={22} />
          ),
        }}
      />
      <BottomTab.Screen
        name="AllNonPOVendorAdvanceStack"
        component={AllNonPOVendorAdvanceStack}
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