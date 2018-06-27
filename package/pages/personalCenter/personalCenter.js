const api = require("./../../../utils/api")

Page({
  data: {
    user: {},
    lesson: {},
  },
  onLoad () {
    api.mycourses().then(res => {
      this.setData({
        user: res.user,
        lesson: res.lessonBean
      })
    })

    let logData = { event: 300  }
    api.vLog(logData);
  },
  goRecords () {
    wx.navigateTo({url: '../myCourse/myCourse'})
  },
  goCart () {
    wx.navigateTo({url: '../myCourse/myCourse?tab=1'})
  },
  gocCupon () {
    wx.navigateTo({
      url: '../couponList/couponList'
    })
  },
  tabBarChange (e) {
    const key = e.detail.key
    switch (key) {
        case 'course':
          wx.navigateTo({url: '../../../pages/index/index'})
          break;
        case 'learn':
          console.log('learn')
          wx.navigateTo({url: '../myCourse/myCourse'})
          break;
        default: break;
    }
  },
})