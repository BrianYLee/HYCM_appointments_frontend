import React from 'react'

// Components
import { View } from '@tarojs/components'
import { AtCard, AtButton} from 'taro-ui'

// styling
import './AppointmentCard.scss'
import 'taro-ui/dist/style/components/card.scss'
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/loading.scss';

const AppointmentCard = ( { note, apmtInfo, handleButtonClick } ) => {
    return ( 
        <View className='appointment-card'>
            <AtCard
                title={apmtInfo.plate}
                thumb={apmtInfo.arrived && require('../../images/icons/check.png') || require('../../images/icons/warning.png')}
                extra={apmtInfo.arrived && (<AtButton onClick={() => handleButtonClick(apmtInfo.plate)} size='small' circle>取消签到</AtButton>) || (<AtButton onClick={() => handleButtonClick(apmtInfo.plate)} size='small' circle type='primary'>签到</AtButton>)}
                note={note}
            >
                <View className='at-row'>
                    <View className='at-col at-col-1 at-col--auto'>
                        { apmtInfo.id && (<View className='infoListing'>ID</View>)}
                        { apmtInfo.date && (<View className='infoListing'>DATE</View>)}
                        { apmtInfo.type && (<View className='infoListing'>TYPE</View>)}
                        { apmtInfo.areas && (<View className='infoListing'>AREAS</View>)}
                        { apmtInfo.studioName && (<View className='infoListing'>STUDIONAME</View>)}
                        { apmtInfo.managerName && (<View className='infoListing'>MANAGERNAME</View>)}
                        { apmtInfo.plate && (<View className='infoListing'>PLATE</View>)}
                    </View>
                    <View className='at-col at-col__offset-1'>
                        { apmtInfo.id && (<View className='infoListing'>{apmtInfo.id}</View>)}
                        { apmtInfo.date && (<View className='infoListing'>{apmtInfo.date}</View>)}
                        { apmtInfo.type && (<View className='infoListing'>{apmtInfo.type}</View>)}
                        { apmtInfo.areas && (<View className='infoListing'>{apmtInfo.areas}</View>)}
                        { apmtInfo.studioName && (<View className='infoListing'>{apmtInfo.studioName}</View>)}
                        { apmtInfo.managerName && (<View className='infoListing'>{apmtInfo.managerName}</View>)}
                        { apmtInfo.plate && (<View className='infoListing'>{apmtInfo.plate}</View>)}
                    </View>
                </View>
            </AtCard>
        </View>
    );
};

export default AppointmentCard;
