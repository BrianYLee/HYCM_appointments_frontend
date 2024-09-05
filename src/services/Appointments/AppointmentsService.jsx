import Taro from '@tarojs/taro'
import { APPOINTMENTS_URL, APPOINTMENT_CHECKIN_URL, APPOINTMENT_CHECKOUT_URL, APPOINTMENT_EDIT_URL, APPOINTMENT_DELETE_URL } from '../../constants/config';

const getAppointments = async (openid, dateToFetch) => {
    try {
        const response = await Taro.request({
            url: `${APPOINTMENTS_URL}?openid=${openid}&date=${dateToFetch}`,
            method: 'GET',
            header: {
                'content-type': 'application/json'
            }
        });

        if (response.statusCode === 200) {
            // got appointments data, do something
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

const postAppointment = async (openId, apmtObj) => {
    try {
        if (!openId) {
            throw new Error('AppointmentsService: checkIn: no openid found');
        }
        const response = await Taro.request({
            url: APPOINTMENTS_URL,
            method: 'POST',
            data: {
                ...apmtObj,
                openid: openId
            }
        });
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            console.log('cant post appointment');
            console.log(response);
            throw new Error('AppointmentsService: postAppointment: failed to post appointment');
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'error'
        });
        return { success: false, message: 'AppointmentsService: postAppointment: failed to post' };
    }
};

const checkIn = async (apmtId) => {
    try {
        const userData = Taro.getStorageSync('userInfo');
        if (!userData || !userData.openid) {
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
            return { success: true };
        } else {
            console.log('wtf happened? ');
            console.log(response);
            throw new Error('AppointmentsService: checkIn: failed to post checkin with ID ' + apmtId);
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'error'
        });
        return { success: false, message: 'AppointmentsService: checkIn: failed to post checkin' };
    }
};

// for editting appointment. Admin only.
const getAppointment = async (openId, apmtId) => {
    try {
        const response = await Taro.request({
            url: `${APPOINTMENT_EDIT_URL}?openid=${openId}&apmt=${apmtId}`,
            method: 'GET',
            header: {
                'content-type': 'application/json'
            }
        });
        if (response.statusCode === 200) {
            // got appointments data, do something
            return { success: true, data: response.data };
        } else {
            throw new Error(response.data.message || 'failed to fetch appontment id: ' + apmtId + ' openid: ' + openId);
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'none'
        });
        return { success: false, message: error.message };
    }
};

const editAppointment = async (openId, apmtObj) => {
    try {
        const response = await Taro.request({
            url: APPOINTMENT_EDIT_URL,
            method: 'POST',
            data: {
                ...apmtObj,
                openid: openId
            }
        });
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            console.log('cant edit appointment');
            console.log(response);
            throw new Error('AppointmentsService: editAppointment: failed to post appointment');
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'error'
        });
        return { success: false, message: 'AppointmentsService: editAppointment: failed to post' };
    }
};

const deleteAppointment = async (openId, apmt) => {
    try {
        const response = await Taro.request({
            url: APPOINTMENT_DELETE_URL,
            method: 'POST',
            data: {
                id: apmt,
                openid: openId
            }
        });
        if (response.statusCode === 200) {
            return { success: true };
        } else {
            console.log('cant delete appointment');
            console.log(response);
            throw new Error('AppointmentsService: deleteAppointment: failed to post');
        }
    } catch (error) {
        Taro.showToast({
            title: error.message,
            icon: 'error'
        });
        return { success: false, message: 'AppointmentsService: deleteAppointment: failed to post' };
    }
};

const checkOut = async (apmtId) => {
    try {
        const userData = Taro.getStorageSync('userInfo');
        if (!userData || !userData.openid) {
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
    postAppointment,
    checkIn,
    checkOut,
    getAppointment,
    editAppointment,
    deleteAppointment
}
