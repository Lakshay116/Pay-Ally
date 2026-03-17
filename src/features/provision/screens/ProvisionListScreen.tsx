import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import { MultiSelect } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  fetchAllProvisions,
  fetchDepartments,
  fetchEntities,
  fetchMyProvisions,
  fetchOffices,
  fetchUsers,
  fetchVendors,
  LookupOption,
} from '../services/provision';

const PAGE_SIZE = 10;

type RootStackParamList = {
  ProvisionDetails: { provision: any };
};

type Filters = {
  ProvisionNumber: string[];
  PurchaseOrderNumber: string[];
  Vendor: string[];
  Entity: string[];
  Office: string[];
  Department: string[];
  CreatedBy: string[];
  Status: string[];
  startDate: Date | null;
  endDate: Date | null;
};

type SelectFilterKey = Exclude<keyof Filters, 'startDate' | 'endDate'>;

const INITIAL_FILTERS: Filters = {
  ProvisionNumber: [],
  PurchaseOrderNumber: [],
  Vendor: [],
  Entity: [],
  Office: [],
  Department: [],
  CreatedBy: [],
  Status: [],
  startDate: null,
  endDate: null,
};

const formatCurrency = (value: number | string) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatDateValue = (value: string | number | Date | null) =>
  value ? new Date(value).toLocaleDateString('en-IN') : '-';

const getProvisionReference = (item: any) =>
  item?.ProvisionReferenceNumber ||
  item?.ProvisionReference ||
  item?.ProvisionNumber ||
  item?.ProvisionNo ||
  '-';

const getPurchaseOrderNumber = (item: any) =>
  item?.PurchaseOrderNumber ||
  item?.POData?.Purchase_Order_Number ||
  item?.PO?.Purchase_Order_Number ||
  item?.PO?.PurchaseOrderNumber ||
  '-';

const getVendorName = (item: any) =>
  item?.VendorData?.Vendor_Name || item?.VendorName || '-';

const getEntityName = (item: any) =>
  item?.EntityData?.Entity_Name || '-';

const getOfficeName = (item: any) =>
  item?.OfficeData?.OfficeName || '-';

const getDepartmentName = (item: any) =>
  item?.DepartmentData?.DepartmentName || '-';

const getCreatorName = (item: any) =>
  item?.Creator?.UserName ||
  `${item?.Creator?.FirstName || ''} ${item?.Creator?.LastName || ''}`.trim() ||
  '-';

const calculateProvisionAmount = (item: any) => {
  if (!item?.ProvisionItems?.length) {
    return Number(item?.TotalAmount || 0);
  }

  return item.ProvisionItems.reduce((sum: number, lineItem: any) => {
    const amount =
      Number(lineItem?.TotalPayableAmount) ||
      Number(lineItem?.TotalAmount) ||
      Number(lineItem?.TotalPrice) ||
      0;
    return sum + amount;
  }, 0);
};

const getStatusColors = (status: string | undefined, colors: any) => {
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
    case 'DRAFTED':
      return {
        backgroundColor: '#6b728022',
        color: '#374151',
      };
    default:
      return {
        backgroundColor: (colors.warning || '#f59e0b') + '22',
        color: colors.warning || '#f59e0b',
      };
  }
};

const createOptionsFromValues = (values: (string | undefined)[]) => {
  const seen = new Set<string>();
  return values.reduce<{ label: string; value: string }[]>((acc, value) => {
    if (!value) {
      return acc;
    }
    const normalized = String(value).trim();
    if (!normalized || seen.has(normalized)) {
      return acc;
    }
    seen.add(normalized);
    acc.push({ label: normalized, value: normalized });
    return acc;
  }, []);
};

const ProvisionListScreen = ({
  scope,
  type,
}: {
  scope: 'my' | 'all';
  type: 'po' | 'nonpo';
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const service = useMemo(
    () => (scope === 'my' ? fetchMyProvisions : fetchAllProvisions),
    [scope],
  );

  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isMomentumScrolling, setIsMomentumScrolling] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [entities, setEntities] = useState<LookupOption[]>([]);
  const [offices, setOffices] = useState<LookupOption[]>([]);
  const [departments, setDepartments] = useState<LookupOption[]>([]);
  const [vendors, setVendors] = useState<LookupOption[]>([]);
  const [users, setUsers] = useState<LookupOption[]>([]);

  const dropdownThemeProps = {
    placeholderStyle: styles.dropdownPlaceholder,
    selectedTextStyle: styles.dropdownSelectedText,
    inputSearchStyle: styles.dropdownSearchInput,
    itemTextStyle: styles.dropdownItemText,
    containerStyle: styles.dropdownMenu,
    selectedStyle: styles.selectedStyle,
    activeColor: colors.primary + '12',
  };

  const loadInitialFilterOptions = useCallback(async () => {
    try {
      const [entityData, officeData, departmentData, vendorData, userData] =
        await Promise.all([
          fetchEntities(),
          fetchOffices(),
          fetchDepartments(),
          fetchVendors(),
          fetchUsers(),
        ]);

      setEntities(entityData);
      setOffices(officeData);
      setDepartments(departmentData);
      setVendors(vendorData);
      setUsers(userData);
    } catch (err) {
      console.log('Provision filter load error:', err);
    }
  }, []);

  const searchEntities = async (text: string) => {
    try {
      const data = await fetchEntities(text);
      setEntities(data);
    } catch (err) {
      console.log('Entity fetch error:', err);
    }
  };

  const searchOffices = async (text: string) => {
    try {
      const data = await fetchOffices(text);
      setOffices(data);
    } catch (err) {
      console.log('Office fetch error:', err);
    }
  };

  const searchDepartments = async (text: string) => {
    try {
      const data = await fetchDepartments(text);
      setDepartments(data);
    } catch (err) {
      console.log('Department fetch error:', err);
    }
  };

  const searchVendors = async (text: string) => {
    try {
      const data = await fetchVendors(text);
      setVendors(data);
    } catch (err) {
      console.log('Vendor fetch error:', err);
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

  const fetchData = useCallback(
    async (nextPage = 1, append = false) => {
      try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const { rows, count } = await service(
        type === 'po' ? 'PO' : 'NON_PO',
        filters,
        PAGE_SIZE,
        (nextPage - 1) * PAGE_SIZE,
      );

      setData(prev => (append ? [...prev, ...rows] : rows));
      setPage(nextPage);
      setTotalCount(prev =>
        count !== null ? count : append ? prev + rows.length : rows.length,
      );
      const more =
        count !== null
          ? nextPage * PAGE_SIZE < count
          : rows.length === PAGE_SIZE;
      setHasMore(more);
      } catch (error) {
        console.log('Provision fetch error', error);
        if (!append) {
          setData([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [filters, service, type],
  );

  useEffect(() => {
    fetchData(1);
  }, [filters, fetchData]);

  useEffect(() => {
    loadInitialFilterOptions();
  }, [loadInitialFilterOptions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(1);
  };

  const loadMore = () => {
    if (!hasMore || loadingMore || loading) return;
    fetchData(page + 1, true);
  };

  const handleEndReached = () => {
    if (!isMomentumScrolling) return;
    loadMore();
  };

  const modalFilters: {
    key: SelectFilterKey;
    label: string;
    options: { label: string; value: string }[];
  }[] = [
    {
      key: 'ProvisionNumber',
      label: 'Provision #',
      options: createOptionsFromValues(data.map(item => getProvisionReference(item))),
    },
    ...(type === 'po'
      ? [
          {
            key: 'PurchaseOrderNumber' as const,
            label: 'Purchase Order #',
            options: createOptionsFromValues(
              data.map(item => getPurchaseOrderNumber(item)),
            ),
          },
        ]
        : []),
  ];

  const renderFilterSelect = ({
    label,
    valueKey,
    options,
    placeholder,
    extraProps = {},
  }: {
    label: string;
    valueKey: SelectFilterKey;
    options: { label: string; value: string }[];
    placeholder: string;
    extraProps?: Record<string, any>;
  }) => (
    <View style={styles.filterField} key={valueKey}>
      <Text style={styles.label}>{label}</Text>
      <MultiSelect
        style={styles.dropdown}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
      value={filters[valueKey] || []}
        onChange={values => setFilters(prev => ({ ...prev, [valueKey]: values }))}
        renderRightIcon={() =>
          (filters[valueKey] as string[])?.length ? (
            <TouchableOpacity
              onPress={() => setFilters(prev => ({ ...prev, [valueKey]: [] }))}
            >
              <Icon name="close-circle-outline" size={18} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <Icon name="chevron-down" size={18} color={colors.text} />
          )
        }
        search
        inside
        maxHeight={260}
        showsHorizontalScrollIndicator={false}
        {...dropdownThemeProps}
        {...extraProps}
      />
    </View>
  );

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, startDate, endDate }));
    setFilterOpen(false);
    fetchData(1);
  };

  const resetFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
    setStartDate(null);
    setEndDate(null);
    setFilterOpen(false);
    setHasMore(true);
    setTotalCount(0);
    loadInitialFilterOptions();
    fetchData(1);
  };

  const renderCard = (item: any) => {
    const statusColors = getStatusColors(item?.Status, colors);
    const amount = calculateProvisionAmount(item);
    const createdDate = item?.createdAt || item?.CreatedDate || item?.CreatedOn;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => navigation.navigate('ProvisionDetails', { provision: item })}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.invoiceNo, { color: colors.primary }]} numberOfLines={1}>
            {getProvisionReference(item)}
          </Text>
          <Text style={[styles.status, statusColors]} numberOfLines={1}>
            {item?.Status || '-'}
          </Text>
        </View>
        {type === 'po' ? (
          <Text style={[styles.row, { color: colors.text }]}>
            PO #: {getPurchaseOrderNumber(item)}
          </Text>
        ) : null}
        <Text style={[styles.row, { color: colors.text }]}>
          Vendor: {getVendorName(item)}
        </Text>
        <Text style={[styles.row, { color: colors.text }]}>
          Entity: {getEntityName(item)}
        </Text>
        <Text style={[styles.row, { color: colors.text }]}>
          Office: {getOfficeName(item)}
        </Text>
        <Text style={[styles.row, { color: colors.text }]}>
          Department: {getDepartmentName(item)}
        </Text>
        <View style={styles.footerRow}>
          <Text style={[styles.amount, { color: colors.text }]}>{formatCurrency(amount)}</Text>
          <Text style={[styles.created, { color: colors.text + '99' }]}>
            {getCreatorName(item)} | {formatDateValue(createdDate)}
          </Text>
        </View>
        <View style={[styles.viewBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.viewText}>View Details</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGridCard = (item: any) => {
    const statusColors = getStatusColors(item?.Status, colors);
    const amount = calculateProvisionAmount(item);

    return (
      <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => navigation.navigate('ProvisionDetails', { provision: item })}
      >
        <View style={styles.gridHeader}>
          <View style={styles.gridHeaderSpacer} />
          <Text style={[styles.gridStatus, statusColors]} numberOfLines={1}>
            {item?.Status || '-'}
          </Text>
        </View>
        <Text style={[styles.gridInvoice, { color: colors.primary }]} numberOfLines={1}>
          {getProvisionReference(item)}
        </Text>
        <Text style={[styles.gridMeta, { color: colors.text }]} numberOfLines={1}>
          {getVendorName(item)}
        </Text>
        {type === 'po' ? (
          <Text style={[styles.gridMeta, { color: colors.text }]} numberOfLines={1}>
            PO #: {getPurchaseOrderNumber(item)}
          </Text>
        ) : null}
        <Text style={[styles.gridAmount, { color: colors.text }]}>{formatCurrency(amount)}</Text>
      </TouchableOpacity>
    );
  };

  if (loading && !data.length) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.primary }]} onPress={() => setFilterOpen(true)}>
          <Icon name="magnify" size={20} color="#fff" />
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setViewMode(prev => (prev === 'list' ? 'grid' : 'list'))}>
          <Icon name={viewMode === 'list' ? 'view-grid' : 'view-list'} size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Modal visible={filterOpen} animationType="fade" transparent onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFilterOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setFilterOpen(false)}>
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
                {modalFilters.map(filter =>
                  renderFilterSelect({
                    label: filter.label,
                    valueKey: filter.key as keyof Filters,
                    placeholder: `Select ${filter.label}`,
                    options: filter.options,
                  }),
                )}
                {renderFilterSelect({
                  label: 'Vendor',
                  valueKey: 'Vendor',
                  placeholder: 'Select Vendor',
                  options: vendors,
                  extraProps: {
                    onChangeText: searchVendors,
                    searchPlaceholder: 'Search Vendor',
                  },
                })}
                {renderFilterSelect({
                  label: 'Entity',
                  valueKey: 'Entity',
                  placeholder: 'Select Entity',
                  options: entities,
                  extraProps: {
                    onChangeText: searchEntities,
                    searchPlaceholder: 'Search Entity',
                  },
                })}
                {renderFilterSelect({
                  label: 'Office',
                  valueKey: 'Office',
                  placeholder: 'Select Office',
                  options: offices,
                  extraProps: {
                    onChangeText: searchOffices,
                    searchPlaceholder: 'Search Office',
                  },
                })}
                {renderFilterSelect({
                  label: 'Department',
                  valueKey: 'Department',
                  placeholder: 'Select Department',
                  options: departments,
                  extraProps: {
                    onChangeText: searchDepartments,
                    searchPlaceholder: 'Search Department',
                  },
                })}
                {renderFilterSelect({
                  label: 'Created By',
                  valueKey: 'CreatedBy',
                  placeholder: 'Select User',
                  options: users,
                  extraProps: {
                    onChangeText: searchUsers,
                    searchPlaceholder: 'Search User',
                  },
                })}

                <View style={styles.filterField}>
                  <Text style={styles.label}>Requested Date</Text>
                  <TouchableOpacity style={styles.dateRangeInput} onPress={() => setOpenStart(true)}>
                    <Text style={[styles.dateText, !startDate && !endDate ? styles.datePlaceholder : null]}>
                      {startDate ? formatDateValue(startDate) : 'Start date'}
                      {'   →   '}
                      {endDate ? formatDateValue(endDate) : 'End date'}
                    </Text>
                    <Icon name="calendar-month-outline" size={18} color={colors.text + '88'} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <DatePicker
              modal
              open={openStart}
              date={startDate || new Date()}
              mode="date"
              onConfirm={date => {
                setOpenStart(false);
                setStartDate(date);
                if (!endDate) {
                  setOpenEnd(true);
                }
              }}
              onCancel={() => setOpenStart(false)}
            />
            <DatePicker
              modal
              open={openEnd}
              date={endDate || startDate || new Date()}
              minimumDate={startDate || undefined}
              mode="date"
              onConfirm={date => {
                setOpenEnd(false);
                setEndDate(date);
              }}
              onCancel={() => setOpenEnd(false)}
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
        data={data}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item, index) =>
          item?.ProvisionId?.toString() ||
          item?.ProvisionReferenceNumber ||
          index.toString()
        }
        renderItem={({ item }) => (viewMode === 'list' ? renderCard(item) : renderGridCard(item))}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onMomentumScrollBegin={() => setIsMomentumScrolling(true)}
        onMomentumScrollEnd={() => setIsMomentumScrolling(false)}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" color={colors.primary} style={styles.footerLoader} /> : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyText, { color: colors.text + '99' }]}>No provisions found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
    searchBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
    searchText: { color: '#fff', marginLeft: 5, fontWeight: '600' },
    toggleBtn: { padding: 6 },
    card: { borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
    invoiceNo: { flex: 1, fontSize: 14, fontWeight: '800' },
    status: { fontSize: 12, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
    row: { fontSize: 13, marginTop: 2 },
    footerRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
    amount: { fontSize: 16, fontWeight: '800' },
    created: { fontSize: 12, flex: 1, textAlign: 'right' },
    viewBtn: { marginTop: 10, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    viewText: { color: '#fff', fontWeight: '700' },
    gridCard: { flex: 1, minHeight: 110, borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, justifyContent: 'flex-start', marginHorizontal: 6 },
    gridRow: { gap: 12 },
    gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    gridHeaderSpacer: { flex: 1 },
    gridInvoice: { fontWeight: '800', fontSize: 13, lineHeight: 18 },
    gridMeta: { fontSize: 12, lineHeight: 16, marginTop: 3 },
    gridAmount: { marginTop: 7, fontWeight: '800', fontSize: 14 },
    gridStatus: { alignSelf: 'flex-end', fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', maxWidth: '58%' },
    listContent: { paddingHorizontal: 12, paddingBottom: 16 },
    footerLoader: { marginVertical: 10 },
    emptyWrap: { paddingTop: 40, alignItems: 'center' },
    emptyText: { fontSize: 14 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: colors.backdrop || 'rgba(0,0,0,0.35)' },
    modalCard: { maxHeight: '88%', borderRadius: 20, padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, elevation: 8 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
    modalCloseBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    modalBody: { flexGrow: 0 },
    modalContent: { paddingBottom: 8 },
    filterStack: { width: '100%' },
    filterField: { width: '100%', marginBottom: 12 },
    label: { fontSize: 13, marginBottom: 4, fontWeight: '600', color: colors.text },
    dropdown: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 10, minHeight: 46, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center' },
    dropdownPlaceholder: { color: colors.text + '88', fontSize: 14 },
    dropdownSelectedText: { color: colors.text, fontSize: 14 },
    dropdownSearchInput: { color: colors.text, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.background },
    dropdownItemText: { color: colors.text, fontSize: 14 },
    dropdownMenu: { borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    selectedStyle: { borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, margin: 4 },
    dateRangeInput: { minHeight: 46, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dateText: { flex: 1, color: colors.text, fontSize: 13, marginRight: 8 },
    datePlaceholder: { color: colors.text + '66' },
    footerButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
    resetBtn: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: colors.background, alignItems: 'center', borderRadius: 10, marginRight: 10, borderColor: colors.border, borderWidth: 1 },
    resetText: { color: colors.text, fontWeight: '600' },
    applyBtn: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#b07d7d', alignItems: 'center', borderRadius: 10 },
    applyText: { color: '#fff', fontWeight: '700' },
  });

export default ProvisionListScreen;
