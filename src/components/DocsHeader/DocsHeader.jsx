import React from 'react';
import { View } from '@tarojs/components'
import './DocsHeader.scss'

const DocsHeader = ({ title='标题', desc=''}) => {
    return (
        <View className='doc_header'>
            <View className='doc_header_title'>{title}</View>
            <View className='doc_header_desc'>{desc}</View>
        </View>
    )
}

export default DocsHeader;
