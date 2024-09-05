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
                : ( apmtInfo.checked_in == true
                    ? ( apmtInfo.canCheckOut == true && (<AtButton className='at-col at-col-1 at-col--auto' disabled={!(apmtInfo.scheduled_date == today)} onClick={() => handleCheckOut(apmtInfo)} size='small' circle>取消签到</AtButton>))
                    : ( apmtInfo.canCheckIn == true && (<AtButton className='at-col at-col-1 at-col--auto' disabled={!(apmtInfo.scheduled_date == today)} onClick={() => handleCheckIn(apmtInfo)} size='small' circle type='primary'>签到</AtButton>))
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

export default AppointmentCard;
