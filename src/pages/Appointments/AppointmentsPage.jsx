import React, { useState, useEffect, useCallback } from 'react';
import Taro from '@tarojs/taro';
import CalendarTab from '../../components/CalendarTab';
import AppointmentsService from '../../services/Appointments/AppointmentsService';
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

const AppointmentsPage = () => {
    const [ selectedDate, setDate ] = useState(new Date().toISOString().split('T')[0]);
    const [ appointments, updateAppointments ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ currentPlate, updateCurrentPlate ] = useState('');
    const [ showModal, toggle ] = useState(false);

    console.log(selectedDate);
    // request appointments data
    const fetchAndSetAppointments = async () => {
        setLoading(true);
        const res = await AppointmentsService.getAppointments(selectedDate);
        if (res && res.success) {
            updateAppointments(res.data);
        }
        setLoading(false);
    };

    const handlePullDownRefresh = async () => {
        await fetchAndSetAppointments(selectedDate);
        Taro.stopPullDownRefresh(); // Stop the pull-down refresh animation
    };

    useEffect(() => {
        fetchAndSetAppointments(selectedDate);
    }, [selectedDate]);

    // Add the onPullDownRefresh lifecycle method
    useEffect(() => {
        Taro.startPullDownRefresh();
        handlePullDownRefresh();
    }, []);

    // modal
    const { show } = useToast({ mask: true });

    const handleCheckIn = (plate) => {
        updateCurrentPlate(plate);
        toggle(true);
    }
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

    return (
        <View className='index'>
            <CalendarTab currentDate={selectedDate} handleDateChange={setDate}></CalendarTab>
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
            {appointments.length > 0 ? (
                appointments.map(( appointment, idx ) => (
                    <AppointmentCard apmtInfo={appointment} handleButtonClick={handleCheckIn}/>
            ))
            ) : (
                <Text>No appointments available.</Text>
            )}
            <AtDivider content='没有更多预约啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>
        </View>
    )
}

export default AppointmentsPage;


/*
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
*/

/*
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
*/