import React, { useState, useEffect, useCallback } from 'react';
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard';
import { View, Text } from '@tarojs/components';
import { useEnv, useNavigationBar, useModal, useToast } from "taro-hooks";
import { AtButton, AtDivider, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

// Appointments page styling
import './AppointmentsPage.scss'
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/card.scss';
import 'taro-ui/dist/style/components/divider.scss';
import 'taro-ui/dist/style/components/modal.scss';
import 'taro-ui/dist/style/components/article.scss';
import 'taro-ui/dist/style/components/button.scss';

//debug
const apmtInfo1 = {
    id: 'id1',
    date: 'date1',
    type: 'type1',
    areas: 'areas1',
    studioName: 'studio1',
    managerName: 'manager1',
    plate: 'plate1',
    arrived: false
}
const apmtInfo2 = {
    id: 'id2',
    date: 'date2',
    type: 'type2',
    areas: 'areas2',
    studioName: 'studio2',
    managerName: 'manager2',
    plate: 'plate2',
    arrived: true
}

const AppointmentsPage = () => {
    const [ currentPlate, updateCurrentPlate ] = useState('');
    const [ showModal, toggle ] = useState(false);

    const { show } = useToast({ mask: true });
    const handleConfirm = () => {
        console.log('modal confirmed');
        toggle(false);
        show({title: "complete!"});
        updateCurrentPlate('')
    }
    
    const handleCancel = () => {
        console.log('modal cancelled');
        updateCurrentPlate('')
        toggle(false);
    }
    const handleCheckIn = (plate) => {
        updateCurrentPlate(plate);
        toggle(true);
    }
    /*
    const showModal = useModal({
            title: "请确认车牌号",
            confirmColor: "#8c2de9",
            confirmText: "确认",
            cancelText: "取消",
            showCancel: true
    });

    const { show } = useToast({ mask: true });

    const handleModal = useCallback((plate) => {
        console.log('handleModal invoked. plate is = ' + plate);
        showModal({ content: plate }).then(() => {
            // POST api call to check-in the vehicle
            show({ title: "签到成功！" });
        });
    }, [showModal, show]);
*/
    return (
        <View>
            <AtModal
                isOpened={showModal}
                onClose={() => toggle(false)}
            >
                <AtModalHeader>请确认车牌号</AtModalHeader>
                <AtModalContent>
                    <View className='.at-article__h1 plateNumber'>{currentPlate}</View>
                </AtModalContent>
                <AtModalAction className='modal-button-group'>
                    <AtButton circle type='secondary' onClick={handleCancel}>取消</AtButton>
                    <AtButton circle type='primary' onClick={handleConfirm}>确定</AtButton>
                </AtModalAction>
            </AtModal>
            <AppointmentCard note='note1' apmtInfo={apmtInfo1} handleButtonClick={handleCheckIn}/>
            <AppointmentCard note='note2' apmtInfo={apmtInfo2} handleButtonClick={handleCheckIn}/>
            <AtDivider content='我是有底线的' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>
        </View>
    )
}

export default AppointmentsPage;
