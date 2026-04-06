import { useApi } from "./Api";
import { enqueueRequest } from "./RequestQueue";

export const useHttp = () => {
  const api = useApi();

  // GET
  const httpGet = async (url, headerData = {}) => {
    return enqueueRequest(async () => {
      const res = await api.get(url, {
        headers: {
          ...headerData,
        },
      });
      return res.data;
    });
  };

  // POST
  const httpPost = async (url, body, headerData = {}) => {
    return enqueueRequest(async () => {
      const res = await api.post(url, body, {
        headers: {
          headerData: JSON.stringify(headerData),
        },
      });
      return res.data;
    });
  };

  // PUT
  const httpPut = async (url, body) => {
    return enqueueRequest(async () => {
      const res = await api.put(url, body);
      return res.data;
    });
  };

  // DELETE
  const httpDelete = async (url) => {
    return enqueueRequest(async () => {
      const res = await api.delete(url);
      return res.data;
    });
  };

  return { httpGet, httpPost, httpPut, httpDelete };
};
