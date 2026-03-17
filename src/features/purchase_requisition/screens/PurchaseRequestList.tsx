import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MultiSelect } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {
  fetchAllPurchaseRequests,
  fetchMyPurchaseRequests,
  fetchPurchaseRequestDepartments,
  fetchPurchaseRequestEntities,
  fetchPurchaseRequestNumbers,
  fetchPurchaseRequestOffices,
  fetchPurchaseRequestStatuses,
  fetchPurchaseRequestUsers,
} from '../services/purchaseRequests';

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  PurchaseRequestNumber: [],
  Entity: [],
  Office: [],
  Department: [],
  CreatedBy: [],
  Status: [],
  startDate: null,
  endDate: null,
};

const formatDateValue = value =>
  value ? new Date(value).toLocaleDateString('en-IN') : '-';

const getCreatedByName = item => {
  const fullName = [item?.Creater?.FirstName, item?.Creater?.LastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || item?.Creater?.UserName || '-';
};

const getItemSummary = item => {
  const items = item?.ProductList || [];

  if (!items.length) {
    return '-';
  }

  if (items.length === 1) {
    return items[0]?.MasterProductData?.Name || items[0]?.Description || '1 Item';
  }

  return `${items.length} Items`;
};

const getTotalEstimatedSpend = item => {
  const total = (item?.ProductList || []).reduce(
    (sum, entry) => sum + Number(entry?.TotalEstimatedSpend || 0),
    0,
  );

  const currencySymbol = item?.PRCurrency?.CurrencySymbol || 'Rs.';
  return `${currencySymbol} ${total.toLocaleString('en-IN')}`;
};

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
    case 'DRAFTED':
      return {
        backgroundColor: '#94a3b822',
        color: '#475569',
      };
    default:
      return {
        backgroundColor: (colors.warning || '#f59e0b') + '22',
        color: colors.warning || '#f59e0b',
      };
  }
};

export default function PurchaseRequestList({ navigation, type = 'all' }) {
  const isMyRequests = type === 'my';
  const endpoint = isMyRequests
    ? '/purchaseRequest/getAllByUserId'
    : '/purchaseRequest/getAll';
  const fetchList = isMyRequests
    ? fetchMyPurchaseRequests
    : fetchAllPurchaseRequests;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [requestNumbers, setRequestNumbers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
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
      const nextValues = [...new Set([...previousValues, ...rows.map(item => item?.Status)])]
        .filter(Boolean)
        .map(status => ({ label: status, value: status }));

      return nextValues;
    });
  }, []);

  const loadRequests = useCallback(
    async (appliedFilters = filters, pageNumber = 1, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const rows = await fetchList(
          appliedFilters,
          PAGE_SIZE,
          (pageNumber - 1) * PAGE_SIZE,
        );

        updateStatusOptions(rows);

        if (isLoadMore) {
          setRequests(prev => [...prev, ...rows]);
        } else {
          setRequests(rows);
        }

        setPage(pageNumber);
        setHasMore(rows.length === PAGE_SIZE);
      } catch (err) {
        console.log('Fetch Purchase Requests Error:', err?.response || err);

        if (!isLoadMore) {
          setRequests([]);
        }

        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [fetchList, filters, updateStatusOptions],
  );

  useEffect(() => {
    loadRequests(INITIAL_FILTERS, 1, false);
  }, [loadRequests]);

  const loadInitialFilterOptions = useCallback(async () => {
    try {
      const [
        numberData,
        entityData,
        officeData,
        departmentData,
        userData,
        statusData,
      ] = await Promise.all([
        fetchPurchaseRequestNumbers(endpoint),
        fetchPurchaseRequestEntities(),
        fetchPurchaseRequestOffices(),
        fetchPurchaseRequestDepartments(),
        fetchPurchaseRequestUsers(),
        fetchPurchaseRequestStatuses(endpoint),
      ]);

      setRequestNumbers(numberData);
      setEntities(entityData);
      setOffices(officeData);
      setDepartments(departmentData);
      setUsers(userData);
      setStatusOptions(statusData);
    } catch (err) {
      console.log('Initial purchase request filter load error:', err);
    }
  }, [endpoint]);

  useEffect(() => {
    loadInitialFilterOptions();
  }, [loadInitialFilterOptions]);

  const searchRequestNumbers = async text => {
    try {
      const data = await fetchPurchaseRequestNumbers(endpoint, text);
      setRequestNumbers(data);
    } catch (err) {
      console.log('Purchase request number fetch error:', err);
    }
  };

  const searchEntity = async text => {
    try {
      const data = await fetchPurchaseRequestEntities(text);
      setEntities(data);
    } catch (err) {
      console.log('Entity fetch error:', err);
    }
  };

  const searchOffice = async text => {
    try {
      const data = await fetchPurchaseRequestOffices(text);
      setOffices(data);
    } catch (err) {
      console.log('Office fetch error:', err);
    }
  };

  const searchDepartment = async text => {
    try {
      const data = await fetchPurchaseRequestDepartments(text);
      setDepartments(data);
    } catch (err) {
      console.log('Department fetch error:', err);
    }
  };

  const searchUsers = async text => {
    try {
      const data = await fetchPurchaseRequestUsers(text);
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
    loadRequests(filters, nextPage, true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    loadRequests(filters, 1, false);
  };

  const applyFilters = () => {
    setFilterOpen(false);
    setHasMore(true);
    loadRequests(filters, 1, false);
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilters(INITIAL_FILTERS);
    setFilterOpen(false);
    setHasMore(true);
    setStatusOptions([]);
    loadRequests(INITIAL_FILTERS, 1, false);
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
          navigation.navigate('PurchaseRequestDetails', {
            purchaseRequest: item,
          })
        }
      >
        <View style={styles.headerRow}>
          <Text style={[styles.requestNo, { color: colors.primary }]}>
            {item?.Purchase_Request_Number || '-'}
          </Text>

          <Text style={[styles.status, statusColors]}>
            {item?.Status || '-'}
          </Text>
        </View>

        <Text style={[styles.row, { color: colors.text }]}>Entity: {item?.PREntity?.Entity_Name || '-'}</Text>
        <Text style={[styles.row, { color: colors.text }]}>Office Name: {item?.PROffice?.OfficeName || '-'}</Text>
        <Text style={[styles.row, { color: colors.text }]}>Department: {item?.PRDepartment?.DepartmentName || '-'}</Text>
        <Text style={[styles.row, { color: colors.text }]}>Items: {getItemSummary(item)}</Text>

        <View style={styles.footerRow}>
          <Text style={[styles.amount, { color: colors.text }]}>
            {getTotalEstimatedSpend(item)}
          </Text>

          <Text style={[styles.created, { color: colors.text + '99' }]}>
            {getCreatedByName(item)} | {formatDateValue(item?.createdAt)}
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
          navigation.navigate('PurchaseRequestDetails', {
            purchaseRequest: item,
          })
        }
      >
        <View style={styles.gridHeader}>
          <View style={styles.gridHeaderSpacer} />
          <Text style={[styles.gridStatus, statusColors]} numberOfLines={1}>
            {item?.Status || '-'}
          </Text>
        </View>

        <Text style={[styles.gridRequestNo, { color: colors.primary }]} numberOfLines={2}>
          {item?.Purchase_Request_Number || '-'}
        </Text>

        <Text style={[styles.gridMeta, { color: colors.text }]} numberOfLines={1}>
          {item?.PREntity?.Entity_Name || '-'}
        </Text>

        <Text style={[styles.gridMeta, { color: colors.text }]} numberOfLines={1}>
          {getItemSummary(item)}
        </Text>

        <Text style={[styles.gridAmount, { color: colors.text }]}> 
          {getTotalEstimatedSpend(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) =>
    viewMode === 'list' ? renderListCard(item) : renderGridCard(item);

  if (loading && !requests.length) {
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
                  'Purchase Request #',
                  'Select Purchase Request #',
                  'PurchaseRequestNumber',
                  requestNumbers,
                  {
                    onChangeText: searchRequestNumbers,
                    searchPlaceholder: 'Search Purchase Request #',
                  },
                )}
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
                {renderFilterSelect(
                  'Created By',
                  'Select User',
                  'CreatedBy',
                  users,
                  {
                    onChangeText: searchUsers,
                    searchPlaceholder: 'Select User',
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
        data={requests}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item, index) =>
          `${String(
            item?.PurchaseRequestId || item?.id || item?.Purchase_Request_Number || index,
          )}-${index}`
        }
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={[styles.empty, { color: colors.text + '99' }]}>
              No purchase requests found.
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
    requestNo: {
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
      minHeight: 138,
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
    gridRequestNo: {
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
