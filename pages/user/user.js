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
    page: 1
};
let userData = {
    courseList: [],
    couponsNum: '0'
};
Page({
    data: userData,
    onLoad: function (options) {
        let params = util_1.getParams(options);
        let me = this;
        let logData = [{ event: '300' }];
        api_1.vLog(logData);
    },
    onShow: function () {
        let me = this;
        //获取个人课程信息
        api_1.getMyCourse().then(res => {
            let obj = res.obj || {};
            let courses = obj.courses;
            if (courses) {
                courses.forEach(ele => {
                    let course = ele.course;
                    /** 转化需要的字段 start */
                    course.tname = ele.tutor.tname;
                    course.headImgUrl = ele.tutor.headImgUrl;
                    course.price = (course.price / 100).toFixed(2);
                    /** 转化需要的字段 end */
                });
            }
            me.setData({
                courseList: courses,
                headImgUrl: obj.user.headImgUrl,
                lessonBean: obj.lessonBean
            });
        });
        api_1.findCoupons([1, 1, 100]).then(res => {
            let obj = res.obj || {};
            let recordCount = obj.recordCount || 0;
            me.setData({
                couponsNum: recordCount > 99 ? '99+' : ('' + recordCount)
            });
        });
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
    * @description 进入课程详情页
    * @param {Event} e
    * @return {void}
    */
    goCourseInfo: function (e) {
        let cid = e.currentTarget.dataset.id;
        let url = `../info/info?cid=${cid}`;
        wx.navigateTo({
            url
        });
    }
});
