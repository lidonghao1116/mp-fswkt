/// <reference path="../../wxAPI.d.ts"/>
import { getParams, getSharePath, formatDayTime } from './../../utils/util'
import { findCoupons, vLog } from './../../utils/api'
import { config } from '../../app'
import { shareTitle, sharePath } from './../../utils/storge'

interface couponListDataM {
    couponList: {
        beginTime: number
        couponCode: string
        couponId: number
        description: string
        endTime: any
        fee: any
        openid: string
        status: number
        title: string
        uid: number
        usedStatus: number
    }[]
    empty: boolean
}

let app = getApp()

let pageConfig = {
    showBackTopHeight: 600,        //滑动高度超出时显示返回顶部按钮
    pageSize: 20,
    page: 1,
    flag: true                //是否还可以再次获取列表 
}

let couponListData: couponListDataM = {
    couponList: [],
    empty: null
}

Page({
    data: couponListData,
    onLoad: function (options) {
        let me = this
        let params: any = getParams(options)

        //获取优惠券
    },
    onShow() {
        let me = this 
		pageConfig.flag = true
		pageConfig.page = 1
         me.getCoupons()
    },
    onShareAppMessage: function (res): any {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: shareTitle,
            path: getSharePath(),
            success: function (res) {
                // 转发成功
                let logData = [{ event: '600' }]
                vLog(logData)
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    getCoupons: function () {
        //获取课程列表
        let me = this
        if (!pageConfig.flag) {
            return
        }
        pageConfig.flag = false
        findCoupons([1, pageConfig.page, pageConfig.pageSize]).then(res => {
            let obj = res.obj || {}
            let record = obj.record
            let newList = this.data.couponList
            if (record) {
                record.forEach(ele => {
                    /** 转化需要的字段 start */
                    ele.endTime = formatDayTime(new Date(ele.endTime))
                    ele.fee = (ele.fee / 100).toFixed(2)
                    /** 转化需要的字段 end */
                    newList.push(ele)
                })
            }
            me.setData({ couponList: newList, empty: newList.length == 0 })
            pageConfig.flag = obj.recordCount >= pageConfig.pageSize
            pageConfig.page += 1
        })
    },
	/**
	 * @description 当主页滑到底端时，需要刷新数据
	 * @param {Event} e
	 * @return {void}
	 */
    lower: function (e) {
        let me = this
        me.getCoupons()
    },
	/**
	 * @description 滚动监听
	 * @param {Event} e
	 * @return {void}
	 */
    scroll: function (e) {
        let scrollTop: number = e.detail.scrollTop
        if (scrollTop > pageConfig.showBackTopHeight) {
            this.setData({ showBackTop: true })
        } else {
            this.setData({ showBackTop: false })
        }
    },
	/**
	 * @description 返回顶部
	 * @return {void}
	 */
    goTop: function () {
        this.setData({ scrollTop: 0 })
    },
	/**
	* @description 进入课程详情页
	* @param {Event} e
	* @return {void}
	*/
    goIndex: function (e) {
        wx.switchTab({
            url: '../index/index'
        })
    }
})
