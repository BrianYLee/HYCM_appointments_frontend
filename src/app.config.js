export default {
  pages: [
    "pages/index/index",
    "pages/Home/index"
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
        pagePath: 'pages/Home/index',
        text: 'Home'
      }
    ]
  }
};
