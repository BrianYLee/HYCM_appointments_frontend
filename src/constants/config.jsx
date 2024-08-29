// base server url
const BASE_URL = 'https://api.hyculturemedia.com';
//const BASE_URL = 'http://localhost:3000';

// appointments endpoint
const APPOINTMENTS_ROUTE = '/appointments';
const APPOINTMENTS_CHECKIN = '/appointments/checkin';
const APPOINTMENTS_CHECKOUT = '/appointments/checkout';

// login endpoint
const WECHAT_LOGIN_ROUTE = '/wechatlogin';

export const APPOINTMENTS_URL = BASE_URL + APPOINTMENTS_ROUTE;
export const APPOINTMENT_CHECKIN_URL = BASE_URL + APPOINTMENTS_CHECKIN;
export const APPOINTMENT_CHECKOUT_URL = BASE_URL + APPOINTMENTS_CHECKOUT;
export const WECHAT_LOGIN_URL = BASE_URL + WECHAT_LOGIN_ROUTE;
