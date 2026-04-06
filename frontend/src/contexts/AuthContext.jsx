import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [theme, setTheme] = useState(null);
    const [userId, setUserId] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const storedToken = localStorage.getItem("token");
        const theme = localStorage.getItem("theme");
        const userId = localStorage.getItem("userId");
        if (storedToken && theme && userId) {
        setToken(storedToken);
        setTheme(theme);
        setUserId(userId);
        }
        setLoading(false);
    },[]);

    const login = (newToken, theme, userId) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("theme", theme);
        localStorage.setItem("userId", userId);
        setToken(newToken);
        setTheme(theme);
        setUserId(userId);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("theme");
        localStorage.removeItem("userId");
        setToken(null);
        setTheme('light');
        setUserId(null);
    };

    return(
        <AuthContext.Provider value={{token, theme, userId ,login, logout, setToken, loading}}>
             {!loading && children}
        </AuthContext.Provider>
    )
}