import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtForm, AtInput, AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';
import DocsHeader from '../../components/DocsHeader';
import Loader from '../../components/Loader';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './RegistrationPage.scss';

const WelcomePage = () => {
    const { isAuthenticated, isEmployee, logout } = useAuth();
    const { loading } = useLoader();

    return (
        <View className="container">
            <Loader />
            <Image className="logo" src={require('../../images/logo.png')} />
            <DocsHeader title='您目前还不是本平台的员工' desc='请点击“员工注册申请”提交您的注册信息' />
            <AtButton disabled={false} loading={loading} className='login_button' type='primary' onClick={() => {console.log('button click')}}>注册申请</AtButton>
            <AtButton className='login_button' type='primary' onClick={logout} >logout</AtButton>
        </View>
    )
}

export default WelcomePage;
