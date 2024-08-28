import React from 'react';
import { View } from '@tarojs/components';
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import './Modal.scss';

const Modal = ({ isOpened=false, closeOnClickOverlay=false, title, contents=[], cancelText, confirmText, onClose, onCancel, onConfirm }) => {
    return (
        <AtModal
            isOpened={isOpened}
            onClose={onClose}
            closeOnClickOverlay={closeOnClickOverlay}
        >
            <AtModalHeader>{title}</AtModalHeader>
            <AtModalContent>
                {contents.map(content => (
                    <View className={content.className}>{content.text}</View>
                ))}
            </AtModalContent>
            <AtModalAction className='modal-button-group'>
                {onCancel != null && (<AtButton circle type='secondary' onClick={onCancel}>{cancelText}</AtButton>)}
                {onConfirm != null && (<AtButton circle type='primary' onClick={onConfirm}>{confirmText}</AtButton>)}
            </AtModalAction>
        </AtModal>
    );
}

export default Modal;
