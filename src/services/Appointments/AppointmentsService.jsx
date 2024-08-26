import Taro from '@tarojs/taro'

const BASE_URL = 'http://localhost:3303';

export const Appointments = async (userInfo) => {
    try {
        const response = await Taro.request({
            url: `${BASE_URL}/api/appointments`,
            method: 'GET',
            data: userInfo,
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
