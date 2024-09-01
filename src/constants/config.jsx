// base server url
const BASE_URL = 'https://api.hyculturemedia.com';
//const BASE_URL = 'http://localhost:3000';

// appointments endpoint
const APPOINTMENTS_ROUTE = '/appointments';
const APPOINTMENTS_CHECKIN = APPOINTMENTS_ROUTE + '/checkin';
const APPOINTMENTS_CHECKOUT = APPOINTMENTS_ROUTE + '/checkout';

// login endpoint
const WECHAT_LOGIN_ROUTE = '/login/wechat_login';
const WECHAT_RENEW_ROUTE = '/login/wechat_renew';

// registration endpoint
const REGISTER_ROUTE = '/register';
const APPLICATIONS_ROUTE = REGISTER_ROUTE + '/applications';
const APPLICATIONS_APPROVE = REGISTER_ROUTE + '/approve';
const APPLICATIONS_REJECT = REGISTER_ROUTE + '/reject';

export const APPOINTMENTS_URL = BASE_URL + APPOINTMENTS_ROUTE;
export const APPOINTMENT_CHECKIN_URL = BASE_URL + APPOINTMENTS_CHECKIN;
export const APPOINTMENT_CHECKOUT_URL = BASE_URL + APPOINTMENTS_CHECKOUT;

export const WECHAT_LOGIN_URL = BASE_URL + WECHAT_LOGIN_ROUTE;
export const WECHAT_RENEW_URL = BASE_URL + WECHAT_RENEW_ROUTE;

export const REGISTER_URL = BASE_URL + REGISTER_ROUTE;
export const APPLICATIONS_URL = BASE_URL + APPLICATIONS_ROUTE;
export const APPLICATIONS_APPROVE_URL = BASE_URL + APPLICATIONS_APPROVE;
export const APPLICATIONS_REJECT_URL = BASE_URL + APPLICATIONS_REJECT;
