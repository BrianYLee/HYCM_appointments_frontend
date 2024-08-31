import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'

import './NotSignedIn.scss';

const NotSignedIn = () => {
    const handleSignIn = () => {
        // Add your sign-in logic here, e.g., navigate to the sign-in page or call a sign-in API
        console.log('Sign-in button clicked');
    };

    return (
        <View className="container">
            <Image className="no-user" src={require('../../images/icons/no-user.png')} />
            <Text className="message">You're not signed in! Click below to sign in.</Text>
            <AtButton circle type='primary' className="sign-in-button" onClick={handleSignIn}>
                Sign In
            </AtButton>
        </View>
    );
};

export default NotSignedIn;
