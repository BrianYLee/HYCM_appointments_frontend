import React, { createContext, useState, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    console.log("AuthProvider loaded");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData) => {
        console.log('AuthContext: login: invoked. userData: ');
        console.log(userData);
        setIsAuthenticated(true);
        Taro.setStorageSync('userInfo', userData);
    };

    const logout = () => {
        console.log('AuthContext: logout: invoked')
        setIsAuthenticated(false);
        Taro.removeStorageSync('userInfo');
    };

    const checkAuthStatus = () => {
        console.log('AuthContext: checkAuthStatus: invoked.');
        const userData = Taro.getStorageSync('userInfo');
        if (userData && userData.openid) {
            console.log('AuthContext: checkAuthStatus: userInfo found with wechat openid: ' + userData.openid);
            setIsAuthenticated(true);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
