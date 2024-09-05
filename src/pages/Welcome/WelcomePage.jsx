import React, { useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';
import DocsHeader from '../../components/DocsHeader';
import Loader from '../../components/Loader';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './WelcomePage.scss';

const WelcomePage = () => {
    const { isAuthenticated, isEmployee, handleLogin } = useAuth();
    const { loading } = useLoader();

    useEffect(() => {
        if (isAuthenticated && isEmployee) {
            // go to appointments page
            Taro.switchTab({
                url: '/pages/Appointments/index'
            });
        }
        if (isAuthenticated && !isEmployee) {
            // go to register page
            Taro.redirectTo({
                url: '/pages/Registration/index'
            });
        }
    }, [isAuthenticated, isEmployee]);

    return (
        <View className="container">
            <Loader />
            <Image className="logo" src={require('../../images/logo.png')} />
            <DocsHeader title='欢迎来到嗨呦文化·入场签到' desc='此平台为内部人员使用。如您是员工，请点击 “登录” 进入平台' />
            <AtButton disabled={(isAuthenticated || loading)} loading={loading} className='login_button' type='primary' onClick={handleLogin}>一键登录</AtButton>
        </View>
    )
}

export default WelcomePage;
