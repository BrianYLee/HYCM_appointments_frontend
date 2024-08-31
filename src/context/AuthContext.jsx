import React, { createContext, useState, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';

import AuthService from '../services/Auth/AuthService';
import { useLoader } from './LoaderContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authLoading, setAuthLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [userData, setUserData] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const handleLogin = async () => {
        try {
            setAuthLoading(true);
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
            setAuthLoading(false);
        }
    };

    const wechat_login = async (code) => {
        try {
            setAuthLoading(true);
            const { success, message, openId, isEmployee } = await AuthService.login(code);
            const userData = {
                openid: openId,
                isEmployee: isEmployee
            }
            setIsAuthenticated(prev => prev = true);
            setIsEmployee(prev => prev = isEmployee);
            setUserData(userData);
            Taro.setStorageSync('userInfo', userData);
        } catch (error) {
            Taro.showToast({
                title: 'Login failed',
                icon: 'fail',
                duration: 2000
            })
        } finally {
            setAuthLoading(false);
        }
    };

    const wechat_renew = async (openid) => {
        try {
            setAuthLoading(true);
            const { success, message, openId, isEmployee } = await AuthService.renew(openid);
            const userData = {
                openid: openId,
                isEmployee: isEmployee
            }
            setIsAuthenticated(prev => prev = success);
            setIsEmployee(prev => prev = isEmployee);
            setUserData(userData);
            Taro.setStorageSync('userInfo', userData);
        } catch (error) {
            setIsAuthenticated(false);
            setIsEmployee(false);
            setUserData(null);
            Taro.removeStorageSync('userInfo');
            Taro.showToast({
                title: 'renew failed',
                icon: 'fail',
                duration: 2000
            });
        } finally {
            setAuthLoading(false);
        }
    }

    const logout = () => {
        console.log('AuthContext: logout: invoked')
        Taro.removeStorageSync('userInfo');
        setIsAuthenticated(prev => prev = false);
        setIsEmployee(prev => prev = false);
        setUserData(null);
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
        <AuthContext.Provider value={{ isAuthenticated, isEmployee, userData, handleLogin, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

