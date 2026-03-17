import api from '../../../utils/api';

export type LookupOption = { label: string; value: string };

const toDateString = (value: any) =>
  value ? new Date(value).toISOString() : '';

const createOption = (label: unknown, value: unknown): LookupOption | null => {
  if (
    label === undefined ||
    label === null ||
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const normalizedLabel = String(label).trim();
  const normalizedValue = String(value).trim();

  if (!normalizedLabel || !normalizedValue) {
    return null;
  }

  return { label: normalizedLabel, value: normalizedValue };
};

const parseFilterBigInts = (values?: Array<string | number>) =>
  (Array.isArray(values) ? values : [])
    .map(value =>
      typeof value === 'string' ? value.trim() : String(value),
    )
    .map(value => (/^\d+$/.test(value) ? BigInt(value) : null))
    .filter((value): value is bigint => value !== null);

const serializeBigInts = (payload: any) =>
  JSON.parse(
    JSON.stringify(payload, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  );

const buildPayload = ({
  filters = {},
  limit = 10,
  offset = 0,
  currentTab = '',
}) => {
  const payload: any = {
    currentTab,
    limit,
    offset,
    startDate: toDateString(filters.startDate),
    endDate: toDateString(filters.endDate),
    isDeleted: false,
  };

 payload.provisionReferenceNumber = filters.ProvisionNumber || [];
  payload.purchaseOrderNumber = filters.PurchaseOrderNumber || [];
  payload.entity = parseFilterBigInts(filters.Entity);
  payload.office = parseFilterBigInts(filters.Office);
  payload.department = parseFilterBigInts(filters.Department);
  payload.vendor = parseFilterBigInts(filters.Vendor);
  payload.user = parseFilterBigInts(filters.CreatedBy);

  return payload;
};

const normalizeResponse = (response: any) => {
  const { success, message } = response?.data || {};

  if (success === false) {
    console.warn('Provision API flagged failure:', message);
    return { rows: [], count: null };
  }

  const rows =
    response?.data?.data?.rows ||
    response?.data?.rows ||
    (Array.isArray(response?.data?.data) ? response.data.data : []) ||
    [];

  const rawCount = response?.data?.data?.count ?? response?.data?.count;
  const count = rawCount !== undefined && rawCount !== null ? Number(rawCount) : null;

  if (!rows.length) {
    console.warn('Provision API returned no rows', {
      endpoint: response.config?.url,
      payload: response.config?.data,
      rowsLength: rows.length,
    });
  }

  return { rows, count };
};

const fetchProvisions = async ({
  filters,
  limit,
  offset,
  currentTab,
  endpoint,
}: {
  filters: any;
  limit: number;
  offset: number;
  currentTab: string;
  endpoint: string;
}) => {
  const payload = serializeBigInts(
    buildPayload({
      filters,
      limit,
      offset,
      currentTab,
    }),
  );

  try {
    const response = await api.post(endpoint, payload);
    return normalizeResponse(response);
  } catch (err) {
    console.error('Provision API request failed', {
      endpoint,
      error: err,
      payload,
    });
    return { rows: [], count: 0 };
  }
};

export const fetchMyProvisions = async ( 
  provisionType: 'PO' | 'NON_PO',
  filters: any,
  limit = 10,
  offset = 0,
) => {
  const currentTab =
    provisionType === 'PO' ? 'POProvision' : 'NONPOProvision';

  return fetchProvisions({
    filters,
    limit,
    offset,
    currentTab,
    endpoint: '/provision/getAllByUserId',
  });
};

export const fetchAllProvisions = async (
  provisionType: 'PO' | 'NON_PO',
  filters: any,
  limit = 10,
  offset = 0,
) => {
  const currentTab =
    provisionType === 'PO' ? 'POProvision' : 'NONPOProvision';

  return fetchProvisions({
    filters,
    limit,
    offset,
    currentTab,
    endpoint: '/provision/getAll',
  });
};

const mapLookup = (
  rows: any[],
  selector: (item: any) => { label: unknown; value: unknown } | null,
) =>
  rows
    .map(item => selector(item))
    .filter((option): option is LookupOption => option !== null);

const fetchLookup = async (
  url: string,
  selector: (item: any) => { label: unknown; value: unknown } | null,
) => {
  const res = await api.get(url);
  const rows = res?.data?.data || [];
  return mapLookup(rows, selector);
};

export const fetchEntities = (searchText = '') =>
  fetchLookup(
    `/entity/getEntity?searchString=${encodeURIComponent(searchText)}`,
    item => createOption(item?.Entity_Name, item?.Entity_Id ?? item?.EntityId),
  );

export const fetchOffices = (searchText = '') =>
  fetchLookup(
    `/office-location/getOffice?searchString=${encodeURIComponent(searchText)}`,
    item => createOption(item?.OfficeName, item?.Office_Location_Id ?? item?.OfficeId),
  );

export const fetchDepartments = (searchText = '') =>
  fetchLookup(
    `/department/getDepartment?searchString=${encodeURIComponent(searchText)}`,
    item =>
      createOption(
        item?.DepartmentName,
        item?.Department_Id ?? item?.DepartmentId,
      ),
  );

export const fetchVendors = (searchText = '') =>
  fetchLookup(
    `/vendor-master/getVendorName?searchString=${encodeURIComponent(searchText)}`,
    item => createOption(item?.Vendor_Name, item?.Vendor_Id ?? item?.VendorId),
  );

export const fetchUsers = (searchText = '') =>
  fetchLookup(
    `/user/getUser?searchString=${encodeURIComponent(searchText)}`,
    item => createOption(item?.UserName, item?.User_Id ?? item?.UserId),
  );
