import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtForm, AtInput, AtButton, AtMessage } from 'taro-ui'
import DocsHeader from '../../components/DocsHeader';
import CountdownButton from '../../components/CountdownButton';
import Loader from '../../components/Loader';
import RegisterService from '../../services/Register/RegisterService';
import { REFRESH_APPLICATIONS } from '../../constants/events';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './RegistrationPage.scss';

const WelcomePage = () => {
    const { isAuthenticated, isEmployee, logout, userData } = useAuth();
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

    const refreshApplications = () => {
        console.log('refreshing applications');
        fetchAndSetApplication();
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
        const approved = applications.filter(application => application.is_approved == true);
        if (approved.length > 0) {
            console.log('application approved. relogging');
            Taro.showToast({
                title: '审核通过！',
                icon: 'success'
            }, logout());
            return;
        }
        const pending = applications.filter(application => application.is_approved == null);
        if (pending.length > 0) {
            Taro.atMessage({
                message: '管理员正在努力审核',
                type: 'warning'
            });
            setHasPendingApplication(true);
        } else if (pending.length <= 0) {
            setHasPendingApplication(false);
        }
    }, [applications]);

    useEffect(() => {
        Taro.eventCenter.on(REFRESH_APPLICATIONS, refreshApplications);
        return () => {
            Taro.eventCenter.off(REFRESH_APPLICATIONS, refreshApplications);
        }
    }, []);

    return (
        <View className="container">
            <Loader />
            <AtMessage />
            <Image className="logo" src={require('../../images/logo.png')} />
            <DocsHeader title={hasPendingApplication ? '申请已提交' : '您目前还不是本平台的员工'} desc={hasPendingApplication ? '请耐心等待' : '请点击“员工注册申请”提交您的注册信息'} />
            {hasPendingApplication 
                ? (<CountdownButton className='login_button' text='更新审核' disabledText='重试' duration={60} onClick={refreshApplications} />)
                : <AtButton disabled={hasPendingApplication} className='login_button' type='primary' onClick={startRegistration}>员工注册申请</AtButton>}
            <AtButton className='logout_btn' type='secondary' onClick={logout} >退出</AtButton>
        </View>
    )
}

export default WelcomePage;
