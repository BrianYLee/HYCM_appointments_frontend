import React, { createContext, useState, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';

import AuthService from '../services/Auth/AuthService'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    console.log("AuthProvider loaded");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [userData, setUserData] = useState(null);

    const wechat_login = async (userInfo, code) => {
        try {
            const { success, message, openId, isEmployee } = await AuthService.login(code);
            const userData = {
                ...userInfo,
                openid: openId,
                isEmployee: isEmployee
            }
            setIsAuthenticated(true);
            setIsEmployee(isEmployee);
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
        setIsEmployee(false);
        setUserData(null);
    };

    const checkAuthStatus = () => {
        console.log('AuthContext: checkAuthStatus: invoked.');
        const userData = Taro.getStorageSync('userInfo');
        if (userData && userData.openid) {
            console.log('AuthContext: checkAuthStatus: userInfo found with wechat openid: ' + userData.openid);
            setIsAuthenticated(true);
            setUserData(userData);
            if (userData.isEmployee) {
                console.log('user is also an employee');
                setIsEmployee(true);
            }
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isEmployee, userData, wechat_login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
