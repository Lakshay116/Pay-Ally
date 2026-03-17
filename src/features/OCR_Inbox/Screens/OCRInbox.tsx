import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import api from '../../../utils/api';
import { fetchOcrJobs } from '../services/ocrInbox';

export default function OCRInbox() {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | number | null>(null);

  const fetchData = useCallback(
    async (nextPage = 1, append = false) => {
      try {
        if (!append) {
          setLoading(true);
        }

        const { rows: nextRows, count } = await fetchOcrJobs({
          limit: 10,
          offset: (nextPage - 1) * 10,
        });

        setRows(prev => (append ? [...prev, ...nextRows] : nextRows));
        setPage(nextPage);
        setTotalCount(count);
        const more =
          count !== null
            ? nextPage * 10 < count
            : nextRows.length === 10;
        setHasMore(more);
      } catch (err) {
        console.log('OCR Inbox fetch error:', err);
        if (!append) {
          setRows([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(1, false);
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(1, false);
  };

  const loadMore = () => {
    if (!hasMore || loading || refreshing) {
      return;
    }
    fetchData(page + 1, true);
  };

  const handlePreview = async (item: any) => {
    const url = item?.Input?.fileUrl;
    if (!url) {
      return;
    }
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.log('Preview open error:', err);
    }
  };

  const deleteJob = (jobId: string | number) => {
    Alert.alert('Delete job', 'Are you sure you want to delete this job?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeletingJobId(jobId);
            await api.post('/job/delete', { jobId });
            fetchData(1, false);
          } catch (err) {
            console.log('OCR delete error:', err);
          } finally {
            setDeletingJobId(null);
          }
        },
      },
    ]);
  };

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString('en-IN') : '-';

  const getName = (item: any) =>
    item?.Title ||
    item?.Input?.fileName ||
    item?.FileName ||
    item?.OriginalFileName ||
    item?.fileName ||
    item?.name ||
    '-';

  const getStatus = (item: any) => item?.Status || item?.status || '-';
  const getStatusLabel = (item: any) => {
    const status = String(getStatus(item)).toLowerCase();
    if (status === 'success' || status === 'completed') {
      return 'Success';
    }
    if (status === 'failed' || status === 'error') {
      return 'Failed';
    }
    return status ? status.toUpperCase() : '-';
  };

  const getGrandTotal = (item: any) => {
    const output = item?.Output;
    if (!output) {
      return item?.GrandTotal ?? item?.TotalAmount ?? item?.grandTotal ?? 0;
    }

    if (output?.total !== undefined && output?.total !== null) {
      return output.total;
    }

    const items = Array.isArray(output?.items) ? output.items : [];
    const totalFromItems = items.reduce((acc: number, curr: any) => {
      const lineTotal =
        (curr?.total_price || 0) -
        (curr?.discount_amount || 0) +
        (curr?.cgst_amount || 0) +
        (curr?.sgst_amount || 0) +
        (curr?.igst_amount || 0) +
        (curr?.vat_amount || 0) +
        (curr?.cess_amount || 0) +
        (curr?.tcs_amount || 0);
      return acc + lineTotal;
    }, 0);

    return totalFromItems || output?.subtotal || 0;
  };

  const getVendor = (item: any) =>
    item?.Output?.vendor?.vendor_name ||
    item?.Output?.vendor ||
    item?.IdentifiedVendor ||
    item?.VendorName ||
    item?.Vendor?.Vendor_Name ||
    '-';

  const getCreatedDocument = (item: any) =>
    item?.Output?.referenceNumber && item?.Output?.moduleType
      ? `${item.Output.moduleType} (${item.Output.referenceNumber})`
      : item?.Output?.referenceNumber ||
        item?.Output?.invoice_number ||
    item?.Output?.purchase_order_number ||
    item?.Output?.proforma_invoice_number ||
    item?.CreatedDocumentNumber ||
    item?.CreatedDocument ||
    item?.DocumentNumber ||
    '-';

  const getCreatedBy = (item: any) =>
    item?.Creater?.UserName ||
    item?.CreatedBy?.UserName ||
    item?.Creator?.UserName ||
    item?.CreatedBy ||
    '-';

  const getCreatedOn = (item: any) =>
    formatDate(item?.createdAt || item?.CreatedOn || item?.CreatedDate);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <TouchableOpacity onPress={() => handlePreview(item)} style={styles.nameButton}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {getName(item)}
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.statusPill,
            getStatusLabel(item) === 'Success'
              ? styles.statusSuccess
              : getStatusLabel(item) === 'Failed'
                ? styles.statusFailed
                : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item)}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Grand Total</Text>
        <Text style={styles.cardValue}>{String(getGrandTotal(item))}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Identified Vendor</Text>
        <Text style={styles.cardValue} numberOfLines={1}>
          {getVendor(item)}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Created document #</Text>
        <Text style={styles.cardValue} numberOfLines={1}>
          {getCreatedDocument(item)}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Created By</Text>
        <Text style={styles.cardValue} numberOfLines={1}>
          {getCreatedBy(item)}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Created On</Text>
        <Text style={styles.cardValue}>{getCreatedOn(item)}</Text>
      </View>

      {getStatus(item) === 'SUCCESS' ? (
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => handlePreview(item)}
          >
            <Icon name="check-circle-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionIconBtn}
            disabled={deletingJobId === item?.JobId}
            onPress={() => deleteJob(item?.JobId)}
          >
            <Icon
              name="trash-can-outline"
              size={18}
              color={colors.error || '#ef4444'}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  if (loading && !rows.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>OCR Inbox</Text>
        <View style={styles.topActions}>
          <Pressable style={styles.iconCircle} onPress={onRefresh} disabled={loading}>
            <Icon name="refresh" size={18} color={colors.text} />
          </Pressable>
        </View>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(item, index) =>
          String(item?.JobId || item?.id || item?.JobID || index)
        }
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No OCR jobs found.</Text>
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footerText}>
            {totalCount !== null
              ? `${rows.length} of ${totalCount} items`
              : `${rows.length} items`}
          </Text>
        }
      />
    </View>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: colors.background },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: { fontSize: 20, fontWeight: '700', color: colors.text },
    topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#8d6b6b',
      borderRadius: 8,
    },
    actionText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: { paddingBottom: 12 },
    card: {
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      gap: 8,
    },
    nameButton: { flex: 1 },
    cardTitle: { fontSize: 14, fontWeight: '800', color: colors.text, flex: 1 },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    cardLabel: { fontSize: 12, color: colors.text + '88' },
    cardValue: { fontSize: 13, fontWeight: '700', color: colors.text, maxWidth: '60%', textAlign: 'right' },
    cardActions: {
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 6,
    },
    statusPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusSuccess: { backgroundColor: '#16a34a22' },
    statusFailed: { backgroundColor: '#ef444422' },
    statusPending: { backgroundColor: '#f59e0b22' },
    statusText: { fontSize: 12, fontWeight: '700', color: colors.text },
    actionIconBtn: { paddingHorizontal: 4 },
    empty: { paddingVertical: 20, alignItems: 'center' },
    emptyText: { color: colors.text + '88' },
    footerText: { marginTop: 8, color: colors.text + '88' },
  });
