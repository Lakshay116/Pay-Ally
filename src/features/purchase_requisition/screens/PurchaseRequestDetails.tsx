import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';

const formatDate = value =>
  value ? new Date(value).toLocaleDateString('en-IN') : '-';

const getCreatedByName = item => {
  const fullName = [item?.Creater?.FirstName, item?.Creater?.LastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || item?.Creater?.UserName || '-';
};

export default function PurchaseRequestDetails({ route, navigation }) {
  const purchaseRequest = route?.params?.purchaseRequest;
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();

  const itemNames = useMemo(
    () =>
      (purchaseRequest?.ProductList || [])
        .map(item => item?.MasterProductData?.Name || item?.Description)
        .filter(Boolean),
    [purchaseRequest],
  );

  const totalEstimatedSpend = useMemo(() => {
    const total = (purchaseRequest?.ProductList || []).reduce(
      (sum, item) => sum + Number(item?.TotalEstimatedSpend || 0),
      0,
    );

    return `${
      purchaseRequest?.PRCurrency?.CurrencySymbol || 'Rs.'
    } ${total.toLocaleString('en-IN')}`;
  }, [purchaseRequest]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View
        style={[
          styles.headerCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.statusRow}>
          <Text style={[styles.status, { color: colors.primary }]}>
            {purchaseRequest?.Status || '-'}
          </Text>
        </View>

        <Row
          label="Purchase Request #"
          value={purchaseRequest?.Purchase_Request_Number}
          colors={colors}
        />
        <Row
          label="Entity"
          value={purchaseRequest?.PREntity?.Entity_Name}
          colors={colors}
        />
        <Row
          label="Office Name"
          value={purchaseRequest?.PROffice?.OfficeName}
          colors={colors}
        />
        <Row
          label="Department"
          value={purchaseRequest?.PRDepartment?.DepartmentName}
          colors={colors}
        />
        <Row
          label="Items"
          value={itemNames.length ? itemNames.join(', ') : '-'}
          colors={colors}
        />
        <Row
          label="Total Estimated Spend"
          value={totalEstimatedSpend}
          colors={colors}
        />
        <Row
          label="Created By"
          value={getCreatedByName(purchaseRequest)}
          colors={colors}
        />
        <Row
          label="Created Date"
          value={formatDate(purchaseRequest?.createdAt)}
          colors={colors}
        />

        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={styles.collapseBtn}
        >
          <Text style={[styles.collapseText, { color: colors.primary }]}>
            {open ? 'Hide Details' : 'View More Details'}
          </Text>
        </TouchableOpacity>

        {open && (
          <View style={[styles.collapseBox, { borderTopColor: colors.border }]}>
            <Row
              label="Financial Year"
              value={purchaseRequest?.FinancialYear}
              colors={colors}
            />
            <Row
              label="Purchase Category"
              value={purchaseRequest?.PurchaseCategory}
              colors={colors}
            />
            <Row
              label="Order Type"
              value={purchaseRequest?.OrderType}
              colors={colors}
            />
            <Row
              label="Currency"
              value={purchaseRequest?.PRCurrency?.Currency}
              colors={colors}
            />
            <Row
              label="Quotation Request"
              value={purchaseRequest?.QuotationRequest ? 'Yes' : 'No'}
              colors={colors}
            />
            <Row
              label="Comments"
              value={purchaseRequest?.Comments}
              colors={colors}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, colors }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.muted || colors.text + '99' }]}>
        {label}
      </Text>
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
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 14,
  },
  label: {
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontWeight: '700',
    flex: 1,
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
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: '800',
  },
});
