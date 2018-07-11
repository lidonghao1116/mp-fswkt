const api = require("./../../../utils/api")
const util_1 = require("./../../../utils/util")
const storge_1 = require("./../../../utils/storge")
const app = getApp()

Page({
  data: {
    user: {},
    lesson: {},
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target);
    }
    let logData = { event: 600 }
    api.vLog(logData);
    return {
      title: '丰盛微课',
      path: util_1.getSharePath('index'),
      imageUrl: '../../../static/img/share.png',
    };
  },
  onLoad () {
    if (!app.globalData.userInfo || !wx.getStorageSync(storge_1.TOKEN)){
      util_1.loginValidataion(app, () => {
        this.init()
      }, () => util_1.router(getCurrentPages(), '/package/pages/auth/auth'))
    } else {
      this.init()
    }
  },
  init () {
    api.mycourses().then(res => {
      this.setData({
        user: res.data.user,
        lesson: res.data.lessonBean
      })
    })
    let logData = { event: 300  }
    api.vLog(logData)
  },
  goRecords () {
    util_1.router(getCurrentPages(), '/package/pages/myCourse/myCourse?tab=0')
  },
  goCart () {
    util_1.router(getCurrentPages(), '/package/pages/myCourse/myCourse?tab=1')
  },
  gocCupon () {
    util_1.router(getCurrentPages(), '/package/pages/couponList/couponList')
  },
  tabBarChange (e) {
    const key = e.detail.key
    switch (key) {
        case 'course':
          util_1.router(getCurrentPages(), '/pages/index/index')
          break;
        case 'learn':
          util_1.router(getCurrentPages(), '/package/pages/myCourse/myCourse?tab=0')
          break;
        default: break;
    }
  },
})