"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../wxAPI.d.ts"/>
const util_1 = require("./../../utils/util");
const api_1 = require("./../../utils/api");
const storge_1 = require("./../../utils/storge");
let app = getApp();
let pageConfig = {
    showBackTopHeight: 600,
    pageSize: 20,
    page: 1,
    flag: true //是否还可以再次获取列表 
};
let couponListData = {
    couponList: [],
    empty: null
};
Page({
    data: couponListData,
    onLoad: function (options) {
        let me = this;
        let params = util_1.getParams(options);
        //获取优惠券
    },
    onShow() {
        let me = this;
        pageConfig.flag = true;
        pageConfig.page = 1;
        me.getCoupons();
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
    getCoupons: function () {
        //获取课程列表
        let me = this;
        if (!pageConfig.flag) {
            return;
        }
        pageConfig.flag = false;
        api_1.findCoupons([1, pageConfig.page, pageConfig.pageSize]).then(res => {
            let obj = res.obj || {};
            let record = obj.record;
            let newList = this.data.couponList;
            if (record) {
                record.forEach(ele => {
                    /** 转化需要的字段 start */
                    ele.endTime = util_1.formatDayTime(new Date(ele.endTime));
                    ele.fee = (ele.fee / 100).toFixed(2);
                    /** 转化需要的字段 end */
                    newList.push(ele);
                });
            }
            me.setData({ couponList: newList, empty: newList.length == 0 });
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
        me.getCoupons();
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
    goIndex: function (e) {
        wx.switchTab({
            url: '../index/index'
        });
    }
});
