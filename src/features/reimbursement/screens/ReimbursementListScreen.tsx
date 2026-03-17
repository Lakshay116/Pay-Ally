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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { MultiSelect } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import {
  fetchAllReimbursements,
  fetchMyReimbursements,
  fetchReimbursementIds,
  fetchEntities,
  fetchOffices,
  fetchDepartments,
  fetchUsers,
} from '../services/reimbursement';

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  ReimbursementId: [],
  Entity: [],
  Office: [],
  Department: [],
  CreatedBy: [],
  Status: [],
  startDate: null,
  endDate: null,
};

const STATUS_OPTIONS = [
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Pending for Approval', value: 'PENDING_FOR_APPROVAL' },
  { label: 'Sent for Revision', value: 'DISAPPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Drafted', value: 'DRAFTED' },
];

const formatDateValue = (value: any) =>
  value ? new Date(value).toLocaleDateString('en-IN') : '-';

const getStatusColors = (status: string, colors: any) => {
  switch (status) {
    case 'APPROVED':
      return {
        backgroundColor: (colors.success || '#16a34a') + '22',
        color: colors.success || '#16a34a',
      };
    case 'REJECTED':
    case 'DECLINED':
      return {
        backgroundColor: '#ef444422',
        color: '#ef4444',
      };
    default:
      return {
        backgroundColor: (colors.warning || '#f59e0b') + '22',
        color: colors.warning || '#f59e0b',
      };
  }
};

const getStatusValue = (item: any) =>
  item?.ReimbursementItems?.[0]?.Status ??
  item?.ReimbursementItems?.[0]?.status ??
  item?.Status ??
  item?.status ??
  '';

const formatStatusLabel = (status: string) => {
  if (status === 'DISAPPROVED') return 'Sent for Revision';
  if (status === 'PENDING_FOR_APPROVAL') return 'Pending for Approval';
  return status;
};

const getAmount = (item: any) => {
  const items = Array.isArray(item?.ReimbursementItems) ? item.ReimbursementItems : [];
  if (!items.length) {
    return Number(item?.TotalAmount || 0);
  }
  return items.reduce((sum: number, row: any) => {
    return sum + Number(row?.TotalAmount || row?.BaseAmount || 0);
  }, 0);
};

const formatCurrency = (item: any, amount: number) => {
  const format = item?.CurrencyData?.CurrencyFormat || 'en-IN';
  const symbol = item?.CurrencyData?.CurrencySymbol || 'Rs.';
  return `${symbol} ${Number(amount || 0).toLocaleString(format)}`;
};

export default function ReimbursementListScreen({ scope }: { scope: 'my' | 'all' }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [reimbursementIds, setReimbursementIds] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>(STATUS_OPTIONS);

  const { colors } = useTheme();
  const navigation = useNavigation<any>();
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

  const updateStatusOptions = useCallback((data: any[]) => {
    setStatusOptions(prev => {
      const base = prev.length ? prev : STATUS_OPTIONS;
      const existingValues = base.map(item => item.value);
      const discovered = data
        .map(item => getStatusValue(item))
        .filter(status => status !== undefined && status !== null)
        .filter(status => !existingValues.includes(status))
        .map(status => ({ label: String(status), value: status }));
      return [...base, ...discovered];
    });
  }, []);

  const loadRows = useCallback(
    async (appliedFilters = filters, pageNumber = 1, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const service = scope === 'my' ? fetchMyReimbursements : fetchAllReimbursements;
        const { rows: data } = await service(
          appliedFilters,
          PAGE_SIZE,
          (pageNumber - 1) * PAGE_SIZE,
        );

        updateStatusOptions(data);

        if (isLoadMore) {
          setRows(prev => [...prev, ...data]);
        } else {
          setRows(data);
        }

        setPage(pageNumber);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.log('Reimbursement fetch error:', err);
        if (!isLoadMore) {
          setRows([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [filters, scope, updateStatusOptions],
  );

  useEffect(() => {
    loadRows(INITIAL_FILTERS, 1, false);
  }, [loadRows]);

  const loadInitialFilterOptions = useCallback(async () => {
    try {
      const [idData, entityData, officeData, departmentData, userData] =
        await Promise.all([
          fetchReimbursementIds(),
          fetchEntities(),
          fetchOffices(),
          fetchDepartments(),
          fetchUsers(),
        ]);
      setReimbursementIds(idData);
      setEntities(entityData);
      setOffices(officeData);
      setDepartments(departmentData);
      setUsers(userData);
    } catch (err) {
      console.log('Reimbursement filter load error:', err);
    }
  }, []);

  useEffect(() => {
    loadInitialFilterOptions();
  }, [loadInitialFilterOptions]);

  const searchEntity = async (text: string) => {
    try {
      const data = await fetchEntities(text);
      setEntities(data);
    } catch (err) {
      console.log('Entity fetch error:', err);
    }
  };

  const searchOffice = async (text: string) => {
    try {
      const data = await fetchOffices(text);
      setOffices(data);
    } catch (err) {
      console.log('Office fetch error:', err);
    }
  };

  const searchDepartment = async (text: string) => {
    try {
      const data = await fetchDepartments(text);
      setDepartments(data);
    } catch (err) {
      console.log('Department fetch error:', err);
    }
  };

  const searchUsers = async (text: string) => {
    try {
      const data = await fetchUsers(text);
      setUsers(data);
    } catch (err) {
      console.log('User fetch error:', err);
    }
  };

  const searchReimbursementIds = async (text: string) => {
    try {
      const data = await fetchReimbursementIds(text);
      setReimbursementIds(data);
    } catch (err) {
      console.log('Reimbursement id fetch error:', err);
    }
  };

  const loadMore = () => {
    if (!hasMore || loading || loadingMore || refreshing) {
      return;
    }
    const nextPage = page + 1;
    loadRows(filters, nextPage, true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    loadRows(filters, 1, false);
  };

  const applyFilters = () => {
    setFilterOpen(false);
    setHasMore(true);
    loadRows(filters, 1, false);
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setFilters(INITIAL_FILTERS);
    setFilterOpen(false);
    setHasMore(true);
    setStatusOptions([]);
    loadRows(INITIAL_FILTERS, 1, false);
    loadInitialFilterOptions();
  };

  const renderFilterSelect = (
    label: string,
    placeholder: string,
    valueKey: keyof typeof INITIAL_FILTERS,
    data: any[],
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
        value={(filters as any)[valueKey]}
        onChange={items => setFilters(prev => ({ ...prev, [valueKey]: items }))}
        selectedStyle={styles.selectedChip}
        selectedTextStyle={styles.selectedChipText}
        search
        inside
        maxHeight={260}
        showsHorizontalScrollIndicator={false}
        renderRightIcon={() =>
          (filters as any)[valueKey]?.length ? (
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

  const openDetails = (item: any) => {
    navigation.navigate('ReimbursementDetails', { reimbursement: item });
  };

  const renderListCard = (item: any) => {
    const statusValue = getStatusValue(item);
    const statusColors = getStatusColors(statusValue, colors);
    const statusLabel = formatStatusLabel(statusValue);
    const amount = getAmount(item);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => openDetails(item)}
        activeOpacity={0.85}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.invoiceNo, { color: colors.primary }]}>
            {item?.ReimbursementId || '-'}
          </Text>
          <Text style={[styles.status, statusColors]}>
            {statusLabel || '-'}
          </Text>
        </View>

        <Text style={[styles.row, { color: colors.text }]}>
          Entity: {item?.EntityData?.Entity_Name || '-'}
        </Text>
        <Text style={[styles.row, { color: colors.text }]}>
          Office: {item?.OfficeData?.OfficeName || '-'}
        </Text>
        <Text style={[styles.row, { color: colors.text }]}>
          Department: {item?.DepartmentData?.DepartmentName || '-'}
        </Text>

        <View style={styles.footerRow}>
          <Text style={[styles.amount, { color: colors.text }]}>
            {formatCurrency(item, amount)}
          </Text>
          <Text style={[styles.created, { color: colors.text + '99' }]}>
            {(item?.Creator?.UserName || '-') +
              ' | ' +
              formatDateValue(item?.createdAt)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.viewBtn, { backgroundColor: colors.primary }]}
          onPress={() => openDetails(item)}
        >
          <Text style={styles.viewText}>View Details</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderGridCard = (item: any) => {
    const statusValue = getStatusValue(item);
    const statusColors = getStatusColors(statusValue, colors);
    const statusLabel = formatStatusLabel(statusValue);
    const amount = getAmount(item);

    return (
      <TouchableOpacity
        style={[
          styles.gridCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => openDetails(item)}
        activeOpacity={0.85}
      >
        <View style={styles.gridHeader}>
          <View style={styles.gridHeaderSpacer} />
          <Text style={[styles.gridStatus, statusColors]} numberOfLines={1}>
            {statusLabel || '-'}
          </Text>
        </View>

        <Text
          style={[styles.gridInvoice, { color: colors.primary }]}
          numberOfLines={1}
        >
          {item?.ReimbursementId || '-'}
        </Text>

        <Text style={[styles.gridMeta, { color: colors.text }]} numberOfLines={1}>
          {item?.Creator?.UserName || '-'}
        </Text>

        <Text style={[styles.gridAmount, { color: colors.text }]}>
          {formatCurrency(item, amount)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: any }) =>
    viewMode === 'list' ? renderListCard(item) : renderGridCard(item);

  if (loading && !rows.length) {
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
        <Pressable style={styles.modalOverlay} onPress={() => setFilterOpen(false)}>
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
                  'Reimbursement #',
                  'Select Reimbursement #',
                  'ReimbursementId',
                  reimbursementIds,
                  {
                    onChangeText: searchReimbursementIds,
                    searchPlaceholder: 'Select Reimbursement #',
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

                {renderFilterSelect('Submitted By', 'Select User', 'CreatedBy', users, {
                  onChangeText: searchUsers,
                  searchPlaceholder: 'Select User',
                })}
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
        data={rows}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item, index) =>
          String(item?.ReimbursementId || item?.id || index)
        }
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={[styles.empty, { color: colors.text + '99' }]}>
              No Reimbursements found.
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

const makeStyles = (colors: any) =>
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
