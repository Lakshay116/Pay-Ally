// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import { useTheme } from 'react-native-paper';
// import api from '../../../utils/api';
// // import InvoiceFilterModal from '../../components/InvoiceFilterModal';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// export default function AllPOInvoice({ navigation }) {
//   const { colors } = useTheme();

//   const styles = makeStyles(colors);

//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [invoices, setInvoices] = useState([]);
//   const [filterOpen, setFilterOpen] = useState(false);

//   const [filters, setFilters] = useState({
//     poInvoiceNo: '',
//     invoiceNo: '',
//     poNumber: '',
//     grn: '',
//     vendor: '',
//     entity: '',
//     office: '',
//     department: '',
//     uploadedBy: '',
//     status: '',
//     paymentStatus: '',
//     showDeleted: 'No',
//   });

//   useEffect(() => {
//     fetchAllPOInvoices();
//   }, []);

//   const fetchAllPOInvoices = async () => {
//     try {
//       const res = await api.post('/invoice/getAll');
//       // console.log(res?.data?.data?.rows);

//       setInvoices(res?.data?.data?.rows || []);
//     } catch (err) {
//       console.log('Fetch All PO Invoice Error:', err?.response || err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchAllPOInvoices();
//   }, []);

//   const renderItem = ({ item }) => {
//     const amount =
//       item?.InvoiceItems?.reduce(
//         (sum, p) => sum + Number(p.TotalPayableAmount || 0),
//         0,
//       ) || 0;

//     return (
//       <TouchableOpacity style={styles.card}>
//         <View style={styles.headerRow}>
//           <Text style={styles.invoiceNo}>{item.Invoice_Number}</Text>
//           <Text
//             style={[
//               styles.status,
//               item.Status === 'DRAFTED' ? styles.draft : styles.approved,
//             ]}
//           >
//             {item.Status}
//           </Text>
//         </View>

//         <Text style={styles.row}>
//           Invoice No: {item.POInvoiceReferenceNumber || '—'}
//         </Text>
//         <Text style={styles.row}>
//           Entity: {item?.POData?.POEntity?.Entity_Name || '—'}
//         </Text>
//         <Text style={styles.row}>
//           Office: {item?.POData?.POOffice?.OfficeName || '—'}
//         </Text>
//         <Text style={styles.row}>
//           Department: {item?.POData?.PODepartment?.DepartmentName || '—'}
//         </Text>
//         <Text style={styles.row}>
//           Vendor: {item?.POData?.POVendor?.Vendor_Name || '—'}
//         </Text>

//         <View style={styles.footerRow}>
//           <Text style={styles.amount}>₹ {amount.toLocaleString('en-IN')}</Text>
//           <Text style={styles.created}>
//             {item?.Creater?.FirstName} {item?.Creater?.LastName} ·{' '}
//             {new Date(item.createdAt).toLocaleDateString('en-IN')}
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={styles.viewBtn}
//           onPress={() =>
//             navigation.navigate('POInvoiceDetails', { invoice: item })
//           }
//         >
//           <Text style={styles.viewText}>View Details</Text>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#7f1d1d" />
//       </View>
//     );
//   }

//   if (!invoices.length) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.empty}>No PO Invoices found</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={invoices}
//       keyExtractor={(item, index) =>
//         String(item?.Invoice_Id || item?.id || index)
//       }
//       renderItem={renderItem}
//       contentContainerStyle={{ padding: 12 }}
//     />
//   );
// }

// const makeStyles = colors =>
//   StyleSheet.create({
//     center: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: colors.background,
//     },

//     empty: {
//       fontSize: 16,
//       color: colors.text,
//       opacity: 0.7,
//     },

//     card: {
//       backgroundColor: colors.surface,
//       borderRadius: 14,
//       padding: 14,
//       marginBottom: 12,
//       elevation: 0,
//       borderWidth: 1,
//       borderColor: colors.border,
//     },

//     headerRow: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       marginBottom: 6,
//     },

//     invoiceNo: {
//       fontSize: 14,
//       fontWeight: '800',
//       color: colors.primary,
//     },

//     status: {
//       fontSize: 12,
//       fontWeight: '700',
//       paddingHorizontal: 8,
//       paddingVertical: 2,
//       borderRadius: 6,
//       overflow: 'hidden',
//     },

//     draft: {
//       backgroundColor: '#fde68a',
//       color: '#92400e',
//     },

//     approved: {
//       backgroundColor: '#bbf7d0',
//       color: '#166534',
//     },

//     row: {
//       fontSize: 13,
//       color: colors.text,
//       marginTop: 2,
//       opacity: 0.9,
//     },

//     footerRow: {
//       marginTop: 8,
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     },

//     amount: {
//       fontSize: 16,
//       fontWeight: '800',
//       color: colors.primary,
//     },

//     created: {
//       fontSize: 12,
//       color: colors.text,
//       opacity: 0.6,
//     },

//     viewBtn: {
//       marginTop: 10,
//       backgroundColor: colors.primary,
//       paddingVertical: 8,
//       borderRadius: 8,
//       alignItems: 'center',
//     },

//     viewText: {
//       color: '#fff',
//       fontWeight: '700',
//     },
//   });

import React, { useEffect, useState } from 'react';
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
  TextInput,
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
  fetchUsers,
} from '../services/NonPOInvoices';
import {
  fetchPOInvoiceNumbers,
  fetchPurchaseOrders,
  fetchSrnGrn,
  fetchInvoiceReferenceNumbers,
} from '../services/POInvoices';

export default function AllPOInvoice({ navigation }) {
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // list | grid
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

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
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState([]);
  const [filteredSrnGrn, setFilteredSrnGrn] = useState([]);
  const [filteredInvoiceReferences, setFilteredInvoiceReferences] = useState(
    [],
  );
  const [filteredPOInvoices, setFilteredPOInvoices] = useState([]);

  const [filters, setFilters] = useState({
    poInvoiceNo: [],
    invoiceNo: [],
    poNumber: [],
    grn: [],
    Entity: [],
    Office: [],
    Department: [],
    Vendor: [],
    CreatedBy: [],
    Status: [],
    PaymentStatus: [],
    startDate: null,
    endDate: null,
  });
  const limit = 10;

  const statusOptions = [
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Pending for Approval', value: 'PENDING_FOR_APPROVAL' },
    { label: 'Sent for Revision', value: 'REVISION' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Drafted', value: 'DRAFTED' },
    { label: 'Pending for Acceptance', value: 'PENDING_FOR_ACCEPTANCE' },
  ];

  const paymentStatusOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'Partly Paid', value: 'Partly Paid' },
    { label: 'Paid', value: 'Paid' },
  ];

  useEffect(() => {
    fetchAllPOInvoices(filters, 1);
    fetchEntities();
  }, []);

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

  const searchEntity = text => {
    if (!text) {
      setFilteredEntities(entities);
      return;
    }

    setFilteredEntities(
      entities.filter(item =>
        item.label.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  const searchOffice = async text => {
    try {
      const data = await fetchOffices(text);
      setOffices(data);
      setFilteredOffices(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('Office fetch error', err);
    }
  };

  const searchPurchaseOrderNumber = async text => {
    try {
      const data = await fetchPurchaseOrders(text);
      setFilteredPurchaseOrders(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('Purchase order fetch error', err);
    }
  };

  const searchPOInvoiceNumbers = async text => {
    try {
      const data = await fetchPOInvoiceNumbers(text);
      setFilteredPOInvoices(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('PO invoice fetch error', err);
    }
  };

  const searchDepartment = async text => {
    try {
      const data = await fetchDepartments(text);
      setDepartments(data);
      setFilteredDepartments(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('Department fetch error', err);
    }
  };

  const searchInvoiceReferences = async text => {
    try {
      const data = await fetchInvoiceReferenceNumbers(text);
      setFilteredInvoiceReferences(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('Invoice reference fetch error', err);
    }
  };

  const searchSrnGrn = async text => {
    try {
      const data = await fetchSrnGrn(text);
      setFilteredSrnGrn(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('SRN/GRN fetch error', err);
    }
  };

  const searchVendor = async text => {
    try {
      const data = await fetchVendors(text);
      setVendors(data);
      setFilteredVendors(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('Vendor fetch error', err);
    }
  };

  const searchUsers = async text => {
    try {
      const data = await fetchUsers(text);
      setUsers(data);
      setFilteredUsers(
        text
          ? data.filter(item =>
              item.label.toLowerCase().includes(text.toLowerCase()),
            )
          : data,
      );
    } catch (err) {
      console.log('User fetch error', err);
    }
  };

  const fetchAllPOInvoices = async (
    appliedFilters = filters,
    pageNumber = 1,
    isLoadMore = false,
  ) => {
    try {
      const res = await api.post('/invoice/getAll', {
        limit,
        offset: (pageNumber - 1) * limit,
        invoice: appliedFilters.poInvoiceNo?.length
          ? appliedFilters.poInvoiceNo
          : [],
        invoiceReferenceNumber: appliedFilters.invoiceNo?.length
          ? appliedFilters.invoiceNo
          : [],
        purchaseOrder: appliedFilters.poNumber?.length
          ? appliedFilters.poNumber
          : [],
        srn__grn: appliedFilters.grn?.length ? appliedFilters.grn : [],
        entity: appliedFilters.Entity?.length ? appliedFilters.Entity : [],
        office: appliedFilters.Office?.length ? appliedFilters.Office : [],
        department: appliedFilters.Department?.length
          ? appliedFilters.Department
          : [],
        vendor: appliedFilters.Vendor?.length ? appliedFilters.Vendor : [],
        user: appliedFilters.CreatedBy?.length ? appliedFilters.CreatedBy : [],
        status: appliedFilters.Status?.length ? appliedFilters.Status : null,
        paymentStatus: appliedFilters.PaymentStatus?.length
          ? appliedFilters.PaymentStatus
          : null,
        paymentStartDate: appliedFilters.startDate,
        paymentEndDate: appliedFilters.endDate,
      });

      const newInvoices = res?.data?.data?.rows || [];

      setInvoices(prev =>
        isLoadMore ? [...prev, ...newInvoices] : newInvoices,
      );
      setHasMore(newInvoices.length === limit);
    } catch (err) {
      console.log('Fetch All PO Invoice Error:', err?.response || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (loading || loadingMore || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchAllPOInvoices(filters, nextPage, true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchAllPOInvoices(filters, 1);
  };

  const applyFilters = () => {
    setFilterOpen(false);
    setLoading(true);
    setPage(1);
    setHasMore(true);
    fetchAllPOInvoices(filters, 1);
  };

  const resetFilters = () => {
    const emptyFilters = {
      poInvoiceNo: [],
      invoiceNo: [],
      poNumber: [],
      grn: [],
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

    setStartDate(null);
    setEndDate(null);
    setFilters(emptyFilters);
    setFilterOpen(false);
    setLoading(true);
    setPage(1);
    setHasMore(true);
    fetchAllPOInvoices(emptyFilters, 1);
  };

  const renderItem = ({ item }) => {
    return viewMode === 'list' ? renderListCard(item) : renderGridCard(item);
  };

  const getAmount = item =>
    item?.InvoiceItems?.reduce(
      (sum, p) => sum + Number(p.TotalPayableAmount || 0),
      0,
    ) || 0;

  const renderListCard = item => {
    const amount = getAmount(item);
    const creatorName = [item?.Creater?.FirstName, item?.Creater?.LastName]
      .filter(Boolean)
      .join(' ');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('POInvoiceDetails', { invoice: item })
        }
      >
        <View style={styles.headerRow}>
          <Text style={styles.invoiceNo}>{item.Invoice_Number}</Text>

          <Text
            style={[
              styles.status,
              item.Status === 'DRAFTED' ? styles.draft : styles.approved,
            ]}
          >
            {item.Status}
          </Text>
        </View>

        <Text style={styles.row}>
          Invoice No: {item?.POInvoiceReferenceNumber || '-'}
        </Text>

        <Text style={styles.row}>
          Vendor: {item?.POData?.POVendor?.Vendor_Name || '—'}
        </Text>

        <Text style={styles.row}>
          Entity: {item?.POData?.POEntity?.Entity_Name || '—'}
        </Text>

        <Text style={styles.row}>
          Office: {item?.POData?.POOffice?.OfficeName || '—'}
        </Text>

        <Text style={styles.row}>
          Department: {item?.POData?.PODepartment?.DepartmentName || '-'}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.amount}>₹ {amount.toLocaleString('en-IN')}</Text>

          <Text style={styles.created}>
            {creatorName ? `${creatorName} - ` : ''}
            {new Date(item.createdAt).toLocaleDateString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() =>
            navigation.navigate('POInvoiceDetails', { invoice: item })
          }
        >
          <Text style={styles.viewText}>View Details</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderGridCard = item => {
    const amount = getAmount(item);

    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={() =>
          navigation.navigate('POInvoiceDetails', { invoice: item })
        }
      >
        <Text style={styles.gridInvoice}>{item.Invoice_Number}</Text>

        <Text style={styles.gridVendor} numberOfLines={1}>
          {item?.POData?.POVendor?.Vendor_Name || '—'}
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
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => setFilterOpen(true)}
        >
          <Icon name="filter-variant" size={18} color="#fff" />
          <Text style={styles.searchText}>Filter</Text>
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

      <FlatList
        key={viewMode}
        data={invoices}
        numColumns={viewMode === 'grid' ? 2 : 1}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          String(item?.Invoice_Id || item?.id || index)
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" style={{ margin: 10 }} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.empty}>No PO Invoices found</Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          !invoices.length && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

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
              <Text style={styles.label}>PO Invoice #</Text>
              <MultiSelect
                style={styles.dropdown}
                data={filteredPOInvoices}
                labelField="label"
                valueField="value"
                placeholder="Search PO Invoice #"
                value={filters.poInvoiceNo}
                search
                searchPlaceholder="Type PO invoice number..."
                onChangeText={searchPOInvoiceNumbers}
                onChange={item =>
                  setFilters(prev => ({ ...prev, poInvoiceNo: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.poInvoiceNo?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, poInvoiceNo: [] }))
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
                data={filteredInvoiceReferences}
                labelField="label"
                valueField="value"
                placeholder="Search Invoice Number"
                value={filters.invoiceNo}
                search
                searchPlaceholder="Type invoice number..."
                onChangeText={searchInvoiceReferences}
                onChange={item =>
                  setFilters(prev => ({ ...prev, invoiceNo: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.invoiceNo?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, invoiceNo: [] }))
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

              <Text style={styles.label}>PO Number</Text>
              <MultiSelect
                style={styles.dropdown}
                data={filteredPurchaseOrders}
                labelField="label"
                valueField="value"
                placeholder="Search Purchase Order"
                value={filters.poNumber}
                search
                searchPlaceholder="Type PO number..."
                onChangeText={searchPurchaseOrderNumber}
                onChange={item =>
                  setFilters(prev => ({ ...prev, poNumber: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.poNumber?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, poNumber: [] }))
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

              <Text style={styles.label}>GRN</Text>
              <MultiSelect
                style={styles.dropdown}
                data={filteredSrnGrn}
                labelField="label"
                valueField="value"
                placeholder="Search SRN / GRN"
                value={filters.grn}
                search
                searchPlaceholder="Type SRN / GRN..."
                onChangeText={searchSrnGrn}
                onChange={item => setFilters(prev => ({ ...prev, grn: item }))}
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.grn?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, grn: [] }))
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
                searchPlaceholder="Search entity..."
                onChangeText={searchEntity}
                onChange={item =>
                  setFilters(prev => ({ ...prev, Entity: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Entity?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, Entity: [] }))
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
                value={filters.Office}
                search
                searchPlaceholder="Type office..."
                onChangeText={searchOffice}
                onChange={item =>
                  setFilters(prev => ({ ...prev, Office: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Office?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, Office: [] }))
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
                value={filters.Department}
                search
                searchPlaceholder="Type department..."
                onChangeText={searchDepartment}
                onChange={item =>
                  setFilters(prev => ({ ...prev, Department: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Department?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, Department: [] }))
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
                value={filters.Vendor}
                search
                searchPlaceholder="Type vendor name..."
                onChangeText={searchVendor}
                onChange={item =>
                  setFilters(prev => ({ ...prev, Vendor: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Vendor?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, Vendor: [] }))
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

              <Text style={styles.label}>Uploaded By</Text>
              <MultiSelect
                style={styles.dropdown}
                data={filteredUsers}
                labelField="label"
                valueField="value"
                placeholder="Search Created By"
                value={filters.CreatedBy}
                search
                searchPlaceholder="Type user name..."
                onChangeText={searchUsers}
                onChange={item =>
                  setFilters(prev => ({ ...prev, CreatedBy: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.CreatedBy?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, CreatedBy: [] }))
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

              <Text style={styles.label}>Payment Due Date</Text>
              <View style={styles.dateRow}>
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

              <Text style={styles.label}>Status</Text>
              <MultiSelect
                style={styles.dropdown}
                data={statusOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Status"
                value={filters.Status}
                onChange={item =>
                  setFilters(prev => ({ ...prev, Status: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.Status?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, Status: [] }))
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

              <Text style={styles.label}>Payment Status</Text>
              <MultiSelect
                style={styles.dropdown}
                data={paymentStatusOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Payment Status"
                value={filters.PaymentStatus}
                onChange={item =>
                  setFilters(prev => ({ ...prev, PaymentStatus: item }))
                }
                selectedStyle={styles.selectedChip}
                selectedTextStyle={styles.selectedChipText}
                inside
                maxHeight={300}
                showsHorizontalScrollIndicator={false}
                renderRightIcon={() =>
                  filters.PaymentStatus?.length ? (
                    <TouchableOpacity
                      onPress={() =>
                        setFilters(prev => ({ ...prev, PaymentStatus: [] }))
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
                setFilters(prev => ({ ...prev, startDate: date }));
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
                setFilters(prev => ({ ...prev, endDate: date }));
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
    </View>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },

    empty: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
    },

    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
    },

    listContent: {
      padding: 12,
    },

    emptyListContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },

    title: {
      fontSize: 18,
      fontWeight: '800',
    },

    searchBtn: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },

    searchText: {
      color: '#fff',
      marginLeft: 5,
      fontWeight: '600',
    },

    toggleBtn: {
      padding: 6,
    },

    label: {
      fontSize: 13,
      marginBottom: 4,
      fontWeight: '600',
      color: colors.text,
    },

    input: {
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
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

    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },

    invoiceNo: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.primary,
    },

    status: {
      fontSize: 11,
      fontWeight: '700',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      overflow: 'hidden',
    },

    draft: {
      backgroundColor: '#fde68a',
      color: '#92400e',
    },

    approved: {
      backgroundColor: '#bbf7d0',
      color: '#166534',
    },

    row: {
      fontSize: 13,
      color: colors.text,
      marginTop: 2,
      opacity: 0.9,
    },

    footerRow: {
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    amount: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primary,
    },

    created: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.6,
    },

    viewBtn: {
      marginTop: 10,
      backgroundColor: colors.primary,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },

    viewText: {
      color: '#fff',
      fontWeight: '700',
    },

    /* GRID CARDS */

    gridCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      margin: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },

    gridInvoice: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 4,
    },

    gridVendor: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 6,
    },

    gridAmount: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },

    gridStatus: {
      marginTop: 6,
      fontSize: 10,
      fontWeight: '700',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: 'flex-start',
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
