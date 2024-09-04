import React from 'react'

// Components
import { View } from '@tarojs/components'
import { AtCard, AtButton} from 'taro-ui'

// styling
import './AppointmentCard.scss'

const ButtonGroup = ({ apmtInfo, today, handleCheckIn=null, handleCheckOut=null, handleEdit=() => null }) => {
    return (
        <View className='button-group at-row'>
            {apmtInfo?.canEdit 
                ? (<AtButton className='at-col at-col-1' onClick={() => handleEdit(apmtInfo.id)} size='small' circle >修改</AtButton>)
                : ( apmtInfo.checked_in
                    && ( apmtInfo.canCheckIn && (<AtButton className='at-col at-col-1 at-col--auto' disabled={!(apmtInfo.scheduled_date == today)} onClick={() => handleCheckOut(apmtInfo)} size='small' circle>取消签到</AtButton>))
                    || ( apmtInfo.canCheckOut && (<AtButton className='at-col at-col-1 at-col--auto' disabled={!(apmtInfo.scheduled_date == today)} onClick={() => handleCheckIn(apmtInfo)} size='small' circle type='primary'>签到</AtButton>))
                )
            }
        </View>
    )
}

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
                        { apmtInfo.studio_name && (<View className='infoListing'>拍摄机构</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>摄影师</View>)}
                        { apmtInfo.horse !== undefined && (<View className='infoListing'>马会预约</View>)}
                        { apmtInfo.created_date && (<View className='infoListing'>添加日期</View>)}
                    </View>
                    <View className='at-col at-col__offset-1'>
                        { apmtInfo.type && (<View className='infoListing'>{apmtInfo.type}</View>)}
                        { apmtInfo.studio_name && (<View className='infoListing'>{apmtInfo.studio_name}</View>)}
                        { apmtInfo.manager_name && (<View className='infoListing'>{apmtInfo.manager_name}</View>)}
                        { apmtInfo.horse != undefined && (<View className='infoListing'>{apmtInfo.horse ? '有' : '没有'}</View>)}
                        { apmtInfo.created_date && (<View className='infoListing'>{apmtInfo.created_date}</View>)}
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


/*
                extra={apmtInfo.checked_in
                    && ( apmtInfo.canCheckIn && (<AtButton disabled={!(apmtInfo.scheduled_date == today)} onClick={() => handleCheckOut(apmtInfo)} size='small' circle>取消签到</AtButton>))
                    || ( apmtInfo.canCheckOut && (<AtButton disabled={!(apmtInfo.scheduled_date == today)} onClick={() => handleCheckIn(apmtInfo)} size='small' circle type='primary'>签到</AtButton>))
                }
*/
