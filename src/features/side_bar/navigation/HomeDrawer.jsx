import React, { useContext, useState } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import Dashboard from '../../dashboard/navigation/Dashboard';
import OCRInbox from '../../../screens/OCRInbox';
import PurchaseRequisition from '../../../screens/PurchaseRequisition';
import RFQ from '../../../screens/RFQ';
import Quotation from '../../../screens/Quotation';
import PurchaseOrder from '../../../screens/PurchaseOrder';
import GRNSRN from '../../../screens/GRNSRN';
import Provision from '../../../screens/Provision';
import VendorAdvance from '../../vendor_advance/navigation/VendorAdvance';
import Reimbursement from '../../../screens/Reimbursement';
import Payments from '../../../screens/Payments';
import CreditNote from '../../../screens/CreditNote';
import Inventory from '../../../screens/Inventory';
import Reports from '../../../screens/Reports';
import Documents from '../../../screens/Documents';
import Settings from '../../../screens/Settings';

import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../../../context/UserContext';
import ProfileMenu from '../../../common_components/ProfileMenu';
import InvoiceStack from '../../invoices/navigation/InvoiceStack';
import { useTheme } from 'react-native-paper';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const drawerIcon =
  name =>
  ({ color }) =>
    <Icon name={name} size={20} color={color} style={{ marginRight: 14 }} />;

function CustomDrawerContent(props) {
  const { user, setUser, setDelegateFromUser } = useContext(UserContext);
  const [openInvoices, setOpenInvoices] = useState(false);
  const { colors } = useTheme();

  const styles = makeStyles(colors);

  const fullName = `${user?.FirstName || ''} ${user?.LastName || ''}`.trim();
  const email = user?.EmailId || '—';

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              fullName || 'User',
            )}&background=7f1d1d&color=fff&size=128`,
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{fullName || 'User'}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      {/* Menu */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.menuContainer}
      >
        {props.state.routes.map((route, index) => {
          const { options } = props.descriptors[route.key];

          if (route.name === 'Invoices') return null;

          if (route.name === 'Provision') {
            return (
              <React.Fragment key="invoices-group">
                <TouchableOpacity
                  onPress={() => setOpenInvoices(!openInvoices)}
                  style={styles.drawerRow}
                >
                  <Icon
                    name="file-text"
                    size={20}
                    color={colors.text}
                    style={{ marginRight: 26 }}
                  />
                  <Text style={styles.drawerLabel}>
                    Invoices {openInvoices ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {openInvoices && (
                  <>
                    <DrawerItem
                      label="PO Invoice"
                      style={styles.subItem}
                      icon={() => (
                        <Icon name="file-text" size={16} color={colors.text} />
                      )}
                      onPress={() =>
                        props.navigation.navigate('Invoices', {
                          screen: 'POInvoice',
                        })
                      }
                    />
                    <DrawerItem
                      label="Non-PO Invoice"
                      style={styles.subItem}
                      icon={() => (
                        <Icon name="file-minus" size={16} color={colors.text} />
                      )}
                      onPress={() =>
                        props.navigation.navigate('Invoices', {
                          screen: 'NonPOInvoice',
                        })
                      }
                    />
                  </>
                )}

                <DrawerItem
                  key={route.key}
                  label={options.drawerLabel ?? route.name}
                  focused={props.state.index === index}
                  onPress={() => props.navigation.navigate(route.name)}
                  icon={options.drawerIcon}
                />
              </React.Fragment>
            );
          }

          return (
            <DrawerItem
              key={route.key}
              label={options.drawerLabel ?? route.name}
              focused={props.state.index === index}
              onPress={() => props.navigation.navigate(route.name)}
              icon={options.drawerIcon}
            />
          );
        })}
      </DrawerContentScrollView>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Logout"
          labelStyle={styles.logoutLabel}
          icon={() => <Icon name="log-out" size={20} color={colors.error} />}
          onPress={() => {
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
                  props.navigation.replace('Login');
                },
              },
            ]);
          }}
        />
      </View>
    </View>
  );
}

export default function HomeDrawer({ navigation }) {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerRight: () => <ProfileMenu />,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitle: route.name,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: { marginLeft: -10, fontSize: 15, fontWeight: '600' },
        drawerStyle: { backgroundColor: colors.surface, width: 290 },
      })}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Dashboard',
          drawerIcon: drawerIcon('home'),
        }}
      />
      <Drawer.Screen
        name="OCR Inbox"
        component={OCRInbox}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('inbox'),
        }}
      />
      <Drawer.Screen
        name="Purchase Requisition"
        component={PurchaseRequisition}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('file-text'),
        }}
      />
      <Drawer.Screen
        name="Request For Quotation"
        component={RFQ}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('clipboard'),
        }}
      />
      <Drawer.Screen
        name="Quotation"
        component={Quotation}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('file'),
        }}
      />
      <Drawer.Screen
        name="Purchase Order"
        component={PurchaseOrder}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('shopping-cart'),
        }}
      />
      <Drawer.Screen
        name="GRN / SRN"
        component={GRNSRN}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('check-square'),
        }}
      />
      <Drawer.Screen
        name="Invoices"
        component={InvoiceStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'POInvoice';

          let title = 'Invoices';

          if (routeName === 'POInvoice') title = 'PO Invoice';
          if (routeName === 'NonPOInvoice') title = 'Non-PO Invoice';

          return {
            headerTitle: title,
          };
        }}
      />
      <Drawer.Screen
        name="Provision"
        component={Provision}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('layers'),
        }}
      />
      <Drawer.Screen
        name="Vendor Advance"
        component={VendorAdvance}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('dollar-sign'),
        }}
      />
      <Drawer.Screen
        name="Reimbursement"
        component={Reimbursement}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('refresh-cw'),
        }}
      />
      <Drawer.Screen
        name="Payments"
        component={Payments}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('credit-card'),
        }}
      />
      <Drawer.Screen
        name="Credit Note"
        component={CreditNote}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('file-plus'),
        }}
      />
      <Drawer.Screen
        name="Inventory"
        component={Inventory}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('box'),
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={Reports}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('bar-chart-2'),
        }}
      />
      <Drawer.Screen
        name="Documents"
        component={Documents}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('folder'),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'OCR Inbox',
          drawerIcon: drawerIcon('settings'),
        }}
      />
    </Drawer.Navigator>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    container: { flex: 1 },
    profileHeader: {
      backgroundColor: colors.primary,
      paddingVertical: 28,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: '#fff',
    },
    name: { color: '#fff', fontSize: 18, fontWeight: '800' },
    email: { color: '#fde68a', fontSize: 12, marginTop: 2 },
    menuContainer: { paddingTop: 8 },
    drawerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingLeft: 16,
    },
    drawerLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
    subItem: { paddingLeft: 28 },
    logoutContainer: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: 8,
    },
    logoutLabel: { color: colors.error, fontWeight: '800' },
  });
