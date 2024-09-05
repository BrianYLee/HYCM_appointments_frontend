import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import NotSignedIn from '../../components/NotSignedIn';
import NotEmployee from '../../components/NotEmployee';
import Modal from '../../components/Modal';
import RegisterService from '../../services/Register/RegisterService';
import ApplictionCard from '../../components/ApplicationCard/ApplicationCard';
import { View, Text, Image } from '@tarojs/components';
import { AtDivider, AtTabs, AtTabsPane } from 'taro-ui'
import Loader from '../../components/Loader';

import { useLoader } from '../../context/LoaderContext';
import { useAuth } from '../../context/AuthContext';

import './ApplicationsPage.scss'

const ApplicationsPage = () => {
    const { isAuthenticated, isEmployee, userData, authLoading, isAdmin } = useAuth();
    const { showLoader, hideLoader } = useLoader();
    if ( !isAuthenticated && authLoading) {
        return (<Loader />);
    }
    else if ( !isAuthenticated && !authLoading) {
        return (<NotSignedIn/>);
    } else if ( isAuthenticated && !isAdmin ) {
        return (<NotEmployee/>);
    }

    const [ currentTab, setTab ] = useState(0);
    const [ applications, updateApplications ] = useState([]);
    const [ pending, updatePending ] = useState([]);
    const [ approved, updateApproved ] = useState([]);
    const [ rejected, updateRejected ] = useState([]);
    const [ currentApp, updateCurrentApp ] = useState({});
    const [ showReviewModal, toggleReviewModal ] = useState(false);

    // request applications data
    const fetchAndSetApplications = async () => {
        showLoader();
        const res = await RegisterService.getApplications(userData.openid)
        if (res && res.success) {
            updateApplications(res.data);
        }
        hideLoader();
    };

    const handleOnReview = (app) => {
        updateCurrentApp(app);
        toggleReviewModal(true);
    }

    const handleApprove = async () => {
        showLoader();
        const res = await RegisterService.approve(userData.openid, currentApp);
        if (res && res.success) {
            hideLoader();
            toggleReviewModal(false);
            Taro.showToast({
                title: '通过成功！',
                icon: 'success',
                duration: 1500,
            });
            setTimeout(() => {
                fetchAndSetApplications();
            }, 1500);
        } else {
            hideLoader();
            toggleReviewModal(false);
            Taro.showToast({
                title: '通过失败',
                icon: 'error',
                duration: 1500
            });
        }
        updateCurrentApp({});
    }

    const handleReject = async () => {
        showLoader();
        const res = await RegisterService.reject(userData.openid, currentApp);
        if (res && res.success) {
            hideLoader();
            toggleReviewModal(false);
            Taro.showToast({
                title: '拒绝了！',
                icon: 'success',
                duration: 1500,
            });
            setTimeout(() => {
                fetchAndSetApplications();
            }, 1500)
        } else {
            hideLoader();
            toggleReviewModal(false);
            Taro.showToast({
                title: '拒绝失败',
                icon: 'error',
                duration: 1500
            });
        }
        updateCurrentApp({});
    }

    const handleCancel = () => {
        toggleReviewModal(false);
        updateCurrentApp({});
    }

    useEffect(() => {
        if (isAuthenticated && isEmployee && isAdmin) {
            fetchAndSetApplications();
        }
    }, []);

    useEffect(() => {
        if (applications && applications.length > 0) {
            updatePending(applications.filter( app => app.is_approved == null));
            updateApproved(applications.filter( app => app.is_approved == true));
            updateRejected(applications.filter( app => app.is_approved == false));
        }
    },[applications])

    const tabList = [{ title: `未审核 (${pending?.length})` }, { title: `通过 (${approved?.length})` }, { title: `拒绝 (${rejected?.length})` }];
    return (
        <View className='index'>
            <Loader />
            <Modal
                isOpened={showReviewModal}
                title='怎么处理？'
                contents={[{className: '.at-article__h1 applicant-name', text: `${currentApp.last_name}${currentApp.first_name}`}]}
                confirmText='通过'
                onClose={handleCancel}
                onCancel={handleCancel}
                onReject={handleReject}
                onConfirm={handleApprove}
            />
            <AtTabs swipeable={false} current={currentTab} tabList={tabList} onClick={setTab.bind(this)}>
                <AtTabsPane current={currentTab} index={0} >
                    {pending.length > 0 ? (
                        pending.map(( app ) => (
                            <ApplictionCard appInfo={app} onReview={handleOnReview} />
                        ))
                    ) : (
                    <View className='no-records'>
                        <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                        <Text className="title">没有需要审核的～</Text>
                    </View>
                    )}
                    {pending.length > 0 && (<AtDivider content='没有更多啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
                </AtTabsPane>
                <AtTabsPane current={currentTab} index={1}>
                    {approved.length > 0 ? (
                        approved.map(( app ) => (
                            <ApplictionCard appInfo={app} />
                        ))
                    ) : (
                    <View className='no-records'>
                        <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                        <Text className="title">没一个通过的</Text>
                    </View>
                    )}
                    {approved.length > 0 && (<AtDivider content='没有更多啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
                </AtTabsPane>
                <AtTabsPane current={currentTab} index={2}>
                    {rejected.length > 0 ? (
                        rejected.map(( app ) => (
                            <ApplictionCard appInfo={app} />
                        ))
                    ) : (
                    <View className='no-records'>
                        <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                        <Text className="title">还没有被拒绝的～</Text>
                    </View>
                    )}
                    {rejected.length > 0 && (<AtDivider content='没有更多啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
                </AtTabsPane>
            </AtTabs>
        </View>
    )
}

export default ApplicationsPage;

/*
                <AtTabsPane current={currentTab} index={2}>
                    {applications.length > 0 ? (
                        applications.map(( app ) => (
                            <ApplictionCard appInfo={app} />
                        ))
                    ) : (
                    <View className='no-records'>
                        <Image className="logo" src={require('../../images/icons/out-of-stock.png')} />
                        <Text className="title">就没人申请过。。。</Text>
                    </View>
                    )}
                    {applications.length > 0 && (<AtDivider content='没有更多啦' fontColor='#ccc' lineColor='#ddd' fontSize='24'/>)}
                </AtTabsPane>
*/
