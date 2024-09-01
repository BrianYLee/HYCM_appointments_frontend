import Taro from '@tarojs/taro'
import { WECHAT_LOGIN_URL, WECHAT_RENEW_URL } from '../../constants/config';

const AuthService = {
    login: async (userCode) => {
        console.log('AuthService: login: invoked');
        try {
            const response = await Taro.request({
                url: WECHAT_LOGIN_URL,
                method: 'POST',
                data: {
                    code: userCode
                }
            });

            if (response.statusCode === 200) {
                const { openid, employee, employee_name, department } = response.data;
                console.log('AuthService: login: openid: ' + openid);
                return {
                    success: true,
                    message: '登录成功！',
                    openId: openid,
                    isEmployee: employee,
                    employee_name: employee_name,
                    department: department
                };
            } else {
                console.log('AuthService: login: login failed');
                throw new Error('AuthService: login: failed');
            }
        } catch (error) {
            console.error('AuthService: login: errur during login', error);
            throw error;
        }
    },
    renew: async (userid) => {
        console.log('AuthService: renew: invoked');
        try {
            const response = await Taro.request({
                url: WECHAT_RENEW_URL,
                method: 'POST',
                data: {
                    openid: userid
                }
            });

            if (response.statusCode === 200) {
                const { openid, employee, employee_name, department } = response.data;
                console.log('AuthService: login: openid: ' + openid);
                return {
                    success: true,
                    message: '登录成功！',
                    openId: openid,
                    isEmployee: employee,
                    employee_name: employee_name,
                    department: department
                };
            } else {
                console.log('AuthService: login: login failed');
                throw new Error('AuthService: login: failed');
            }
        } catch (error) {
            console.error('AuthService: login: errur during login', error);
            throw error;
        }
    }
}

export default AuthService;
