import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components'
import { AtInput, AtButton, AtFloatLayout, AtRadio, AtMessage } from 'taro-ui';
import DocsHeader from '../../components/DocsHeader';
import Modal from '../../components/Modal/Modal';
import RegisterService from '../../services/Register/RegisterService';
import { REFRESH_APPLICATIONS } from '../../constants/events';

import { useAuth } from '../../context/AuthContext';
import { useLoader } from '../../context/LoaderContext';

import './RegistrationForm.scss';

const RegistrationForm = () => {
    const { isAuthenticated, isEmployee, userData } = useAuth();
    const { loading, showLoader, hideLoader } = useLoader();

    const [ formErrors, setFormError ] = useState({
        lName: false,
        fName: false,
        dept: false,
        phone: false
    })
    const [ formData, setFormData ] = useState({
        lName: '',
        fName: '',
        dept: '',
        phone: ''
    });
    const [ showDeptSelect, toggleDeptSelect ] = useState(false);
    const [ showSubmitModal, toggleSubmitModal ] = useState(false);

    const departments = ['安保', '市场', '酒店', '球会', '马会', '其他'];
    const radioOpts = [
        { label: '安保', value: '安保'},
        { label: '市场', value: '市场'},
        { label: '酒店', value: '酒店'},
        { label: '球会', value: '球会'},
        { label: '马会', value: '马会'},
        { label: '其他', value: '其他'}
    ]

    const handleInput = (value, field) => {
        setFormData({
            ...formData,
            [field]: value
        });
    }

    const hasFormErrors = () => {
        const phonePattern = /^1[3-9]\d{9}$/;
        let errors = { lName: false, fName: false, dept: false, phone: false };
        if (!formData.lName || !formData.lName.length) {
            errors.lName = true;
        }
        if (!formData.fName || !formData.fName.length) {
            errors.fName = true;
        }
        if (!departments.includes(formData.dept)) {
            errors.dept = true;
        }
        if (!phonePattern.test(formData.phone)) {
            errors.phone = true;
        }
        setFormError(errors);
        return (errors.lName || errors.fName || errors.dept || errors.phone);
    }

    const onSubmit = () => {
        if (hasFormErrors()) {
            Taro.atMessage({
                message: '输入错误',
                type: 'error'
            });
            return;
        }
        toggleSubmitModal(true);
    }

    const onConfirm = async () => {
        toggleSubmitModal(false);
        try {
            showLoader();
            const submitRes = await RegisterService.register(userData.openid, formData.lName, formData.fName, formData.dept, formData.phone);
            if (submitRes.success) {
                hideLoader();
                Taro.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                });
                setTimeout(() => {
                    Taro.eventCenter.trigger(REFRESH_APPLICATIONS, {});
                    Taro.navigateBack();
                }, 2000);
            }
        } catch (err) {
            hideLoader();
            console.error('some went wrong while posting', err);
            Taro.showToast({
                title: '提交失败',
                icon: 'fail'
            });
        }
    }

    return (
        <View className='index'>
            <AtMessage />
            <Modal isOpened={showSubmitModal} closeOnClickOverlay={true} title='请确认您填写的信息' 
                contents={[
                    {className: '.at-article__h3 centered', text: '提交后无法撤回'},
                    {className: '.at-article__h3', text: `姓名：${formData.lName}${formData.fName}`},
                    {className: '.at-article__h3', text: `部门：${formData.dept}`},
                    {className: '.at-article__h3', text: `手机：${formData.phone}`}
                ]}
                cancelText='取消' confirmText='提交' onClose={() => toggleSubmitModal(false)} onCancel={() => toggleSubmitModal(false)} onConfirm={onConfirm} />
            <DocsHeader className='header' title='员工注册申请' desc='请填写真实信息。提交后管理员会尽快处理'/>
            <View className='form-container'>
                    <AtInput
                        error={formErrors.lName}
                        name='lName'
                        title='姓'
                        type='text'
                        placeholder='请填写'
                        maxLength={20}
                        value={formData.lName}
                        adjustPosition
                        onChange={(value) => handleInput(value, 'lName')}
                        className='text-input'
                    />
                    <AtInput
                        error={formErrors.fName}
                        name='fName'
                        title='名'
                        type='text'
                        maxLength={20}
                        placeholder='请填写'
                        onClick
                        value={formData.fName}
                        adjustPosition
                        onChange={(value) => handleInput(value, 'fName')}
                        className='text-input'
                    />
                    <AtInput
                        error={formErrors.dept}
                        name='dept'
                        title='部门'
                        type='text'
                        placeholder='请选择'
                        value={formData.dept}
                        disabled={true}
                        editable={false}
                        onClick={() => toggleDeptSelect(true)}
                        className='text-input force-enable'
                    />
                    <AtFloatLayout isOpened={showDeptSelect} onClose={() => toggleDeptSelect(false)} cancelText='Cancel'>
                        <AtRadio 
                            options={radioOpts} 
                            value={formData.dept} 
                            onClick={(value) => {handleInput(value, 'dept'); toggleDeptSelect(false)}}
                        />
                    </AtFloatLayout>
                    <AtInput
                        error={formErrors.phone}
                        name='phone'
                        border={false}
                        title='手机号码'
                        type='phone'
                        placeholder='手机号码'
                        value={formData.phone}
                        adjustPosition
                        onChange={(value) => handleInput(value, 'phone')}
                        className='text-input'
                    />
            </View>
            <AtButton circle className='submit-btn' type='primary' onClick={onSubmit}>提交</AtButton>
        </View>
    )
}

export default RegistrationForm;
