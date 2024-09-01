import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import NotSignedIn from '../../components/NotSignedIn';
import NotEmployee from '../../components/NotEmployee';
import Modal from '../../components/Modal';
import CalendarTab from '../../components/CalendarTab';
import AppointmentsService from '../../services/Appointments/AppointmentsService';
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard';
import { View, Text, Image } from '@tarojs/components';
import { AtDivider, AtTabs, AtTabsPane } from 'taro-ui'
import Loader from '../../components/Loader';
import { REFRESH_APMTS } from '../../constants/events';

import { useLoader } from '../../context/LoaderContext';
import { useAuth } from '../../context/AuthContext';

// Appointments page styling
import './AppointmentsPage.scss'

const AppointmentsPage = () => {
    const { isAuthenticated, isEmployee, userData, authLoading } = useAuth();
    if ( !isAuthenticated && authLoading) {
        return (<Loader />);
    }
    else if ( !isAuthenticated && !authLoading) {
        console.log('AppointmentsPage: user not authenticated');
        return (<NotSignedIn/>);
    } else if ( isAuthenticated && !isEmployee ) {
        console.log('AppointmentsPage: user is not an employee status');
        return (<NotEmployee/>);
    }

    const { showLoader, hideLoader } = useLoader();
    const [ selectedDate, setDate ] = useState(new Date().toISOString().split('T')[0]);
    const [ currentTab, setTab ] = useState(0);
    const [ appointments, updateAppointments ] = useState([]);
    const [ notArrived, updateNotArrived ] = useState([]);
    const [ arrived, updateArrived ] = useState([]);
    const [ currentApmt, updateCurrentApmt ] = useState({});
    const [ showCheckInModal, toggleCheckInModal ] = useState(false);
    const [ showCheckOutModal, toggleCheckOutModal ] = useState(false);

    // request appointments data
    const fetchAndSetAppointments = async () => {
        showLoader();
        console.log('fetching apmts for ' + selectedDate);
        const res = await AppointmentsService.getAppointments(selectedDate);
        if (res && res.success) {
            updateAppointments(res.data);
            updateNotArrived(res.data.filter( apmt => !apmt.checked_in));
            updateArrived(res.data.filter( apmt => apmt.checked_in));
        }
        hideLoader();
    };

    const handleDateChange = (date) => {
        console.log('got new date from calendar: ' + date);
        setDate(prev => (prev = date));
    }

    const refresh = () => {
        if (isAuthenticated && isEmployee && userData?.openid) {
            fetchAndSetAppointments();
        }
    }
    // checkin functions
    const handleCheckIn = (apmtObj) => {
        updateCurrentApmt(apmtObj);
        toggleCheckInModal(true);
    }
    const handleCheckInConfirm = async () => {
        showLoader();
        const res = await AppointmentsService.checkIn(currentApmt.id);
        if (res && res.success) {
            hideLoader();
            Taro.showToast({
                title: '签到成功',
                icon: 'success',
                //duration: 1000,
                complete: () => {
                    fetchAndSetAppointments();
                }
            });
        } else {
            hideLoader();
            Taro.showToast({
                title: '签到失败',
                icon: 'fail',
                duration: 1000
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
        showLoader();
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
            hideLoader();
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
        updateCurrentApmt({})
        toggleCheckInModal(false);
        toggleCheckOutModal(false);
    }

    useEffect(() => {
        if (isAuthenticated && isEmployee && userData?.openid) {
            fetchAndSetAppointments();
        }
    }, [selectedDate]);

    useEffect(() => {
        Taro.eventCenter.on(REFRESH_APMTS, fetchAndSetAppointments);
        return () => {
            Taro.eventCenter.off(REFRESH_APMTS, fetchAndSetAppointments);
        }
    }, []);

    const tabList = [{ title: `未签到 (${notArrived.length})` }, { title: `已签到 (${arrived.length})` }, { title: `全部 (${appointments.length})` }]
    return (
        <View className='index'>
            <Loader />
            <CalendarTab currentDate={selectedDate} handleDateChange={handleDateChange} handleRefresh={refresh}></CalendarTab>
            <Modal
                isOpened={showCheckInModal}
                title='请确认车牌号'
                contents={[{className: '.at-article__h1 plateNumber', text: currentApmt.plate}]}
                cancelText='取消'
                confirmText='确定'
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleCheckInConfirm}
            />
            <Modal
                isOpened={showCheckOutModal}
                title='请确取消签到'
                contents={[
                    {className: '.at-article__h2 plateNumber', text: '确认要取消签到？'},
                    {className: '.at-article__h1 plateNumber', text: currentApmt.plate}
                ]}
                cancelText='返回'
                confirmText='取消签到'
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleCheckOutConfirm}
            />
            <AtTabs className='appointments-tab' swipeable={false} current={currentTab} tabList={tabList} onClick={setTab.bind(this)}>
                <AtTabsPane current={currentTab} index={0} >
                    {notArrived.length > 0 ? (
                        notArrived.map(( appointment ) => (
                            <AppointmentCard apmtInfo={appointment} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut}/>
                        ))
                    ) : (
                    <View className='no-records'>
                        <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                        <Text className="title">看来今天没有预约～</Text>
                    </View>
                    )}
                    {notArrived.length > 0 && (<AtDivider content='没有更多预约啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
                </AtTabsPane>
                <AtTabsPane current={currentTab} index={1}>
                    {arrived.length > 0 ? (
                        arrived.map(( appointment ) => (
                            <AppointmentCard apmtInfo={appointment} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut}/>
                        ))
                    ) : (
                    <View className='no-records'>
                        <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                        <Text className="title">看来今天没有预约～</Text>
                    </View>
                    )}
                    {arrived.length > 0 && (<AtDivider content='没有更多预约啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
                </AtTabsPane>
                <AtTabsPane current={currentTab} index={2}>
                    {appointments.length > 0 ? (
                        appointments.map(( appointment ) => (
                            <AppointmentCard apmtInfo={appointment} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut}/>
                        ))
                    ) : (
                    <View className='no-records'>
                        <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                        <Text className="title">看来今天没有预约～</Text>
                    </View>
                    )}
                    {appointments.length > 0 && (<AtDivider content='没有更多预约啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
                </AtTabsPane>
            </AtTabs>
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

            <AtModal
                isOpened={showCheckInModal}
                onClose={() => toggleCheckInModal(false)}
                closeOnClickOverlay={false}
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
                closeOnClickOverlay={false}
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

            <Modal
                isOpened={showCheckInModal}
                title='请确认车牌号'
                contents={[{className: '.at-article__h1 plateNumber', text: currentApmt.plate}]}
                cancelText='取消'
                confirmText='确定'
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleCheckInConfirm}
            />
            <Modal
                isOpened={showCheckOutModal}
                title='请确取消签到'
                contents={[
                    {className: '.at-article__h2 plateNumber', text: '确认要取消签到？'},
                    {className: '.at-article__h1 plateNumber', text: currentApmt.plate}
                ]}
                cancelText='返回'
                confirmText='取消签到'
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleCheckOutConfirm}
            />

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
*/
