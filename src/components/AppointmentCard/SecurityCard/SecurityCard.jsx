import React, { useState } from 'react'
import ButtonGroup from '../ButtonGroup'
import { View } from '@tarojs/components'
import { AtCard, AtButton } from 'taro-ui'

// styling
import './SecurityCard.scss'

const SecurityCard = ({ apmtInfo, handleCheckIn, handleCheckOut }) => {
    // checkin functions
    return (
        <View className='appointment-card security-card'>
            <AtCard
                className='appointment-card-item'
                title={`${apmtInfo?.studio_name} - ${apmtInfo?.manager_name}`}
                //extra={<ButtonGroup apmtInfo={apmtInfo} today={today} handleEdit={handleEdit} />}
            >
                {apmtInfo?.vehicles?.map((vehicle, idx) => (
                    <View className={`at-row at-row__align--center ${idx%2 == 0 ? 'even' : 'odd'}`}>
                        <View className='at-col infoListing'>{vehicle.plate}</View>
                        <View className='at-col at-col__offset-1 at-col-1 at-col--auto infoListing info'>
                            <AtButton
                                circle
                                size='small'
                                type={vehicle.checked_in
                                    ? 'secondary'
                                    : 'primary'
                                }
                                onClick={vehicle.checked_in
                                    ? () => handleCheckOut({area: 'security', id: vehicle.id, content: vehicle.plate})
                                    : () => handleCheckIn({area: 'security', id: vehicle.id, content: vehicle.plate})
                                }
                            >
                                {vehicle.checked_in ? '取消签到' : '签到'}
                            </AtButton>
                        </View>
                    </View>
                ))}
            </AtCard>
        </View>
    )
};

export default SecurityCard;

/*

            <View className='at-row'>
                <View className='at-col at-col-1 at-col--auto infoListing'>{apmtInfo.type && '类型'}</View>
                <View className='at-col at-col__offset-1 infoListing'>{apmtInfo.type && (apmtInfo.type)}</View>
            </View>
            <View className='at-row'>
                <View className='at-col at-col-1 at-col--auto'>{ apmtInfo.scheduled_time_string !== undefined && (<View className='infoListing'>拍摄时间</View>)}</View>
                <View className='at-col at-col__offset-1'>{ apmtInfo.scheduled_time_string !== undefined && (<View className='infoListing'>{apmtInfo.scheduled_time_string || '未填'}</View>)}</View>
            </View>
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
*/
