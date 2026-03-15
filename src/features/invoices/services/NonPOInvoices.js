import api from '../../../utils/api';

/* ---------- INVOICES ---------- */

export const fetchAllNonPOInvoices = async (filters, limit, offset) => {
    return api.post('/nonPOInvoice/getAll', {
        limit,
        offset,

        invoice: filters.NonPOInvoiceNumber
            ? [filters.NonPOInvoiceNumber]
            : [],
        invoiceNumber: filters.InvoiceNumber
            ? [filters.InvoiceNumber]
            : [],
        entity: filters.Entity ? [filters.Entity] : [],
        office: filters.Office ? [filters.Office] : [],
        department: filters.Department
            ? [filters.Department]
            : [],
        vendor: filters.Vendor ? [filters.Vendor] : [],
        user: filters.CreatedBy ? [filters.CreatedBy] : [],
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.Status,
        paymentStatus: filters.PaymentStatus,
    });
};

/* ---------- ENTITY ---------- */


export const fetchEntities = async (searchText = '') => {
    const res = await api.get(
        `/entity/getEntity?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: item.Entity_Name,
        value: item.Entity_Id,
    }));
};

/* ---------- OFFICE ---------- */

export const fetchOffices = async (searchText = '') => {
    const res = await api.get(
        `/office-location/getOffice?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: item.OfficeName,
        value: item.Office_Location_Id,
    }));
};

/* ---------- DEPARTMENT ---------- */

export const fetchDepartments = async (searchText = '') => {
    const res = await api.get(
        `/department/getDepartment?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: item.DepartmentName,
        value: item.Department_Id || item.DepartmentId,
    }));
};

/* ---------- VENDOR ---------- */

export const fetchVendors = async (searchText = '') => {
    const res = await api.get(
        `/vendor-master/getVendorName?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: item.Vendor_Name,
        value: item.Vendor_Id,
    }));
};

export const fetchNonPOInvoiceNumbers = async (searchText = '') => {
    const res = await api.get(
        `/nonPOInvoice/getInvoice?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: item.NonPOInvoiceNumber,
        value: item.NonPOInvoiceId,
    }));
};

export const fetchNonPOInvoiceNo = async (searchText = '') => {
    const res = await api.get(
        `/nonPOInvoice/getInvoiceNumber?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: item.InvoiceNumber,
        value: item.NonPOInvoiceId,
    }));
};

/* ---------- USERS ---------- */

export const fetchUsers = async (searchText = '') => {
    const res = await api.get(
        `/user/getUser?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: item.UserName,
        value: item.User_Id,
    }));
};

export const fetchPurchaseOrderNumber = async (searchText = '') => {
    const res = await api.get(
        `/purchaseOrder/getPO?searchString=${searchText}`
    );

    return res.data.data.map(item => ({
        label: Purchase_Order_Number,
        value: Purchase_Order_Id,
    }));
};

