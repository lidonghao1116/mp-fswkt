const api = require("./../../../utils/api")
const util_1 = require("./../../../utils/util")
const storge_1 = require("./../../../utils/storge")
const app = getApp()

Page({
  data: {
    user: {},
    lesson: {},
  },
  onLoad () {
    if (!app.globalData.userInfo || !wx.getStorageSync(storge_1.TOKEN)) 
      util_1.router(getCurrentPages(), '/package/pages/auth/auth')
    else {
      api.mycourses().then(res => {
        this.setData({
          user: res.data.user,
          lesson: res.data.lessonBean
        })
      })

      let logData = { event: 300  }
      api.vLog(logData)
    }
  },
  goRecords () {
    util_1.router(getCurrentPages(), '/package/pages/myCourse/myCourse')
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
          util_1.router(getCurrentPages(), '/package/pages/myCourse/myCourse')
          break;
        default: break;
    }
  },
})