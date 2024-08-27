import Taro from '@tarojs/taro'
import { APPOINTMENTS_URL } from '../../constants/config';

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

export default {
    getAppointments
}
