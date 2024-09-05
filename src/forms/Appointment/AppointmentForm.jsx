import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components'
import { AtInput, AtButton, AtCalendar, AtFloatLayout, AtMessage, AtActionSheet, AtActionSheetItem, AtSwitch } from 'taro-ui';
import DocsHeader from '../../components/DocsHeader';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader';
import AppointmentsService from '../../services/Appointments/AppointmentsService';
import { REFRESH_APMTS } from '../../constants/events';
import { parseAppointment } from '../../utils/appointment';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './AppointmentForm.scss';

const AppointmentForm = () => {
    const { isAdmin, userData } = useAuth();
    const { showLoader, hideLoader } = useLoader();

    // common states
    const [ initLoading, setInitLoading ] = useState(true);
    const [ selectedDate, setSelectedDate ] = useState('');
    const [ showCalendar, toggleCalendar ] = useState(false);
    const [ typeSelect, toggleTypeSelect ] = useState(false);
    const [ horseSelect, toggleHorseSelect ] = useState(false);
    const [ showSubmitModal, toggleSubmitModal ] = useState(false);
    const [ horseInputVal, setHorseInputValue ] = useState('');
    const [ formErrors, setFormError ] = useState({
        scheduled_date: false,
        type: false,
        horse: false,
        studio_name: false,
        manager_name: false,
        plate: false
    });

    const [ formData, setFormData ] = useState({
        id: null,
        checked_in: false,
        scheduled_date: '',
        scheduled_time_string: '',
        type: '',
        areas: '',
        hotel: true,
        golf: true,
        horse: null,
        studio_name: '',
        manager_name: '',
        bridal_name: '',
        plate: ''
    });

    // edit only states
    const [ editMode, setEditMode ] = useState(false);
    const [ showEditSubmitModal, toggleEditSubmitModal ] = useState(false);
    const [ showDeleteModal, toggleDeleteModal ] = useState(false);
    const [ dataBeforeEdit, setApmtData ] = useState({});
    const [ formChanges, setFormChanges ] = useState({
        checked_in: false,
        scheduled_date: false,
        scheduled_time_string: false,
        areas: false,
        type: false,
        horse: false,
        studio_name: false,
        manager_name: false,
        bridal_name: false,
        plate: false
    });

    const typeOpts = ['样片', '客片'];

    useEffect(() => {
        if (formData.horse == true) {
            setHorseInputValue('拍');
        } else if (formData.horse == false) {
            setHorseInputValue('不拍');
        }
    }, [formData.horse]);

    useEffect(() => {
        if (initLoading) showLoader();
        else if (!initLoading) hideLoader();
    }, [initLoading]);

    useEffect(() => {
        if (!isAdmin) {
            setInitLoading(false);
            Taro.navigateBack();
        }
        const { apmt, date } = Taro.getCurrentInstance().router.params;
        if ( apmt ) {
            setEditMode(true);
            fetchAndSetAppointment(apmt);
        }
        else if (date) {
            handleInput(date, 'scheduled_date');
            setInitLoading(false);
        }
        else {
            setInitLoading(false);
        }
    }, []);

    const fetchAndSetAppointment = async (apmt) => {
        showLoader();
        try {
            const { success, data } = await AppointmentsService.getAppointment(userData.openid, apmt);
            if (success && data) {
                setApmtData({...data});
                setSelectedDate(data.scheduled_date);
                setFormData({
                    id: data.id,
                    checked_in: data.checked_in,
                    scheduled_date: data.scheduled_date,
                    scheduled_time_string: data.scheduled_time_string,
                    type: data.type,
                    areas: data.areas,
                    hotel: data.hotel,
                    golf: data.golf,
                    horse: data.horse,
                    studio_name: data.studio_name,
                    manager_name: data.manager_name,
                    bridal_name: data.bridal_name,
                    plate: data.plate
                });
                hideLoader();
            }
            else {
                hideLoader();
                Taro.showToast({
                    title: 'not successful',
                    icon: 'error',
                    mask: true,
                    duration: 2000
                });
                setTimeout(() => Taro.navigateBack({
                    fail: (res) => {
                        Taro.reLaunch();
                    }
                }), 2000);
            }
        } catch (err) {
            hideLoader();
            Taro.showToast({
                title: 'error fetching apmt',
                icon: 'error',
                mask: true,
                duration: 2000
            });
            setTimeout(() => Taro.navigateBack(), 2000);
        } finally {
            setInitLoading(false);
        }
    };

    const handleInput = (value, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (editMode) {
            setFormChanges(prev => ({
                ...prev,
                [field]: (dataBeforeEdit[field] != value)
            }));
        }
    };

    const resetForm = () => {
        setFormData({ ...dataBeforeEdit });
        setFormChanges({
            checked_in: false,
            scheduled_date: false,
            scheduled_time_string: false,
            areas: false,
            type: false,
            horse: false,
            studio_name: false,
            manager_name: false,
            bridal_name: false,
            plate: false
        });
    }

    const parseClipBoard = () => {
        Taro.getClipboardData({
            success: (res) => {
                const parsedData = parseAppointment(res.data);
                if (parsedData != null) {
                    setSelectedDate(parsedData.scheduled_date);
                    setFormData({
                        scheduled_date: parsedData.scheduled_date,
                        scheduled_time_string: parsedData.scheduled_time_string,
                        type: parsedData.type,
                        areas: parsedData.areas,
                        hotel: true,
                        golf: true,
                        horse: parsedData.horse,
                        studio_name: parsedData.studio_name,
                        manager_name: parsedData.manager_name,
                        bridal_name: parsedData.bridal_name,
                        plate: parsedData.plate
                    });
                }
            }
        })
    }

    const handleDateSelect = (dateObj) => {
        setSelectedDate(dateObj.value.end);
    };

    const onDateConfirm = (type) => {
        if (selectedDate === '') {
            Taro.atMessage({
                'message': 'bad date selection',
                'type': type
            })
            return;
        }
        toggleCalendar(false);
        handleInput(selectedDate, 'scheduled_date');
    };
    
    const hasFormErrors = () => {
        const isValidDate = (dateToCheck) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!regex.test(dateToCheck)) {
                return false;
            }
            const parts = dateToCheck.split("-");
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            const date = new Date(year, month - 1, day);
            return date && (date.getMonth() + 1) === month && date.getDate() === day && date.getFullYear() === year;
        }
        let errors = { scheduled_date: false, type: false, horse: false, studio_name: false, manager_name: false, plate: false };
        if (!formData.scheduled_date || !isValidDate(formData.scheduled_date)) {
            errors.scheduled_date = true;
        }
        if (!typeOpts.includes(formData.type)) {
            errors.type = true;
        }
        if (formData.horse === null ) {
            errors.horse = true;
        }
        if (!formData.studio_name || formData.studio_name.length < 2) {
            errors.studio_name = true;
        }
        if (!formData.manager_name || formData.manager_name.length < 2) {
            errors.manager_name = true;
        }
        if (!formData.plate || formData.plate.length < 2) {
            errors.plate = true;
        }
        setFormError(errors);
        return (errors.scheduled_date || errors.type || errors.horse || errors.studio_name || errors.manager_name || errors.plate );
    };

    const onSubmit = () => {
        if (hasFormErrors()) {
            Taro.atMessage({
                message: '输入错误',
                type: 'error'
            });
            return;
        }
        if (editMode) {
            toggleEditSubmitModal(true);
        }
        else {
            toggleSubmitModal(true);
        }
    };

    const onConfirm = async () => {
        if (!editMode) {
            toggleSubmitModal(false);
            try {
                showLoader();
                const submitRes = await AppointmentsService.postAppointment(userData.openid, formData);
                if (submitRes.success) {
                    hideLoader();
                    Taro.showToast({
                        title: '提交成功',
                        icon: 'success',
                        mask: true,
                        duration: 2000
                    });
                    setTimeout(() => {
                        Taro.eventCenter.trigger(REFRESH_APMTS, formData.scheduled_date);
                        Taro.navigateBack({
                            fail: (res) => {
                                Taro.reLaunch();
                            }
                        });
                    }, 500);
                }
            } catch (err) {
                hideLoader();
                console.error('some went wrong while posting', err);
                Taro.showToast({
                    title: '提交失败',
                    icon: 'error',
                    mask: true
                });
            }
        } else if (editMode) {
            toggleEditSubmitModal(false);
            let hasChanges = false;
            for (let key in formChanges) {
                if (formChanges[key] == true) {
                    hasChanges = true;
                    break;
                }
            }
            if (!hasChanges) {
                Taro.atMessage({
                    message: '没有修改任何信息',
                    type: 'warning'
                });
                return;
            }
            try {
                showLoader();
                const submitRes = await AppointmentsService.editAppointment(userData.openid, formData);
                if (submitRes.success) {
                    hideLoader();
                    Taro.showToast({
                        title: '更新了～',
                        icon: 'success',
                        mask: true,
                        duration: 2000
                    });
                    setTimeout(() => {
                        Taro.eventCenter.trigger(REFRESH_APMTS, dataBeforeEdit.scheduled_date);
                        Taro.navigateBack({
                            fail: (res) => {
                                Taro.reLaunch();
                            }
                        });
                    }, 500);
                } else {
                    hideLoader();
                    Taro.showToast({
                        title: 'error',
                        icon: 'error',
                        mask: true,
                        duration: 2000
                    });
                }
            } catch (err) {
                hideLoader();
                console.error('some went wrong while posting', err);
                Taro.showToast({
                    title: '提交失败',
                    icon: 'error',
                    mask: true
                });
            }
        }
    };

    const onDelete = () => {
        if (editMode) {
            toggleDeleteModal(true);
        }
    };

    const onDeleteConfirm = async () => {
        toggleDeleteModal(false);
        try {
            showLoader();
            const submitRes = await AppointmentsService.deleteAppointment(userData.openid, dataBeforeEdit.id);
            if (submitRes.success) {
                hideLoader();
                Taro.showToast({
                    title: '取消了～',
                    icon: 'success',
                    mask: true,
                    duration: 2000
                });
                setTimeout(() => {
                    Taro.eventCenter.trigger(REFRESH_APMTS, dataBeforeEdit.scheduled_date);
                    Taro.navigateBack({
                        fail: (res) => {
                            Taro.reLaunch();
                        }
                    });
                }, 500);
            } else {
                hideLoader();
                Taro.showToast({
                    title: 'error',
                    icon: 'error',
                    mask: true,
                    duration: 2000
                });
            }
        } catch (err) {
            hideLoader();
            console.error('some went wrong while posting', err);
            Taro.showToast({
                title: '取消失败',
                icon: 'error',
                mask: true
            });
        }
    }

    if (initLoading) {
        return (<Loader />)
    }
    return (
        <View className='index appointment-form'>
            <Loader />
            <AtMessage />
            <Modal isOpened={showSubmitModal} closeOnClickOverlay={true} title='没错吧？' 
                contents={[
                    {className: '.at-article__h2', text: `日期：${formData.scheduled_date}`},
                    {className: '.at-article__h2', text: `类型：${formData.type}`},
                    {className: '.at-article__h2', text: `拍马：${horseInputVal}`},
                    {className: '.at-article__h2', text: `机构：${formData.studio_name}`},
                    {className: '.at-article__h2', text: `老师：${formData.manager_name}`},
                    {className: '.at-article__h2', text: `车牌：${formData.plate}`}
                ]}
                cancelText='取消' confirmText='提交' onClose={() => toggleSubmitModal(false)} onCancel={() => toggleSubmitModal(false)} onConfirm={onConfirm} />
            <Modal isOpened={showEditSubmitModal} closeOnClickOverlay={true} title='改的对不对？' 
                contents={[
                    {className: '.at-article__h2 ' + (formChanges.checked_in && 'has-changes'), text: `签到：${formData.checked_in ? '已签到' : '未签到'}`},
                    {className: '.at-article__h2 ' + (formChanges.scheduled_date && 'has-changes'), text: `日期：${formData.scheduled_date}`},
                    {className: '.at-article__h2 ' + (formChanges.type && 'has-changes'), text: `类型：${formData.type}`},
                    {className: '.at-article__h2 ' + (formChanges.horse && 'has-changes'), text: `拍马：${horseInputVal}`},
                    {className: '.at-article__h2 ' + (formChanges.studio_name && 'has-changes'), text: `机构：${formData.studio_name}`},
                    {className: '.at-article__h2 ' + (formChanges.manager_name && 'has-changes'), text: `老师：${formData.manager_name}`},
                    {className: '.at-article__h2 ' + (formChanges.plate && 'has-changes'), text: `车牌：${formData.plate}`}
                ]}
                cancelText='取消' confirmText='提交' onClose={() => toggleEditSubmitModal(false)} onCancel={() => toggleEditSubmitModal(false)} onConfirm={onConfirm} />
            <Modal isOpened={showDeleteModal} closeOnClickOverlay={true} title='确定把预约取消了？' 
                contents={[
                    {className: '.at-article__h2 ', text: `取消后就没了。`},
                    {className: '.at-article__h2 ', text: `确认客人不来了是吧？`}
                ]}
                cancelText='再想想' confirmText='取消预约' onClose={() => toggleDeleteModal(false)} onCancel={() => toggleDeleteModal(false)} onConfirm={onDeleteConfirm} />
            <DocsHeader className='header' title={editMode ? '预约修改' : '新增拍摄预约'} desc='别填错了'/>
            { !editMode && (<AtButton className='parse-btn' circle type='primary' onClick={parseClipBoard}>粘贴识别</AtButton>)}
            <View className='form-container'>
                    { editMode && (<AtSwitch title='签到' checked={formData.checked_in} onChange={(value) => handleInput(value, 'checked_in')} />)}
                    <AtInput
                        error={formErrors.type}
                        name='type'
                        title='类型'
                        type='text'
                        maxLength={20}
                        placeholder='请选择'
                        value={formData.type}
                        disabled={true}
                        editable={false}
                        onClick={() => toggleTypeSelect(true)}
                        className='text-input force-enable'
                    />
                    <AtInput
                        error={formErrors.scheduled_date}
                        name='scheduled_date'
                        title='拍摄日期'
                        type='text'
                        placeholder='请选择'
                        value={formData.scheduled_date}
                        disabled={true}
                        editable={false}
                        onClick={() => toggleCalendar(true)}
                        className='text-input force-enable'
                    />
                    <AtInput
                        error={formErrors.scheduled_time_string}
                        name='scheduled_time_string'
                        title='预计时间'
                        type='text'
                        placeholder='请填写'
                        value={formData.scheduled_time_string}
                        className='text-input'
                        onChange={(value) => handleInput(value, 'scheduled_time_string')}
                    />
                    <AtInput
                        error={formErrors.areas}
                        name='areas'
                        title='拍摄区域'
                        type='text'
                        placeholder='请填写'
                        value={formData.areas}
                        className='text-input'
                        onChange={(value) => handleInput(value, 'areas')}
                    />
                    <AtInput
                        error={formErrors.horse}
                        name='horse'
                        title='拍马吗？'
                        type='text'
                        placeholder='请选择'
                        value={horseInputVal}
                        disabled={true}
                        editable={false}
                        onClick={() => toggleHorseSelect(true)}
                        className='text-input force-enable'
                    />
                    <AtInput
                        error={formErrors.studio_name}
                        name='studio_name'
                        title='机构名称'
                        type='text'
                        placeholder='请填写'
                        value={formData.studio_name}
                        className='text-input'
                        onChange={(value) => handleInput(value, 'studio_name')}
                    />
                    <AtInput
                        error={formErrors.manager_name}
                        name='manager_name'
                        title='摄影师'
                        type='text'
                        placeholder='请填写'
                        value={formData.manager_name}
                        className='text-input'
                        onChange={(value) => handleInput(value, 'manager_name')}
                    />
                    <AtInput
                        error={formErrors.bridal_name}
                        name='bridal_name'
                        title='新人姓名'
                        type='text'
                        placeholder='请填写'
                        value={formData.bridal_name}
                        className='text-input'
                        onChange={(value) => handleInput(value, 'bridal_name')}
                    />
                    <AtInput
                        error={formErrors.plate}
                        name='plate'
                        title='车牌号'
                        type='text'
                        placeholder='确认不了请填写 “待定”'
                        value={formData.plate}
                        adjustPosition
                        onChange={(value) => handleInput(value, 'plate')}
                        className='text-input'
                    />
                    <AtFloatLayout isOpened={showCalendar} onClose={() => toggleCalendar(false)} cancelText='Cancel'>
                        <AtCalendar currentDate={formData.scheduled_date} format='YYYY-MM-DD' onSelectDate={e => (handleDateSelect(e))} isMultiSelect={false}/>
                        <AtButton type='primary' circle onClick={onDateConfirm.bind(this, 'error')}>Confirm</AtButton>
                    </AtFloatLayout>
                    <AtActionSheet isOpened={typeSelect} title='「客片」还是「样片」？'>
                        <AtActionSheetItem onClick={() => {handleInput("客片", 'type'); toggleTypeSelect(false);}}>客片</AtActionSheetItem>
                        <AtActionSheetItem onClick={() => {handleInput("样片", 'type'); toggleTypeSelect(false);}}>样片</AtActionSheetItem>
                    </AtActionSheet>
                    <AtActionSheet isOpened={horseSelect} title='马拍不拍？'>
                        <AtActionSheetItem onClick={() => {handleInput(true, 'horse'); toggleHorseSelect(false);}}>拍</AtActionSheetItem>
                        <AtActionSheetItem onClick={() => {handleInput(false, 'horse'); toggleHorseSelect(false);}}>不拍</AtActionSheetItem>
                    </AtActionSheet>
            </View>
            { editMode && (<AtButton circle className='submit-btn' type='secondary' onClick={resetForm}>复原</AtButton>) }
            <AtButton circle className='submit-btn' type='primary' onClick={onSubmit}>提交</AtButton>
            { editMode && (<AtButton circle className='delete-btn' type='secondary' onClick={onDelete}>取消预约</AtButton>) }
        </View>
    )
}

export default AppointmentForm;
