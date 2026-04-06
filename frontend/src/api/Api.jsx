import axios from "axios";
import {useContext, useMemo} from "react";
import {AuthContext} from "../contexts/AuthContext";

// const API_URL = import.meta.env.API_URL;
const API_URL = 'http://localhost:5000/api';

export const useApi = () => {
    const {token, userId, theme, logout} = useContext(AuthContext);

    const api = useMemo(()=>{
        const instance = axios.create({
            baseURL: API_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
        //Request interceptor
        instance.interceptors.request.use(
            (config) => {
                if(token){
                    config.headers.Authorization = `Bearer ${token}`;
                    config.headers.Data = JSON.stringify({
                        UserId: parseInt(userId),
                        Theme: theme,
                    });
                } 
                return config;
            },
            (error) => Promise.reject(error)
        );

        //Response interceptor
        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if(error.response.status === 401){
                    logout();
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [token, logout]);
    return api;
}