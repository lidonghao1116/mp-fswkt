"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storge_1 = require("./storge");
const util_1 = require("./util");
/**
 * @description 登录
 * @param {Objcet} res
 * @return {Promise}
 */
function miniLogin(res) {
    // let rawData = res.rawData
    // let signature = res.signature
    // let encryptedData = res.encryptedData
    // let iv = res.iv
    // let code = res.code
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.miniLogin,
        data: {
            params: [Object.assign({}, res, { channel })],
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'miniLogin'
        },
        method: 'POST',
        header: {
            'content-type': 'application/json',
            'head': {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            }
        },
        dataType: 'json'
    });
    return re;
}
exports.miniLogin = miniLogin;
/**
 * @description 主页banner图
 * @return {Promise}
 */
function queryBanners() {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryBanners,
        data: {
            params: [],
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'queryBanners',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.queryBanners = queryBanners;
/**
 * @description 主页课程列表图
 * @param {Array} params
 * @return {Promise}
 */
function queryCourses(params) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryCourses,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'queryCourses',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.queryCourses = queryCourses;
/**
 * @description 主页课程详情
 * @param {Array} params
 * @return {Promise}
 */
function findCourseById(params) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.findCourseById,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'findCourseById',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.findCourseById = findCourseById;
/**
 * @description 主页课程详情
 * @param {Array} params
 * @return {Promise}
 */
function queryChapters(params) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryChapters,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'queryChapters',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.queryChapters = queryChapters;
/**
 * @description 获取我的课程
 * @param {Array} params
 * @return {Promise}
 */
function getMyCourse(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.getMyCourse,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'getMyCourse',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.getMyCourse = getMyCourse;
/**
 * @description 获取我的课程
 * @param {Array} params
 * @return {Promise}
 */
function createOrder(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.createOrder,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'createOrder',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.createOrder = createOrder;
/**
 * @description 获取我的课程
 * @param {Array} params
 * @return {Promise}
 */
function createComplexOrder(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.createComplexOrder,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'createComplexOrder',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.createComplexOrder = createComplexOrder;
// let EventCode = {
//     list: 100    // 列表
//     view: 200,   // 查看
//     my: 300      // 个人中心
//     click: 400,  // 点击
//     click-banner: 401,  // 点击banner --new
//     play: 500,   // 播放
//     play-end: 501,   // 播放结束
//     play-ing: 502,   // 播放80% --new
//     share: 600       //分享
//     order: 700       //下单 --new
// }
/**
 * @description 统计
 * @param {{event:EventCode}[]} params
 * @return {Promise}
 */
function vLog(params = []) {
    console.log('上报事件参数', params[0])
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.logVist,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'logVist',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    util_1.request({
        url: storge_1.url.logPush,
        data: {
            ...params[0],
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'logVist',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.vLog = vLog;
/**
 * @description 获取优惠券
 * @param {Array} params
 * @return {Promise}
 */
function findCoupons(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryCoupons,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'queryCoupons',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.findCoupons = findCoupons;
/**
 * @description 领取优惠券
 * @param {Array} params
 * @return {Promise}
 */
function grantCoupon(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.grantCoupon,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'grantCoupon',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.grantCoupon = grantCoupon;
/**
 * @description 获取可领优惠券
 * @param {Array} params
 * @return {Promise}
 */
function getValidActivity(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.getValidActivity,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'getValidActivity',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.getValidActivity = getValidActivity;
/**
 * @description 获取可领优惠券
 * @param {Array} params
 * @return {Promise}
 */
function addLittleTemplateMsg(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.addLittleTemplateMsg,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'addLittleTemplateMsg',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.addLittleTemplateMsg = addLittleTemplateMsg;
/**
 * @description 获取可领优惠券
 * @param {Array} params
 * @return {Promise}
 */
function checkValidAct(params = []) {
    let token = wx.getStorageSync(storge_1.TOKEN);
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.checkValidAct,
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            method: 'checkValidAct',
            token
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.checkValidAct = checkValidAct;
