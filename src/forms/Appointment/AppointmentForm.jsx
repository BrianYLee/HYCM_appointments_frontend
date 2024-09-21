import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components'
import { AtInput, AtButton, AtCalendar, AtFloatLayout, AtMessage, AtActionSheet, AtActionSheetItem, AtSwitch } from 'taro-ui';
import DocsHeader from '../../components/DocsHeader';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader';
import AppointmentsService from '../../services/Appointments/AppointmentsService';
import { REFRESH_APMTS } from '../../constants/events';
import { parseAppointment, validateForm } from '../../utils/appointment';

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

    const [ formData, setFormData ] = useState({
        id: null,
        hotel_checked_in: false,
        golf_checked_in: false,
        jockey_checked_in: false,
        type: '',
        scheduled_date: '',
        scheduled_time_string: '',
        areas: '',
        has_jockey: false,
        studio_name: '',
        manager_name: '',
        bridal_name: '',
        vehicles: [null]
    });
    const [ formErrors, setFormError ] = useState({
        type: false,
        scheduled_date: false,
        scheduled_time_string: false,
        areas: false,
        has_jockey: false,
        studio_name: false,
        manager_name: false,
        bridal_name: false,
        vehicles: new Array(formData.vehicles.length).fill(false)
    });

    // edit only states
    const [ editMode, setEditMode ] = useState(false);
    const [ showEditSubmitModal, toggleEditSubmitModal ] = useState(false);
    const [ showDeleteModal, toggleDeleteModal ] = useState(false);
    const [ dataBeforeEdit, setApmtData ] = useState({});
    const [ formChanges, setFormChanges ] = useState({
        hotel_checked_in: false,
        golf_checked_in: false,
        jockey_checked_in: false,
        type: false,
        scheduled_date: false,
        scheduled_time_string: false,
        areas: false,
        has_jockey: false,
        studio_name: false,
        manager_name: false,
        bridal_name: false,
        vehicles: new Array(formData.vehicles.length).fill(false)
    });

    useEffect(() => {
        formData.has_jockey
            ? setHorseInputValue('拍')
            : setHorseInputValue('不拍');
    }, [formData.has_jockey]);

    useEffect(() => {
        initLoading 
            ? showLoader()
            : hideLoader()
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
                    hotel_checked_in: data.hotel_checked_in,
                    golf_checked_in: data.golf_checked_in,
                    jockey_checked_in: data.jockey_checked_in,
                    type: data.type,
                    scheduled_date: data.scheduled_date,
                    scheduled_time_string: data.scheduled_time_string,
                    areas: data.areas,
                    has_jockey: data.has_jockey,
                    studio_name: data.studio_name,
                    manager_name: data.manager_name,
                    bridal_name: data.bridal_name,
                    vehicles: data.vehicles
                });
                setFormChanges(prev => ({...prev, vehicles: new Array(data.vehicles.length).fill(false)}));
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
        return value;
    };

    const handlePlateInput = (value, idx) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.map((vehicle, i) => (i === idx ? {...vehicle, plate: value, isEdited: (editMode && !formData.vehicles[idx]?.isNew) ? true : undefined} : vehicle))
        }));
        if (editMode) {
            setFormChanges(prev => ({
                ...prev,
                vehicles: prev.vehicles.map((v, i) => (i == idx && dataBeforeEdit?.vehicles[idx]?.plate != v) ? true : v)
            }));
        }
        return value;
    };

    const addPlate = () => {
        setFormData(prev => ({
            ...prev,
            vehicles: [ ...prev.vehicles, {plate: '', isNew: true}]
        }));
        if (editMode) {
            setFormChanges(prev => ({
                ...prev,
                vehicles: [...prev.vehicles, true]
            }));
        }
    }

    const deletePlate = (idx) => {
        if (formData.vehicles[idx]?.isNew) {
            setFormData(prev => ({
                ...prev,
                vehicles: prev.vehicles.filter((_, i) => i !== idx)
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                vehicles: prev.vehicles.map((vehicle, i) => (i === idx ? {...vehicle, isDeleted: true} : vehicle))
            }));
        }
        if (editMode) {
            if (formData.vehicles[idx]?.isNew) {
                setFormChanges(prev => ({
                    ...prev,
                    vehicles: prev.vehicles.filter((_, i) => i !== idx)
                }));
            }
            else {
                setFormChanges(prev => ({
                    ...prev,
                    vehicles: prev.vehicles.map((vehicle, i) => (i === idx ? true : vehicle))
                }));
            }
        }
    }

    const resetForm = () => {
        setFormData({ ...dataBeforeEdit });
        setFormChanges({
            hotel_checked_in: false,
            golf_checked_in: false,
            jockey_checked_in: false,
            type: false,
            scheduled_date: false,
            scheduled_time_string: false,
            areas: false,
            has_jockey: false,
            studio_name: false,
            manager_name: false,
            bridal_name: false,
            vehicles: new Array(dataBeforeEdit.vehicles.length).fill(false)
        });
    };

    const parseClipBoard = () => {
        Taro.getClipboardData({
            success: (res) => {
                const parsedData = parseAppointment(res.data);
                if (parsedData != null) {
                    setSelectedDate(parsedData.scheduled_date);
                    setFormData({ ...parsedData });
                }
            }
        });
    };

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
        const errObj = validateForm(formData);
        setFormError(prev => ({ ...errObj.errors }));
        return errObj.hasError;
    };

    const onSubmit = () => {
        console.log(formData);
        if (hasFormErrors()) {
            Taro.atMessage({
                message: '输入错误',
                type: 'error'
            });
            console.log(formErrors);
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
                if (key == 'vehicles') {
                    formChanges.vehicles.forEach(v => {
                        if (v == true) {
                            hasChanges = true;
                            return
                        }
                    });
                    if (hasChanges) break;
                }
                else if (formChanges[key] == true) {
                    console.log('found change in key ' + key);
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
                    ...(formData.vehicles.map((v, idx) => {
                        return {className: '.at-article__h2', text: `车牌${idx+1}：${v?.plate}`}
                    }))
                ]}
                cancelText='取消' confirmText='提交' onClose={() => toggleSubmitModal(false)} onCancel={() => toggleSubmitModal(false)} onConfirm={onConfirm} />
            <Modal isOpened={showEditSubmitModal} closeOnClickOverlay={true} title='改的对不对？' 
                contents={[
                    {className: '.at-article__h2 ' + (formChanges.hotel_checked_in && 'has-changes'), text: `酒店签到：${formData.hotel_checked_in ? '已签到' : '未签到'}`},
                    {className: '.at-article__h2 ' + (formChanges.golf_checked_in && 'has-changes'), text: `球会签到：${formData.golf_checked_in ? '已签到' : '未签到'}`},
                    {className: '.at-article__h2 ' + (formChanges.jockey_checked_in && 'has-changes'), text: `马会签到：${formData.jockey_checked_in ? '已签到' : '未签到'}`},
                    {className: '.at-article__h2 ' + (formChanges.scheduled_date && 'has-changes'), text: `日期：${formData.scheduled_date}`},
                    {className: '.at-article__h2 ' + (formChanges.scheduled_time_string && 'has-changes'), text: `时间：${formData.scheduled_time_string}`},
                    {className: '.at-article__h2 ' + (formChanges.areas && 'has-changes'), text: `区域：${formData.areas}`},
                    {className: '.at-article__h2 ' + (formChanges.type && 'has-changes'), text: `类型：${formData.type}`},
                    {className: '.at-article__h2 ' + (formChanges.has_jockey && 'has-changes'), text: `拍马：${horseInputVal}`},
                    {className: '.at-article__h2 ' + (formChanges.studio_name && 'has-changes'), text: `机构：${formData.studio_name}`},
                    {className: '.at-article__h2 ' + (formChanges.manager_name && 'has-changes'), text: `老师：${formData.manager_name}`},
                    {className: '.at-article__h2 ' + (formChanges.bridal_name && 'has-changes'), text: `新人：${formData.bridal_name}`},
                    ...(formChanges.vehicles.map((plateHasChange, idx) => {
                        return {className: '.at-article__h2 ' + (plateHasChange && 'has-changes ') + (formData.vehicles[idx]?.isDeleted && 'is-deleted'), text: `车牌${idx+1}：${formData.vehicles[idx]?.plate}`}
                    }))
                ]}
                cancelText='取消' confirmText='提交' onClose={() => toggleEditSubmitModal(false)} onCancel={() => toggleEditSubmitModal(false)} onConfirm={onConfirm} />
            <Modal isOpened={showDeleteModal} closeOnClickOverlay={true} title='确定把预约取消了？' 
                contents={[
                    {className: '.at-article__h2 ', text: `取消后就没了。`},
                    {className: '.at-article__h2 ', text: `确认客人不来了是吧？`}
                ]}
                cancelText='再想想' confirmText='取消预约' onClose={() => toggleDeleteModal(false)} onCancel={() => toggleDeleteModal(false)} onConfirm={onDeleteConfirm} />
            <DocsHeader className='header' title={editMode ? '预约修改' : '新增拍摄预约'} desc='别填错了'/>
            { !editMode && (<AtButton className='parse-btn' size='small' type='primary' onClick={parseClipBoard}>粘贴识别</AtButton>)}
            <View className='form-container'>
                    { editMode && (<AtSwitch title='酒店签到' checked={formData.hotel_checked_in} onChange={(value) => handleInput(value, 'hotel_checked_in')} />)}
                    { editMode && (<AtSwitch title='高尔夫签到' checked={formData.golf_checked_in} onChange={(value) => handleInput(value, 'golf_checked_in')} />)}
                    { editMode && (<AtSwitch title='签到' checked={formData.jockey_checked_in} onChange={(value) => handleInput(value, 'jockey_checked_in')} />)}
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
                        error={formErrors.has_jockey}
                        name='has_jockey'
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
                    {formData.vehicles.map((v, idx) => (
                        <View className={'plate-row at-row ' + (v?.isDeleted && 'vehicle-hidden')}>
                            <AtInput
                                error={formErrors.vehicles[idx]}
                                name='vehicles'
                                title={`车牌号${idx+1}`}
                                type='text'
                                placeholder='没确认填写 “待定”'
                                value={v?.plate}
                                adjustPosition
                                onChange={(value) => handlePlateInput(value, idx)}
                                className='text-input plate-input at-col at-col-8'
                            />
                            {idx === 0 && <AtButton circle={true} size='small' className='plate-delete-btn at-col at-col-1 at-col--auto' type='primary' onClick={addPlate}>+</AtButton>}
                            {idx != 0 && <AtButton circle={true} size='small' className='plate-delete-btn at-col at-col-1 at-col--auto' type='secondary' onClick={() => deletePlate(idx)}>-</AtButton>}
                        </View>
                    ))}
                    <AtFloatLayout isOpened={showCalendar} onClose={() => toggleCalendar(false)} cancelText='Cancel'>
                        <AtCalendar currentDate={formData.scheduled_date} format='YYYY-MM-DD' onSelectDate={e => (handleDateSelect(e))} isMultiSelect={false}/>
                        <AtButton type='primary' circle onClick={onDateConfirm.bind(this, 'error')}>Confirm</AtButton>
                    </AtFloatLayout>
                    <AtActionSheet isOpened={typeSelect} title='「客片」还是「样片」？'>
                        <AtActionSheetItem onClick={() => {handleInput("客片", 'type'); toggleTypeSelect(false);}}>客片</AtActionSheetItem>
                        <AtActionSheetItem onClick={() => {handleInput("样片", 'type'); toggleTypeSelect(false);}}>样片</AtActionSheetItem>
                    </AtActionSheet>
                    <AtActionSheet isOpened={horseSelect} title='马拍不拍？'>
                        <AtActionSheetItem onClick={() => {handleInput(true, 'has_jockey'); toggleHorseSelect(false);}}>拍</AtActionSheetItem>
                        <AtActionSheetItem onClick={() => {handleInput(false, 'has_jockey'); toggleHorseSelect(false);}}>不拍</AtActionSheetItem>
                    </AtActionSheet>
            </View>
            { editMode && (<AtButton circle className='submit-btn' type='secondary' onClick={resetForm}>复原</AtButton>) }
            <AtButton circle className='submit-btn' type='primary' onClick={onSubmit}>提交</AtButton>
            { editMode && (<AtButton circle className='delete-btn' type='secondary' onClick={onDelete}>取消预约</AtButton>) }
        </View>
    )
}

export default AppointmentForm;
