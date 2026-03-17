import api from '../../../utils/api';

export type OcrJobResponse = {
  rows?: any[];
  count?: number | string | null;
};

type FetchOcrJobsParams = {
  limit?: number;
  offset?: number;
};

export const fetchOcrJobs = async ({
  limit = 10,
  offset = 0,
}: FetchOcrJobsParams = {}): Promise<OcrJobResponse> => {
  const payload = {
    limit,
    offset,
    module: null,
    type: 'AI_DOCUMENT_PROCESSING',
  };

  const res = await api.post('/job/getByUserId', payload);
  const rows =
    res?.data?.data?.rows ||
    res?.data?.rows ||
    (Array.isArray(res?.data?.data) ? res.data.data : []) ||
    [];
  const rawCount = res?.data?.data?.count ?? res?.data?.count;
  const count = rawCount !== undefined && rawCount !== null ? Number(rawCount) : null;

  return { rows, count };
};
