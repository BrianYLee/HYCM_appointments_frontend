import React, { useState } from 'react'
import ButtonGroup from '../ButtonGroup'
import { View } from '@tarojs/components'
import { AtCard, AtButton } from 'taro-ui'

// styling
import './JockeyCard.scss'

const JockeyCard = ({ apmtInfo, handleCheckIn, handleCheckOut }) => {
    // checkin functions
    return (
        <View className='appointment-card jockey-card'>
            <AtCard
                className='appointment-card-item'
                title={`${apmtInfo?.studio_name}`}
                extra={
                    <AtButton
                        circle
                        size='small'
                        type={apmtInfo.jockey_checked_in
                            ? 'secondary'
                            : 'primary'
                        }
                        onClick={apmtInfo.jockey_checked_in
                            ? () => handleCheckOut({area: 'jockey', id: apmtInfo.id, content: `${apmtInfo.studio_name} ${apmtInfo.manager_name}`})
                            : () => handleCheckIn({area: 'jockey', id: apmtInfo.id, content: `${apmtInfo.studio_name} ${apmtInfo.manager_name}`})
                        }
                    >
                        {apmtInfo.jockey_checked_in ? '取消签到' : '签到'}
                    </AtButton>
                }
            >
                <View className={`at-row at-row__align--center even`}>
                    <View className='at-col infoListing'>类型</View>
                    <View className='at-col at-col__offset-1 at-col-1 at-col--auto infoListing info'>{apmtInfo.type}</View>
                </View>
                <View className={`at-row at-row__align--center odd`}>
                    <View className='at-col infoListing'>摄影师</View>
                    <View className='at-col at-col__offset-1 at-col-1 at-col--auto infoListing info'>{apmtInfo.manager_name}</View>
                </View>
                <View className={`at-row at-row__align--center even`}>
                    <View className='at-col infoListing'>新人姓名</View>
                    <View className='at-col at-col__offset-1 at-col-1 at-col--auto infoListing info'>{apmtInfo.bridal_name}</View>
                </View>
            </AtCard>
        </View>
    )
};

export default JockeyCard;
