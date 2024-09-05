import Taro from '@tarojs/taro'
import { REGISTER_URL, APPLICATIONS_URL, APPLICATIONS_APPROVE_URL, APPLICATIONS_REJECT_URL } from '../../constants/config';

const RegisterService = {
    register: async (openid, lName, fName, dept, phone) => {
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
                throw new Error('RegisterService: getApplication: failed');
            }
        } catch (error) {
            console.error('RegisterService: getApplication: error fetching applications for openid: ' + openid, error);
            throw error;
        }
    },

    getApplications: async (openid) => {
        try {
            const response = await Taro.request({
                url: `${APPLICATIONS_URL}?openid=${openid}`,
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
                    data: applications
                };
            } else {
                console.log('RegisterService: getApplications: failed');
                throw new Error('RegisterService: getApplications: failed');
            }
        } catch (error) {
            console.error('RegisterService: getApplications: error fetching employee applications with openid: ' + openid, error);
            throw error;
        }
    },

    approve: async (openid, application) => {
        try {
            const response = await Taro.request({
                url: APPLICATIONS_APPROVE_URL,
                method: 'POST',
                data: {
                    employee_openid: openid,
                    application_id: application.id,
                    application_openid: application.openid
                }
            });
            if (response.statusCode === 200) {
                return {
                    success: true,
                    message: '提交成功'
                };
            } else {
                console.log('RegisterService: approve: post failed');
                throw new Error('RegisterService: approve: post failed');
            }
        } catch (error) {
            console.error('RegisterService: error while approve', error);
            throw error;
        }
    },

    reject: async (openid, application) => {
        console.log('RegisterService: reject: invoked');
        try {
            const response = await Taro.request({
                url: APPLICATIONS_REJECT_URL,
                method: 'POST',
                data: {
                    employee_openid: openid,
                    application_id: application.id,
                    application_openid: application.openid
                }
            });
            if (response.statusCode === 200) {
                return {
                    success: true,
                    message: '提交成功'
                };
            } else {
                throw new Error('RegisterService: reject: post failed');
            }
        } catch (error) {
            console.error('RegisterService: error while reject', error);
            throw error;
        }
    }
}

export default RegisterService;
