import api from '../../../utils/api';

const toOption = (label, value) => ({
  label,
  value,
});

const filterBySearch = (items, searchText = '') => {
  if (!searchText) {
    return items;
  }

  const query = searchText.toLowerCase();
  return items.filter(item => item.label?.toLowerCase().includes(query));
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

const buildPayload = (filters = {}, limit = 10, offset = 0) => {
  const payload = {
    limit,
    offset,
  };

  if (filters.AdvanceReferenceNumber?.length) {
    payload.advanceReferenceNumber = filters.AdvanceReferenceNumber;
  }

  if (filters.Entity?.length) {
    payload.entity = filters.Entity;
  }

  if (filters.Office?.length) {
    payload.office = filters.Office;
  }

  if (filters.Department?.length) {
    payload.department = filters.Department;
  }

  if (filters.Vendor?.length) {
    payload.vendor = filters.Vendor;
  }

  if (filters.CreatedBy?.length) {
    payload.user = filters.CreatedBy;
  }

  if (filters.Status?.length) {
    payload.status = filters.Status;
  }

  if (filters.PurchaseOrderNumber?.length) {
    payload.purchaseOrder = filters.PurchaseOrderNumber;
  }

  if (filters.startDate) {
    payload.startDate = filters.startDate;
  }

  if (filters.endDate) {
    payload.endDate = filters.endDate;
  }

  return payload;
};

const applyNonPOFilters = (rows, filters = {}) => {
  return rows.filter(item => {
    const createdAt = item?.createdAt ? new Date(item.createdAt) : null;

    if (
      filters.AdvanceReferenceNumber?.length &&
      !filters.AdvanceReferenceNumber.includes(String(item?.AdvanceReferenceNumber))
    ) {
      return false;
    }

    if (
      filters.Entity?.length &&
      !filters.Entity.includes(
        String(item?.VaEntity?.Entity_Id || item?.VaEntity?.EntityId),
      )
    ) {
      return false;
    }

    if (
      filters.Office?.length &&
      !filters.Office.includes(
        String(item?.VaOffice?.Office_Location_Id || item?.VaOffice?.OfficeId),
      )
    ) {
      return false;
    }

    if (
      filters.Department?.length &&
      !filters.Department.includes(
        String(
          item?.VaDepartment?.Department_Id || item?.VaDepartment?.DepartmentId,
        ),
      )
    ) {
      return false;
    }

    if (
      filters.Vendor?.length &&
      !filters.Vendor.includes(
        String(item?.VaVendor?.Vendor_Id || item?.VaVendor?.VendorId),
      )
    ) {
      return false;
    }

    if (
      filters.CreatedBy?.length &&
      !filters.CreatedBy.includes(
        String(item?.Creater?.User_Id || item?.Creater?.UserId),
      )
    ) {
      return false;
    }

    if (filters.Status?.length && !filters.Status.includes(String(item?.Status))) {
      return false;
    }

    if (filters.startDate && (!createdAt || createdAt < new Date(filters.startDate))) {
      return false;
    }

    if (filters.endDate && (!createdAt || createdAt > new Date(filters.endDate))) {
      return false;
    }

    return true;
  });
};

const applyPOFilters = (rows, filters = {}) => {
  return rows.filter(item => {
    const createdAt = item?.createdAt ? new Date(item.createdAt) : null;
    const po = item?.VendorAdvancePO;

    if (
      filters.AdvanceReferenceNumber?.length &&
      !filters.AdvanceReferenceNumber.includes(String(item?.AdvanceReferenceNumber))
    ) {
      return false;
    }

    if (
      filters.PurchaseOrderNumber?.length &&
      !filters.PurchaseOrderNumber.includes(String(po?.Purchase_Order_Number))
    ) {
      return false;
    }

    if (
      filters.Entity?.length &&
      !filters.Entity.includes(String(po?.POEntity?.Entity_Id || po?.POEntity?.EntityId))
    ) {
      return false;
    }

    if (
      filters.Office?.length &&
      !filters.Office.includes(
        String(po?.POOffice?.Office_Location_Id || po?.POOffice?.OfficeId),
      )
    ) {
      return false;
    }

    if (
      filters.Department?.length &&
      !filters.Department.includes(
        String(po?.PODepartment?.Department_Id || po?.PODepartment?.DepartmentId),
      )
    ) {
      return false;
    }

    if (
      filters.Vendor?.length &&
      !filters.Vendor.includes(String(po?.POVendor?.Vendor_Id || po?.POVendor?.VendorId))
    ) {
      return false;
    }

    if (
      filters.CreatedBy?.length &&
      !filters.CreatedBy.includes(String(item?.Creator?.User_Id || item?.Creator?.UserId))
    ) {
      return false;
    }

    if (filters.Status?.length && !filters.Status.includes(String(item?.Status))) {
      return false;
    }

    if (filters.startDate && (!createdAt || createdAt < new Date(filters.startDate))) {
      return false;
    }

    if (filters.endDate && (!createdAt || createdAt > new Date(filters.endDate))) {
      return false;
    }

    return true;
  });
};

const fetchAdvanceRows = async (
  endpoint,
  filters = {},
  limit = 10,
  offset = 0,
  filterFn,
) => {
  const payload = buildPayload(filters, limit, offset);
  const res = await api.post(endpoint, payload);
  const rows = res?.data?.data?.rows || [];

  if (rows.length || offset > 0) {
    return rows;
  }

  const fallbackRes = await api.post(endpoint);
  const fallbackRows = fallbackRes?.data?.data?.rows || [];
  const filteredRows = filterFn(fallbackRows, filters);
  return filteredRows.slice(offset, offset + limit);
};

const fetchAdvanceReferenceOptions = async (endpoint, searchText = '') => {
  const fallbackRes = await api.post(endpoint);
  const rows = fallbackRes?.data?.data?.rows || [];
  const options = getUniqueOptions(rows, item => item?.AdvanceReferenceNumber);
  return filterBySearch(options, searchText);
};

export const fetchAllNonPOVendorAdvances = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchAdvanceRows('/vendorAdvance/getAll', filters, limit, offset, applyNonPOFilters);
};

export const fetchMyNonPOVendorAdvances = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchAdvanceRows(
    '/vendorAdvance/getAllByUserId',
    filters,
    limit,
    offset,
    applyNonPOFilters,
  );
};

export const fetchAllPOVendorAdvances = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchAdvanceRows(
    '/POVendorAdvance/getAllAdvanceRequest',
    filters,
    limit,
    offset,
    applyPOFilters,
  );
};

export const fetchMyPOVendorAdvances = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchAdvanceRows(
    '/POVendorAdvance/getAllAdvanceRequestByUserId',
    filters,
    limit,
    offset,
    applyPOFilters,
  );
};

export const fetchVendorAdvanceReferenceNumbers = async (searchText = '') => {
  return fetchAdvanceReferenceOptions('/vendorAdvance/getAll', searchText);
};

export const fetchMyVendorAdvanceReferenceNumbers = async (searchText = '') => {
  return fetchAdvanceReferenceOptions('/vendorAdvance/getAllByUserId', searchText);
};

export const fetchPOVendorAdvanceReferenceNumbers = async (searchText = '') => {
  return fetchAdvanceReferenceOptions('/POVendorAdvance/getAllAdvanceRequest', searchText);
};

export const fetchMyPOVendorAdvanceReferenceNumbers = async (searchText = '') => {
  return fetchAdvanceReferenceOptions(
    '/POVendorAdvance/getAllAdvanceRequestByUserId',
    searchText,
  );
};

export const fetchPurchaseOrders = async (searchText = '') => {
  const res = await api.get(`/purchaseOrder/getPO?searchString=${searchText}`);

  return (res?.data?.data || []).map(item =>
    toOption(item.Purchase_Order_Number, String(item.Purchase_Order_Number)),
  );
};

export const fetchEntities = async (searchText = '') => {
  const res = await api.get(`/entity/getEntity?searchString=${searchText}`);

  return (res?.data?.data || []).map(item =>
    toOption(item.Entity_Name, String(item.Entity_Id)),
  );
};

export const fetchOffices = async (searchText = '') => {
  const res = await api.get(`/office-location/getOffice?searchString=${searchText}`);

  return (res?.data?.data || []).map(item =>
    toOption(item.OfficeName, String(item.Office_Location_Id)),
  );
};

export const fetchDepartments = async (searchText = '') => {
  const res = await api.get(`/department/getDepartment?searchString=${searchText}`);

  return (res?.data?.data || []).map(item =>
    toOption(item.DepartmentName, String(item.Department_Id || item.DepartmentId)),
  );
};

export const fetchVendors = async (searchText = '') => {
  const res = await api.get(`/vendor-master/getVendorName?searchString=${searchText}`);

  return (res?.data?.data || []).map(item =>
    toOption(item.Vendor_Name, String(item.Vendor_Id)),
  );
};

export const fetchUsers = async (searchText = '') => {
  const res = await api.get(`/user/getUser?searchString=${searchText}`);

  return (res?.data?.data || []).map(item =>
    toOption(item.UserName, String(item.User_Id)),
  );
};
