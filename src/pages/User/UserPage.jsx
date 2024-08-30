import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';
import Loader from '../../components/Loader';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './UserPage.scss';

const UserPage = () => {
    const { isAuthenticated, isEmployee, userData, handleLogin, logout } = useAuth();
    const { loading, showLoader, hideLoader } = useLoader();

  return (
    <View className='index'>
        <Loader />
        {isAuthenticated ? (
            <View>
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
                    onClick={handleLogin}
                    >
                    Login with WeChat
                </AtButton>
        )}
    </View>
  );
};

export default UserPage;

/*
                <Image src={userData.avatarUrl} />
                <View>{userData.nickName}</View>
                <View>OpenID: {userData.openid}</View>
*/
