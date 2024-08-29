import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';
import Loader from '../../components/Loader';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './UserPage.scss';

const UserPage = () => {
    const { isAuthenticated, isEmployee, userData, wechat_login, logout } = useAuth();
    const { showLoader, hideLoader } = useLoader();

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

  return (
    <View className='index'>
        <Loader />
        {isAuthenticated ? (
            <View>
                <Image src={userData.avatarUrl} />
                <View>{userData.nickName}</View>
                <View>OpenID: {userData.openid}</View>
                <View>is employee: {(isEmployee ? 'yes' : 'no')}</View>
                <AtButton
                    type='secondary'
                    onClick={logout}
                >
                    Logout
                </AtButton>
            </View>
            
        ) : (
                <AtButton
                    circle
                    type='primary'
                    openType="getUserInfo"
                    onGetUserInfo={handleLogin}
                    >
                    Login with WeChat
                </AtButton>
        )}
    </View>
  );
};

export default UserPage;
