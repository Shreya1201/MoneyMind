import {useApi} from "./Api";

export const useHttp = () => {
  const api = useApi();

    //Get
    const httpGet = async (url) =>  {
        const res = await api.get(url);
        return res.data;
    }

    //Post
    const httpPost = async (url, body) => {
        const res = await api.post(url, body);
        return res.data;
    }

    //Put
    const httpPut = async (url, body) => {
        const res = await api.put(url, body);
        return res.data;
    }

    //Delete
    const httpDelete = async (url) => {
        const res = await api.delete(url);
        return res.data;
    }

    return { httpGet, httpPost, httpPut, httpDelete};
}