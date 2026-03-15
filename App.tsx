// import React, { useEffect, useState } from 'react';
// import { useColorScheme } from 'react-native';
// import {
//   NavigationContainer,
//   DarkTheme as NavDark,
//   DefaultTheme as NavLight,
// } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Provider as PaperProvider } from 'react-native-paper';

// import { UserContextProvider } from './src/context/UserContext';
// import LoginScreen from './src/features/auth/screens/LoginScreen';
// import HomeDrawer from './src/features/side_bar/navigation/HomeDrawer';

// import { LightTheme, DarkTheme } from './src/theme/theme';
// import setGlobalFont from './src/utils/globalFont';

// // import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

// setGlobalFont();
// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <ThemeProvider>
//       <UserContextProvider>
//         <GestureHandlerRootView style={{ flex: 1 }}>
//           <AppWithTheme />
//         </GestureHandlerRootView>
//       </UserContextProvider>
//     </ThemeProvider>
//   );
// }

// function AppWithTheme() {
//   const { isDark } = React.useContext(ThemeContext);

//   return (
//     <PaperProvider theme={isDark ? DarkTheme : LightTheme}>
//       <NavigationContainer theme={isDark ? NavDark : NavLight}>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Home" component={HomeDrawer} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </PaperProvider>
//   );
// }

import React, { useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  NavigationContainer,
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import { Provider as PaperProvider } from 'react-native-paper';

import { UserContextProvider } from './src/context/UserContext';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

import LoginScreen from './src/features/auth/screens/LoginScreen';
import HomeDrawer from './src/features/side_bar/navigation/HomeDrawer';

import { LightTheme, DarkTheme } from './src/theme/theme';
import setGlobalFont from './src/utils/globalFont';
import { RootStackParamList } from './src/types/navigation.types';

/* ---------------- Navigation Types ---------------- */

// export type RootStackParamList = {
//   Login: undefined;
//   Home: undefined;
// };

/* ---------------- Stack ---------------- */

const Stack = createNativeStackNavigator<RootStackParamList>();

/* ---------------- Global Font ---------------- */

setGlobalFont();

/* ---------------- Main App ---------------- */

export default function App() {
  return (
    <ThemeProvider>
      <UserContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppWithTheme />
        </GestureHandlerRootView>
      </UserContextProvider>
    </ThemeProvider>
  );
}

/* ---------------- Themed App ---------------- */

function AppWithTheme(){
  const { isDark } = useContext(ThemeContext);

  return (
    <PaperProvider theme={isDark ? DarkTheme : LightTheme}>
      <NavigationContainer theme={isDark ? NavDark : NavLight}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeDrawer} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
