import React from 'react'
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
