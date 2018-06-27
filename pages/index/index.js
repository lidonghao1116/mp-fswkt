"use strict";
const api = require("./../../utils/api")
const util_1 = require("./../../utils/util")
const storge = require("./../../utils/storge");

let tabData = {}
const start = {}
const end = {}
const app = getApp();

Page({
    data: {
        selectTabId: 0,
        scrollH: 0,
        scrollW: 0,
        groups: [],
        banners: [],
        courses: [],
        showAuth: false,
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return {
            title: '丰盛微课堂',
            path: util_1.getSharePath('info'),
            success: function (res) {
                // 转发成功
                let logData = { event: 600 }
                api_1.vLog(logData);
            },
            fail: function (res) {
                // 转发失败
            }
        };
    },
    onLoad (options) {
        tabData = {}
        if (!app.globalData.userInfo) {
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
                    this.setData({
                        showAuth: true
                    })
                }
              }
            })
        } else {
            this.init()
        }
        //   let params = util_1.getParams(options);
        //   this.setData({ params });

        
    },
    onGotUserInfo: function (e) {
        if (e.detail.userInfo) {
          this.login()
        } else {
          wx.openSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                this.login()
              } else {
                wx.showToast({
                  title: '微信授权失败',
                  icon: 'none'
                })
              }
            }
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
                app.globalData.userInfo = res.userInfo;
                res.code = code;
                api.miniLogin(res).then(res => {
                  wx.setStorageSync(storge.TOKEN, res.token);
                  this.init()
                });
              }
            });
          }
        });
      },
    init: function (options) {
        this.setData({
            showAuth: false
        })
        wx.setNavigationBarColor({
            backgroundColor : '#ffffff',
            frontColor: '#000000'
        })
        wx.setNavigationBarTitle({
            title: '丰盛微课堂'
          })
        this.getSystemInfo()
        this.queryGroups().then(() => {
            this.setData({
                groupId: this.data.groups[0].id
            })
            this.queryCourse(this.data.groups[0].id)
        })
        this.queryBanner()
        
        let logData = { event: 100 }
        api.vLog(logData)
    },
    tabBarChange (e) {
        const key = e.detail.key
        switch (key) {
            case 'learn':
                wx.navigateTo({url: '../../package/pages/myCourse/myCourse'})
                break;
            case 'person':
                wx.navigateTo({url: '../../package/pages/personalCenter/personalCenter'})
                break;
            default: break;
        }
    },
    getSystemInfo () {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    scrollH: res.windowHeight - 50 // 底部tabbar高度
                });
            }
        })
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
            if (this.data.selectTabId < this.data.groups.length - 1) {
                this.setData({
                    selectTabId: Number(this.data.selectTabId) + 1
                })
                this.preQueryCourse(this.data.groups[this.data.selectTabId].id)
            }
        } else if (r >= -35 && r <= 35 && r !== 0) {
            if (this.data.selectTabId > 0) {
                this.setData({
                    selectTabId: Number(this.data.selectTabId) - 1
                })
                this.preQueryCourse(this.data.groups[this.data.selectTabId].id)
            }
        }
    },
    tabChange (e) {
        const selectTabId = e.detail.key
        const groupId = this.data.groups[selectTabId].id
        this.setData({
            selectTabId
        })
        this.preQueryCourse(groupId)
    },
    lower () {
        this.queryCourse (this.data.groups[this.data.selectTabId].id)
    },
    tapBanner (e) {
        wx.navigateTo({
            url: '../../package/pages/info/info?cid=' + e.currentTarget.dataset.cid
        })
        let logData = { event: 401 }
        api.vLog(logData)
    },
    goCourseInfo (e) {
        wx.navigateTo({
            url: '../../package/pages/info/info?cid=' + e.currentTarget.dataset.cid
        })
    },
    goSearch () {
        wx.navigateTo({
            url: '../../package/pages/search/search'
        })
    },
    queryGroups () {
        return api.queryGroups().then(res => {
            this.setData({
                groups: res.data
            })
        })
    },
    queryBanner () {
        api.queryBanners().then(res => {
            this.setData({
                banners: res.obj.filter(banner => banner.cid && !banner.url)
            })
        })
    },
    preQueryCourse (groupId) {
        if (tabData[groupId]) {
            this.setData({
                courses: tabData[groupId].courses
            })
        } else {
            this.queryCourse(groupId)
        }
    },
    queryCourse (groupId) {
        tabData[groupId] = tabData[groupId] || {}
        if (tabData[groupId].pageno > tabData[groupId].pageCount) return

        tabData[groupId].pageno = tabData[groupId].pageno || 1,
        api.queryCourses({
            pageno: tabData[groupId].pageno,
            pagesize: 10,
            groupId
        }).then(res => {
            
            let courses = tabData[groupId].courses || []
            courses = courses.concat(res.record)

            tabData[groupId].courses = courses
            this.setData({courses})

            tabData[groupId].pageno = tabData[groupId].pageno + 1
            tabData[groupId].pageCount = res.pageCount
        })
    }
});