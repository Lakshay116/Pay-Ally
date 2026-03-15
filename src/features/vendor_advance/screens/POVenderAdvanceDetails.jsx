import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';

export default function POVendorAdvanceDetails({ route, navigation }) {
  const { advance } = route.params || {};
  const { colors } = useTheme();

  if (!advance) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No advance data found</Text>
      </View>
    );
  }

  const items = advance?.POVAItems || [];

  const totalAmount = items.reduce(
    (sum, it) => sum + Number(it?.AdvancePayableAmount || 0),
    0,
  );

  const totalPaid = (advance?.POVAPayment || []).reduce(
    (sum, p) => sum + Number(p?.Paid_Amount || 0),
    0,
  );

  const paymentStatus =
    totalPaid >= totalAmount && totalAmount > 0
      ? 'Paid'
      : totalPaid > 0
      ? 'Partly Paid'
      : 'Unpaid';

  const formatDate = date =>
    date ? new Date(date).toLocaleDateString('en-IN') : '—';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.badgeRow}>
          <StatusBadge status={advance.Status} colors={colors} />
          <PaymentBadge status={paymentStatus} colors={colors} />
        </View>

        {/* Created Meta */}
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.muted }]}>
            👤 {advance?.Creator?.FirstName} {advance?.Creator?.LastName || ''}
          </Text>
          <Text style={[styles.metaText, { color: colors.muted }]}>
            {formatDate(advance.createdAt)}
          </Text>
        </View>

        {/* <Info
          label="Advance Ref"
          value={advance.AdvanceReferenceNumber}
          colors={colors}
        /> */}
        <Info
          label="Purchase Order"
          value={advance?.VendorAdvancePO?.Purchase_Order_Number}
          colors={colors}
        />
        <Info
          label="Entity"
          value={advance?.VendorAdvancePO?.POEntity?.Entity_Name}
          colors={colors}
        />
        <Info
          label="Office"
          value={advance?.VendorAdvancePO?.POOffice?.OfficeName}
          colors={colors}
        />
        <Info
          label="Department"
          value={advance?.VendorAdvancePO?.PODepartment?.DepartmentName}
          colors={colors}
        />
        <Info
          label="Vendor"
          value={advance?.VendorAdvancePO?.POVendor?.Vendor_Name}
          colors={colors}
        />
        <Info
          label="Payment Due"
          value={formatDate(advance.PaymentDueDate)}
          colors={colors}
        />

        <View
          style={[styles.amountBox, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.amountLabel, { color: colors.muted }]}>
            Total Advance Payable
          </Text>
          <Text style={[styles.amountValue, { color: colors.text }]}>
            ₹ {totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Items */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Advance Items
      </Text>

      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.itemCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.itemName, { color: colors.text }]}>
            {item?.POItemsMaster?.Name || 'Item'}
          </Text>

          <View style={styles.itemRow}>
            <Text style={[styles.itemText, { color: colors.muted }]}>
              Qty: {item?.POItemData?.Quantity || '-'}
            </Text>
            <Text style={[styles.itemText, { color: colors.muted }]}>
              Rate: ₹ {item?.POItemData?.Unit_Price || '-'}
            </Text>
          </View>

          <View style={styles.itemRow}>
            <Text style={[styles.itemText, { color: colors.muted }]}>
              CGST: {item?.CGST || 0}%
            </Text>
            <Text style={[styles.itemText, { color: colors.muted }]}>
              SGST: {item?.SGST || 0}%
            </Text>
            <Text style={[styles.itemText, { color: colors.muted }]}>
              IGST: {item?.IGST || 0}%
            </Text>
            <Text style={[styles.itemAmount, { color: colors.text }]}>
              ₹{' '}
              {Number(item?.AdvancePayableAmount || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      ))}

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backText, { color: '#fff' }]}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- Components ---------------- */

function Info({ label, value, colors }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value || '—'}</Text>
    </View>
  );
}

function StatusBadge({ status, colors }) {
  let bg = colors.muted;
  if (status === 'APPROVED') bg = colors.success;
  if (status === 'PENDING_FOR_APPROVAL') bg = colors.warning;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

function PaymentBadge({ status, colors }) {
  let bg = colors.danger;
  if (status === 'Paid') bg = colors.success;
  if (status === 'Partly Paid') bg = colors.warning;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: { padding: 12 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  metaText: {
    fontSize: 11,
    fontWeight: '600',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  label: { fontSize: 12 },
  value: { fontSize: 13, fontWeight: '600' },

  amountBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  amountLabel: { fontSize: 12 },
  amountValue: {
    fontSize: 20,
    fontWeight: '900',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },

  itemCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  itemText: { fontSize: 12 },

  itemAmount: {
    fontSize: 13,
    fontWeight: '800',
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
