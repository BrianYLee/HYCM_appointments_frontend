import React, { createContext, useState, useContext, useEffect } from 'react';
import Taro from '@tarojs/taro';

import AuthService from '../services/Auth/AuthService'
import { useLoader } from './LoaderContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    console.log("AuthProvider loaded");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [userData, setUserData] = useState(null);

    const { showLoader, hideLoader } = useLoader();

    const redirectOnAuthChange = () => {
        if (isAuthenticated && isEmployee) {
            // goto appointments
            console.log('redir auth emp')
            Taro.switchTab({
                url: '/pages/Appointments/index'
            });
        }
        else if (isAuthenticated && !isEmployee) {
            // goto registration page
            console.log('redir auth')
            Taro.redirectTo({
                url: '/pages/Registration/index'
            });
        }
        else {
            console.log('relaunch')
            Taro.reLaunch({
                url: '/pages/Welcome/index'
            });
        }
    }

    const handleLogin = async () => {
        try {
            showLoader();
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
            hideLoader();
        }
    };

    const wechat_login = async (code) => {
        try {
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
        }
    }
    const wechat_renew = async (openid) => {
        try {
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
        showLoader();
        console.log('AuthContext: checkAuthStatus: invoked.');
        const userData = Taro.getStorageSync('userInfo');
        if (userData && userData.openid) {
            console.log('AuthContext: checkAuthStatus: userInfo found with wechat openid: ' + userData.openid);
            try {
                await wechat_renew(userData.openid);
            } catch (err) {
                console.log(err);
            } finally {
                hideLoader();
                //redirectOnAuthChange();
            }
            /*
            if (userData.isEmployee) {
                console.log('user is also an employee');
                setIsAuthenticated(prev => prev = true);
                setIsEmployee(prev => prev = true);
            }
            else {
                setIsAuthenticated(prev => prev = true);
                setIsEmployee(prev => prev = false);
            }
            setUserData(prev => prev = userData);
            */
        }
        else {
            console.log('AuthContext: checkAuthStatus: no user found')
            hideLoader();
        }
    };

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

/*
    const handleLogin = async (userProfile) => {
        showLoader();
        try {
            const userInfo = userProfile?.detail?.userInfo;
            if (!userInfo) {
                throw new Error('could not get user info');
            }
            const taroRes = await Taro.login();
            if (taroRes.code) {
                const credentials = taroRes.code;
                wechat_login(userInfo, credentials);
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
            hideLoader();
        }
    };

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
*/
