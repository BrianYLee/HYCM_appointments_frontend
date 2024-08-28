import React, { useState, useEffect, useCallback } from 'react';
import Taro from '@tarojs/taro';
import CalendarTab from '../../components/CalendarTab';
import AppointmentsService from '../../services/Appointments/AppointmentsService';
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard';
import { View, Text, Image } from '@tarojs/components';
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
    const [ loading, setLoading ] = useState(true);
    const [ selectedDate, setDate ] = useState(new Date().toISOString().split('T')[0]);
    const [ appointments, updateAppointments ] = useState([]);
    const [ currentApmt, updateCurrentApmt ] = useState({});
    const [ showCheckInModal, toggleCheckInModal ] = useState(false);
    const [ showCheckOutModal, toggleCheckOutModal ] = useState(false);

    console.log(selectedDate);
    // request appointments data
    const fetchAndSetAppointments = async () => {
        console.log('fetchAndSetAppointments invoked');
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

    // checkin functions
    const handleCheckIn = (apmtObj) => {
        updateCurrentApmt(apmtObj);
        toggleCheckInModal(true);
    }
    const handleCheckInConfirm = async () => {
        console.log('check-in modal confirmed');
        console.log(`id = ${currentApmt.id}, plate = ${currentApmt.plate}`);
        const res = await AppointmentsService.checkIn(currentApmt.id);
        if (res && res.success) {
            Taro.showToast({
                title: '签到成功',
                icon: 'success',
                duration: 1500,
                complete: () => {
                    fetchAndSetAppointments();
                }
            });
        } else {
            Taro.showToast({
                title: '签到失败',
                icon: 'fail',
                duration: 1500
            });
        }
        toggleCheckInModal(false);
        updateCurrentApmt({});
    }

    // checkout functions
    const handleCheckOut = (apmtObj) => {
        updateCurrentApmt(apmtObj);
        toggleCheckOutModal(true);
    }
    const handleCheckOutConfirm = async () => {
        console.log('check-out modal confirmed');
        console.log(`id = ${currentApmt.id}, plate = ${currentApmt.plate}`);
        const res = await AppointmentsService.checkOut(currentApmt.id);
        if (res && res.success) {
            Taro.showToast({
                title: '签离成功',
                icon: 'success',
                duration: 1500,
                complete: () => {
                    fetchAndSetAppointments();
                }
            });
        } else {
            Taro.showToast({
                title: '签离失败',
                icon: 'fail',
                duration: 1500
            });
        }
        toggleCheckOutModal(false);
        updateCurrentApmt({});
    }

    const handleCancel = () => {
        console.log('check-out modal cancelled');
        updateCurrentApmt({})
        toggleCheckOutModal(false);
    }

    return (
        <View className='index'>
            <CalendarTab currentDate={selectedDate} handleDateChange={setDate}></CalendarTab>
            <AtModal
                isOpened={showCheckInModal}
                onClose={() => toggleCheckInModal(false)}
            >
                <AtModalHeader>请确认车牌号</AtModalHeader>
                <AtModalContent>
                    <View className='.at-article__h1 plateNumber'>{currentApmt.plate}</View>
                </AtModalContent>
                <AtModalAction className='modal-button-group'>
                    <AtButton circle type='secondary' onClick={handleCancel}>取消</AtButton>
                    <AtButton circle type='primary' onClick={handleCheckInConfirm}>确定</AtButton>
                </AtModalAction>
            </AtModal>
            <AtModal
                isOpened={showCheckOutModal}
                onClose={() => toggleCheckOutModal(false)}
            >
                <AtModalHeader>请确取消签到</AtModalHeader>
                <AtModalContent>
                    <View className='.at-article__h2 plateNumber'>确认要取消签到？</View>
                    <View className='.at-article__h1 plateNumber'>{currentApmt.plate}</View>
                </AtModalContent>
                <AtModalAction className='modal-button-group'>
                    <AtButton circle type='secondary' onClick={handleCancel}>返回</AtButton>
                    <AtButton circle type='primary' onClick={handleCheckOutConfirm}>取消签到</AtButton>
                </AtModalAction>
            </AtModal>
            {appointments.length > 0 ? (
                appointments.map(( appointment, idx ) => (
                    <AppointmentCard apmtInfo={appointment} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut}/>
                ))
            ) : (
                <>
                    <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                    <Text className="title">看来今天没有预约～</Text>
                </>
            )}
            {appointments.length > 0 && (<AtDivider content='没有更多预约啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
        </View>
    )
}

export default AppointmentsPage;

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
