"use strict";
const api = require("./../../../utils/api")
const util_1 = require("./../../../utils/util")
const storge_1 = require("./../../../utils/storge")
const app = getApp()

Page({
  data: {
    btnText: '取消',
    default: '',
    courses: [],
    isSearched: false
  },
  onLoad () {
    if (!app.globalData.userInfo || !wx.getStorageSync(storge_1.TOKEN)){
        util_1.loginValidataion(app, null, () => util_1.router(getCurrentPages(), '/package/pages/auth/auth'))
    }
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
  clearInput () {
    this.setData({
      btnText: '取消',
      default: '',
      courses: [],
      isSearched: false
    })
  },
  inputing (e) {
    this.setData({
      default: e.detail.value.trim()
    })
    if (e.detail.value.trim()) {
      this.setData({
        btnText: '搜索'
      })
    } else {
      this.setData({
        btnText: '取消'
      })
    }
  },
  hotwordSearch (e) {
    if (!e.target.id) return
    this.setData({
      default: e.target.id,
      btnText: '取消'
    })
    this.search(e.target.id)

  },
  tapSearch () {
    if (this.data.btnText === '取消') {
      wx.navigateBack(1)
    }
    if (this.data.default.trim()){
      this.search(this.data.default.trim())
      this.setData({
        btnText: '取消'
      })
    }
  },
  search (name) {

    api.queryCourseByName({
      pageno: 1,
      pagesize: 100,
      name
    }).then(res => {
      let courses = this.data.courses
      courses = courses.concat(res.data.record)
      this.setData({
        courses,
        isSearched: true
      })
    })
  },
  goCourseInfo (e) {
    util_1.router(getCurrentPages(), '/package/pages/info/info?cid=' + e.currentTarget.dataset.cid)
  }
})