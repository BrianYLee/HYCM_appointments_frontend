import React from 'react';
import { View, Text, Image } from '@tarojs/components';

import './NotEmployee.scss';

const NotEmployee = () => {
    return (
        <View className="container">
            <Image className="no-user" src={require('../../images/icons/no-user.png')} />
            <Text className="message">Looks like you don't have the permissions to view this page yet.</Text>
        </View>
    );
};

export default NotEmployee;
