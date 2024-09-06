import React, { createContext, useState, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';

import AuthService from '../services/Auth/AuthService';
import { useLoader } from './LoaderContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authLoading, setAuthLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userData, setUserData] = useState({});

    const { showLoader, hideLoader } = useLoader();

    const handleLogin = async () => {
        try {
            setAuthLoading(true);
            //showLoader();
            const taroRes = await Taro.login();
            if (taroRes.code) {
                const credentials = taroRes.code;
                await wechat_login(credentials);
            } else {
                Taro.showToast({
                    title: 'Login failed, please try again!',
                    icon: 'error',
                    duration: 2000
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            Taro.showToast({
                title: 'An error occurred during login',
                icon: 'none',
                duration: 2000
            });
        } finally {
            //hideLoader();
            setAuthLoading(false);
        }
    };

    const wechat_login = async (code) => {
        try {
            //setAuthLoading(true);
            const { success, message, openId, isEmployee, employee_name, department } = await AuthService.login(code);
            const newUserData = {
                openid: openId,
                isEmployee: isEmployee,
                employee_name: employee_name,
                department: department
            };
            setIsAuthenticated(prev => prev = success);
            setIsEmployee(prev => prev = isEmployee);
            if(department == 'admin') {
                setIsAdmin(prev => prev = true);
            }
            setUserData(newUserData);
            Taro.setStorageSync('userInfo', newUserData);
        } catch (error) {
            Taro.showToast({
                title: 'Login failed',
                icon: 'fail',
                duration: 2000
            })
        } finally {
            //setAuthLoading(false);
        }
    };

    const wechat_renew = async (openid) => {
        try {
            setAuthLoading(true);
            const {success, message, openId, isEmployee, employee_name, department } = await AuthService.renew(openid);
            const newUserData = {
                openid: openId,
                isEmployee: isEmployee,
                employee_name: employee_name,
                department: department
            }
            setIsAuthenticated(prev => prev = success);
            setIsEmployee(prev => prev = isEmployee);
            if(department == 'admin') {
                setIsAdmin(prev => prev = true);
            }
            setUserData(newUserData);
            Taro.setStorageSync('userInfo', newUserData);
        } catch (error) {
            setIsAuthenticated(false);
            setIsEmployee(false);
            setUserData({});
            Taro.removeStorageSync('userInfo');
            Taro.showToast({
                title: 'renew failed',
                icon: 'fail',
                mask: true,
                duration: 2000
            });
            logout();
        } finally {
            setAuthLoading(false);
        }
    }

    const logout = () => {
        Taro.removeStorageSync('userInfo');
        setIsAuthenticated(prev => prev = false);
        setIsEmployee(prev => prev = false);
        setUserData({});
        Taro.reLaunch({
            url: '/pages/Welcome/index'
        });
    };

    const checkAuthStatus = async () => {
        const userData = Taro.getStorageSync('userInfo');
        if (userData && userData.openid) {
            try {
                await wechat_renew(userData.openid);
            } catch (err) {
                console.log(err);
            } finally {
                //setAuthLoading(false);
                //redirectOnAuthChange();
            }
        }
    };

    useEffect(() => {
        if (authLoading) {
            showLoader();
        } else if (!authLoading) {
            hideLoader();
        }
    }, [authLoading]);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isEmployee, isAdmin, userData, handleLogin, logout, checkAuthStatus, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

