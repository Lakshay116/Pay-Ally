// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { useTheme } from 'react-native-paper';

// export default function NonPOInvoiceDetails({ route }) {
//   const { invoice } = route.params;

//   const { colors } = useTheme();

//   return (
//     <ScrollView
//       style={[styles.container, { backgroundColor: colors.background }]}
//       contentContainerStyle={{ paddingBottom: 30 }}
//     >
//       {/* Header */}
//       <View
//         style={[
//           styles.headerCard,
//           { backgroundColor: colors.primary, borderColor: colors.border },
//         ]}
//       >
//         {/* <Text style={[styles.invoiceNo, { color: '#fff' }]}>
//           {invoice.NonPOInvoiceNumber}
//         </Text> */}
//         <Text style={[styles.status, { color: colors.warning }]}>
//           {invoice.Status}
//         </Text>
//       </View>

//       {/* Basic Info */}
//       <Section title="Basic Details" colors={colors}>
//         <Row
//           label="Invoice Number"
//           value={invoice.InvoiceNumber}
//           colors={colors}
//         />
//         <Row
//           label="Invoice Date"
//           value={formatDate(invoice.InvoiceDate)}
//           colors={colors}
//         />
//         <Row
//           label="Financial Year"
//           value={invoice.FinancialYear}
//           colors={colors}
//         />
//         <Row
//           label="Category"
//           value={invoice.PurchaseCategory}
//           colors={colors}
//         />
//       </Section>

//       {/* Entity */}
//       <Section title="Entity & Office" colors={colors}>
//         <Row
//           label="Entity"
//           value={invoice.EntityData?.Entity_Name}
//           colors={colors}
//         />
//         <Row
//           label="Office"
//           value={invoice.OfficeData?.OfficeName}
//           colors={colors}
//         />
//         <Row
//           label="Department"
//           value={invoice.DepartmentData?.DepartmentName}
//           colors={colors}
//         />
//       </Section>

//       {/* Vendor */}
//       <Section title="Vendor" colors={colors}>
//         <Row
//           label="Vendor Name"
//           value={invoice.VendorData?.Vendor_Name}
//           colors={colors}
//         />
//         <Row
//           label="Credit Terms"
//           value={`${invoice.VendorData?.Credit_Terms || '-'} Days`}
//           colors={colors}
//         />
//       </Section>

//       {/* Amount */}
//       <Section title="Amount Summary" colors={colors}>
//         <Row
//           label="Currency"
//           value={invoice.CurrencyData?.Currency}
//           colors={colors}
//         />
//         <Row label="Round Off" value={invoice.RoundOffAmount} colors={colors} />
//       </Section>

//       {/* Products */}
//       <Section title="Items" colors={colors}>
//         {invoice.Products?.length ? (
//           invoice.Products.map((item, index) => (
//             <View
//               key={index}
//               style={[
//                 styles.itemCard,
//                 { backgroundColor: colors.surface, borderColor: colors.border },
//               ]}
//             >
//               <Text style={[styles.itemName, { color: colors.text }]}>
//                 {item.MasterProductData?.Name || 'Item'}
//               </Text>
//               <Text style={[styles.itemLine, { color: colors.muted }]}>
//                 Qty: {item.Quantity}
//               </Text>
//               <Text style={[styles.itemLine, { color: colors.text }]}>
//                 Total: ₹{item.TotalAmount}
//               </Text>
//             </View>
//           ))
//         ) : (
//           <Text style={[styles.emptyText, { color: colors.muted }]}>
//             No items found
//           </Text>
//         )}
//       </Section>

//       {/* Audit */}
//       <Section title="Audit" colors={colors}>
//         <Row
//           label="Created By"
//           value={`${invoice.Creater?.FirstName} ${invoice.Creater?.LastName}`}
//           colors={colors}
//         />
//         <Row
//           label="Created On"
//           value={formatDate(invoice.createdAt)}
//           colors={colors}
//         />
//       </Section>
//     </ScrollView>
//   );
// }

// /* ---------------- Reusable UI ---------------- */

// function Section({ title, children, colors }) {
//   return (
//     <View
//       style={[
//         styles.section,
//         { backgroundColor: colors.surface, borderColor: colors.border },
//       ]}
//     >
//       <Text style={[styles.sectionTitle, { color: colors.primary }]}>
//         {title}
//       </Text>
//       <View style={styles.sectionBody}>{children}</View>
//     </View>
//   );
// }

// function Row({ label, value, colors }) {
//   return (
//     <View style={styles.row}>
//       <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
//       <Text style={[styles.value, { color: colors.text }]}>{value || '-'}</Text>
//     </View>
//   );
// }

// const formatDate = date =>
//   date ? new Date(date).toLocaleDateString('en-IN') : '-';

// /* ---------------- Styles ---------------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 12,
//   },

//   headerCard: {
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//   },

//   invoiceNo: {
//     fontSize: 16,
//     fontWeight: '800',
//   },

//   status: {
//     marginTop: 6,
//     fontWeight: '700',
//   },

//   section: {
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//   },

//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: '800',
//     marginBottom: 10,
//   },

//   sectionBody: {
//     gap: 8,
//   },

//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   label: {
//     fontWeight: '600',
//   },

//   value: {
//     fontWeight: '700',
//     maxWidth: '55%',
//     textAlign: 'right',
//   },

//   itemCard: {
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 8,
//     borderWidth: 1,
//   },

//   itemName: {
//     fontWeight: '700',
//   },

//   itemLine: {
//     fontSize: 13,
//     marginTop: 2,
//   },

//   emptyText: {
//     fontStyle: 'italic',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';

export default function NonPOInvoiceDetails({ route, navigation }) {
  const { invoice } = route.params;
  const { colors } = useTheme();

  const [open, setOpen] = useState(false);

  const amount =
    invoice?.Products?.reduce(
      (sum, p) => sum + Number(p.TotalPayableAmount || 0),
      0,
    ) || 0;

  const formatDate = date =>
    date ? new Date(date).toLocaleDateString('en-IN') : '-';

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
        <Text style={[styles.status, { color: colors.primary }]}>
          {invoice.Status}
        </Text>

        <Row label="Invoice No" value={invoice.InvoiceNumber} colors={colors} />
        <Row
          label="Invoice Date"
          value={formatDate(invoice.InvoiceDate)}
          colors={colors}
        />
        <Row
          label="Vendor"
          value={invoice.VendorData?.Vendor_Name}
          colors={colors}
        />
        <Row label="Amount" value={`₹ ${amount || '-'}`} colors={colors} />

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
              value={invoice.FinancialYear}
              colors={colors}
            />
            <Row
              label="Category"
              value={invoice.PurchaseCategory}
              colors={colors}
            />
            <Row
              label="Entity"
              value={invoice.EntityData?.Entity_Name}
              colors={colors}
            />
            <Row
              label="Office"
              value={invoice.OfficeData?.OfficeName}
              colors={colors}
            />
            <Row
              label="Department"
              value={invoice.DepartmentData?.DepartmentName}
              colors={colors}
            />
            <Row
              label="Credit Terms"
              value={`${invoice.VendorData?.Credit_Terms || '-'} Days`}
              colors={colors}
            />
            <Row
              label="Currency"
              value={invoice.CurrencyData?.Currency}
              colors={colors}
            />
            <Row
              label="Round Off"
              value={invoice.RoundOffAmount}
              colors={colors}
            />
            <Row
              label="Created By"
              value={`${invoice.Creater?.FirstName} ${invoice.Creater?.LastName}`}
              colors={colors}
            />
            <Row
              label="Created On"
              value={formatDate(invoice.createdAt)}
              colors={colors}
            />
          </View>
        )}
      </View>

      {/* Items (unchanged) */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>

      {invoice.Products?.length ? (
        invoice.Products.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.itemName, { color: colors.text }]}>
              {item.MasterProductData?.Name || 'Item'}
            </Text>
            <Text style={[styles.itemLine, { color: colors.muted }]}>
              Qty: {item.Quantity}
            </Text>
            <Text style={[styles.itemLine, { color: colors.text }]}>
              Total: ₹{item.TotalPayableAmount}
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          No items found
        </Text>
      )}

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

  status: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
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

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },

  itemCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
  },

  itemName: {
    fontWeight: '700',
  },

  itemLine: {
    fontSize: 13,
    marginTop: 2,
  },

  emptyText: {
    fontStyle: 'italic',
  },
});
