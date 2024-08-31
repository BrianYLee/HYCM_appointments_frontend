import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtForm, AtInput, AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';
import DocsHeader from '../../components/DocsHeader';
import Loader from '../../components/Loader';
import RegisterService from '../../services/Register/RegisterService';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './RegistrationPage.scss';

const WelcomePage = () => {
    const { isAuthenticated, isEmployee, userData, logout } = useAuth();
    const { showLoader, hideLoader, loading } = useLoader();
    const [ applications, updateApplications ] = useState([]);
    const [ hasPendingApplication, setHasPendingApplication ] = useState(false);

    const fetchAndSetApplication = async () => {
        showLoader();
        console.log('fetchApplication invoked');
        const res = await RegisterService.getApplication(userData.openid);
        if (res && res.success) {
            console.log('got applications');
            console.log(res.applications);
            updateApplications(res.applications);
            hideLoader();
        }
        else {
            hideLoader();
            Taro.showToast({
                title: '网络失误',
                duration: 2000
            });
        }
    }

    const startRegistration = () => {
        Taro.navigateTo({
            url: '../../forms/Registration/index'
        });
    }

    useEffect(() => {
        if (userData && userData.openid) {
            fetchAndSetApplication();
        }
    }, [userData]);

    useEffect(() => {
        console.log('checking if has pending applications');
        const pending = applications.filter(application => application.is_approved == null);
        console.log('filtered applications: ');
        console.log(pending);
        console.log('length is ' + pending.length);
        if (pending.length > 0) {
            setHasPendingApplication(true);
        } else if (pending.length <= 0) {
            setHasPendingApplication(false);
        }
    }, [applications])

    return (
        <View className="container">
            <Loader />
            <Image className="logo" src={require('../../images/logo.png')} />
            <DocsHeader title='您目前还不是本平台的员工' desc={hasPendingApplication ? '您以提交了申请，请耐心等待。退出并重新登录可更新审核结果。' : '请点击“员工注册申请”提交您的注册信息'} />
            <AtButton disabled={hasPendingApplication} loading={loading} className='login_button' type='primary' onClick={startRegistration}>员工注册申请</AtButton>
            <AtButton className='logout_btn' type='secondary' onClick={logout} >退出</AtButton>
        </View>
    )
}

export default WelcomePage;
