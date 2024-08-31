import Taro from '@tarojs/taro'
import { REGISTER_URL } from '../../constants/config';

const RegisterService = {
    register: async (openid, lName, fName, dept, phone) => {
        console.log('RegisterService: register: invoked');
        try {
            const response = await Taro.request({
                url: REGISTER_URL,
                method: 'POST',
                data: {
                    openid: openid,
                    lName: lName,
                    fName: fName,
                    dept: dept,
                    phone: phone
                }
            });

            if (response.statusCode === 200) {
                console.log('RegisterService: register: success');
                return {
                    success: true,
                    message: '提交成功'
                };
            } else {
                console.log('RegisterService: register: post failed');
                throw new Error('RegisterService: register: post failed');
            }
        } catch (error) {
            console.error('RegisterService: error while registering', error);
            throw error;
        }
    },
    getApplication: async (openid) => {
        console.log('RegisterService: getApplication: invoked');
        try {
            const response = await Taro.request({
                url: `${REGISTER_URL}?openid=${openid}`,
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                }
            });
            if (response.statusCode === 200) {
                const applications = response.data;
                return {
                    success: true,
                    message: 'got applications',
                    applications
                };
            } else {
                console.log('RegisterService: getApplication: failed');
                throw new Error('RegisterService: getApplication: failed');
            }
        } catch (error) {
            console.error('RegisterService: getApplication: error fetching applications for openid: ' + openid, error);
            throw error;
        }
    }
}

export default RegisterService;
