import Taro from '@tarojs/taro'
import { APPOINTMENTS_URL, APPOINTMENT_CHECKIN_URL, APPOINTMENT_CHECKOUT_URL } from '../../constants/config';

const getAppointments = async (dateToFetch) => {
    console.log('AppointmentsService: getAppointments: invoked');
    try {
        const response = await Taro.request({
            url: `${APPOINTMENTS_URL}?date=${dateToFetch}`,
            method: 'GET',
            //data: userInfo,
            header: {
                'content-type': 'application/json'
            }
        });

        if (response.statusCode === 200) {
            // got appointments data, do something
            console.log('AppointmentsService: getAppointments: got successful response');
            console.log(response.data);
            return { success: true, data: response.data };
        } else {
            throw new Error(response.data.message || 'failed to fetch appontments');
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'none'
        });
        return { success: false, message: error.message };
    }
};

const checkIn = async (apmtId) => {
    console.log('AppointmentsService: checkIn: invoked. ID=' + apmtId);
    try {
        const userData = Taro.getStorageSync('userInfo');
        if (!userData || !userData.openid) {
            console.log('no openid found')
            throw new Error('AppointmentsService: checkIn: no openid found');
        }
        const response = await Taro.request({
            url: APPOINTMENT_CHECKIN_URL,
            method: 'POST',
            data: {
                openId: userData.openid,
                apmtId: apmtId
            },
            header: {
                'content-type': 'application/json'
            }
        });
        if (response.statusCode === 200) {
            // checkin posted
            console.log('AppointmentsService: checkIn: got successful response');
            return { success: true };
        } else {
            console.log('wtf happened? ');
            console.log(response);
            throw new Error('AppointmentsService: checkIn: failed to post checkin with ID ' + apmtId);
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'none'
        });
        return { success: false, message: 'AppointmentsService: checkIn: failed to post checkin' };
    }
};

const checkOut = async (apmtId) => {
    console.log('AppointmentsService: checkOut: invoked. ID=' + apmtId);
    try {
        const userData = Taro.getStorageSync('userInfo');
        if (!userData || !userData.openid) {
            console.log('no openid found')
            throw new Error('AppointmentsService: checkOut: no openid found');
        }
        const response = await Taro.request({
            url: APPOINTMENT_CHECKOUT_URL,
            method: 'POST',
            data: {
                openId: userData.openid,
                apmtId: apmtId
            },
            header: {
                'content-type': 'application/json'
            }
        });
        if (response.statusCode === 200) {
            // check-out posted
            console.log('AppointmentsService: checkOut: got successful response');
            return { success: true };
        } else {
            console.log('wtf happened? ');
            console.log(response);
            throw new Error('AppointmentsService: checkOut: failed to post checkout with ID ' + apmtId);
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'none'
        });
        return { success: false, message: 'AppointmentsService: checkOut: failed to post checkout' };
    }
};

export default {
    getAppointments,
    checkIn,
    checkOut
}
