"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./wxAPI.d.ts"/>·
const util_1 = require("./utils/util");
const api_1 = require("./utils/api");
const storge_1 = require("./utils/storge");
exports.config = {
    /**
     * @description 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     * @param {Object} options
     * @return {void}
     */
    onLaunch: function (options) {
        let me = this;
        let param = util_1.getParams(options);
        me.globalData.channel = param.channel || '-2';
        wx.setStorageSync(storge_1.CHANNEL, me.globalData.channel);
    },
    appid: 'wxea8dcedf89df0e63',
    globalData: {
        userInfo: null,
        channel: '-2'
    }
};
App(exports.config);
