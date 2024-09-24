import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
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
import { ROLES } from '../../constants/roles';

import { useLoader } from '../../context/LoaderContext';
import { useAuth } from '../../context/AuthContext';

// Appointments page styling
import './AppointmentsPage.scss'

const AppointmentsPage = () => {
    const { isAuthenticated, department, isEmployee, isAdmin, userData, authLoading } = useAuth();
    if ( !isAuthenticated && authLoading) {
        return (<Loader />);
    }
    else if ( !isAuthenticated && !authLoading) {
        return (<NotSignedIn/>);
    } else if ( isAuthenticated && !isEmployee ) {
        return (<NotEmployee/>);
    }

    const defaultDate = dayjs().format('YYYY-MM-DD');

    const { showLoader, hideLoader } = useLoader();
    const [ currentDate, setDate ] = useState(defaultDate);
    const [ today, setToday ] = useState(defaultDate);
    const [ currentTab, setTab ] = useState(0);
    const [ appointments, updateAppointments ] = useState([]);
    const [ notArrived, updateNotArrived ] = useState([]);
    const [ arrived, updateArrived ] = useState([]);
    const [ currentApmt, updateCurrentApmt ] = useState({area: null, id: null, content: '无信息'});
    const tabList = [{ title: `未签到 (${notArrived.length})` }, { title: `已签到 (${arrived.length})` }, { title: `全部 (${appointments.length})` }];

    // check-in/out modal states
    const [ showCheckInModal, toggleCheckInModal ] = useState(false);
    const [ showCheckOutModal, toggleCheckOutModal ] = useState(false);

    const buildTabLists = (data) => {
        // WIP build lists for individual department.
        const vehiclesCheckedIn = (apmt) => {
            if (!apmt || !apmt.vehicles) return false;
            for(let vehicle of apmt.vehicles) {
                if (vehicle.checked_in == false) return false
            }
            return true;
        };
        switch (department) {
            case ROLES.ADMIN:
                updateAppointments(data);
                updateNotArrived(data.filter( apmt => {
                    const vehiclesStatus = vehiclesCheckedIn(apmt);
                    return (
                        (apmt.has_jockey == false && apmt.jockey_checked_in == false && !vehiclesStatus) || 
                        (apmt.has_jockey == true && apmt.jockey_checked_in == false && !vehiclesStatus) ||
                        (apmt.has_jockey == true && apmt.jockey_checked_in == false && vehiclesStatus) ||
                        (apmt.has_jockey == true && apmt.jockey_checked_in == true && !vehiclesStatus)
                    );
            }));
                updateArrived(data.filter( apmt => {
                    const vehiclesStatus = vehiclesCheckedIn(apmt);
                    return (
                        (!apmt.has_jockey && vehiclesStatus) || 
                        (apmt.has_jockey && apmt.jockey_checked_in && vehiclesStatus)
                    );
                }));
                break;
            case ROLES.SECURITY:
                updateAppointments(data);
                updateNotArrived(data.filter( apmt => !vehiclesCheckedIn(apmt)));
                updateArrived(data.filter( apmt => vehiclesCheckedIn(apmt)));
                break;
            case ROLES.GOLF:
                updateAppointments(data);
                updateNotArrived(data.filter( apmt => !apmt.golf_checked_in == true));
                updateArrived(data.filter( apmt => apmt.golf_checked_in == true));
                break;
            case ROLES.JOCKEY:
                updateAppointments(data);
                updateNotArrived(data.filter( apmt => !apmt.jockey_checked_in == true));
                updateArrived(data.filter( apmt => apmt.jockey_checked_in == true));
                break;
            case ROLES.SALES:
                // WIP
                updateAppointments(data);
                updateNotArrived(data.filter( apmt => !vehiclesCheckedIn(apmt)));
                updateArrived(data.filter( apmt => vehiclesCheckedIn(apmt)));
                break;
            case ROLES.OTHER:
                // WIP
                updateAppointments(data);
                updateNotArrived(data.filter( apmt => !vehiclesCheckedIn(apmt)));
                updateArrived(data.filter( apmt => vehiclesCheckedIn(apmt)));
                break;
        }
    }
    // request appointments data
    const fetchAndSetAppointments = async (dateToFetch) => {
        showLoader();
        const res = await AppointmentsService.getAppointments(userData.openid, dateToFetch || currentDate);
        if (res && res.success) {
            buildTabLists(res.data);
        }
        hideLoader();
    };

    const handleDateChange = (date) => {
        setDate(prev => (prev = date));
    }

    const refresh = () => {
        if (isAuthenticated && isEmployee && userData?.openid) {
            setToday(dayjs().format('YYYY-MM-DD'));
            fetchAndSetAppointments();
        }
    }
    // checkin functions
    const handleCheckIn = (data) => {
        updateCurrentApmt({ ...data });
        toggleCheckInModal(true);
    }

    const handleCheckInConfirm = async () => {
        showLoader();
        toggleCheckInModal(false);
        const res = await AppointmentsService.checkIn(userData.openid, currentApmt.id, currentApmt.area);
        if (res && res.success) {
            Taro.showToast({
                title: '签到成功',
                icon: 'success',
                mask: true,
                duration: 1500,
                complete: () => {
                    fetchAndSetAppointments();
                }
            });
        } else {
            hideLoader();
            Taro.showToast({
                title: '签到失败',
                icon: 'fail',
                mask: true,
                duration: 1500
            });
        }
        updateCurrentApmt({});
    }

    // checkout functions
    const handleCheckOut = (apmtObj) => {
        updateCurrentApmt(apmtObj);
        toggleCheckOutModal(true);
    }
    const handleCheckOutConfirm = async () => {
        showLoader();
        toggleCheckOutModal(false);
        const res = await AppointmentsService.checkOut(userData.openid, currentApmt.id, currentApmt.area);
        if (res && res.success) {
            Taro.showToast({
                title: '签离成功',
                icon: 'success',
                mask: true,
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
                mask: true,
                duration: 1500
            });
        }
        updateCurrentApmt({});
    }

    const handleCancel = () => {
        updateCurrentApmt({})
        toggleCheckInModal(false);
        toggleCheckOutModal(false);
    }

    const handleEdit = (apmtId) => {
        // fetch appointment by id
        Taro.navigateTo({
            url: `/forms/Appointment/index?apmt=${apmtId}`
        });
    }

    const handleNewAppointment = () => {
        Taro.navigateTo({
            url: `/forms/Appointment/index?date=${currentDate}`
        });
    }

    useEffect(() => {
        if (isAuthenticated && isEmployee && userData?.openid) {
            fetchAndSetAppointments();
        }
    }, [currentDate]);

    useEffect(() => {
        Taro.eventCenter.on(REFRESH_APMTS, (date) => {
            if (isAuthenticated && isEmployee && userData?.openid) {
                setDate(date);
                fetchAndSetAppointments(date);
            }
        });
        return () => {
            Taro.eventCenter.off();
        }
    }, []);

    return (
        <View className='index'>
            <Loader />
            <CalendarTab currentDate={currentDate} handleDateChange={handleDateChange} handleRefresh={refresh} handleNewAppointment={isAdmin && handleNewAppointment} ></CalendarTab>
            <Modal
                isOpened={showCheckInModal}
                title='确认签到信息'
                contents={[
                    {className: '.at-article__h1 plateNumber', text: currentApmt.content}]}
                cancelText='取消'
                confirmText='确定'
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleCheckInConfirm}
            />
            <Modal
                isOpened={showCheckOutModal}
                title='取消签到'
                contents={[
                    {className: '.at-article__h2 plateNumber', text: '确认要取消签到？'},
                    {className: '.at-article__h1 plateNumber', text: currentApmt.content}
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
                            <AppointmentCard department={department} apmtInfo={appointment} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} handleEdit={handleEdit} today={today}/>
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
                            <AppointmentCard department={department} apmtInfo={appointment} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} handleEdit={handleEdit} today={today}/>
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
                            <AppointmentCard department={department} apmtInfo={appointment} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} handleEdit={handleEdit} today={today}/>
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
