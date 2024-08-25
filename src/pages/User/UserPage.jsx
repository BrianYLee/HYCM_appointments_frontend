import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';

import './UserPage.scss';
import "taro-ui/dist/style/components/button.scss";

const UserPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    Taro.getStorage({ key: 'userInfo' })
      .then((res) => {
        if (res.data) {
          setUserInfo(res.data);
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        // No user info in storage
      });
  }, []);

  const handleLogin = (profileRes) => {
    if (profileRes.detail?.userInfo) {
      Taro.login({
        success: (loginRes) => {
          if (loginRes.code) {
            Taro.request({
              url: 'http://localhost:3303/api/wechat-login', // Replace with your server API
              method: 'POST',
              data: {
                code: loginRes.code,
              },
              success: (serverRes) => {
                if (serverRes.data.success) {
                  const { openid } = serverRes.data;
                  const userData = {
                    ...profileRes.detail.userInfo,
                    openid,
                  };
                  setUserInfo(userData);
                  setIsLoggedIn(true);
                  Taro.setStorage({ key: 'userInfo', data: userData });
                } else {
                  Taro.showToast({
                    title: 'Server login failed',
                    icon: 'none',
                    duration: 2000,
                  });
                }
              },
              fail: () => {
                Taro.showToast({
                  title: 'Unable to connect to server',
                  icon: 'none',
                  duration: 2000,
                });
              },
            })
          } else {
            Taro.showToast({
              title: 'Login failed',
              icon: 'none',
              duration: 2000,
            });
          }
        }
      })
    }
  };

  return (
    <View className="user-container">
      {isLoggedIn ? (
        <View className="user-info">
          <Image className="user-avatar" src={userInfo.avatarUrl} />
          <Text className="user-name">{userInfo.nickName}</Text>
          <Text className="user-info-item">OpenID: {userInfo.openid}</Text>
        </View>
      ) : (
        <AtButton
          className="login-button"
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


/*

    Taro.login({
      success: (loginRes) => {
        if (loginRes.code) {
          console.log('loginRes.code: \n')
          console.log(loginRes.code)
          // Send login code to the server to get session_key and openid
          Taro.request({
            url: 'http://localhost:3303/api/wechat-login', // Replace with your server API
            method: 'POST',
            data: {
              code: loginRes.code,
            },
            success: (serverRes) => {
              if (serverRes.data.success) {
                const { session_key, openid } = serverRes.data;
                // Get user profile after successful server login
                Taro.getUserProfile({
                  desc: 'We need your profile information to personalize your experience',
                  success: (profileRes) => {
                    const userData = {
                      ...profileRes.userInfo,
                      //session_key,
                      openid,
                    };
                    setUserInfo(userData);
                    setIsLoggedIn(true);
                    Taro.setStorage({ key: 'userInfo', data: userData });
                  },
                });
              } else {
                Taro.showToast({
                  title: 'Server login failed',
                  icon: 'none',
                  duration: 2000,
                });
              }
            },
            fail: () => {
              Taro.showToast({
                title: 'Unable to connect to server',
                icon: 'none',
                duration: 2000,
              });
            },
          });
        } else {
          Taro.showToast({
            title: 'Login failed',
            icon: 'none',
            duration: 2000,
          });
        }
      },
    });
  };

*/