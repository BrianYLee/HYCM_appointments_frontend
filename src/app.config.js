export default {
    pages: [
        "pages/Welcome/index",
        "pages/Registration/index",
        "pages/Appointments/index",
        "pages/User/index",
        "pages/Applications/index",
        "forms/Registration/index",
        "forms/Appointment/index"
    ],
    window: {
        backgroundTextStyle: "light",
        navigationBarBackgroundColor: "#fff",
        navigationBarTitleText: "WeChat",
        navigationBarTextStyle: "black",
        //enablePullDownRefresh: true
    },
    tabBar: {
        selectedColor: '#000000',
        color: '#aaaaaa',
        borderStyle: 'black',
        backgroundColor: '#fff',
        list: [
            {
                pagePath: 'pages/Appointments/index',
                text: '签到',
                iconPath: 'images/tabbar/booking-inactive.png',
                selectedIconPath: 'images/tabbar/booking-active.png'
            },
            {
                pagePath: 'pages/User/index',
                text: '我的',
                iconPath: 'images/tabbar/user-inactive.png',
                selectedIconPath: 'images/tabbar/user-active.png'
            }
        ]
    }
};
