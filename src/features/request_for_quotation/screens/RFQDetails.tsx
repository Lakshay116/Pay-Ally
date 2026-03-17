import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function RFQDetails({ route, navigation }) {
  const { rfq } = route.params;
  const { colors } = useTheme();
  
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'workflow'

  const formatDate = date =>
    date ? new Date(date).toLocaleDateString('en-IN') : '-';

  const amount = (rfq?.ProductList || []).reduce(
    (sum, it) => sum + Number(it?.TotalEstimatedSpend || 0),
    0,
  );

  const getStatusColors = (status) => {
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

  const renderProductItem = ({ item }) => {
    const product = item?.MasterProductData;
    const isService = product?.ProductType === 'SERVICE';

    return (
      <View style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.productHeader}>
          <Text style={[styles.productName, { color: colors.primary }]}>
            {product?.Name || '-'}
          </Text>
          <Text style={[styles.productType, { color: isService ? '#f59e0b' : '#3b82f6', backgroundColor: isService ? '#fef3c7' : '#dbeafe' }]}>
            {product?.ProductType || '-'}
          </Text>
        </View>

        <Text style={[styles.productDesc, { color: colors.text + 'bb' }]}>
          {item?.Description || product?.Description || '-'}
        </Text>

        <View style={styles.productDetails}>
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {item?.Quantity ? `${item.Quantity} ${product?.UOMData?.UOM || ''}` : '-'}
            </Text>
          </View>
          
          <View style={styles.detailCol}>
            <Text style={styles.detailLabel}>Est. Unit Price</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {item?.EstimatedSpend ? `₹ ${Number(item.EstimatedSpend).toLocaleString('en-IN')}` : '-'}
            </Text>
          </View>

          <View style={[styles.detailCol, styles.alignRight]}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={[styles.detailValue, { color: colors.primary, fontWeight: '800' }]}>
              ₹ {Number(item?.TotalEstimatedSpend || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderWorkflowItem = ({ item }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
      </View>
      
      <View style={[styles.timelineContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.workflowHeader}>
          <Text style={styles.workflowAction}>{item.ActionTaken}</Text>
          <Text style={styles.workflowDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={[styles.workflowUser, { color: colors.text }]}>
          {item.Is_ByDelegation ? 'Delegated Action' : `User ID: ${item.Users}`}
        </Text>
        {item.Notes && <Text style={styles.workflowNotes}>{item.Notes}</Text>}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
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
            <Text style={[styles.status, getStatusColors(rfq.Status)]}>
              {rfq.Status}
            </Text>
            
            <Text style={[styles.totalAmount, { color: colors.primary }]}>
              ₹ {amount.toLocaleString('en-IN')}
            </Text>
          </View>

          <Row
            label="Purchase Request"
            value={rfq?.Purchase_Request_Number}
            colors={colors}
          />
          <Row
            label="Entity"
            value={rfq?.PREntity?.Entity_Name}
            colors={colors}
          />
          <Row
            label="Office Name"
            value={rfq?.PROffice?.OfficeName}
            colors={colors}
          />
          <Row
            label="Department"
            value={rfq?.PRDepartment?.DepartmentName}
            colors={colors}
          />
          <Row
            label="Order Type"
            value={rfq?.OrderType}
            colors={colors}
          />
          <Row
            label="Requested Date"
            value={formatDate(rfq.createdAt)}
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
            <View style={[styles.collapseBox, { borderTopColor: colors.border }]}>
              <Row
                label="Financial Year"
                value={rfq?.FinancialYear}
                colors={colors}
              />
              <Row
                label="Category"
                value={rfq?.PurchaseCategory}
                colors={colors}
              />
              <Row
                label="Currency"
                value={rfq?.PRCurrency?.Currency}
                colors={colors}
              />
              <Row
                label="Updater"
                value={`${rfq?.Updater?.FirstName || ''} ${rfq?.Updater?.LastName || ''}`}
                colors={colors}
              />
            </View>
          )}
        </View>

        {/* Tab Selection */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'items' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]} 
            onPress={() => setActiveTab('items')}
          >
            <Icon name="package-variant-closed" size={20} color={activeTab === 'items' ? colors.primary : colors.text + '88'} />
            <Text style={[styles.tabText, { color: activeTab === 'items' ? colors.primary : colors.text + '88' }]}>Items ({rfq?.ProductList?.length || 0})</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'workflow' && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]} 
            onPress={() => setActiveTab('workflow')}
          >
            <Icon name="timeline-check-outline" size={20} color={activeTab === 'workflow' ? colors.primary : colors.text + '88'} />
            <Text style={[styles.tabText, { color: activeTab === 'workflow' ? colors.primary : colors.text + '88' }]}>Workflow</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'items' ? (
          <View style={styles.listContainer}>
            {rfq?.ProductList?.length ? (
              rfq.ProductList.map((item, index) => (
                <View key={item.PurchaseRequestItem_Id || index}>
                  {renderProductItem({ item })}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No items found for this RFQ.</Text>
            )}
          </View>
        ) : (
          <View style={[styles.listContainer, styles.timelineContainer]}>
            {rfq?.PRTransactionData?.length ? (
              rfq.PRTransactionData.map((item, index) => (
                <View key={item.WorkflowTransactionId || index}>
                  {renderWorkflowItem({ item })}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No workflow history found.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Layout */}
      <View style={[styles.bottomNav, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color="#fff" />
          <Text style={[styles.backText, { color: '#fff' }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- Reusable UI ---------------- */

function Row({ label, value, colors }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.text + 'aa' }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value || '-'}</Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00000015',
  },

  status: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
  },

  value: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },

  collapseBtn: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#00000008',
    borderRadius: 8,
  },

  collapseText: {
    fontWeight: '700',
    fontSize: 13,
  },

  collapseBox: {
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 16,
  },

  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },

  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },

  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },

  listContainer: {
    gap: 12,
  },

  productCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },

  productType: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },

  productDesc: {
    fontSize: 13,
    marginBottom: 14,
  },

  productDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#00000010',
    paddingTop: 12,
  },

  detailCol: {
    flex: 1,
    gap: 4,
  },

  alignRight: {
    alignItems: 'flex-end',
  },

  detailLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  timelineContainer: {
    paddingLeft: 8,
  },

  timelineItem: {
    flexDirection: 'row',
  },

  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -6,
  },

  timelineContent: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },

  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  workflowAction: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16a34a',
  },

  workflowDate: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },

  workflowUser: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },

  workflowNotes: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#00000008',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },

  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },

  backBtn: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  backText: {
    fontWeight: '700',
    fontSize: 15,
  },
});
