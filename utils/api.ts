import { url, CHANNEL, TOKEN, ostype, littleOsType } from './storge'
import { request } from './util'


/**
 * @description 登录
 * @param {Objcet} res
 * @return {Promise} 
 */
export function miniLogin(res) {
    // let rawData = res.rawData
    // let signature = res.signature
    // let encryptedData = res.encryptedData
    // let iv = res.iv
    // let code = res.code

    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.miniLogin, 
        data: {
            params: [{ ...res, channel }],
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'miniLogin'
        },
        method: 'POST',
        header: {
            'content-type': 'application/json', // 默认值
            'head': {
                ostype,
                littleOsType,
                channel
            }
        },
        dataType: 'json'
    })
    return re
}
/**
 * @description 主页banner图
 * @return {Promise} 
 */
export function queryBanners() {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.queryBanners, 
        data: {
            params: [],
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'queryBanners',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 主页课程列表图
 * @param {Array} params
 * @return {Promise} 
 */
export function queryCourses(params) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.queryCourses, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'queryCourses',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}

/**
 * @description 主页课程详情
 * @param {Array} params
 * @return {Promise} 
 */
export function findCourseById(params) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.findCourseById, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'findCourseById',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 主页课程详情
 * @param {Array} params
 * @return {Promise} 
 */
export function queryChapters(params) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.queryChapters, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'queryChapters',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 获取我的课程
 * @param {Array} params
 * @return {Promise} 
 */
export function getMyCourse(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.getMyCourse, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'getMyCourse',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 获取我的课程
 * @param {Array} params
 * @return {Promise} 
 */
export function createOrder(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.createOrder, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'createOrder',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 获取我的课程
 * @param {Array} params
 * @return {Promise} 
 */
export function createComplexOrder(params = []) {
  console.log(params)
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.createComplexOrder, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'createOrder',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}

// let EventCode = {
//     list: 100    // 列表
//     view: 200,   // 查看
//     my: 300      // 个人中心
//     click: 400,  // 点击
//     play: 500,   // 播放
//     play-end: 501,   // 播放结束
//     share: 600       //分享
// }
/**
 * @description 统计
 * @param {{event:EventCode}[]} params
 * @return {Promise} 
 */
export function vLog(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.logVist, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'logVist',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 获取优惠券
 * @param {Array} params
 * @return {Promise} 
 */
export function findCoupons(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.queryCoupons, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'queryCoupons',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 领取优惠券
 * @param {Array} params
 * @return {Promise} 
 */
export function grantCoupon(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.grantCoupon, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'grantCoupon',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 获取可领优惠券
 * @param {Array} params
 * @return {Promise} 
 */
export function getValidActivity(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.getValidActivity, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'getValidActivity',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 获取可领优惠券
 * @param {Array} params
 * @return {Promise} 
 */
export function addLittleTemplateMsg(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.addLittleTemplateMsg, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'addLittleTemplateMsg',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}
/**
 * @description 获取可领优惠券
 * @param {Array} params
 * @return {Promise} 
 */
export function checkValidAct(params = []) {
    let token = wx.getStorageSync(TOKEN)
    let channel = wx.getStorageSync(CHANNEL)
    let re = request({
        url: url.checkValidAct, 
        data: {
            params,
            head: {
                ostype,
                littleOsType,
                channel
            },
            method: 'checkValidAct',
            token
        },
        method: 'POST',
        dataType: 'json'
    })
    return re
}