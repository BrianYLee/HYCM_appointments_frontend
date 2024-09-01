import React from 'react'
import { View } from '@tarojs/components'
import { AtCard, AtButton} from 'taro-ui'

import './ApplicationCard.scss'

const ApplicationCard = ( { note = undefined, appInfo, onReview } ) => {
    return ( 
        <View className='application-card'>
            <AtCard
                title={`${appInfo.last_name}${appInfo.first_name}`}
                thumb={(appInfo.is_approved === null && require('../../images/icons/warning.png')) || (appInfo.is_approved === true && require('../../images/icons/check.png')) || (appInfo.is_approved === false && require('../../images/icons/x.png'))}
                extra={(appInfo.is_approved === null && (<AtButton onClick={() => onReview(appInfo)} size='small' circle>审核</AtButton>))}
                note={note}
            >
                <View className='at-row'>
                    <View className='at-col at-col-1 at-col--auto'>
                        { appInfo.date_created && (<View className='infoListing'>提交日期</View>) }
                        { appInfo.department && (<View className='infoListing'>部门</View>) }
                        { appInfo.phone && (<View className='infoListing'>联系方式</View>) }
                    </View>
                    <View className='at-col at-col__offset-1'>
                        { appInfo.date_created && (<View className='infoListing'>{appInfo.date_created}</View>) }
                        { appInfo.department && (<View className='infoListing'>{appInfo.department}</View>) }
                        { appInfo.phone && (<View className='infoListing'>{appInfo.phone}</View>) }
                    </View>
                </View>
            </AtCard>
        </View>
    );
};

export default ApplicationCard;
