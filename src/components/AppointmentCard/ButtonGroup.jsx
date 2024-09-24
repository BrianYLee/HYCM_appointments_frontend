import React from 'react'

// Components
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'

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

export default ButtonGroup;
