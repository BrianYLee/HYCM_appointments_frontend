import React, { createContext, useState, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';

import AuthService from '../services/Auth/AuthService'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    console.log("AuthProvider loaded");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [userData, setUserData] = useState(null);

    const wechat_login = (userInfo, userCode) => {
        console.log('AuthContext: wechat_login: invoked.');
        let loginResult = null;
        if (isAuthenticated) {
            return { success: false, message: 'already logged in...' };
        }
        const loginRes = AuthService.login_wechat(userCode);
        if (!loginRes) {
            loginResult = { success: false, message: 'server didnt response with valid login data' };
        }
        else if (!loginRes.success) {
            loginResult = loginRes;
        }
        else { // success
            loginResult = { success: true, message: loginRes.message };
            const userData = {
                ...userInfo,
                openid: loginRes.openId
            }
            setIsAuthenticated(true);
            setUserData(userData);
            Taro.setStorageSync('userInfo', userData);
        }
        console.log('AuthContext: wechat_login: loginResult: ');
        console.log(loginResult);
        return loginResult;
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
        <AuthContext.Provider value={{ isAuthenticated, wechat_login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
