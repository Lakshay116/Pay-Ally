// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function VendorAdvance() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>VendorAdvance</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 24, fontWeight: '700' },
// });

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyVendorAdvanceTabs from './MyVendorAdvanceTabs';
import AllVendorAdvanceTabs from './AllVendorAdvanceTabs';

const TopTab = createMaterialTopTabNavigator();

export default function VendorAdvance() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#C63D2F' },
        tabBarLabelStyle: { fontWeight: '700' },
      }}
    >
      <TopTab.Screen
        name="MyVendorAdvance"
        component={MyVendorAdvanceTabs}
        options={{ title: 'My Vendor Advances' }}
      />
      <TopTab.Screen
        name="AllVendorAdvance"
        component={AllVendorAdvanceTabs}
        options={{ title: 'All Vendor Advances' }}
      />
    </TopTab.Navigator>
  );
}
