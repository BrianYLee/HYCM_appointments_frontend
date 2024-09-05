import React from 'react';
import { View } from '@tarojs/components';
import { AtList, AtListItem, AtAvatar } from 'taro-ui';
import Taro from '@tarojs/taro';

import Loader from '../../components/Loader';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';
import './UserPage.scss';

const UserPage = () => {  
    const { isAdmin, userData, logout } = useAuth();
    const { loading } = useLoader();

    const handleAddAppointment = () => {
        Taro.navigateTo({ url: '/forms/Appointment/index' });
    };

    const handleManageEmployees = () => {
        Taro.showToast({
            title: 'WIP',
            icon: 'error'
        });
    };

    const handleManageApplications = () => {
        Taro.navigateTo({ url: '/pages/Applications/index'});
    }
    
    if (loading) {
        return (<Loader />);
    }
    
    return (
        <View className='user-page'>
            <Loader />
            <View className='profile-container at-row at-row__align--center'>
                <View className='at-col at-col-1 at-col--auto'>
                    <AtAvatar circle size='large' image={require('../../images/icons/no-user.png')} />
                </View>
                <View className='at-col'>
                    <View className='at-article__h1'>{userData.employee_name}</View>
                    <View className='at-article__info'>{userData.department == 'admin' ? '超级管理员' : userData.department}</View>
                </View>
            </View>

            <AtList className='control-panel'>
                { isAdmin && (<AtListItem
                    title='新增预约'
                    thumb={require('../../images/icons/add-apmt.png')}
                    arrow='right'
                    onClick={handleAddAppointment}
                />)}
                { isAdmin && (<AtListItem
                    title='员工管理'
                    thumb={require('../../images/icons/employees.png')}
                    arrow='right'
                    onClick={handleManageEmployees}
                />)}
                { isAdmin && (<AtListItem
                    title='员工注册审核'
                    thumb={require('../../images/icons/resume.png')}
                    arrow='right'
                    onClick={handleManageApplications}
                />)}
                <AtListItem
                    title='退出登录'
                    thumb={require('../../images/icons/logout.png')}
                    arrow='right'
                    onClick={logout}
                />
            </AtList>
        </View>
    );
};

export default UserPage;
