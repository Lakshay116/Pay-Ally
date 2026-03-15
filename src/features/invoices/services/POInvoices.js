import api from '../../../utils/api';

export const fetchPurchaseOrders = async (searchText = '') => {
    const res = await api.get(
        `/purchaseOrder/getPO?searchString=${searchText}`,
    );

    return (res?.data?.data || []).map(item => ({
        label: item.Purchase_Order_Number,
        value: item.Purchase_Order_Number,
    }));
};

export const fetchSrnGrn = async (searchText = '') => {
    const res = await api.get(
        `/Srn_Grn/getSrn_Grn?searchString=${searchText}`,
    );

    return (res?.data?.data || []).map(item => ({
        label: item.SRN_GRN_Number,
        value: item.SRN_GRN_Number,
    }));
};

export const fetchInvoiceReferenceNumbers = async (searchText = '') => {
    const res = await api.get(
        `/invoice/getReferenceNumber?searchString=${searchText}`,
    );

    return (res?.data?.data || []).map(item => ({
        label: item.POInvoiceReferenceNumber,
        value: item.POInvoiceReferenceNumber,
    }));
};

export const fetchPOInvoiceNumbers = async (searchText = '') => {
    const res = await api.get(
        `/invoice/getInvoice?searchString=${searchText}`,
    );

    return (res?.data?.data || []).map(item => ({
        label: item.Invoice_Number,
        value: item.Invoice_Number,
    }));
};
