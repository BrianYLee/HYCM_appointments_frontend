// imports
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from "@tarojs/components";
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";

import { AtButton } from 'taro-ui'
import Taro from '@tarojs/taro';

const HomePage = () => {
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

    const handleClick = () => {
        Taro.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (profileRes) => {
              const userData = {
                ...profileRes.userInfo,
                //session_key,
                //openid,
              };
              setUserInfo(userData);
              setIsLoggedIn(true);
              Taro.setStorage({ key: 'userInfo', data: userData });
            },
          });

    }
    const handleClick2 = (userInfo) => {
        console.log('userInfo: ');
        console.log(userInfo?.detail?.userInfo);
    }
    return (
        <View>
            hello world
            <AtButton openType='getUserInfo' lang='zh_CN' onGetUserInfo={handleClick2}>click me</AtButton>
        </View>
    )
}

export default HomePage;