const api = require("./../../../utils/api")
const util_1 = require("./../../../utils/util")
const storge_1 = require("./../../../utils/storge")

let tabData = {}
const start = {}
const end = {}
const app = getApp()

Page({
  data: {
    selectTabId: 0,
    list: [{name: '最近学习'}, {name: '已购课程'}],
    courses: [],
    isSearched: false
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
  onLoad (options) {
    if (!app.globalData.userInfo || !wx.getStorageSync(storge_1.TOKEN)){
      util_1.loginValidataion(app, () => {
        this.init(options)
      }, () => util_1.router(getCurrentPages(), '/package/pages/auth/auth'))
    } else {
      this.init(options)
    }
  },
  init (options) {
    tabData = {}
    const selectTabId = options.tab || 0
    this.setData({
      selectTabId
    })
    if (Number(selectTabId) === 1)
      this.myCourses()
    else
      this.latelyStudy()
  },
  tabBarChange (e) {
    const key = e.detail.key
    switch (key) {
      case 'course':
        util_1.router(getCurrentPages(), '/pages/index/index')
        break;
      case 'person':
      util_1.router(getCurrentPages(), '/package/pages/personalCenter/personalCenter')
        break;
      default: break;
    }
  },
  tabChange (e) {
    const selectTabId = e.detail.key
    this.switchTab(Number(selectTabId))
  },
  switchTab (selectTabId) {
    this.setData({
      selectTabId
    })
    if (tabData[selectTabId]) {
      this.setData({
        courses: tabData[selectTabId]
      })
    } else {
      switch (selectTabId) {
        case 0:
          this.latelyStudy()
          break;
        case 1:
          this.myCourses()
          break;
      }
    }
  },
  touchstart (e) {
    start.x = e.changedTouches[0].pageX
    start.y = e.changedTouches[0].pageY
  },
  touchend (e) {
    end.x = e.changedTouches[0].pageX
    end.y = e.changedTouches[0].pageY
    
    const X = end.x - start.x
    const Y = end.y - start.y

    const r = Math.atan2(Y, X) * 180 / Math.PI
    if ((r >= 155 && r <= 180) || (r >= -180 && r < -160)) {
      this.setData({
        selectTabId: 1
      })
      this.switchTab(1)
    } else if (r >= -35 && r <= 35 && r !== 0) {
      this.setData({
        selectTabId: 0
      })
      this.switchTab(0)
    }
  },
  myCourses () {
    api.mycourses().then(res => {
      tabData['1'] = res.data.courses
      this.setData({
        courses: res.data.courses,
        isSearched: true
      })
    })
  },
  latelyStudy () {
    api.latelyStudy().then(res => {
      tabData['0'] = res.data.record
      this.setData({
        courses: res.data.record,
        isSearched: true
      })
    })
  },
  goCourseInfo (e) {
    util_1.router(getCurrentPages(), '/package/pages/info/info?cid=' + e.currentTarget.dataset.cid)
  }
})