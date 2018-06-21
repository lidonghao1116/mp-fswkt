"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../wxAPI.d.ts"/>
const util_1 = require("./../../utils/util");
const api_1 = require("./../../utils/api");
const storge_1 = require("./../../utils/storge");
let app = getApp();
let pageConfig = {
    showBackTopHeight: 600,
    pageSize: 10,
    page: 1,
    flag: true //是否还可以再次获取列表 
};
let indexData = {
    showAuthorModal: false,
    ready: false,
    actId: 0,
    showBackTop: false,
    scrollTop: 0,
    imgUrls: [],
    courseList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    showCoupon: false,
    showOnce: true,
    couponData: {
        totalMoney: '0',
        couponMoney: '0',
        desc: '0',
        endtime: '0',
        hasGotCoupon: false,
        granting: false
    },
    onceData: {
        totalMoney: '0',
        couponMoney: '20',
        desc: '0',
        hasGotCoupon: false,
        granting: false
    },
    params: {}
};
Page({
    data: indexData,
    onLoad: function (options) {
      wx.hideTabBar();
      const me = this  
      if (!app.globalData.userInfo) {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              me.login()
            } else {
              me.setData({
                showAuthorModal: true
              })
            }
          }
        })
      } else {
        this.init()
      }
      let params = util_1.getParams(options);
      let logData = [{ event: '100' }];
      this.setData({ params });
      api_1.vLog(logData);
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
      let me = this;
      //调用登录接口
      wx.login({
        success: data => {
          let code = data.code;
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              res.code = code;
              api_1.miniLogin(res).then(res => {
                let obj = res.obj || {};
                wx.setStorageSync(storge_1.TOKEN, obj.token);
                me.init()
              });
            }
          });
        }
      });
    },
    init: function (options) {
        wx.showTabBar();
        this.setData({
          showAuthorModal: false
        })
        let me = this;
        pageConfig.flag = true;
        pageConfig.page = 1;
        //获取banner图
       
        api_1.queryBanners().then(res => {
            me.setData({ imgUrls: res.obj });
        });
        //获取课程列表
        me.setCourseList();
        //me.checkValidAct();
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return {
            title: storge_1.shareTitle,
            path: util_1.getSharePath(),
            success: function (res) {
                // 转发成功
                let logData = [{ event: '600' }];
                api_1.vLog(logData);
            },
            fail: function (res) {
                // 转发失败
            }
        };
    },
    /**
     * @description 检查当前优惠券是否可用
     * @return {void}
     */
    checkValidAct: function () {
        let me = this;
        let params = me.data.params;
        if (params.channel == 1008) {
            me.setData({ showOnce: true });
            return;
        }
        if (params.actId) {
            api_1.checkValidAct([Number(params.actId)]).then(res => {
                let obj = res.obj || {};
                let isValid = obj.isValid;
                if (isValid) {
                    me.getCouponByAct(Number(params.actId));
                }
            });
        }
        else {
            //me.getValidActivity();
        }
    },
    getCouponByAct: function (actId) {
        let me = this;
        let couponData = me.data.couponData;
        api_1.grantCoupon([actId]).then(res => {
            let me = this;
            let obj = res.obj || {};
            if (!obj.couponCode) {
                return;
            }
            couponData.couponMoney = (obj.fee / 100).toFixed(2);
            couponData.desc = obj.title;
            couponData.endtime = util_1.formatDayTime(new Date(obj.endTime));
            couponData.granting = false;
            couponData.hasGotCoupon = true;
            me.setData({ couponData, showCoupon: true });
        });
    },
    /**
     * @description 领取优惠券
     * @return {void}
     */
    getCoupon: function () {
        let me = this;
        let couponData = me.data.couponData;
        couponData.granting = true;
        me.setData({ couponData });
        api_1.grantCoupon([me.data.actId]).then(res => {
            let me = this;
            let obj = res.obj || {};
            couponData.couponMoney = (obj.fee / 100).toFixed(2);
            couponData.desc = obj.title;
            couponData.endtime = util_1.formatDayTime(new Date(obj.endTime));
            if (obj.actId) {
                me.setData({ showCoupon: true, actId: obj.actId, couponData });
            }
        });
        setTimeout(() => {
            couponData.granting = false;
            couponData.hasGotCoupon = true;
            me.setData({ couponData });
        }, 2000);
    },
    /**
    * @description 领取优惠券
    * @return {void}
    */
    getCoupon1: function () {
        let me = this;
        let onceData = me.data.onceData;
        onceData.granting = true;
        me.setData({ onceData });
        let arr = [1009, 1010, 1011, 1012, 1013];
        arr.forEach(ele => {
            api_1.grantCoupon([ele]).then(res => {
                let me = this;
                let obj = res.obj || {};
                onceData.desc = obj.title || '已参加过活动';
                if (obj.actId) {
                    me.setData({ showOnce: true, actId: obj.actId, onceData });
                }
            });
        });
        setTimeout(() => {
            onceData.granting = false;
            onceData.hasGotCoupon = true;
            me.setData({ onceData });
        }, 2000);
    },
    /**
     * @description 关闭红包领取界面
     * @return {void}
     */
    closeCoupon: function (e) {
        let me = this;
        let couponData = me.data.couponData;
        let hasGotCoupon = couponData.hasGotCoupon;
        if (e.target.dataset.close == '2') {
            me.setData({ showCoupon: false });
        }
        else if (e.target.dataset.close == '1' && hasGotCoupon) {
            me.setData({ showCoupon: false });
        }
    },
    closeCoupon1: function (e) {
        let me = this;
        let onceData = me.data.onceData;
        let hasGotCoupon = onceData.hasGotCoupon;
        if (e.target.dataset.close == '2') {
            me.setData({ showOnce: false });
        }
        else if (e.target.dataset.close == '1' && hasGotCoupon) {
            me.setData({ showOnce: false });
        }
    },
    /**
     * @description 获取可领取优惠券
     * @return {void}
     */
    getValidActivity: function () {
        api_1.getValidActivity().then(res => {
            let me = this;
            let obj = res.obj || {};
            let couponData = me.data.couponData;
            couponData.totalMoney = (obj.totalFee / 100).toFixed(2);
            if (obj.actId) {
                me.setData({ showCoupon: true, actId: obj.actId, couponData });
            }
        });
    },
    /**
     * @description 更新课程列表
     * @param {Object} res
     * @return {void}
     */
    setCourseList: function () {
        //获取课程列表
        let me = this;
        if (!pageConfig.flag) {
            return;
        }
        pageConfig.flag = false;
        api_1.queryCourses([null, null, pageConfig.page, pageConfig.pageSize]).then(res => {
            let course, obj = res.obj || {};
            let record = obj.record;
            let newList = this.data.courseList;
            if (record) {
                record.forEach(ele => {
                    let course = ele.course;
                    ele.tutor = ele.tutor ? ele.tutor : {};
                    /** 转化需要的字段 start */
                    course.tname = ele.tutor.tname;
                    course.headImgUrl = ele.tutor.headImgUrl;
                    course.price = (course.price / 100).toFixed(2);
                    /** 转化需要的字段 end */
                    newList.push(course);
                });
            }
            me.setData({ courseList: newList });
            pageConfig.flag = obj.recordCount >= pageConfig.pageSize;
            pageConfig.page += 1;
        });
    },
    /**
     * @description 当主页滑到底端时，需要刷新数据
     * @param {Event} e
     * @return {void}
     */
    lower: function (e) {
        let me = this;
        me.setCourseList();
    },
    /**
     * @description 滚动监听
     * @param {Event} e
     * @return {void}
     */
    scroll: function (e) {
        let scrollTop = e.detail.scrollTop;
        if (scrollTop > pageConfig.showBackTopHeight) {
            this.setData({ showBackTop: true });
        }
        else {
            this.setData({ showBackTop: false });
        }
    },
    /**
     * @description 返回顶部
     * @return {void}
     */
    goTop: function () {
        this.setData({ scrollTop: 0 });
    },
    /**
    * @description 进入课程详情页
    * @param {Event} e
    * @return {void}
    */
    goCourseInfo: function (e) {
        let cid = e.currentTarget.dataset.id;
        let banner = e.currentTarget.dataset.banner
        if (banner) {
            let logData = [{ event: '401' }];
            api_1.vLog(logData);
        }
        let url = `../info/info?cid=${cid}`;
        wx.navigateTo({
            url
        });
    },
    /**
     * @description 上报form_id
     * @return {void}
     */
    formSubmit: function (e) {
        let form_id = e.detail.formId;
        let that = this;
        console.log('form_id' + form_id);
        api_1.addLittleTemplateMsg([{ form_id }]).then(res => {
            console.log('上报成功');
            console.log(res);
        });
    },
    btn1: function () {
        let me = this;
        wx.navigateToMiniProgram({
            appId: 'wxd6c5337aed6300ec',
            path: 'pages/index/index?shareType=getPrize&prize_id=1'
        });
    },
    btn2: function () {
        let me = this;
        me.setData({ showOnce: false });
    }
});
