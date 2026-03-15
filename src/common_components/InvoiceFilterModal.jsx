import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import api from '../utils/api';

let timer;

const STATUS_OPTIONS = [
  { label: 'Drafted', value: 'DRAFTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Pending for Acceptance', value: 'PENDING_FOR_ACCEPTANCE' },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Paid', value: 'PAID' },
];

export default function InvoiceFilterModal({
  visible,
  onClose,
  filters,
  setFilters,
  onApply,
  onReset,
}) {
  const { colors } = useTheme();

  const [entityOptions, setEntityOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [officeOptions, setOfficeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [invoiceNumberOptions, setInvoiceNumberOptions] = useState([]);

  const search = async (url, query, setter) => {
    if (!query) return setter([]);
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const res = await api.post(url, { search: query });
        setter(res?.data?.data || []);
      } catch (e) {
        console.log('Search error:', e?.response || e);
      }
    }, 400);
  };

  const toggleMulti = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }));
  };

  const renderMultiSelect = (label, options, key, onSearch) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={`Search ${label}`}
        style={styles.input}
        onChangeText={text => onSearch(text)}
      />
      <View style={styles.chipWrap}>
        {options.map(item => {
          const value =
            item?.value ?? item?.id ?? item?.User_Id ?? item?.Vendor_Id;
          const labelText =
            item?.label ??
            item?.name ??
            item?.Vendor_Name ??
            item?.Entity_Name ??
            item?.OfficeName ??
            item?.DepartmentName ??
            item?.UserName ??
            item?.NonPOInvoiceNumber ??
            item?.InvoiceNumber;

          return (
            <TouchableOpacity
              key={String(value)}
              style={[
                styles.chip,
                filters[key].includes(value) && styles.chipActive,
              ]}
              onPress={() => toggleMulti(key, value)}
            >
              <Text
                style={{
                  color: filters[key].includes(value) ? '#fff' : '#000',
                }}
              >
                {labelText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Filter Non-PO Invoices</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {renderMultiSelect(
              'Non PO Invoice #',
              invoiceOptions,
              'invoice',
              q => search('/nonPOInvoice/getInvoice', q, setInvoiceOptions),
            )}

            {renderMultiSelect(
              'Invoice #',
              invoiceNumberOptions,
              'invoiceNumber',
              q =>
                search(
                  '/nonPOInvoice/getInvoiceNumber',
                  q,
                  setInvoiceNumberOptions,
                ),
            )}

            {renderMultiSelect('Entity', entityOptions, 'entity', q =>
              search('/entity/getEntity', q, setEntityOptions),
            )}

            {renderMultiSelect('Office', officeOptions, 'office', q =>
              search('/office/getOffice', q, setOfficeOptions),
            )}

            {renderMultiSelect(
              'Department',
              departmentOptions,
              'department',
              q => search('/department/getDepartment', q, setDepartmentOptions),
            )}

            {renderMultiSelect('Vendor', vendorOptions, 'vendor', q =>
              search('/vendor/getVendor', q, setVendorOptions),
            )}

            {renderMultiSelect('Created By', userOptions, 'user', q =>
              search('/user/getUser', q, setUserOptions),
            )}

            <Text style={styles.label}>Status</Text>
            <View style={styles.chipWrap}>
              {STATUS_OPTIONS.map(it => (
                <TouchableOpacity
                  key={it.value}
                  style={[
                    styles.chip,
                    filters.status === it.value && styles.chipActive,
                  ]}
                  onPress={() =>
                    setFilters(prev => ({
                      ...prev,
                      status: prev.status === it.value ? null : it.value,
                    }))
                  }
                >
                  <Text
                    style={{
                      color: filters.status === it.value ? '#fff' : '#000',
                    }}
                  >
                    {it.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Payment Status</Text>
            <View style={styles.chipWrap}>
              {PAYMENT_STATUS_OPTIONS.map(it => (
                <TouchableOpacity
                  key={it.value}
                  style={[
                    styles.chip,
                    filters.paymentStatus === it.value && styles.chipActive,
                  ]}
                  onPress={() =>
                    setFilters(prev => ({
                      ...prev,
                      paymentStatus:
                        prev.paymentStatus === it.value ? null : it.value,
                    }))
                  }
                >
                  <Text
                    style={{
                      color:
                        filters.paymentStatus === it.value ? '#fff' : '#000',
                    }}
                  >
                    {it.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onReset}>
              <Text style={styles.reset}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onApply}
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: colors.primary, textAlign: 'center' }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '95%',
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  label: { marginTop: 12, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  chipActive: { backgroundColor: '#2563eb' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  reset: { fontWeight: '700', color: '#444' },
  applyBtn: { padding: 12, borderRadius: 8 },
  applyText: { color: '#fff', fontWeight: '800' },
});
