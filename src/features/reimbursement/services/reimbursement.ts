import api from '../../../utils/api';

const buildPayload = (filters = {}, limit = 10, offset = 0) => {
  const payload: any = {
    limit,
    offset,
  };

  if (filters.Entity?.length) {
    payload.entity = filters.Entity;
  }

  if (filters.ReimbursementId?.length) {
    payload.reimbursement = filters.ReimbursementId;
  }

  if (filters.Office?.length) {
    payload.office = filters.Office;
  }

  if (filters.Department?.length) {
    payload.department = filters.Department;
  }

  if (filters.CreatedBy?.length) {
    payload.user = filters.CreatedBy;
  }

  if (filters.Status?.length) {
    payload.status = filters.Status;
  }

  if (filters.startDate) {
    payload.startDate = filters.startDate;
  }

  if (filters.endDate) {
    payload.endDate = filters.endDate;
  }

  return payload;
};

const fetchRows = async (
  endpoint: string,
  filters = {},
  limit = 10,
  offset = 0,
) => {
  const payload = buildPayload(filters, limit, offset);
  const res = await api.post(endpoint, payload);
  const rows = res?.data?.data?.rows || [];
  const count = res?.data?.data?.count;
  return { rows, count };
};

export const fetchAllReimbursements = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchRows('/reimbursement/getAll', filters, limit, offset);
};

export const fetchMyReimbursements = async (
  filters = {},
  limit = 10,
  offset = 0,
) => {
  return fetchRows('/reimbursement/getAllByUserId', filters, limit, offset);
};

const toOption = (label: string, value: string) => ({ label, value });

export const fetchEntities = async (searchText = '') => {
  const res = await api.get(`/entity/getEntity?searchString=${searchText}`);
  return (res?.data?.data || []).map((item: any) =>
    toOption(item.Entity_Name, String(item.Entity_Id)),
  );
};

export const fetchOffices = async (searchText = '') => {
  const res = await api.get(`/office-location/getOffice?searchString=${searchText}`);
  return (res?.data?.data || []).map((item: any) =>
    toOption(item.OfficeName, String(item.Office_Location_Id)),
  );
};

export const fetchDepartments = async (searchText = '') => {
  const res = await api.get(`/department/getDepartment?searchString=${searchText}`);
  return (res?.data?.data || []).map((item: any) =>
    toOption(item.DepartmentName, String(item.Department_Id || item.DepartmentId)),
  );
};

export const fetchUsers = async (searchText = '') => {
  const res = await api.get(`/user/getUser?searchString=${searchText}`);
  return (res?.data?.data || []).map((item: any) =>
    toOption(item.UserName, String(item.User_Id)),
  );
};

export const fetchReimbursementIds = async (searchText = '') => {
  const res = await api.get(
    `/reimbursement/getAllReimbursementId?searchString=${searchText}`,
  );
  return (res?.data?.data || []).map((item: any) =>
    toOption(
      String(item.ReimbursementId || item.reimbursementId || item.id),
      String(item.ReimbursementId || item.reimbursementId || item.id),
    ),
  );
};
