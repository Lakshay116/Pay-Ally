//without grid and list view
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   useColorScheme,
// } from 'react-native';
// import api from '../../../utils/api';
// import { useTheme } from 'react-native-paper';

// export default function MyNonPOInvoice({ navigation }) {
//   const [loading, setLoading] = useState(true);
//   const [invoices, setInvoices] = useState([]);

//   const { colors } = useTheme();

//   useEffect(() => {
//     fetchNonPOInvoices();
//   }, []);

//   const fetchNonPOInvoices = async () => {
//     try {
//       const res = await api.post('/nonPOInvoice/getAllByUserId');
//       setInvoices(res?.data?.data?.rows || []);
//     } catch (err) {
//       console.log('Fetch Non PO Invoice Error:', err?.response || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => {
//     const amount =
//       item?.Products?.reduce(
//         (sum, p) => sum + Number(p.TotalPayableAmount || 0),
//         0,
//       ) || 0;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.card,
//           { backgroundColor: colors.surface, borderColor: colors.border },
//         ]}
//         onPress={() =>
//           navigation.navigate('NonPOInvoiceDetails', { invoice: item })
//         }
//       >
//         <View style={styles.headerRow}>
//           <Text style={[styles.invoiceNo, { color: colors.primary }]}>
//             {item.NonPOInvoiceNumber}
//           </Text>

//           <Text
//             style={[
//               styles.status,
//               item.Status === 'DRAFTED'
//                 ? {
//                     backgroundColor: colors.warning + '33',
//                     color: colors.warning,
//                   }
//                 : {
//                     backgroundColor: colors.success + '33',
//                     color: colors.success,
//                   },
//             ]}
//           >
//             {item.Status}
//           </Text>
//         </View>

//         <Text style={[styles.row, { color: colors.text }]}>
//           Invoice No: {item.InvoiceNumber || '—'}
//         </Text>
//         <Text style={[styles.row, { color: colors.text }]}>
//           Entity: {item?.EntityData?.Entity_Name || '—'}
//         </Text>
//         <Text style={[styles.row, { color: colors.text }]}>
//           Office: {item?.OfficeData?.OfficeName || '—'}
//         </Text>
//         <Text style={[styles.row, { color: colors.text }]}>
//           Department: {item?.DepartmentData?.DepartmentName || '—'}
//         </Text>
//         <Text style={[styles.row, { color: colors.text }]}>
//           Vendor: {item?.VendorData?.Vendor_Name || '—'}
//         </Text>

//         <View style={styles.footerRow}>
//           <Text style={[styles.amount, { color: colors.text }]}>
//             ₹ {amount.toLocaleString('en-IN')}
//           </Text>

//           <Text style={[styles.created, { color: colors.muted }]}>
//             {item?.Creater?.FirstName} {item?.Creater?.LastName} ·{' '}
//             {new Date(item.createdAt).toLocaleDateString('en-IN')}
//           </Text>
//         </View>

//         <View style={[styles.viewBtn, { backgroundColor: colors.primary }]}>
//           <Text style={[styles.viewText, { color: '#fff' }]}>View Details</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={[styles.center, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   if (!invoices.length) {
//     return (
//       <View style={[styles.center, { backgroundColor: colors.background }]}>
//         <Text style={[styles.empty, { color: colors.muted }]}>
//           No Non-PO Invoices found
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={invoices}
//       keyExtractor={item => String(item?.NonPOInvoiceId)}
//       renderItem={renderItem}
//       contentContainerStyle={{ padding: 12 }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//   empty: { fontSize: 16 },

//   card: {
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 12,
//     elevation: 3,
//     borderWidth: 1,
//   },

//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//   },

//   invoiceNo: {
//     fontSize: 14,
//     fontWeight: '800',
//   },

//   status: {
//     fontSize: 12,
//     fontWeight: '700',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },

//   row: {
//     fontSize: 13,
//     marginTop: 2,
//   },

//   footerRow: {
//     marginTop: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   amount: {
//     fontSize: 16,
//     fontWeight: '800',
//   },

//   created: {
//     fontSize: 12,
//   },

//   viewBtn: {
//     marginTop: 10,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//   },

//   viewText: {
//     fontWeight: '700',
//   },
// });

//with grid and list view
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import api from '../../../utils/api';
// import { useTheme } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// export default function MyNonPOInvoice({ navigation }) {
//   const [loading, setLoading] = useState(true);
//   const [invoices, setInvoices] = useState([]);
//   const [viewMode, setViewMode] = useState('list');

//   const { colors } = useTheme();
//   const styles = makeStyles(colors);

//   useEffect(() => {
//     fetchNonPOInvoices();
//   }, []);

//   const fetchNonPOInvoices = async () => {
//     try {
//       const res = await api.post('/nonPOInvoice/getAllByUserId');
//       setInvoices(res?.data?.data?.rows || []);
//     } catch (err) {
//       console.log('Fetch Non PO Invoice Error:', err?.response || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAmount = item =>
//     item?.Products?.reduce(
//       (sum, p) => sum + Number(p.TotalPayableAmount || 0),
//       0,
//     ) || 0;

//   const renderItem = ({ item }) =>
//     viewMode === 'list' ? renderListCard(item) : renderGridCard(item);

//   /* ---------- LIST CARD ---------- */

//   const renderListCard = item => {
//     const amount = getAmount(item);

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         onPress={() =>
//           navigation.navigate('NonPOInvoiceDetails', { invoice: item })
//         }
//       >
//         <View style={styles.headerRow}>
//           <Text style={[styles.invoiceNo, { color: colors.primary }]}>
//             {item.NonPOInvoiceNumber}
//           </Text>

//           <Text
//             style={[
//               styles.status,
//               item.Status === 'DRAFTED'
//                 ? {
//                     backgroundColor: colors.warning + '33',
//                     color: colors.warning,
//                   }
//                 : {
//                     backgroundColor: colors.success + '33',
//                     color: colors.success,
//                   },
//             ]}
//           >
//             {item.Status}
//           </Text>
//         </View>

//         <Text style={[styles.row, { color: colors.text }]}>
//           Invoice No: {item.InvoiceNumber || '—'}
//         </Text>

//         <Text style={[styles.row, { color: colors.text }]}>
//           Entity: {item?.EntityData?.Entity_Name || '—'}
//         </Text>

//         <Text style={[styles.row, { color: colors.text }]}>
//           Office: {item?.OfficeData?.OfficeName || '—'}
//         </Text>

//         <Text style={[styles.row, { color: colors.text }]}>
//           Department: {item?.DepartmentData?.DepartmentName || '—'}
//         </Text>

//         <Text style={[styles.row, { color: colors.text }]}>
//           Vendor: {item?.VendorData?.Vendor_Name || '—'}
//         </Text>

//         <View style={styles.footerRow}>
//           <Text style={[styles.amount, { color: colors.text }]}>
//             ₹ {amount.toLocaleString('en-IN')}
//           </Text>

//           <Text style={[styles.created, { color: colors.muted }]}>
//             {item?.Creater?.FirstName} {item?.Creater?.LastName} ·{' '}
//             {new Date(item.createdAt).toLocaleDateString('en-IN')}
//           </Text>
//         </View>

//         <View style={[styles.viewBtn, { backgroundColor: colors.primary }]}>
//           <Text style={styles.viewText}>View Details</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   /* ---------- GRID CARD ---------- */

//   const renderGridCard = item => {
//     const amount = getAmount(item);

//     return (
//       <TouchableOpacity
//         style={styles.gridCard}
//         onPress={() =>
//           navigation.navigate('NonPOInvoiceDetails', { invoice: item })
//         }
//       >
//         <Text style={[styles.gridInvoice, { color: colors.primary }]}>
//           {item.NonPOInvoiceNumber}
//         </Text>

//         <Text
//           style={[styles.gridVendor, { color: colors.text }]}
//           numberOfLines={1}
//         >
//           {item?.VendorData?.Vendor_Name || '—'}
//         </Text>

//         <Text style={[styles.gridAmount, { color: colors.primary }]}>
//           ₹ {amount.toLocaleString('en-IN')}
//         </Text>

//         <Text
//           style={[
//             styles.gridStatus,
//             item.Status === 'DRAFTED'
//               ? {
//                   backgroundColor: colors.warning + '33',
//                   color: colors.warning,
//                 }
//               : {
//                   backgroundColor: colors.success + '33',
//                   color: colors.success,
//                 },
//           ]}
//         >
//           {item.Status}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={[styles.center]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   if (!invoices.length) {
//     return (
//       <View style={styles.center}>
//         <Text style={[styles.empty, { color: colors.muted }]}>
//           No Non-PO Invoices found
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       {/* TOP BAR */}

//       <View style={styles.topBar}>
//         {/* <Text style={[styles.title, { color: colors.text }]}>
//           My Non-PO Invoices
//         </Text> */}

//         <TouchableOpacity
//           style={styles.toggleBtn}
//           onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
//         >
//           <Icon
//             name={viewMode === 'list' ? 'view-grid' : 'view-list'}
//             size={22}
//             color={colors.primary}
//           />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         key={viewMode}
//         data={invoices}
//         numColumns={viewMode === 'grid' ? 2 : 1}
//         keyExtractor={item => String(item?.NonPOInvoiceId)}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 12 }}
//       />
//     </View>
//   );
// }

// /* ---------- STYLES ---------- */

// const makeStyles = colors =>
//   StyleSheet.create({
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//     empty: { fontSize: 16 },

//     topBar: {
//       // flexDirection: 'row',
//       // justifyContent: 'space-between',
//       alignItems: 'flex-end',
//       paddingHorizontal: 14,
//       paddingVertical: 10,
//       // borderBottomWidth: 1,
//       // borderColor: colors.border,
//     },

//     title: {
//       fontSize: 18,
//       fontWeight: '800',
//     },

//     toggleBtn: {
//       padding: 6,
//     },

//     card: {
//       borderRadius: 14,
//       padding: 14,
//       marginBottom: 12,
//       borderWidth: 1,
//       borderColor: colors.border,
//       backgroundColor: colors.surface,
//     },

//     headerRow: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       marginBottom: 6,
//     },

//     invoiceNo: {
//       fontSize: 14,
//       fontWeight: '800',
//     },

//     status: {
//       fontSize: 12,
//       fontWeight: '700',
//       paddingHorizontal: 8,
//       paddingVertical: 2,
//       borderRadius: 6,
//     },

//     row: {
//       fontSize: 13,
//       marginTop: 2,
//     },

//     footerRow: {
//       marginTop: 8,
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//     },

//     amount: {
//       fontSize: 16,
//       fontWeight: '800',
//     },

//     created: {
//       fontSize: 12,
//     },

//     viewBtn: {
//       marginTop: 10,
//       paddingVertical: 8,
//       borderRadius: 8,
//       alignItems: 'center',
//     },

//     viewText: {
//       fontWeight: '700',
//       color: '#fff',
//     },

//     /* GRID CARD */

//     gridCard: {
//       flex: 1,
//       backgroundColor: colors.surface,
//       borderRadius: 12,
//       padding: 12,
//       margin: 6,
//       borderWidth: 1,
//       borderColor: colors.border,
//     },

//     gridInvoice: {
//       fontSize: 13,
//       fontWeight: '800',
//       marginBottom: 4,
//     },

//     gridVendor: {
//       fontSize: 12,
//       opacity: 0.7,
//       marginBottom: 6,
//     },

//     gridAmount: {
//       fontSize: 14,
//       fontWeight: '700',
//     },

//     gridStatus: {
//       marginTop: 6,
//       fontSize: 10,
//       fontWeight: '700',
//       paddingHorizontal: 6,
//       paddingVertical: 2,
//       borderRadius: 4,
//       alignSelf: 'flex-start',
//     },
//   });

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MultiSelect } from 'react-native-element-dropdown';
import api from '../../../utils/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {
  fetchOffices,
  fetchDepartments,
  fetchVendors,
  fetchNonPOInvoiceNumbers,
  fetchNonPOInvoiceNo,
  fetchUsers,
} from '../services/NonPOInvoices';

export default function MyNonPOInvoice({ navigation }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const dropdownThemeProps = {
    placeholderStyle: styles.dropdownPlaceholder,
    selectedTextStyle: styles.dropdownSelectedText,
    inputSearchStyle: styles.dropdownSearchInput,
    itemTextStyle: styles.dropdownItemText,
    containerStyle: styles.dropdownMenu,
    selectedStyle: styles.selectedStyle,
    activeColor: colors.primary + '12',
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [filterOpen, setFilterOpen] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 14;

  const [entities, setEntities] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);

  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [nonPoInvoices, setNonPoInvoices] = useState([]);
  const [nonPoInvoiceLoading, setNonPoInvoiceLoading] = useState(false);

  const [nonPoInvoiceNo, setNonPoInvoiceNo] = useState([]);
  const [filteredNonPoInvoiceNo, setFilteredNonPoInvoiceNo] = useState([]);

  const fetchEntities = async () => {
    try {
      const res = await api.get('/entity/getAll');

      const entityList = res.data.data.map(item => ({
        label: item.Entity_Name,
        value: item.Entity_Id,
      }));

      setEntities(entityList);
      setFilteredEntities(entityList);
    } catch (err) {
      console.log('Entity fetch error', err);
    }
  };

  const [filters, setFilters] = useState({
    NonPOInvoiceNumber: [],
    InvoiceNumber: [],
    Entity: [],
    Office: [],
    Department: [],
    Vendor: [],
    CreatedBy: [],
    Status: [],
    PaymentStatus: [],
  });

  const statusOptions = [
    { label: 'empty', value: null },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Pending for Approval', value: 'PENDING_FOR_APPROVAL' },
    { label: 'Sent for Revision', value: 'REVISION' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Drafted', value: 'DRAFTED' },
    { label: 'Pending for Acceptance', value: 'PENDING_FOR_ACCEPTANCE' },
  ];

  const paymentStatusOptions = [
    { label: 'empty', value: null },
    { label: 'Open', value: 'Open' },
    { label: 'Partly Paid', value: 'Partly Paid' },
    { label: 'Paid', value: 'Paid' },
  ];

  useEffect(() => {
    fetchMyNonPOInvoices(filters, 1);
    fetchEntities();
  }, []);

  const searchEntity = async text => {
    if (!text) {
      setFilteredEntities(entities);
      return;
    }

    const filtered = entities.filter(item =>
      item.label.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredEntities(filtered);
  };

  const searchOffice = async text => {
    try {
      const data = await fetchOffices(text);

      setOffices(data);
      if (!text) {
        setFilteredOffices(offices);
        return;
      }

      const filtered = offices.filter(item =>
        item.label.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredOffices(filtered);
    } catch (err) {
      console.log('Office fetch error', err);
    }
  };

  const searchDepartment = async text => {
    try {
      // setDepartmentLoading(true);

      const data = await fetchDepartments(text);

      setDepartments(data);
      if (!text) {
        setFilteredDepartments(departments);
        return;
      }

      const filtered = departments.filter(item =>
        item.label.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredDepartments(filtered);
    } catch (err) {
      console.log('Department fetch error', err);
    }
  };

  const searchVendor = async text => {
    try {
      const data = await fetchVendors(text);

      setVendors(data);
      if (!text) {
        setFilteredVendors(vendors);
        return;
      }

      const filtered = vendors.filter(item =>
        item.label.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredVendors(filtered);
    } catch (err) {
      console.log('Vendor fetch error', err);
    }
  };

  const searchNonPOInvoice = async text => {
    try {
      setNonPoInvoiceLoading(true);

      const data = await fetchNonPOInvoiceNumbers(text);

      setNonPoInvoices(data);
    } catch (err) {
      console.log('NonPO Invoice fetch error', err);
    } finally {
      setNonPoInvoiceLoading(false);
    }
  };

  const searchNonPOInvoiceNo = async text => {
    try {
      // setNonPoInvoiceNoLoading(true);

      const data = await fetchNonPOInvoiceNo(text);

      setNonPoInvoiceNo(data);
      if (!text) {
        setFilteredNonPoInvoiceNo(nonPoInvoiceNo);
        return;
      }

      const filtered = nonPoInvoiceNo.filter(item =>
        item.label.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredNonPoInvoiceNo(filtered);
    } catch (err) {
      console.log('NonPO Invoice Number fetch error', err);
    }
  };

  const searchUsers = async text => {
    try {
      const data = await fetchUsers(text);

      setUsers(data);
      if (!text) {
        setFilteredUsers(users);
        return;
      }

      const filtered = users.filter(item =>
        item.label.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredUsers(filtered);
    } catch (err) {
      console.log('User fetch error', err);
    }
  };

  const fetchMyNonPOInvoices = async (
    appliedFilters = filters,
    pageNumber = 1,
    isLoadMore = false,
  ) => {
    try {
      const res = await api.post('/nonPOInvoice/getAllByUserId', {
        limit: limit,
        offset: (pageNumber - 1) * limit,

        invoice: appliedFilters.NonPOInvoiceNumber?.length
          ? appliedFilters.NonPOInvoiceNumber
          : [],
        invoiceNumber: appliedFilters.InvoiceNumber?.length
          ? appliedFilters.InvoiceNumber
          : [],
        entity: appliedFilters.Entity?.length ? appliedFilters.Entity : [],
        office: appliedFilters.Office?.length ? appliedFilters.Office : [],
        department: appliedFilters.Department?.length
          ? appliedFilters.Department
          : [],
        vendor: appliedFilters.Vendor?.length ? appliedFilters.Vendor : [],
        user: appliedFilters.CreatedBy?.length ? appliedFilters.CreatedBy : [],
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
        status: appliedFilters.Status?.length ? appliedFilters.Status : null,
        paymentStatus: appliedFilters.PaymentStatus?.length
          ? appliedFilters.PaymentStatus
          : null,
      });

      const newInvoices = res?.data?.data?.rows || [];

      if (isLoadMore) {
        setInvoices(prev => [...prev, ...newInvoices]);
      } else {
        setInvoices(newInvoices);
      }

      if (newInvoices.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.log('Fetch Error', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    fetchMyNonPOInvoices(filters, nextPage, true);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);

    fetchMyNonPOInvoices(filters, 1);
  }, []);

  const applyFilters = () => {
    setFilterOpen(false);
    setLoading(true);
    setPage(1);
    setHasMore(true);
    fetchMyNonPOInvoices(filters);
  };

  const resetFilters = () => {
    const empty = {
      NonPOInvoiceNumber: [],
      InvoiceNumber: [],
      Entity: [],
      Office: [],
      Department: [],
      Vendor: [],
      CreatedBy: [],
      Status: [],
      PaymentStatus: [],
      startDate: null,
      endDate: null,
    };

    setFilters(empty);

    // reset date picker UI
    setStartDate(null);
    setEndDate(null);

    setFilterOpen(false);
    // setPage(1);
    setHasMore(true);

    fetchMyNonPOInvoices(filters, 1);
  };

  const getAmount = item =>
    item?.Products?.reduce(
      (sum, p) => sum + Number(p.TotalPayableAmount || 0),
      0,
    ) || 0;

  const renderItem = ({ item }) =>
    viewMode === 'list' ? renderListCard(item) : renderGridCard(item);

  const renderListCard = item => {
    const amount = getAmount(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('NonPOInvoiceDetails', { invoice: item })
        }
      >
        <View style={styles.headerRow}>
          <Text style={styles.invoiceNo}>{item.NonPOInvoiceNumber}</Text>

          <Text
            style={[
              styles.status,
              item.Status === 'DRAFTED' ? styles.draft : styles.approved,
            ]}
          >
            {item.Status}
          </Text>
        </View>

        <Text style={styles.row}>Invoice No: {item.InvoiceNumber || '—'}</Text>
        <Text style={styles.row}>
          Entity: {item?.EntityData?.Entity_Name || '—'}
        </Text>
        <Text style={styles.row}>
          Office: {item?.OfficeData?.OfficeName || '—'}
        </Text>
        <Text style={styles.row}>
          Department: {item?.DepartmentData?.DepartmentName || '—'}
        </Text>
        <Text style={styles.row}>
          Vendor: {item?.VendorData?.Vendor_Name || '—'}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.amount}>₹ {amount.toLocaleString('en-IN')}</Text>

          <Text style={styles.created}>
            {item?.Creater?.FirstName} {item?.Creater?.LastName} ·{' '}
            {new Date(item.createdAt).toLocaleDateString('en-IN')}
          </Text>
        </View>

        <View style={styles.viewBtn}>
          <Text style={styles.viewText}>View Details</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGridCard = item => {
    const amount = getAmount(item);

    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={() =>
          navigation.navigate('NonPOInvoiceDetails', { invoice: item })
        }
      >
        <Text style={styles.gridInvoice}>{item.NonPOInvoiceNumber}</Text>

        <Text style={styles.gridVendor} numberOfLines={1}>
          {item?.VendorData?.Vendor_Name || '—'}
        </Text>

        <Text style={styles.gridAmount}>
          ₹ {amount.toLocaleString('en-IN')}
        </Text>

        <Text
          style={[
            styles.gridStatus,
            item.Status === 'DRAFTED' ? styles.draft : styles.approved,
          ]}
        >
          {item.Status}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* TOP BAR */}

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => setFilterOpen(true)}
        >
          <Icon name="magnify" size={20} color="#fff" />
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        >
          <Icon
            name={viewMode === 'list' ? 'view-grid' : 'view-list'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* SEARCH MODAL */}

      <Modal
        visible={filterOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setFilterOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterOpen(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Filters</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setFilterOpen(false)}
              >
                <Icon name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>Non PO Invoice #</Text>

              <MultiSelect
                style={styles.dropdown}
                data={nonPoInvoices}
                labelField="label"
                valueField="label"
                placeholder="Search Non PO Invoice"
                search
                searchPlaceholder="Type Non PO number..."
                value={filters.NonPOInvoiceNumber}
                onChangeText={searchNonPOInvoice}
                onChange={item => {
                  setFilters({
                    ...filters,
                    NonPOInvoiceNumber: item,
                  });
                }}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.NonPOInvoiceNumber?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          NonPOInvoiceNumber: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              <Text style={styles.label}>Invoice Number</Text>

              <MultiSelect
                style={styles.dropdown}
                data={filteredNonPoInvoiceNo}
                labelField="label"
                valueField="label"
                placeholder="Search Non PO Invoice No."
                search
                searchPlaceholder="Type invoice number..."
                value={filters.InvoiceNumber}
                onChangeText={searchNonPOInvoiceNo}
                onChange={item => {
                  setFilters({
                    ...filters,
                    InvoiceNumber: item,
                  });
                }}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.InvoiceNumber?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          InvoiceNumber: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              <Text style={styles.label}>Entity</Text>

              <MultiSelect
                style={styles.dropdown}
                data={filteredEntities}
                labelField="label"
                valueField="value"
                placeholder="Select Entity"
                value={filters.Entity}
                search
                searchPlaceholder="Search Entity..."
                onChangeText={searchEntity}
                onChange={item => setFilters({ ...filters, Entity: item })}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Entity?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          Entity: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              <Text style={styles.label}>Office</Text>

              <MultiSelect
                style={styles.dropdown}
                data={filteredOffices}
                labelField="label"
                valueField="value"
                placeholder="Search Office"
                search
                searchPlaceholder="Type office..."
                value={filters.Office}
                onChangeText={searchOffice}
                onChange={item => {
                  setFilters({
                    ...filters,
                    Office: item,
                  });
                }}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Office?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          Office: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              <Text style={styles.label}>Department</Text>

              <MultiSelect
                style={styles.dropdown}
                data={filteredDepartments}
                labelField="label"
                valueField="value"
                placeholder="Search Department"
                search
                searchPlaceholder="Type department..."
                value={filters.Department}
                onChangeText={searchDepartment}
                onChange={item => {
                  setFilters({
                    ...filters,
                    Department: item,
                  });
                }}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Department?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          Department: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              <Text style={styles.label}>Vendor</Text>

              <MultiSelect
                style={styles.dropdown}
                data={filteredVendors}
                labelField="label"
                valueField="value"
                placeholder="Search Vendor"
                search
                searchPlaceholder="Type vendor name..."
                value={filters.Vendor}
                onChangeText={searchVendor}
                onChange={item => {
                  setFilters({
                    ...filters,
                    Vendor: item,
                  });
                }}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Vendor?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          Vendor: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              <Text style={styles.label}>Created By</Text>
              <MultiSelect
                style={styles.dropdown}
                data={filteredUsers}
                labelField="label"
                valueField="value"
                placeholder="Search Created By"
                search
                searchPlaceholder="Type user name..."
                value={filters.CreatedBy}
                onChangeText={searchUsers}
                onChange={item => {
                  setFilters({
                    ...filters,
                    CreatedBy: item,
                  });
                }}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.CreatedBy?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          CreatedBy: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              <Text style={styles.label}>Created Date</Text>

              <View style={styles.dateRow}>
                {/* Start Date */}

                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setOpenStartPicker(true)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      !startDate && styles.datePlaceholder,
                    ]}
                  >
                    {startDate ? startDate.toLocaleDateString() : 'Start Date'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.dateArrow}>to</Text>

                {/* End Date */}

                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setOpenEndPicker(true)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      !endDate && styles.datePlaceholder,
                    ]}
                  >
                    {endDate ? endDate.toLocaleDateString() : 'End Date'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* STATUS DROPDOWN */}

              <Text style={styles.label}>Status</Text>
              <MultiSelect
                style={styles.dropdown}
                data={statusOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Status"
                value={filters.Status}
                onChange={item => setFilters({ ...filters, Status: item })}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Status?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          Status: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />

              {/* PAYMENT STATUS */}

              <Text style={styles.label}>Payment Status</Text>
              <MultiSelect
                style={styles.dropdown}
                data={paymentStatusOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Payment Status"
                value={filters.PaymentStatus}
                onChange={item =>
                  setFilters({ ...filters, PaymentStatus: item })
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside // important
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.PaymentStatus?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({
                          ...prev,
                          PaymentStatus: [],
                        }))
                      }
                    >
                      <Icon
                        name="close-circle-outline"
                        size={20}
                        color={colors.text}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Icon name="chevron-down" size={20} color={colors.text} />
                  )
                }
                {...dropdownThemeProps}
              />
            </ScrollView>

            <DatePicker
              modal
              open={openStartPicker}
              date={startDate || new Date()}
              mode="date"
              onConfirm={date => {
                setOpenStartPicker(false);
                setStartDate(date);
                setFilters({ ...filters, startDate: date });
              }}
              onCancel={() => setOpenStartPicker(false)}
            />

            <DatePicker
              modal
              open={openEndPicker}
              date={endDate || new Date()}
              mode="date"
              onConfirm={date => {
                setOpenEndPicker(false);
                setEndDate(date);
                setFilters({ ...filters, endDate: date });
              }}
              onCancel={() => setOpenEndPicker(false)}
            />

            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                <Text style={styles.applyText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* LIST */}

      <FlatList
        key={viewMode}
        data={invoices}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item, index) => String(item?.NonPOInvoiceId || index)}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator size="small" style={{ margin: 10 }} />
          ) : null
        }
        contentContainerStyle={{ padding: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    label: {
      fontSize: 13,
      marginBottom: 4,
      fontWeight: '600',
      color: colors.text,
    },

    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: colors.backdrop || 'rgba(0,0,0,0.35)',
    },

    modalCard: {
      maxHeight: '88%',
      borderRadius: 20,
      padding: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },

    selectedChip: {
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginRight: 6,
      backgroundColor: '#E3F2FD',
      flexDirection: 'row',
      alignItems: 'center',
    },

    selectedChipText: {
      fontSize: 12,
      color: '#000',
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    dropdown: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 10,
      minHeight: 45,
      marginBottom: 12,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },

    modalSubtitle: {
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 12,
      color: colors.text + 'AA',
    },

    modalCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },

    modalBody: {
      flexGrow: 0,
    },

    modalContent: {
      paddingBottom: 8,
    },

    dropdownPlaceholder: {
      color: colors.text + '88',
      fontSize: 14,
    },

    dropdownSelectedText: {
      color: colors.text,
      fontSize: 14,
    },

    dropdownSearchInput: {
      color: colors.text,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.background,
    },

    dropdownItemText: {
      color: colors.text,
      fontSize: 14,
    },

    dropdownMenu: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },

    selectedStyle: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      margin: 4,
    },

    footerButtons: {
      flexDirection: 'row',
      marginTop: 10,
    },

    resetBtn: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.background,
      alignItems: 'center',
      borderRadius: 12,
      marginRight: 5,
      borderColor: colors.border,
      borderWidth: 1,
    },

    resetText: {
      color: colors.text,
      fontWeight: '600',
    },

    applyBtn: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      borderRadius: 12,
      marginLeft: 5,
    },

    applyText: {
      color: '#fff',
      fontWeight: '600',
    },

    /*CARD + GRID STYLES */

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { fontSize: 16, opacity: 0.7 },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 12,
    },
    searchBtn: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: 'center',
    },
    searchText: { color: '#fff', marginLeft: 5 },
    toggleBtn: { padding: 6 },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
    invoiceNo: { fontWeight: '800', color: colors.primary },
    status: { fontSize: 12, paddingHorizontal: 6, borderRadius: 4 },
    draft: { backgroundColor: '#fde68a' },
    approved: { backgroundColor: '#bbf7d0' },
    row: { fontSize: 13, marginTop: 3, color: colors.text },
    footerRow: {
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    amount: { fontWeight: '800', color: colors.primary },
    created: { fontSize: 12, opacity: 0.6, color: colors.text },
    viewBtn: {
      marginTop: 10,
      backgroundColor: colors.primary,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    viewText: { color: '#fff', fontWeight: '700' },

    gridCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      margin: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    gridInvoice: { fontWeight: '800', color: colors.primary },
    gridVendor: { fontSize: 12, marginTop: 4, color: colors.text },
    gridAmount: { marginTop: 6, fontWeight: '700', color: colors.primary },
    gridStatus: {
      marginTop: 6,
      fontSize: 10,
      paddingHorizontal: 6,
      borderRadius: 4,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },

    dateInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      backgroundColor: colors.background,
    },

    dateText: {
      color: colors.text,
    },

    datePlaceholder: {
      color: colors.text + '66',
    },

    dateArrow: {
      marginHorizontal: 8,
      color: colors.text + '99',
      fontWeight: '600',
    },
  });
