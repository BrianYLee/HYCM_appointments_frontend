export default {
  pages: [
    "pages/index/index",
    "pages/Appointments/index",
    "pages/User/index"
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: 'Taro'
      },
      {
        pagePath: 'pages/Appointments/index',
        text: 'Appointments'
      },
      {
        pagePath: 'pages/User/index',
        text: 'User'
      }
    ]
  }
};
