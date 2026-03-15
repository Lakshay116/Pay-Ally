import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../../../context/UserContext';
import api from '../../../utils/api';
import { useTheme } from 'react-native-paper';

/* ------------------ Module Mapping ------------------ */
const moduleMapping = {
  Vendor: { label: 'Vendor', screen: 'Vendor' },
  PurchaseOrders: { label: 'Purchase Order', screen: 'Purchase Order' },
  Invoices: { label: 'PO Invoice', screen: 'Invoice' },
  NonPOInvoices: { label: 'Non PO Invoice', screen: 'Invoice' },
  Quotations: { label: 'Quotation', screen: 'Quotation' },
  RFQ: { label: 'RFQ', screen: 'Request For Quotation' },
  GRNs: { label: 'GRN', screen: 'GRN / SRN' },
  PurchaseRequests: {
    label: 'Purchase Requisition',
    screen: 'Purchase Requisition',
  },
  VendorAdvance: { label: 'Vendor Advance', screen: 'Vendor Advance' },
  POVendorAdvance: { label: 'PO Vendor Advance', screen: 'Vendor Advance' },
  CreditNotes: { label: 'Credit Note', screen: 'Credit Note' },
  Reimbursement: { label: 'Reimbursement', screen: 'Reimbursement' },
};

/* ------------------ Status Groups ------------------ */
const statusGroups = {
  approve: [
    'Approve',
    'Pending For Approval',
    'PENDING_FOR_APPROVAL',
    'PENDING_FOR_ACCEPTANCE',
    'PENDING_FOR_INVOICE_VERIFICATION',
    'PENDING_FOR_DOCUMENT_VERIFICATION',
  ],
  revise: [
    'Revise',
    'Pending For Revision',
    'DISAPPROVED',
    'REVISION',
    'APPROVED_AND_INVOICE_PENDING',
    'APPROVED_AS_EXCEPTION',
    'INVOICE_REJECTED',
  ],
  pending: ['Pending For Acknowledgement'],
  create: ['Pending To Create'],
  draft: ['DRAFTED'],
};

/* ------------------ Transform API -> Cards ------------------ */
const transformPendingTasksToCards = data => {
  const cardData = [
    { title: 'Draft', count: 0, items: [], variant: 'draft' },
    { title: 'Create', count: 0, items: [], variant: 'create' },
    { title: 'Revise', count: 0, items: [], variant: 'revise' },
    { title: 'Pending', count: 0, items: [], variant: 'pending' },
    { title: 'Approve', count: 0, items: [], variant: 'approve' },
  ];

  if (!data || typeof data !== 'object') return [];

  Object.entries(data).forEach(([module, statuses]) => {
    const moduleConfig = moduleMapping[module];
    if (!moduleConfig) return;

    if (!statuses || typeof statuses !== 'object' || Array.isArray(statuses))
      return;

    Object.entries(statuses).forEach(([status, count]) => {
      if (!count || count <= 0) return;

      let variant = null;

      if (statusGroups.approve.includes(status)) variant = 'approve';
      else if (statusGroups.revise.includes(status)) variant = 'revise';
      else if (statusGroups.pending.includes(status)) variant = 'pending';
      else if (statusGroups.create.includes(status)) variant = 'create';
      else if (statusGroups.draft.includes(status)) variant = 'draft';

      if (!variant) return;

      const card = cardData.find(c => c.variant === variant);
      if (!card) return;

      const existing = card.items.find(i => i.name === moduleConfig.label);

      if (existing) {
        existing.count += count;
      } else {
        card.items.push({
          name: moduleConfig.label,
          count,
          screen: moduleConfig.screen,
        });
      }

      card.count += count;
    });
  });

  return cardData.filter(c => c.count > 0 && c.items.length > 0);
};

/* ------------------ API ------------------ */
const fetchPendingTasks = async () => {
  const res = await api.post('/dashboard/getPendingTasks', {});
  return res?.data?.data || {};
};

/* ------------------ Card UI ------------------ */
function DashboardCard({ title, items, colors }) {
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.primary }]}>{title}</Text>

      {items.map(item => (
        <TouchableOpacity key={item.name} style={styles.itemRow}>
          <Text style={[styles.itemText, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.count, { color: colors.text }]}>
            {item.count}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ------------------ Main Screen ------------------ */
export default function MyTasks() {
  const { colors } = useTheme();

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchPendingTasks();
      const transformed = transformPendingTasksToCards(data);
      setCards(transformed);
    } catch (e) {
      setCards([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={{ marginTop: 40 }}
      />
    );
  }

  if (!cards.length) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          No pending tasks 🎉
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={cards}
      keyExtractor={item => item.title}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }}
          tintColor={colors.primary}
        />
      }
      renderItem={({ item }) => (
        <DashboardCard title={item.title} items={item.items} colors={colors} />
      )}
    />
  );
}

/* ------------------ Styles ------------------ */
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
  },
  count: {
    fontSize: 16,
    fontWeight: '800',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
