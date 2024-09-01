import React from 'react';
import { View } from '@tarojs/components';
import { AtList, AtListItem, AtAvatar } from 'taro-ui';
import Taro from '@tarojs/taro';

import Loader from '../../components/Loader';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';
import './UserPage.scss';

const UserPage = () => {

  const { isAuthenticated, isEmployee, userData, handleLogin, logout, checkAuthStatus } = useAuth();
  const { loading, showLoader, hideLoader } = useLoader();

  const handleAddAppointment = () => {
    // Handle navigation or actions for managing applications
    Taro.navigateTo({ url: '/forms/Appointment/index' });
  };

  const handleManageEmployees = () => {
    // Handle navigation or actions for managing appointments
    //Taro.navigateTo({ url: '/pages/manageAppointments/index' });
    Taro.showToast({
      title: 'WIP',
      icon: 'error'
    });
  };

  const handleManageApplications = () => {
    console.log('manage applications');
    Taro.showToast({
      title: 'WIP',
      icon: 'error'
    })
  }

  return (
    <View className='user-page'>
      <View className='profile-container at-row at-row__align--center'>
        <View className='at-col at-col-1 at-col--auto'>
          <AtAvatar circle size='large' image={require('../../images/icons/no-user.png')}></AtAvatar>
        </View>
        <View className='at-col'>
          <View className='at-article__h1'>john doe</View>
          <View className='at-article__info'>市场部</View>
        </View>
      </View>

      <AtList>
        <AtListItem
          title='新增预约'
          thumb={require('../../images/icons/add-apmt.png')}
          arrow='right'
          onClick={handleAddAppointment}
        />
        <AtListItem
          title='员工管理'
          thumb={require('../../images/icons/employees.png')}
          arrow='right'
          onClick={handleManageEmployees}
        />
        <AtListItem
          title='员工注册审核'
          thumb={require('../../images/icons/resume.png')}
          arrow='right'
          onClick={handleManageApplications}
        />
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