"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./wxAPI.d.ts"/>·
const util_1 = require("./utils/util");
const api_1 = require("./utils/api");
const storge_1 = require("./utils/storge");
exports.config = {
    onLaunch: function (options) {
        let param = util_1.getParams(options);
        this.globalData.channel = param.channel || '-2';
        wx.setStorageSync(storge_1.CHANNEL, this.globalData.channel);
    },
    appid: 'your appid',
    globalData: {
        userInfo: null,
        channel: '-2'
    }
};
App(exports.config);
