import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MultiSelect } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {
  fetchMyNonPOVendorAdvances,
  fetchMyVendorAdvanceReferenceNumbers,
  fetchEntities,
  fetchOffices,
  fetchDepartments,
  fetchVendors,
  fetchUsers,
} from '../services/vendoradvance';

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  AdvanceReferenceNumber: [],
  Vendor: [],
  Entity: [],
  Office: [],
  Department: [],
  CreatedBy: [],
  Status: [],
  startDate: null,
  endDate: null,
};

const formatCurrency = value =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatDateValue = value =>
  value ? new Date(value).toLocaleDateString('en-IN') : '-';

const getStatusColors = (status, colors) => {
  switch (status) {
    case 'APPROVED':
      return {
        backgroundColor: (colors.success || '#16a34a') + '22',
        color: colors.success || '#16a34a',
      };
    case 'REJECTED':
      return {
        backgroundColor: '#ef444422',
        color: '#ef4444',
      };
    case 'DELETED':
      return {
        backgroundColor: '#64748b22',
        color: '#475569',
      };
    default:
      return {
        backgroundColor: (colors.warning || '#f59e0b') + '22',
        color: colors.warning || '#f59e0b',
      };
  }
};

export default function MyNonPOVendorAdvance({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [advances, setAdvances] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [advanceReferences, setAdvanceReferences] = useState([]);
  const [entities, setEntities] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

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

  const updateStatusOptions = useCallback(rows => {
    setStatusOptions(prev => {
      const previousValues = prev.map(item => item.value);
      const nextValues = [
        ...new Set([...previousValues, ...rows.map(item => item?.Status)]),
      ]
        .filter(Boolean)
        .map(status => ({ label: status, value: status }));
      return nextValues;
    });
  }, []);

  const loadAdvances = useCallback(
    async (appliedFilters = filters, pageNumber = 1, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const rows = await fetchMyNonPOVendorAdvances(
          appliedFilters,
          PAGE_SIZE,
          (pageNumber - 1) * PAGE_SIZE,
        );

        updateStatusOptions(rows);

        if (isLoadMore) {
          setAdvances(prev => [...prev, ...rows]);
        } else {
          setAdvances(rows);
        }

        setPage(pageNumber);
        setHasMore(rows.length === PAGE_SIZE);
      } catch (err) {
        console.log(
          'Fetch My Non-PO Vendor Advance Error:',
          err?.response || err,
        );

        if (!isLoadMore) {
          setAdvances([]);
        }

        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [filters, updateStatusOptions],
  );

  useEffect(() => {
    loadAdvances(INITIAL_FILTERS, 1, false);
  }, [loadAdvances]);

  const loadInitialFilterOptions = useCallback(async () => {
    try {
      const [
        referenceData,
        entityData,
        officeData,
        departmentData,
        vendorData,
        userData,
      ] = await Promise.all([
        fetchMyVendorAdvanceReferenceNumbers(),
        fetchEntities(),
        fetchOffices(),
        fetchDepartments(),
        fetchVendors(),
        fetchUsers(),
      ]);

      setAdvanceReferences(referenceData);
      setEntities(entityData);
      setOffices(officeData);
      setDepartments(departmentData);
      setVendors(vendorData);
      setUsers(userData);
    } catch (err) {
      console.log('Initial my vendor advance filter load error:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialFilterOptions();
  }, [loadInitialFilterOptions]);

  const searchAdvanceReferences = async text => {
    try {
      const data = await fetchMyVendorAdvanceReferenceNumbers(text);
      setAdvanceReferences(data);
    } catch (err) {
      console.log('Advance reference fetch error:', err);
    }
  };

  const searchEntity = async text => {
    try {
      const data = await fetchEntities(text);
      setEntities(data);
    } catch (err) {
      console.log('Entity fetch error:', err);
    }
  };

  const searchOffice = async text => {
    try {
      const data = await fetchOffices(text);
      setOffices(data);
    } catch (err) {
      console.log('Office fetch error:', err);
    }
  };

  const searchDepartment = async text => {
    try {
      const data = await fetchDepartments(text);
      setDepartments(data);
    } catch (err) {
      console.log('Department fetch error:', err);
    }
  };

  const searchVendor = async text => {
    try {
      const data = await fetchVendors(text);
      setVendors(data);
    } catch (err) {
      console.log('Vendor fetch error:', err);
    }
  };

  const searchUsers = async text => {
    try {
      const data = await fetchUsers(text);
      setUsers(data);
    } catch (err) {
      console.log('User fetch error:', err);
    }
  };

  const loadMore = () => {
    if (!hasMore || loading || loadingMore || refreshing) {
      return;
    }

    const nextPage = page + 1;
    loadAdvances(filters, nextPage, true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    loadAdvances(filters, 1, false);
  };

  const applyFilters = () => {
    setFilterOpen(false);
    setHasMore(true);
    loadAdvances(filters, 1, false);
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilters(INITIAL_FILTERS);
    setFilterOpen(false);
    setHasMore(true);
    setStatusOptions([]);
    loadAdvances(INITIAL_FILTERS, 1, false);
    loadInitialFilterOptions();
  };

  const renderFilterSelect = (
    label,
    placeholder,
    valueKey,
    data,
    extraProps = {},
  ) => (
    <View style={styles.filterField}>
      <Text style={styles.label}>{label}</Text>
      <MultiSelect
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={filters[valueKey]}
        onChange={items => setFilters(prev => ({ ...prev, [valueKey]: items }))}
        selectedStyle={styles.selectedChip}
        selectedTextStyle={styles.selectedChipText}
        search
        inside
        maxHeight={260}
        showsHorizontalScrollIndicator={false}
        renderRightIcon={() =>
          filters[valueKey]?.length ? (
            <TouchableOpacity
              onPress={() => setFilters(prev => ({ ...prev, [valueKey]: [] }))}
            >
              <Icon name="close-circle-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <Icon name="chevron-down" size={20} color={colors.text} />
          )
        }
        {...dropdownThemeProps}
        {...extraProps}
      />
    </View>
  );

  const renderListCard = item => {
    const statusColors = getStatusColors(item?.Status, colors);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() =>
          navigation.navigate('VendorAdvanceDetails', {
            advance: item,
            type: 'NON_PO',
          })
        }
      >
        <View style={styles.headerRow}>
          <Text style={[styles.invoiceNo, { color: colors.primary }]}> 
            {item?.AdvanceReferenceNumber || '-'}
          </Text>

          <Text style={[styles.status, statusColors]}>
            {item?.Status || '-'}
          </Text>
        </View>

        <Text style={[styles.row, { color: colors.text }]}> 
          Proforma Invoice: {item?.ProformaInvoiceNumber || '-'}
        </Text>

        <Text style={[styles.row, { color: colors.text }]}> 
          Entity: {item?.VaEntity?.Entity_Name || '-'}
        </Text>

        <Text style={[styles.row, { color: colors.text }]}> 
          Office: {item?.VaOffice?.OfficeName || '-'}
        </Text>

        <Text style={[styles.row, { color: colors.text }]}> 
          Department: {item?.VaDepartment?.DepartmentName || '-'}
        </Text>

        <Text style={[styles.row, { color: colors.text }]}> 
          Vendor: {item?.VaVendor?.Vendor_Name || '-'}
        </Text>

        <View style={styles.footerRow}>
          <Text style={[styles.amount, { color: colors.text }]}> 
            {formatCurrency(item?.TotalPayableAmount)}
          </Text>

          <Text style={[styles.created, { color: colors.text + '99' }]}> 
            {(item?.Creater?.UserName || '-') +
              ' | ' +
              formatDateValue(item?.createdAt)}
          </Text>
        </View>

        <View style={[styles.viewBtn, { backgroundColor: colors.primary }]}> 
          <Text style={styles.viewText}>View Details</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGridCard = item => {
    const statusColors = getStatusColors(item?.Status, colors);

    return (
      <TouchableOpacity
        style={[
          styles.gridCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() =>
          navigation.navigate('VendorAdvanceDetails', {
            advance: item,
            type: 'NON_PO',
          })
        }
      >
        <View style={styles.gridHeader}>
          <View style={styles.gridHeaderSpacer} />
          <Text style={[styles.gridStatus, statusColors]} numberOfLines={1}>
            {item?.Status || '-'}
          </Text>
        </View>

        <Text
          style={[styles.gridInvoice, { color: colors.primary }]}
          numberOfLines={1}
        >
          {item?.AdvanceReferenceNumber || '-'}
        </Text>

        <Text style={[styles.gridMeta, { color: colors.text }]} numberOfLines={1}>
          {item?.VaVendor?.Vendor_Name || '-'}
        </Text>

        <Text style={[styles.gridMeta, { color: colors.text }]} numberOfLines={1}>
          {item?.VaEntity?.Entity_Name || '-'}
        </Text>

        <Text style={[styles.gridAmount, { color: colors.text }]}>
          {formatCurrency(item?.TotalPayableAmount)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) =>
    viewMode === 'list' ? renderListCard(item) : renderGridCard(item);

  if (loading && !advances.length) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: colors.primary }]}
          onPress={() => setFilterOpen(true)}
        >
          <Icon name="magnify" size={20} color="#fff" />
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setViewMode(prev => (prev === 'list' ? 'grid' : 'list'))}
        >
          <Icon
            name={viewMode === 'list' ? 'view-grid' : 'view-list'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

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
              <Text style={styles.modalTitle}>Search</Text>
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
              <View style={styles.filterStack}>
                {renderFilterSelect(
                  'Advance Reference #',
                  'Select Advance Reference #',
                  'AdvanceReferenceNumber',
                  advanceReferences,
                  {
                    onChangeText: searchAdvanceReferences,
                    searchPlaceholder: 'Search Advance Reference #',
                  },
                )}
                {renderFilterSelect('Vendor', 'Select Vendor', 'Vendor', vendors, {
                  onChangeText: searchVendor,
                  searchPlaceholder: 'Select Vendor',
                })}
                {renderFilterSelect('Entity', 'Select Entity', 'Entity', entities, {
                  onChangeText: searchEntity,
                  searchPlaceholder: 'Select Entity',
                })}
                {renderFilterSelect('Office', 'Select Office', 'Office', offices, {
                  onChangeText: searchOffice,
                  searchPlaceholder: 'Select Office',
                })}
                {renderFilterSelect(
                  'Department',
                  'Select Department',
                  'Department',
                  departments,
                  {
                    onChangeText: searchDepartment,
                    searchPlaceholder: 'Select Department',
                  },
                )}

                <View style={styles.filterField}>
                  <Text style={styles.label}>Created Date</Text>
                  <TouchableOpacity
                    style={styles.dateRangeInput}
                    onPress={() => setOpenStartPicker(true)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !startDate && !endDate ? styles.datePlaceholder : null,
                      ]}
                    >
                      {startDate ? formatDateValue(startDate) : 'Start date'}
                      {'   ->   '}
                      {endDate ? formatDateValue(endDate) : 'End date'}
                    </Text>
                    <Icon
                      name="calendar-month-outline"
                      size={18}
                      color={colors.text + '88'}
                    />
                  </TouchableOpacity>
                </View>

                {renderFilterSelect(
                  'Submitted By',
                  'Select User',
                  'CreatedBy',
                  users,
                  {
                    onChangeText: searchUsers,
                    searchPlaceholder: 'Select User',
                  },
                )}
                {renderFilterSelect('Status', 'Select Status', 'Status', statusOptions)}
              </View>
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
                if (!endDate) {
                  setOpenEndPicker(true);
                }
              }}
              onCancel={() => setOpenStartPicker(false)}
            />

            <DatePicker
              modal
              open={openEndPicker}
              date={endDate || startDate || new Date()}
              minimumDate={startDate || undefined}
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

      <FlatList
        key={viewMode}
        data={advances}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item, index) =>
          String(item?.AdvanceId || item?.id || item?.AdvanceReferenceNumber || index)
        }
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={[styles.empty, { color: colors.text + '99' }]}> 
              No Non-PO Vendor Advances found.
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.footerLoader}
            />
          ) : null
        }
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyWrap: {
      flex: 1,
      paddingTop: 80,
      alignItems: 'center',
    },
    empty: {
      fontSize: 16,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    searchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    searchText: {
      color: '#fff',
      marginLeft: 5,
      fontWeight: '600',
    },
    toggleBtn: {
      padding: 6,
    },
    listContent: {
      paddingHorizontal: 12,
      paddingBottom: 16,
      flexGrow: 1,
    },
    gridRow: {
      gap: 12,
    },
    footerLoader: {
      marginVertical: 10,
    },
    card: {
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
      alignItems: 'flex-start',
      gap: 12,
    },
    invoiceNo: {
      flex: 1,
      fontSize: 14,
      fontWeight: '800',
    },
    status: {
      fontSize: 12,
      fontWeight: '700',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      overflow: 'hidden',
    },
    row: {
      fontSize: 13,
      marginTop: 2,
    },
    footerRow: {
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
    amount: {
      fontSize: 16,
      fontWeight: '800',
      flexShrink: 0,
    },
    created: {
      fontSize: 12,
      flex: 1,
      textAlign: 'right',
    },
    viewBtn: {
      marginTop: 10,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    viewText: {
      color: '#fff',
      fontWeight: '700',
    },
    gridCard: {
      flex: 1,
      minHeight: 116,
      borderRadius: 12,
      padding: 10,
      marginBottom: 12,
      borderWidth: 1,
      justifyContent: 'flex-start',
    },
    gridHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    gridHeaderSpacer: {
      flex: 1,
    },
    gridInvoice: {
      fontWeight: '800',
      fontSize: 13,
      lineHeight: 18,
    },
    gridMeta: {
      marginTop: 3,
      fontSize: 12,
      lineHeight: 16,
    },
    gridAmount: {
      marginTop: 7,
      fontWeight: '800',
      fontSize: 14,
    },
    gridStatus: {
      alignSelf: 'flex-end',
      fontSize: 10,
      fontWeight: '700',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      overflow: 'hidden',
      maxWidth: '58%',
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
      elevation: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
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
    filterStack: {
      width: '100%',
    },
    filterField: {
      width: '100%',
      marginBottom: 12,
    },
    label: {
      fontSize: 13,
      marginBottom: 4,
      fontWeight: '600',
      color: colors.text,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 10,
      minHeight: 46,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
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
    dateRangeInput: {
      minHeight: 46,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateText: {
      flex: 1,
      color: colors.text,
      fontSize: 13,
      marginRight: 8,
    },
    datePlaceholder: {
      color: colors.text + '66',
    },
    footerButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
    },
    resetBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: colors.background,
      alignItems: 'center',
      borderRadius: 10,
      marginRight: 10,
      borderColor: colors.border,
      borderWidth: 1,
    },
    resetText: {
      color: colors.text,
      fontWeight: '600',
    },
    applyBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      backgroundColor: '#b07d7d',
      alignItems: 'center',
      borderRadius: 10,
    },
    applyText: {
      color: '#fff',
      fontWeight: '700',
    },
  });
