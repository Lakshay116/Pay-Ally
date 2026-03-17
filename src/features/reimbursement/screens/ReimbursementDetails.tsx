import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const formatDate = (value: any) =>
  value ? new Date(value).toLocaleDateString('en-IN') : '-';

const getAmount = (item: any) => {
  const items = Array.isArray(item?.ReimbursementItems)
    ? item.ReimbursementItems
    : [];
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

export default function ReimbursementDetails({ route, navigation }) {
  const { reimbursement } = route.params;
  const { colors } = useTheme();
  const amount = getAmount(reimbursement);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Row
          label="Entity"
          value={reimbursement?.EntityData?.Entity_Name}
          colors={colors}
        />
        <Row
          label="Office"
          value={reimbursement?.OfficeData?.OfficeName}
          colors={colors}
        />
        <Row
          label="Department"
          value={reimbursement?.DepartmentData?.DepartmentName}
          colors={colors}
        />
        <Row
          label="Total Amount"
          value={formatCurrency(reimbursement, amount)}
          colors={colors}
        />
        <Row
          label="Created By"
          value={reimbursement?.Creator?.UserName}
          colors={colors}
        />
        <Row
          label="Created Date"
          value={formatDate(reimbursement?.createdAt)}
          colors={colors}
        />
        <Row label="Status" value={reimbursement?.Status} colors={colors} />
        <Row
          label="Payment Status"
          value={reimbursement?.PaymentStatus}
          colors={colors}
        />
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
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontWeight: '600',
  },
  value: {
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backText: {
    fontWeight: '800',
    color: '#fff',
  },
});
