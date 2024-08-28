import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtNavBar, AtCalendar, AtButton, AtFloatLayout } from 'taro-ui';

import "./CalendarTab.scss";

const CalendarTab = ({ currentDate, handleDateChange }) => {
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
                onClickRgIconSt={() => (toggleCalendar(true))}
                color='#666'
                title={dateChinese}
                rightFirstIconType='calendar'
            />
            <AtFloatLayout isOpened={showCalendar} cancelText='cancel' onClose={onCalendarCancel}>
                <AtCalendar currentDate={currentDate} format='YYYY-MM-DD' onSelectDate={e => (handleDateSelect(e))} isMultiSelect={false}/>
                <AtButton type='primary' circle onClick={onDateConfirm.bind(this, 'error')}>Confirm</AtButton>
            </AtFloatLayout>
        </View>
    )
}

export default CalendarTab;

/*

        <>
            <View className='calendar-tab'>
                <View className='at-row'>
                    <View className='at-col calendar-selector'>
                        <AtButton full onClick={() => toggleCalendar(true)}>
                            {currentDate}
                        </AtButton>
                    </View>
                </View>
            </View>
            <AtFloatLayout isOpened={showCalendar} cancelText='cancel' onClose={onCalendarCancel}>
                <AtCalendar currentDate={currentDate} format='YYYY-MM-DD' onSelectDate={e => (setSelectedDate(e.value.end))} isMultiSelect={false}/>
                <AtButton type='primary' circle onClick={onDateConfirm.bind(this, 'error')}>Confirm</AtButton>
            </AtFloatLayout>
        </>


            <View className='calendar-tab'>
                <View className='at-row'>
                    <View className='at-col at-col-2 calendar-left'>
                        <AtButton onClick={handleLeftClick} full>
                            <AtIcon value='chevron-left' size='30' color='#000000'></AtIcon>
                        </AtButton>
                    </View>
                    <View className='at-col calendar-selector'>
                        <AtButton full onClick={() => toggleCalendar(true)}>
                            {currentDate}
                        </AtButton>
                    </View>
                    <View className='at-col at-col-2 calendar-right'>
                        <AtButton full onClick={handleRightClick}>
                            <AtIcon value='chevron-right' size='30' color='#000000'></AtIcon>
                        </AtButton>
                    </View>
                </View>
                <Text>current date: {currentDate}</Text>
                <Text>selected Date: {selectedDate}</Text>
            </View>
*/
