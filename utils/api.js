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
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.miniLogin,
        data: {
            params: Object.assign({}, res, { channel }),
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.miniLogin = miniLogin;

function queryGroups () {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryGroups,
        data: {
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel,
            }
        },
        dataType: 'json'
    });
    return re;
}

exports.queryGroups = queryGroups;

/**
 * @description 主页banner图
 * @return {Promise}
 */
function queryBanners() {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryBanners,
        data: {
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel,
            }
            
        },
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
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryCourses,
        data: {
            ...params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel,
            }
            
        },
        dataType: 'json'
    });
    return re;
}
exports.queryCourses = queryCourses;

/**
 * 根据课程名称模糊查询课程列表
 */
exports.queryCourseByName = function (params) {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryCourseByName,
        data: {
            ...params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel,
            }
            
        },
        dataType: 'json'
    });
    return re;
}
/**
 * 我的最近学习
 */
exports.latelyStudy = function (params) {
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.latelyStudy,
        data: {
            ...params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel,
            }
        },
        dataType: 'json'
    });
    return re;
}
/**
 * 我的已购课程
 */
exports.mycourses = function (params) {
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.mycourses,
        data: {
            ...params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel,
            }
        },
        dataType: 'json'
    });
    return re;
}

/**
 * @description 主页课程详情
 * @param {Array} params
 * @return {Promise}
 */
function findCourseById(cid) {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryCourseById + cid,
        data: {
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel,
            }    
        },
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
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.queryChapters.replace('{cid}', params.cid),
        data: {
            params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            },
            
        },
        dataType: 'json'
    });
    return re;
}
exports.queryChapters = queryChapters;

/**
 * @description 创建订单
 * @param {Array} params
 * @return {Promise}
 */
function createOrder(params) {
    
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
            
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.createOrder = createOrder;
// let EventCode = {
//     list: 100    // 列表
//     view: 200,   // 查看详情
//     my: 300      // 个人中心
//     click: 400,  // 点击
//     click-banner: 401,  // 点击banner --new
//     click-zixun: 410    // 点击点我咨询
//     click-libao: 411    // 点击戳我领取礼包
//     click-shequn: 412    // 点击tarbar学习群
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
function vLog(params) {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.logVist,
        data: {
            params: [params],
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            }
        },
        method: 'POST',
        dataType: 'json'
    });
    return re;
}
exports.vLog = vLog;
exports.courseFinish = function(params) {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.courseFinish.replace('{cid_chid}', params.cid + '/' + params.ch_id),
        data: {
            ...params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            }
        },
        dataType: 'json'
    });
    return re;
}
/**
 * @description 获取优惠券
 * @param {Array} params
 * @return {Promise}
 */
function mycoupons() {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.mycoupons,
        data: {
            ostype: storge_1.ostype,
            littleOsType: storge_1.littleOsType,
            channel
        },
        dataType: 'json'
    });
    return re;
}
exports.mycoupons = mycoupons;
/**
 * @description 领取优惠券
 * @param {Array} params
 * @return {Promise}
 */
function grantCoupon(params) {
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.grantCoupon,
        data: {
            ...params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            }
        },
        dataType: 'json'
    });
    return re;
}
exports.grantCoupon = grantCoupon
/**
 * @description 获取可领优惠券
 * @param {Array} params
 * @return {Promise}
 */
function checkValidAct(params = []) {
    
    let channel = wx.getStorageSync(storge_1.CHANNEL);
    let re = util_1.request({
        url: storge_1.url.checkValidAct,
        data: {
            ...params,
            head: {
                ostype: storge_1.ostype,
                littleOsType: storge_1.littleOsType,
                channel
            }
        },
        dataType: 'json'
    });
    return re;
}
exports.checkValidAct = checkValidAct;
