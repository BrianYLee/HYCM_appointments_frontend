import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtNavBar, AtCalendar, AtButton, AtFloatLayout } from 'taro-ui';

import "./CalendarTab.scss";

const CalendarTab = ({ currentDate, handleDateChange, handleRefresh=() => {}, handleNewAppointment }) => {
    const [ selectedDate, setSelectedDate ] = useState(currentDate || 'no date');
    const [ dateChinese, setChineseDate ] = useState('')
    const [ showCalendar, toggleCalendar ] = useState(false)

    const onCalendarCancel = () => {
        setSelectedDate(currentDate);
        toggleCalendar(false)
    }

    const onDateConfirm = (type) => {
        // validate here
        if (selectedDate === '') {
            Taro.atMessage({
                'message': 'bad date selection',
                'type': type
            })
            return;
        }
        toggleCalendar(false);
        handleDateChange(selectedDate);
    }
    
    const handleDateSelect = (dateObj) => {
        setSelectedDate(dateObj.value.end);
    }

    const dateToCn = () => {
        const [year, month, day] = currentDate.split('-');
        return `${year}年${month}月${day}日`;
    }

    useEffect(() => {
        const chineseDate = dateToCn();
        setChineseDate(chineseDate);
    }, [ currentDate ]);

    return (
        <View>
            <AtNavBar
                fixed
                className='calendar-nav'
                onClickLeftIcon={handleRefresh}
                onClickRgIconSt={() => (toggleCalendar(true))}
                onClickRgIconNd={handleNewAppointment}
                color='#666'
                title={dateChinese}
                leftIconType='reload'
                rightFirstIconType='calendar'
                rightSecondIconType={handleNewAppointment ? 'add' : undefined}
            />
            <AtFloatLayout isOpened={showCalendar} cancelText='cancel' onClose={onCalendarCancel}>
                <AtCalendar currentDate={currentDate} format='YYYY-MM-DD' onSelectDate={e => (handleDateSelect(e))} isMultiSelect={false}/>
                <AtButton type='primary' circle onClick={onDateConfirm.bind(this, 'error')}>确认</AtButton>
            </AtFloatLayout>
        </View>
    )
}

export default CalendarTab;
