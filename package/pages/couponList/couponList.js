"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../../wxAPI.d.ts"/>
const util_1 = require("./../../../utils/util");
const api_1 = require("./../../../utils/api");
const storge_1 = require("./../../../utils/storge");

Page({
    data: {
        couponList: [],
    },
    onShow() {
        this.getCoupons();
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
                let logData = { event: '600' };
                api_1.vLog(logData);
            },
            fail: function (res) {
                // 转发失败
            }
        };
    },
    getCoupons: function () {
        api_1.mycoupons().then(res => {
            if (res.record) {
                const newList = []
                res.record.forEach(ele => {
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
