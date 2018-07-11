"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../../wxAPI.d.ts"/>
const util_1 = require("./../../../utils/util");
const api_1 = require("./../../../utils/api");
const storge_1 = require("./../../../utils/storge");

const app = getApp()
Page({
    data: {
        couponList: [],
    },
    onLoad () {
        if (!app.globalData.userInfo || !wx.getStorageSync(storge_1.TOKEN)){
            util_1.loginValidataion(app, () => {
                this.getCoupons()
            }, () => util_1.router(getCurrentPages(), '/package/pages/auth/auth'))
        } else {
            this.getCoupons()
        }
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        let logData = { event: 600 }
        api_1.vLog(logData);
        return {
          title: '丰盛微课',
          path: util_1.getSharePath('index'),
          imageUrl: '../../../static/img/share.png',
        };
    },
    getCoupons: function () {
        api_1.mycoupons().then(res => {
            if (res.data.record) {
                const newList = []
                res.data.record.forEach(ele => {
                    ele.endTime = util_1.formatDayTime(new Date(ele.endTime));
                    /** 转化需要的字段 end */
                    newList.push(ele);
                });
                this.setData({ couponList: newList });
            }
        });
    },
    /**
    * @description 进入课程详情页
    * @param {Event} e
    * @return {void}
    */
    goIndex: function () {
        util_1.router(getCurrentPages(), '/pages/index/index')
    }
});
