import React, { createContext, useState, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';

import AuthService from '../services/Auth/AuthService'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    console.log("AuthProvider loaded");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [userData, setUserData] = useState(null);

    const wechat_login = async (userInfo, credentials) => {
        try {
            const { success, message, openId } = await AuthService.login(credentials);
            const userData = {
                ...userInfo,
                openid: openId
            }
            setIsAuthenticated(true);
            setUserData(userData);
            Taro.setStorageSync('userInfo', userData);
        } catch (error) {
            Taro.showToast({
                title: 'Login failed',
                icon: 'fail',
                duration: 2000
            })
        }
    }

    const logout = () => {
        console.log('AuthContext: logout: invoked')
        Taro.removeStorageSync('userInfo');
        setIsAuthenticated(false);
        setUserData(null);
    };

    const checkAuthStatus = () => {
        console.log('AuthContext: checkAuthStatus: invoked.');
        const userData = Taro.getStorageSync('userInfo');
        if (userData && userData.openid) {
            console.log('AuthContext: checkAuthStatus: userInfo found with wechat openid: ' + userData.openid);
            setIsAuthenticated(true);
            setUserData(userData);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, wechat_login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
