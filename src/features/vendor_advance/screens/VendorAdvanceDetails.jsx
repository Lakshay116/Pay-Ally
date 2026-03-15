import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';

export default function VendorAdvanceDetails({ route, navigation }) {
  const { advance } = route.params;
  const RefNo = advance.AdvanceReferenceNumber;
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const formatDate = date =>
    date ? new Date(date).toLocaleDateString('en-IN') : '-';

  const getTotalAdvance = items =>
    items?.reduce((sum, it) => sum + Number(it?.AdvanceTotalAmount || 0), 0) ||
    0;

  const getPaymentStatus = payments => {
    if (!payments?.length) return 'Unpaid';
    const totalPaid = payments.reduce(
      (sum, p) => sum + Number(p?.Paid_Amount || 0),
      0,
    );
    const totalAdvance = getTotalAdvance(advance?.POVAItems);
    return totalPaid >= totalAdvance ? 'Paid' : 'Partially Paid';
  };

  const amount = getTotalAdvance(advance?.POVAItems);
  const paymentStatus = getPaymentStatus(advance?.POVAPayment);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Main Summary Card */}
      <View
        style={[
          styles.headerCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {/* Status */}
        <View style={styles.statusRow}>
          <Text style={[styles.status, { color: colors.primary }]}>
            {advance.Status}
          </Text>

          <Text
            style={[
              styles.paymentStatus,
              paymentStatus === 'Paid'
                ? {
                    backgroundColor: colors.success + '33',
                    color: colors.success,
                  }
                : {
                    backgroundColor: colors.warning + '33',
                    color: colors.warning,
                  },
            ]}
          >
            {paymentStatus}
          </Text>
        </View>
        {/* <Row
          label="Advance #"
          value={advance.AdvanceReferenceNumber}
          colors={colors}
        /> */}

        <Row
          label="Performa Invoice"
          value={advance?.ProformaInvoiceNumber}
          colors={colors}
        />

        <Row
          label="Entity"
          value={
            advance?.VendorAdvancePO?.POEntity?.Entity_Name ||
            advance?.VaEntity?.Entity_Name
          }
          colors={colors}
        />
        <Row
          label="Office Name"
          value={
            advance?.VendorAdvancePO?.POOffice?.OfficeName ||
            advance?.VaOffice?.OfficeName
          }
          colors={colors}
        />
        <Row
          label="Department"
          value={
            advance?.VendorAdvancePO?.PODepartment?.DepartmentName ||
            advance?.VaDepartment?.DepartmentName
          }
          colors={colors}
        />
        <Row
          label="Vendor"
          value={
            advance?.VendorAdvancePO?.POVendor?.Vendor_Name ||
            advance?.VaVendor?.Vendor_Name
          }
          colors={colors}
        />
        <Row
          label="Amount"
          value={`₹ ${
            amount.toLocaleString('en-IN') == 0
              ? advance?.TotalPayableAmount
              : amount.toLocaleString('en-IN')
          }`}
          colors={colors}
        />
        <Row
          label="Requested Date"
          value={formatDate(advance.createdAt)}
          colors={colors}
        />
        <Row
          label="Requested By"
          value={`${
            advance?.Creator?.FirstName === undefined
              ? advance?.Creater?.UserName
              : advance?.Creator?.FirstName + ' ' + advance?.Creator?.LastName
          }`}
          colors={colors}
        />
        {/* Collapse Button */}
        <TouchableOpacity
          onPress={() => setOpen(!open)}
          style={styles.collapseBtn}
        >
          <Text style={[styles.collapseText, { color: colors.primary }]}>
            {open ? 'Hide Details ▲' : 'View More Details ▼'}
          </Text>
        </TouchableOpacity>
        {/* Collapsible Content */}
        {open && (
          <View style={styles.collapseBox}>
            <Row
              label="Financial Year"
              value={
                advance?.VendorAdvancePO?.FinancialYear ||
                advance?.FinancialYear
              }
              colors={colors}
            />
            <Row
              label="Category"
              value={
                advance?.VendorAdvancePO?.PurchaseCategory ||
                advance?.PurchaseCategory
              }
              colors={colors}
            />
            <Row
              label="Currency"
              value={
                advance?.VendorAdvancePO?.POCurrency?.Currency ||
                advance?.VaCurrency?.Currency
              }
              colors={colors}
            />
            <Row
              label="Payment Due Date"
              value={formatDate(advance?.PaymentDueDate)}
              colors={colors}
            />
            <Row
              label="Round Off"
              value={advance?.RoundOffAmount || advance?.AdvanceRoundOffAmount}
              colors={colors}
            />
          </View>
        )}
      </View>

      {/* Back */}
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backText, { color: '#fff' }]}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- Reusable UI ---------------- */

function Row({ label, value, colors }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value || '-'}</Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */

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
    marginBottom: 6,
  },

  status: {
    fontSize: 16,
    fontWeight: '800',
  },

  paymentStatus: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  label: {
    fontWeight: '600',
  },

  value: {
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },

  collapseBtn: {
    marginTop: 10,
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
});
