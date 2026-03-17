import api from '../../../utils/api';
import {
  fetchDepartments,
  fetchEntities,
  fetchOffices,
  fetchUsers,
} from '../../vendor_advance/services/vendoradvance';

const toOption = (label, value) => ({
  label,
  value,
});

const dedupeOptions = (options = []) => {
  const seen = new Set();

  return options.filter(option => {
    const value = String(option?.value ?? '');

    if (!value || seen.has(value)) {
      return false;
    }

    seen.add(value);
    return true;
  });
};

const getUniqueOptions = (rows, getLabel, getValue = getLabel) => {
  const seen = new Set();

  return rows.reduce((acc, row) => {
    const label = getLabel(row);
    const value = getValue(row);

    if (!label || value === null || value === undefined || value === '') {
      return acc;
    }

    const normalizedValue = String(value);

    if (seen.has(normalizedValue)) {
      return acc;
    }

    seen.add(normalizedValue);
    acc.push(toOption(String(label), normalizedValue));
    return acc;
  }, []);
};

const filterBySearch = (items, searchText = '') => {
  if (!searchText) {
    return items;
  }

  const query = searchText.toLowerCase();
  return items.filter(item => item.label?.toLowerCase().includes(query));
};

const matchesDateRange = (value, startDate, endDate) => {
  if (!startDate && !endDate) {
    return true;
  }

  if (!value) {
    return false;
  }

  const current = new Date(value);

  if (startDate && current < new Date(startDate)) {
    return false;
  }

  if (endDate && current > new Date(endDate)) {
    return false;
  }

  return true;
};

const applyFilters = (rows, filters = {}) => {
  return rows.filter(item => {
    if (
      filters.PurchaseRequestNumber?.length &&
      !filters.PurchaseRequestNumber.includes(
        String(item?.Purchase_Request_Number),
      )
    ) {
      return false;
    }

    if (
      filters.Entity?.length &&
      !filters.Entity.includes(
        String(item?.PREntity?.Entity_Id || item?.EntityId),
      )
    ) {
      return false;
    }

    if (
      filters.Office?.length &&
      !filters.Office.includes(
        String(item?.PROffice?.Office_Location_Id || item?.OfficeLocationId),
      )
    ) {
      return false;
    }

    if (
      filters.Department?.length &&
      !filters.Department.includes(
        String(item?.PRDepartment?.Department_Id || item?.DepartmentId),
      )
    ) {
      return false;
    }

    if (
      filters.CreatedBy?.length &&
      !filters.CreatedBy.includes(String(item?.CreatedBy))
    ) {
      return false;
    }

    if (filters.Status?.length && !filters.Status.includes(String(item?.Status))) {
      return false;
    }

    if (!matchesDateRange(item?.createdAt, filters.startDate, filters.endDate)) {
      return false;
    }

    return true;
  });
};

const buildPayload = (filters = {}, limit = 10, offset = 0) => ({
  purchaseRequest: filters.PurchaseRequestNumber?.[0] || null,
  purchaseRequestIds: filters.PurchaseRequestNumber || [],
  entity: filters.Entity?.[0] || null,
  office: filters.Office?.[0] || null,
  department: filters.Department?.[0] || null,
  startDate: filters.startDate || null,
  endDate: filters.endDate || null,
  status: filters.Status || null,
  totalEstimatedSpend: filters.totalEstimatedSpend || null,
  items: filters.items || null,
  user: filters.CreatedBy || null,
  IsDeleted: false,
  limit,
  offset,
});

const fetchPurchaseRequestRows = async (
  endpoint,
  filters = {},
  limit = 10,
  offset = 0,
) => {
  const payload = buildPayload(filters, limit, offset);
  const res = await api.post(endpoint, payload);
  const rows = res?.data?.data?.rows || [];

  if (rows.length === limit) {
    return rows;
  }

  // If backend returns incomplete or exact matching items as limit, 
  // the fallback triggers fetching ALL to do local pagination.
  // This safely resolves duplicate data bugs.
  const fallbackRes = await api.post(endpoint, buildPayload({}, 5000, 0));
  const fallbackRows = fallbackRes?.data?.data?.rows || [];
  const filteredRows = applyFilters(fallbackRows, filters);

  return filteredRows.slice(offset, offset + limit);
};

const fetchAllRows = async endpoint => {
  const res = await api.post(endpoint, buildPayload({}, 1000, 0));
  return res?.data?.data?.rows || [];
};

export const fetchAllPurchaseRequests = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchPurchaseRequestRows('/purchaseRequest/getAll', filters, limit, offset);
};

export const fetchMyPurchaseRequests = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchPurchaseRequestRows(
    '/purchaseRequest/getAllByUserId',
    filters,
    limit,
    offset,
  );
};

export const fetchPurchaseRequestNumbers = async (
  endpoint,
  searchText = '',
) => {
  const rows = await fetchAllRows(endpoint);
  const options = getUniqueOptions(rows, item => item?.Purchase_Request_Number);
  return filterBySearch(options, searchText);
};

export const fetchPurchaseRequestStatuses = async endpoint => {
  const rows = await fetchAllRows(endpoint);
  return getUniqueOptions(rows, item => item?.Status);
};

export const fetchPurchaseRequestEntities = async searchText => {
  const options = await fetchEntities(searchText);
  return dedupeOptions(options);
};

export const fetchPurchaseRequestOffices = async searchText => {
  const options = await fetchOffices(searchText);
  return dedupeOptions(options);
};

export const fetchPurchaseRequestDepartments = async searchText => {
  const options = await fetchDepartments(searchText);
  return dedupeOptions(options);
};

export const fetchPurchaseRequestUsers = async searchText => {
  const options = await fetchUsers(searchText);
  return dedupeOptions(options);
};
