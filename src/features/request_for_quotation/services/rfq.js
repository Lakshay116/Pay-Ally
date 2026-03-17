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
      filters.purchaseRequest?.length &&
      !filters.purchaseRequest.includes(
        String(item?.Purchase_Request_Number),
      )
    ) {
      return false;
    }

    if (
      filters.entity?.length &&
      !filters.entity.includes(
        String(item?.PREntity?.Entity_Id || item?.EntityId),
      )
    ) {
      return false;
    }

    if (
      filters.office?.length &&
      !filters.office.includes(
        String(item?.PROffice?.Office_Location_Id || item?.OfficeLocationId),
      )
    ) {
      return false;
    }

    if (
      filters.department?.length &&
      !filters.department.includes(
        String(item?.PRDepartment?.Department_Id || item?.DepartmentId),
      )
    ) {
      return false;
    }

    if (
      filters.user?.length &&
      !filters.user.includes(String(item?.CreatedBy))
    ) {
      return false;
    }

    if (!matchesDateRange(item?.createdAt, filters.startDate, filters.endDate)) {
      return false;
    }

    return true;
  });
};

const buildPayload = (filters = {}, limit = 10, offset = 0) => ({
  purchaseRequest: Array.isArray(filters.purchaseRequest) ? filters.purchaseRequest[0] : filters.purchaseRequest || null,
  purchaseRequestIds: Array.isArray(filters.purchaseRequest) ? filters.purchaseRequest : (filters.purchaseRequest ? [filters.purchaseRequest] : []),
  entity: Array.isArray(filters.entity) ? filters.entity[0] : filters.entity || null,
  office: Array.isArray(filters.office) ? filters.office[0] : filters.office || null,
  department: Array.isArray(filters.department) ? filters.department[0] : filters.department || null,
  startDate: filters.startDate || null,
  endDate: filters.endDate || null,
  user: Array.isArray(filters.user) ? filters.user : (filters.user ? [filters.user] : []),
  IsDeleted: false,
  pagination: filters.pagination || { limit, page: Math.floor(offset / limit) + 1 },
});

const fetchRFQRows = async (
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

  // Fallback local pagination since sometimes APIs ignore the limits 
  const fallbackRes = await api.post(endpoint, buildPayload({}, 5000, 0));
  const fallbackRows = fallbackRes?.data?.data?.rows || [];
  const filteredRows = applyFilters(fallbackRows, filters);

  return filteredRows.slice(offset, offset + limit);
};

const fetchAllRows = async endpoint => {
  const res = await api.post(endpoint, buildPayload({}, 5000, 0));
  return res?.data?.data?.rows || [];
};

export const fetchAllRFQs = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchRFQRows('/purchaseRequest/getApprovedForRFQ', filters, limit, offset);
};

export const fetchMyRFQs = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchRFQRows(
    '/purchaseRequest/getApprovedByUserIdForRFQ',
    filters,
    limit,
    offset,
  );
};

export const fetchRFQNumbers = async (
  endpoint,
  searchText = '',
) => {
  const rows = await fetchAllRows(endpoint);
  const options = getUniqueOptions(rows, item => item?.Purchase_Request_Number);
  return filterBySearch(options, searchText);
};



export const fetchRFQEntities = async searchText => {
  const options = await fetchEntities(searchText);
  return dedupeOptions(options);
};

export const fetchRFQOffices = async searchText => {
  const options = await fetchOffices(searchText);
  return dedupeOptions(options);
};

export const fetchRFQDepartments = async searchText => {
  const options = await fetchDepartments(searchText);
  return dedupeOptions(options);
};

export const fetchRFQUsers = async searchText => {
  const options = await fetchUsers(searchText);
  return dedupeOptions(options);
};
