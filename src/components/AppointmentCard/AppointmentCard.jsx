import React from 'react'

// Components
import { View } from '@tarojs/components'
import { AtCard, AtButton} from 'taro-ui'

// styling
import './AppointmentCard.scss'

const AppointmentCard = ( { note = undefined, apmtInfo, handleCheckIn, handleCheckOut  } ) => {
    return ( 
        <View className='appointment-card'>
            <AtCard
                title={apmtInfo.plate}
                thumb={apmtInfo.checked_in
                    && require('../../images/icons/check.png')
                    || require('../../images/icons/warning.png')
                }
                extra={apmtInfo.checked_in
                    && (<AtButton disabled={!(apmtInfo.scheduled_date == new Date().toISOString().split('T')[0])} onClick={() => handleCheckOut(apmtInfo)} size='small' circle>取消签到</AtButton>)
                    || (<AtButton disabled={!(apmtInfo.scheduled_date == new Date().toISOString().split('T')[0])} onClick={() => handleCheckIn(apmtInfo)} size='small' circle type='primary'>签到</AtButton>)
                }
                note={note}
            >
                <View className='at-row'>
                    <View className='at-col at-col-1 at-col--auto'>
                        { apmtInfo.type && (<View className='infoListing'>类型</View>)}
                        { apmtInfo.studio_name && (<View className='infoListing'>拍摄机构</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>摄影师</View>)}
                    </View>
                    <View className='at-col at-col__offset-1'>
                        { apmtInfo.type && (<View className='infoListing'>{apmtInfo.type}</View>)}
                        { apmtInfo.studio_name && (<View className='infoListing'>{apmtInfo.studio_name}</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>{apmtInfo.manager_name}</View>)}
                    </View>
                </View>
            </AtCard>
        </View>
    );
};

export default AppointmentCard;

/*
                    <View className='at-col at-col-1 at-col--auto'>
                        { apmtInfo.id && (<View className='infoListing'>ID</View>)}
                        { apmtInfo.scheduled_date && (<View className='infoListing'>DATE</View>)}
                        { apmtInfo.type && (<View className='infoListing'>TYPE</View>)}
                        { apmtInfo.hotel && (<View className='infoListing'>HOTEL</View>)}
                        { apmtInfo.golf && (<View className='infoListing'>GOLF</View>)}
                        { apmtInfo.horse && (<View className='infoListing'>HORSE</View>)}
                        { apmtInfo.studio_name && (<View className='infoListing'>STUDIONAME</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>MANAGERNAME</View>)}
                        { apmtInfo.plate && (<View className='infoListing'>PLATE</View>)}
                    </View>
                    <View className='at-col at-col__offset-1'>
                        { apmtInfo.id && (<View className='infoListing'>{apmtInfo.id}</View>)}
                        { apmtInfo.scheduled_date && (<View className='infoListing'>{apmtInfo.scheduled_date}</View>)}
                        { apmtInfo.type && (<View className='infoListing'>{apmtInfo.type}</View>)}
                        { apmtInfo.hotel && (<View className='infoListing'>{apmtInfo.hotel}</View>)}
                        { apmtInfo.golf && (<View className='infoListing'>{apmtInfo.golf}</View>)}
                        { apmtInfo.horse && (<View className='infoListing'>{apmtInfo.horse}</View>)}
                        { apmtInfo.studio_name && (<View className='infoListing'>{apmtInfo.studio_name}</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>{apmtInfo.manager_name}</View>)}
                        { apmtInfo.plate && (<View className='infoListing'>{apmtInfo.plate}</View>)}
                    </View>
*/
