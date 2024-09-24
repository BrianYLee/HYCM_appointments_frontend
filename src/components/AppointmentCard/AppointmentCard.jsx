import React from 'react'
import AdminCard from './AdminCard'
import SecurityCard from './SecurityCard'
import JockeyCard from './JockeyCard/JockeyCard'
import HotelCard from './HotelCard'
import GolfCard from './GolfCard'
import { ROLES } from '../../constants/roles'
import { View } from '@tarojs/components'

import './AppointmentCard.scss'

const AppointmentCard = ( { department = null, note = undefined, apmtInfo, handleCheckIn=() => null, handleCheckOut = () => null, handleEdit=() => null, today } ) => {
    return (
        <View className='appointment-card'>
            {department == ROLES.ADMIN && (<AdminCard apmtInfo={apmtInfo} today={today} handleEdit={handleEdit} />)}
            {department == ROLES.SECURITY && (<SecurityCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
            {department == ROLES.JOCKEY && (<JockeyCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
            {department == ROLES.GOLF && (<GolfCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
            {department == ROLES.HOTEL && (<HotelCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
        </View>
    );
};

export default AppointmentCard;

/*
const AppointmentCard = ( { note = undefined, apmtInfo, handleCheckIn, handleCheckOut, handleEdit=() => null, today } ) => {
    return ( 
        <View className='appointment-card'>
            <AtCard
                className='appointment-card-item'
                title={apmtInfo.plate}
                thumb={apmtInfo.checked_in
                    && require('../../images/icons/check.png')
                    || require('../../images/icons/warning.png')
                }
                extra={<ButtonGroup apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} handleEdit={handleEdit} />}
                note={note}
            >
                <View className='at-row'>
                    <View className='at-col at-col-1 at-col--auto'>
                        { apmtInfo.type && (<View className='infoListing'>类型</View>)}
                        { apmtInfo.scheduled_time_string !== undefined && (<View className='infoListing'>拍摄时间</View>)}
                        { apmtInfo.studio_name && (<View className='infoListing'>机构名称</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>摄影师</View>)}
                        { apmtInfo.bridal_name !== undefined && (<View className='infoListing'>新人姓名</View>)}
                        { apmtInfo.areas !== undefined && (<View className='infoListing'>拍摄区域</View>)}
                        { apmtInfo.horse != undefined && (<View className='infoListing'>马会预约</View>)}
                        { apmtInfo.created_date && (<View className='infoListing'>添加日期</View>)}
                    </View>
                    <View className='at-col at-col__offset-1'>
                        { apmtInfo.type && (<View className='infoListing'>{apmtInfo.type}</View>)}
                        { apmtInfo.scheduled_time_string !== undefined && (<View className='infoListing'>{apmtInfo.scheduled_time_string || '未填'}</View>)}
                        { apmtInfo.studio_name && (<View className='infoListing'>{apmtInfo.studio_name}</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>{apmtInfo.manager_name}</View>)}
                        { apmtInfo.bridal_name !== undefined && (<View className='infoListing'>{apmtInfo.bridal_name || '未填'}</View>)}
                        { apmtInfo.areas !== undefined && (<View className='infoListing'>{apmtInfo.areas || '未填'}</View>)}
                        { apmtInfo.horse != undefined && (<View className='infoListing'>{apmtInfo.horse ? '有' : '没有'}</View>)}
                        { apmtInfo.created_date && (<View className='infoListing'>{apmtInfo.created_date}</View>)}
                    </View>
                </View>
            </AtCard>
        </View>
    );
};
*/