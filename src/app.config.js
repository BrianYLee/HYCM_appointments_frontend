export default {
    pages: [
        "pages/index/index",
        "pages/Appointments/index",
        "pages/User/index"
    ],
    window: {
        backgroundTextStyle: "light",
        navigationBarBackgroundColor: "#ccc",
        navigationBarTitleText: "WeChat",
        navigationBarTextStyle: "black",
        enablePullDownRefresh: true
    },

    tabBar: {
        list: [
        {
            pagePath: 'pages/index/index',
            text: '首页',
            iconPath: 'images/tabbar/home-inactive.png',
            selectedIconPath: 'images/tabbar/home-active.png'
        },
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
