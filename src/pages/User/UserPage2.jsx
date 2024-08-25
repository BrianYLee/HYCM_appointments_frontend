


import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import './UserPage.scss';

const UserPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    Taro.login({
      success: (res) => {
        if (res.code) {
          // Use res.code to get session_key and openid from your server
          Taro.request({
            url: 'localhost:3303/login', // Replace with your backend endpoint
            method: 'POST',
            data: {
              code: res.code
            },
            success: (response) => {
              if (response.data && response.data.success) {
                setIsLoggedIn(true);
                // Save user data or token if necessary
                Taro.setStorageSync('userInfo', response.data.userInfo);
                Taro.showToast({
                  title: 'Login Successful',
                  icon: 'success'
                });
              } else {
                Taro.showToast({
                  title: 'Login Failed',
                  icon: 'none'
                });
              }
            },
            fail: () => {
              Taro.showToast({
                title: 'Request Failed',
                icon: 'none'
              });
            }
          });
        } else {
          Taro.showToast({
            title: 'Login Failed',
            icon: 'none'
          });
        }
      },
      fail: () => {
        Taro.showToast({
          title: 'Login Failed',
          icon: 'none'
        });
      }
    });
  };

  return (
    <View className='login-page'>
      {isLoggedIn ? (
        <View>
          <Text>Welcome Back!</Text>
          {/* Add additional logic or navigation here */}
        </View>
        
      ) : (
        <View>
          <Text>Please log in using your WeChat account:</Text>
          <Button className='login-button' onClick={handleLogin}>Log in with WeChat</Button>
        </View>
      )}
    </View>
  );
};

export default UserPage;
