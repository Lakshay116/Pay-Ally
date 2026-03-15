// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   useColorScheme,
//   Switch,
//   Linking,
// } from 'react-native';
// import { Avatar, Menu, Divider } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/Feather';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import UserContext from '../context/UserContext';
// import { LightColors, DarkColors } from '../theme/colors';
// import { ThemeContext } from '../context/ThemeContext';

// export default function ProfileMenu({ navigation }) {
//   const [visible, setVisible] = useState(false);
//   const { user, setUser, setDelegateFromUser } = useContext(UserContext);

//   const { isDark, toggleTheme } = useContext(ThemeContext);
//   const colors = isDark ? DarkColors : LightColors;

//   const openMenu = () => setVisible(true);
//   const closeMenu = () => setVisible(false);

//   const getInitials = () => {
//     if (!user) return 'U';
//     return `${user?.FirstName?.[0] || ''}${
//       user?.LastName?.[0] || ''
//     }`.toUpperCase();
//   };

//   const handleLogout = () => {
//     Alert.alert('Logout', 'Are you sure you want to logout?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Logout',
//         style: 'destructive',
//         onPress: async () => {
//           await AsyncStorage.multiRemove([
//             'PAYALLY_USER',
//             'PAYALLY_DELEGATE_USER',
//           ]);
//           setUser(null);
//           setDelegateFromUser(null);
//           navigation.replace('Login');
//         },
//       },
//     ]);
//     closeMenu();
//   };

//   return (
//     <View
//       style={[
//         styles.container,
//         { borderColor: 'white', borderWidth: 2, borderRadius: '50%' },
//       ]}
//     >
//       <Menu
//         visible={visible}
//         onDismiss={closeMenu}
//         contentStyle={[
//           styles.menu,
//           { backgroundColor: colors.surface, borderColor: colors.border },
//         ]}
//         anchor={
//           <TouchableOpacity onPress={openMenu}>
//             <Avatar.Text
//               size={40}
//               label={getInitials()}
//               style={[styles.avatar, { backgroundColor: colors.primary }]}
//             />
//           </TouchableOpacity>
//         }
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <Avatar.Text
//             size={44}
//             label={getInitials()}
//             style={[styles.avatarLarge, { backgroundColor: colors.primary }]}
//           />
//           <View style={{ marginLeft: 10 }}>
//             <Text style={[styles.name, { color: colors.text }]}>
//               {user?.FirstName} {user?.LastName}
//             </Text>

//             <View style={styles.roleRow}>
//               {user?.Roles?.map(r => (
//                 <Text
//                   key={r.Role_Id}
//                   style={[
//                     styles.role,
//                     {
//                       color: 'white',
//                       backgroundColor: colors.primary,
//                     },
//                   ]}
//                 >
//                   {r.RoleName}
//                 </Text>
//               ))}
//             </View>
//           </View>
//         </View>
//         <View
//           style={[
//             styles.themeRow,
//             {
//               backgroundColor: colors.background,
//               borderColor: colors.border,
//             },
//           ]}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//             <Icon
//               name={isDark ? 'moon' : 'sun'}
//               size={18}
//               color={colors.text}
//             />
//             <Text style={[styles.themeText, { color: colors.text }]}>
//               Dark Mode
//             </Text>
//           </View>

//           <Switch
//             value={isDark}
//             onValueChange={toggleTheme}
//             thumbColor={isDark ? colors.primary : '#f4f3f4'}
//             trackColor={{ false: '#d1d5db', true: colors.primary }}
//           />
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.delegateBtn,
//             {
//               backgroundColor: colors.background,
//               borderColor: colors.border,
//               borderWidth: 1,
//             },
//           ]}
//         >
//           <Text style={[styles.delegateText, { color: colors.text }]}>
//             Delegated To Me →
//           </Text>
//         </TouchableOpacity>

//         <Divider />

//         <Menu.Item
//           onPress={() => {
//             closeMenu();
//             navigation.navigate('Settings');
//           }}
//           title="Settings"
//           leadingIcon={() => (
//             <Icon name="settings" size={18} color={colors.text} />
//           )}
//           titleStyle={{ color: colors.text }}
//         />

//         <Menu.Item
//           onPress={() => {
//             const url = 'https://help.pay-ally.com';

//             Linking.openURL(url).catch(() => {
//               Alert.alert('Error', 'Unable to open the link');
//             });
//           }}
//           title="Help Center"
//           leadingIcon={() => (
//             <Icon name="help-circle" size={18} color={colors.text} />
//           )}
//           titleStyle={{ color: colors.text }}
//         />

//         <Menu.Item
//           onPress={() => Alert.alert('Change Password', 'Coming soon')}
//           title="Change Password"
//           leadingIcon={() => <Icon name="lock" size={18} color={colors.text} />}
//           titleStyle={{ color: colors.text }}
//         />

//         <Menu.Item
//           onPress={handleLogout}
//           title="Sign Out"
//           leadingIcon={() => (
//             <Icon name="log-out" size={18} color={colors.danger} />
//           )}
//           titleStyle={{ color: colors.danger, fontWeight: '700' }}
//         />
//       </Menu>
//     </View>
//   );
// }

// /* ------------------ Styles ------------------ */
// const styles = StyleSheet.create({
//   container: {
//     marginRight: 12,
//   },
//   avatar: {},
//   avatarLarge: {},
//   menu: {
//     width: 280,
//     borderRadius: 12,
//     borderWidth: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     padding: 12,
//     alignItems: 'center',
//   },
//   name: {
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   roleRow: {
//     flexDirection: 'row',
//     marginTop: 6,
//     flexWrap: 'wrap',
//     gap: 6,
//   },
//   role: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//     fontSize: 11,
//     marginRight: 6,
//     marginTop: 4,
//   },
//   delegateBtn: {
//     marginHorizontal: 12,
//     padding: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   delegateText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   themeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 12,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//   },

//   themeText: {
//     fontSize: 13,
//     fontWeight: '700',
//   },
// });

//ts
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { Avatar, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useUserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { LightColors, DarkColors } from '../theme/colors';
import { User, Role } from '../types/user.types';
import { RootStackParamList } from '../types/navigation.types';
/* ------------------ Types ------------------ */





type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  navigation: NavigationProp,
};

/* ------------------ Component ------------------ */

export default function ProfileMenu({ navigation }: Props) {
  const [visible, setVisible] = useState <boolean>(false);

  const { user, setUser, setDelegateFromUser } = useUserContext();

  const { isDark, toggleTheme } = useContext(ThemeContext);

  const colors = isDark ? DarkColors : LightColors;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  /* ------------------ Helpers ------------------ */

  const getInitials = (): string => {
    if (!user) return 'U';

    return `${user?.FirstName?.[0] || ''}${
      user?.LastName?.[0] || ''
    }`.toUpperCase();
  };

  /* ------------------ Logout ------------------ */

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove([
            'PAYALLY_USER',
            'PAYALLY_DELEGATE_USER',
          ]);

          setUser(null);
          setDelegateFromUser(null);

          navigation.replace('Login');
        },
      },
    ]);

    closeMenu();
  };

  /* ------------------ UI ------------------ */

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: 'white',
          borderWidth: 2,
          borderRadius: 50,
        },
      ]}
    >
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={[
          styles.menu,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        anchor={
          <TouchableOpacity onPress={openMenu}>
            <Avatar.Text
              size={40}
              label={getInitials()}
              style={[styles.avatar, { backgroundColor: colors.primary }]}
            />
          </TouchableOpacity>
        }
      >
        {/* Header */}

        <View style={styles.header}>
          <Avatar.Text
            size={44}
            label={getInitials()}
            style={[styles.avatarLarge, { backgroundColor: colors.primary }]}
          />

          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.name, { color: colors.text }]}>
              {user?.FirstName} {user?.LastName}
            </Text>

            <View style={styles.roleRow}>
              {user?.Roles?.map((r: Role) => (
                <Text
                  key={r.Role_Id}
                  style={[
                    styles.role,
                    {
                      color: 'white',
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  {r.RoleName}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Theme Toggle */}

        <View
          style={[
            styles.themeRow,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon
              name={isDark ? 'moon' : 'sun'}
              size={18}
              color={colors.text}
            />

            <Text style={[styles.themeText, { color: colors.text }]}>
              Dark Mode
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? colors.primary : '#f4f3f4'}
            trackColor={{ false: '#d1d5db', true: colors.primary }}
          />
        </View>

        {/* Delegation */}

        <TouchableOpacity
          style={[
            styles.delegateBtn,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.delegateText, { color: colors.text }]}>
            Delegated To Me →
          </Text>
        </TouchableOpacity>

        <Divider />

        {/* Settings */}

        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Settings');
          }}
          title="Settings"
          leadingIcon={() => (
            <Icon name="settings" size={18} color={colors.text} />
          )}
          titleStyle={{ color: colors.text }}
        />

        {/* Help Center */}

        <Menu.Item
          onPress={() => {
            const url = 'https://help.pay-ally.com';

            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'Unable to open the link');
            });
          }}
          title="Help Center"
          leadingIcon={() => (
            <Icon name="help-circle" size={18} color={colors.text} />
          )}
          titleStyle={{ color: colors.text }}
        />

        {/* Change Password */}

        <Menu.Item
          onPress={() => Alert.alert('Change Password', 'Coming soon')}
          title="Change Password"
          leadingIcon={() => <Icon name="lock" size={18} color={colors.text} />}
          titleStyle={{ color: colors.text }}
        />

        {/* Logout */}

        <Menu.Item
          onPress={handleLogout}
          title="Sign Out"
          leadingIcon={() => (
            <Icon name="log-out" size={18} color={colors.danger} />
          )}
          titleStyle={{ color: colors.danger, fontWeight: '700' }}
        />
      </Menu>
    </View>
  );
}

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },

  avatar: {},

  avatarLarge: {},

  menu: {
    width: 280,
    borderRadius: 12,
    borderWidth: 1,
  },

  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
  },

  roleRow: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },

  role: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 11,
    marginRight: 6,
    marginTop: 4,
  },

  delegateBtn: {
    marginHorizontal: 12,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 6,
  },

  delegateText: {
    fontSize: 13,
    fontWeight: '600',
  },

  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },

  themeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
