import Taro from '@tarojs/taro'
import { WECHAT_LOGIN_URL } from '../../constants/config';

const AuthService = {
    login: async (credentials) => {
        console.log('AuthService: login: invoked');
        try {
            const response = await Taro.request({
                url: WECHAT_LOGIN_URL,
                method: 'POST',
                data: {
                    code: credentials,
                }
            });

            if (response.statusCode === 200) {
                const { openid } = response.data;
                console.log('AuthService: login: openid: ' + openid);
                return {
                    success: true,
                    message: '登录成功！',
                    openId: openid
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
