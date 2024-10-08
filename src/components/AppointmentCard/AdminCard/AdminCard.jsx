import React from 'react'
import ButtonGroup from '../ButtonGroup'
import { View } from '@tarojs/components'
import { AtCard } from 'taro-ui'

// styling
import './AdminCard.scss'

const AdminCard = ({ apmtInfo, today, handleEdit }) => {
    return ( 
        <View className='appointment-card admin-card'>
            <AtCard
                className='appointment-card-item'
                title={`${apmtInfo?.studio_name} - ${apmtInfo?.manager_name}`}
                extra={<ButtonGroup apmtInfo={apmtInfo} today={today} handleEdit={handleEdit} />}
            >
                <View className='at-row at-row__align--center even'>
                    <View className='at-col at-col-1 at-col--auto infoListing'>{apmtInfo.type && '类型'}</View>
                    <View className='at-col at-col__offset-1 infoListing info'>{apmtInfo.type && (apmtInfo.type)}</View>
                </View>
                <View className='at-row at-row__align--center odd'>
                    <View className='at-col at-col-1 at-col--auto infoListing'>{apmtInfo.scheduled_time_string !== undefined && '拍摄时间'}</View>
                    <View className='at-col at-col__offset-1 infoListing info'>{apmtInfo.scheduled_time_string !== undefined && (apmtInfo.scheduled_time_string || '未填')}</View>
                </View>
                <View className='at-row at-row__align--center even'>
                    <View className='at-col at-col-1 at-col--auto infoListing'>{apmtInfo.areas !== undefined && '拍摄区域'}</View>
                    <View className='at-col at-col__offset-1 infoListing info'>{apmtInfo.areas !== undefined && (apmtInfo.areas || '未填')}</View>
                </View>
                <View className='at-row at-row__align--center odd'>
                    <View className='at-col at-col-1 at-col--auto infoListing'>马会预约</View>
                    <View className='at-col at-col__offset-1 infoListing info'>{apmtInfo.has_jockey == true ? `有 ${apmtInfo.jockey_checked_in == true ? '已签到' : '未签到'}` : '没有'}</View>
                </View>
                <View className='at-row at-row__align--center even'>
                    <View className='at-col at-col-1 at-col--auto infoListing'>{apmtInfo.bridal_name !== undefined && '新人姓名'}</View>
                    <View className='at-col at-col__offset-1 infoListing info'>{apmtInfo.bridal_name !== undefined && (apmtInfo.bridal_name || '未填')}</View>
                </View>
                <View className='at-row at-row__align--center odd'>
                    <View className='at-col at-col-1 at-col--auto infoListing'>{apmtInfo.created_date && '添加日期'}</View>
                    <View className='at-col at-col__offset-1 infoListing info'>{apmtInfo.created_date && (apmtInfo.created_date)}</View>
                </View>
                <View className='at-row at-row__align--center even'>
                    <View className='at-col at-col-1 at-col--auto infoListing'>车辆信息</View>
                    <View className='at-col at-col__offset-1 infoListing info'>{apmtInfo.vehicles.map(vehicle => (
                        <View className='at-row at-row__align--center'>
                            <View className={`at-col at-col__offset-1 infoListing info ${vehicle.checked_in ? 'v-in' : 'v-not-in'}`}>{vehicle.plate} {vehicle.checked_in ? '已进场' : '未入场'}</View>
                        </View>))}
                    </View>
                </View>
            </AtCard>
        </View>
    )
};

export default AdminCard;
