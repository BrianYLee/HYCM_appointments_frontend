import React from 'react'
import AdminCard from './AdminCard'
import SecurityCard from './SecurityCard'
import JockeyCard from './JockeyCard/JockeyCard'
import HotelCard from './HotelCard'
import GolfCard from './GolfCard'
import SalesCard from './SalesCard'
import { ROLES } from '../../constants/roles'
import { View } from '@tarojs/components'

import './AppointmentCard.scss'

const AppointmentCard = ( { department = null, note = undefined, apmtInfo, handleCheckIn=() => null, handleCheckOut = () => null, handleEdit=() => null, today } ) => {
    return (
        <View className='appointment-card'>
            {department == ROLES.ADMIN && (<AdminCard apmtInfo={apmtInfo} today={today} handleEdit={handleEdit} />)}
            {department == ROLES.SALES && (<SalesCard apmtInfo={apmtInfo} />)}
            {department == ROLES.SECURITY && (<SecurityCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
            {department == ROLES.JOCKEY && (<JockeyCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
            {department == ROLES.GOLF && (<GolfCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
            {department == ROLES.HOTEL && (<HotelCard apmtInfo={apmtInfo} today={today} handleCheckIn={handleCheckIn} handleCheckOut={handleCheckOut} />)}
        </View>
    );
};

export default AppointmentCard;
