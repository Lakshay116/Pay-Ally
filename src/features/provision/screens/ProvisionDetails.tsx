import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const formatCurrency = (value: number | string) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('en-IN') : '-';

const getProvisionReference = (provision: any) =>
  provision?.ProvisionReferenceNumber ||
  provision?.ProvisionReference ||
  provision?.ProvisionNumber ||
  '-';

const getVendorName = (provision: any) =>
  provision?.VendorData?.Vendor_Name || provision?.VendorName || '-';

const getEntityName = (provision: any) =>
  provision?.EntityData?.Entity_Name || '-';

const getOfficeName = (provision: any) =>
  provision?.OfficeData?.OfficeName || '-';

const getDepartmentName = (provision: any) =>
  provision?.DepartmentData?.DepartmentName || '-';

const getCreatorName = (provision: any) =>
  provision?.Creator?.UserName ||
  `${provision?.Creator?.FirstName || ''} ${provision?.Creator?.LastName || ''}`.trim() ||
  '-';

const calculateAmount = (provision: any) => {
  if (!provision?.ProvisionItems?.length) {
    return Number(provision?.TotalAmount || 0);
  }

  return provision.ProvisionItems.reduce((sum: number, item: any) => {
    const amount =
      Number(item?.TotalPayableAmount) ||
      Number(item?.TotalAmount) ||
      Number(item?.TotalPrice) ||
      0;
    return sum + amount;
  }, 0);
};

const ProvisionDetails = ({ route }: any) => {
  const { provision } = route.params || {};
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const amount = calculateAmount(provision);
  const extraStatusLabel = provision?.IsDeleted ? 'Deleted' : 'Active';

  const primaryFields = [
    ['Provision #', getProvisionReference(provision)],
    ...(provision?.PurchaseOrderNumber || provision?.POData?.Purchase_Order_Number
      ? [
          [
            'Purchase Order #',
            provision?.PurchaseOrderNumber ||
              provision?.POData?.Purchase_Order_Number ||
              '-',
          ],
        ]
      : []),
    ['Vendor', getVendorName(provision)],
    ['Entity', getEntityName(provision)],
    ['Office', getOfficeName(provision)],
    ['Department', getDepartmentName(provision)],
    ['Amount', formatCurrency(amount)],
    ['Created By', getCreatorName(provision)],
    ['Created Date', formatDate(provision?.createdAt || provision?.CreatedDate)],
    ['Status', provision?.Status || '-'],
  ];

  const extraFields = [
    ['Financial Year', provision?.FinancialYear || '-'],
    ['Purchase Reason', provision?.PurchaseReason || provision?.Narration || '-'],
    ['Currency', provision?.CurrencyData?.Currency || '-'],
    ['Accounting Date', formatDate(provision?.AccountingDate)],
    ['Round Off', provision?.RoundOffAmount || '0'],
    ['Tally Integration', provision?.TallyIntegration ? 'Enabled' : 'Disabled'],
  ];

  const itemRows = provision?.ProvisionItems || [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: colors.primary }]}>{provision?.Status || '-'}</Text>
          <Text
            style={[
              styles.paymentStatus,
              extraStatusLabel === 'Deleted'
                ? { backgroundColor: '#ef444422', color: '#ef4444' }
                : { backgroundColor: colors.success + '33', color: colors.success },
            ]}
          >
            {extraStatusLabel}
          </Text>
        </View>

        {primaryFields.map(([label, value]) => (
          <Row key={label} label={label} value={value} colors={colors} />
        ))}

        <TouchableOpacity style={styles.collapseBtn} onPress={() => setOpen(prev => !prev)}>
          <Text style={[styles.collapseText, { color: colors.primary }]}>
            {open ? 'Hide Details ⮟' : 'View More Details ⮞'}
          </Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.collapseBox}>
            {extraFields.map(([label, value]) => (
              <Row key={label} label={label} value={value} colors={colors} />
            ))}
          </View>
        )}
      </View>

      {itemRows.length ? (
        <View style={[styles.card, { marginTop: 16, backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Provision Items</Text>
          {itemRows.map((item: any, index: number) => (
            <View style={styles.itemRow} key={item?.ProvisionItemId || index}>
              <Text style={[styles.itemLabel, { color: colors.text }]} numberOfLines={1}>
                {item?.Description || `Item ${index + 1}`}
              </Text>
              <Text style={[styles.itemValue, { color: colors.text + '99' }]}>
                {formatCurrency(item?.TotalPayableAmount || item?.TotalAmount || item?.TotalPrice || 0)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

  <TouchableOpacity
    style={[styles.backBtn, { backgroundColor: colors.primary }]}
    onPress={() => navigation.goBack()}
  >
    <Text style={[styles.backText, { color: '#fff' }]}>Back</Text>
  </TouchableOpacity>
</ScrollView>
);
};

function Row({ label, value, colors }: any) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  headerCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '800',
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontWeight: '600',
    color: '#6b7280',
  },
  value: {
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },
  collapseBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  collapseText: {
    fontWeight: '700',
    fontSize: 13,
  },
  collapseBox: {
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemValue: {
    fontSize: 13,
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backText: {
    fontWeight: '800',
  },
});

export default ProvisionDetails;
