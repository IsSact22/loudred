export const fetcher = (url, params) =>
  apiClient.get(url, { params }).then((res) => res.data.data);
