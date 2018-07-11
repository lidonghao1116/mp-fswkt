const storge = require("../../../utils/storge")
const api = require("../../../utils/api")
const app = getApp()

Page({
  data: {
    scrollH: 0,
    scrollW: 0,
  },
  onLoad () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.login()
        } else {
          wx.setNavigationBarColor({
            backgroundColor : '#bdb5c2',
            frontColor: '#ffffff'
          })
          var res = wx.getSystemInfoSync()
          this.setData({
            scrollH: res.windowHeight - 40,
            scrollW: res.windowWidth
          })
        }
      }
    })
  },
  onGotUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.login()
    } else {
      wx.showToast({
        title: '微信授权失败',
        icon: 'none'
      })  
    }
  },
  login: function () {
    //调用登录接口
    wx.login({
      success: data => {
        let code = data.code;
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            res.code = code;
            api.miniLogin(res).then(res => {
              wx.setStorageSync(storge.TOKEN, res.data.token)
              const pageStack = getCurrentPages()
              const route = pageStack[pageStack.length - 2]
              let params = ''
              if (route && route.options) {
                Object.keys(route.options).forEach(key => {
                  params += '&' + key + '=' + route.options[key]
                })
              }
              if (params) params = params.replace('&', '?')
              wx.reLaunch({
                url: '/' + route.route + params
              })
            })
          }
        })
      }
    })
  }
})