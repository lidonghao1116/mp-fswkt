/// <reference path="../../wxAPI.d.ts"/>
import { getParams, getSharePath, formatDayTime } from './../../utils/util'
import { queryBanners, queryCourses, vLog, getValidActivity, grantCoupon, checkValidAct ,addLittleTemplateMsg} from './../../utils/api'
import { config } from '../../app'
import { shareTitle, sharePath } from './../../utils/storge'

interface indexDataM {
	showBackTop: boolean           //是否显示返回顶部按钮
	scrollTop: number              //主页滚动条距离顶部的高度
	imgUrls: {
		bannerNo: number           //
		bid: number
		cid: number
		img: string
		imgHeight: number
		imgWidth: number
		location: number
		url: string
	}[]              			   //swriper滚动图片列表
	indicatorDots: boolean		   //swriper是否显示面板指示点
	autoplay: boolean              //swriper是否自动播放
	interval: number			   //swriper自动切换时间间隔	
	duration: number  			   //swriper滑动动画时长
	courseList: {
		category: number
		cid: number
		ctime: string
		intro: string
		introImg: string
		orderNum: number
		price: string
		slogo: string
		status: number
		tags: string
		tid: number
		title: string
		titleImg: string
	}[]                            //课堂列表    
	actId: number
	showCoupon: boolean
	showOnce:boolean
	couponData: {

	}
	onceData:{

	}
	params: any
}

let app = getApp()

let pageConfig = {
	showBackTopHeight: 600,        //滑动高度超出时显示返回顶部按钮
	pageSize: 10,
	page: 1,
	flag: true                //是否还可以再次获取列表 
}

let indexData: indexDataM = {
	actId: 0,
	showBackTop: false,
	scrollTop: 0,
	imgUrls: [],
	courseList: [],
	indicatorDots: true,
	autoplay: true,
	interval: 5000,
	duration: 1000,
	showCoupon: false,
	showOnce:false,
	couponData: {
		totalMoney: '0',
		couponMoney: '0',
		desc: '0',
		endtime: '0',
		hasGotCoupon: false,
		granting: false
	},
	onceData: {
		totalMoney: '0',
		couponMoney: '20',
		desc: '0',
		hasGotCoupon: false,
		granting: false
	},
	params: {}
}

Page({
	data: indexData,
	onLoad: function (options) {
		let me = this
		let params: any = getParams(options)
		let logData = [{ event: '100' }]
		pageConfig.flag = true
		pageConfig.page = 1
		//获取banner图
		me.setData({ params })
		queryBanners().then(res => {
			me.setData({ imgUrls: res.obj })
		})
		//获取课程列表
		me.setCourseList()
		me.checkValidAct()
		vLog(logData)
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
	/**
	 * @description 检查当前优惠券是否可用
	 * @return {void}
	 */
	checkValidAct: function () {
		let me = this
		let params = me.data.params
		if(params.channel == 1008){
			me.setData({showOnce:true})
			return 
		}
		if (params.actId) {
			checkValidAct([Number(params.actId)]).then(res => {
				let obj = res.obj || {}
				let isValid = obj.isValid
				if(isValid){
					me.getCouponByAct(Number(params.actId))
				}
			})
		} else {
			me.getValidActivity()
		}
	}, /**
	* @description 通过活动领取优惠券
	* @param {Number} actId
	* @return {void}
	*/
	getCouponByAct: function (actId) {
		let me = this
		let couponData = me.data.couponData
		grantCoupon([actId]).then(res => {
			let me = this
			let obj = res.obj || {}
			if (!obj.couponCode) {
				return
			}
			couponData.couponMoney = (obj.fee / 100).toFixed(2)
			couponData.desc = obj.title
			couponData.endtime = formatDayTime(new Date(obj.endTime))
			couponData.granting = false
			couponData.hasGotCoupon = true
			me.setData({ couponData, showCoupon: true })
		})
	},
	/**
	 * @description 领取优惠券
	 * @return {void}
	 */
	getCoupon: function () {
		let me = this
		let couponData = me.data.couponData
		couponData.granting = true
		me.setData({ couponData })
		grantCoupon([me.data.actId]).then(res => {
			let me = this
			let obj = res.obj || {}
			couponData.couponMoney = (obj.fee / 100).toFixed(2)
			couponData.desc = obj.title
			couponData.endtime = formatDayTime(new Date(obj.endTime))
			if (obj.actId) {
				me.setData({ showCoupon: true, actId: obj.actId, couponData })
			}
		})
		setTimeout(() => {
			couponData.granting = false
			couponData.hasGotCoupon = true
			me.setData({ couponData })
		}, 2000)
	},
	/**
	* @description 领取优惠券
	* @return {void}
	*/
   getCoupon1: function () {
	   let me = this
	   let onceData = me.data.onceData
	   onceData.granting = true
	   me.setData({ onceData })
	   let arr = [1009,1010,1011,1012,1013]
	   arr.forEach(ele=>{		
			grantCoupon([ele]).then(res => {
				let me = this
				let obj = res.obj || {}
				onceData.desc = obj.title || '已参加过活动'
				if (obj.actId) {
					me.setData({ showOnce: true, actId: obj.actId, onceData })
				}
			})
	   })
	   setTimeout(() => {
			onceData.granting = false
			onceData.hasGotCoupon = true
		   me.setData({ onceData })
	   }, 2000)
   },
	/**
	 * @description 关闭红包领取界面
	 * @return {void}
	 */
	closeCoupon: function (e) {
		let me = this
		let couponData = me.data.couponData
		let hasGotCoupon = couponData.hasGotCoupon
		if (e.target.dataset.close == '2') { //关闭按钮可以关闭红包
			me.setData({ showCoupon: false })
		} else if (e.target.dataset.close == '1' && hasGotCoupon) {  //黑色区域和已经开过红包才能关闭红包
			me.setData({ showCoupon: false })
		}
	},/**
	* @description 关闭红包领取界面
	* @return {void}
	*/
   closeCoupon1: function (e) {
	   let me = this
	   let onceData = me.data.onceData
	   let hasGotCoupon = onceData.hasGotCoupon
	   if (e.target.dataset.close == '2') { //关闭按钮可以关闭红包
		   me.setData({ showOnce: false })
	   } else if (e.target.dataset.close == '1' && hasGotCoupon) {  //黑色区域和已经开过红包才能关闭红包
		   me.setData({ showOnce: false })
	   }
   },
	/**
	 * @description 获取可领取优惠券
	 * @return {void}
	 */
	getValidActivity: function () {
		getValidActivity().then(res => {
			let me = this
			let obj = res.obj || {}
			let couponData = me.data.couponData
			couponData.totalMoney = (obj.totalFee / 100).toFixed(2)
			if (obj.actId) {
				me.setData({ showCoupon: true, actId: obj.actId, couponData })
			}
		})
	},
	/**
	 * @description 更新课程列表
	 * @param {Object} res
	 * @return {void}
	 */
	setCourseList: function () {
		//获取课程列表
		let me = this
		if (!pageConfig.flag) {
			return
		}
		pageConfig.flag = false
		queryCourses([null, null, pageConfig.page, pageConfig.pageSize]).then(res => {
			let course, obj = res.obj || {}
			let record = obj.record
			let newList = this.data.courseList
			if (record) {
				record.forEach(ele => {
					let course = ele.course
					ele.tutor = ele.tutor ? ele.tutor : {}
					/** 转化需要的字段 start */
					course.tname = ele.tutor.tname
					course.headImgUrl = ele.tutor.headImgUrl
					course.price = (course.price / 100).toFixed(2)
					/** 转化需要的字段 end */
					newList.push(course)
				});
			}
			me.setData({ courseList: newList })
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
		me.setCourseList()
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
	goCourseInfo: function (e) {
		let cid: string = e.currentTarget.dataset.id
		let banner: boolean = e.currentTarget.dataset.banner
		console.log(banner)
		let url: string = `../info/info?cid=${cid}`
		wx.navigateTo({
			url
		})
	},
    /**
     * @description 上报form_id
     * @return {void}
     */
    formSubmit: function (e) {
        let form_id = e.detail.formId
        let that = this
        console.log('form_id' + form_id)
        addLittleTemplateMsg([{ form_id }]).then(res => {
            console.log('上报成功')
            console.log(res)
        })
    },
	btn1:function(){
		let me = this
		wx.navigateToMiniProgram({
			appId: 'wxd6c5337aed6300ec',
			path: 'pages/index/index?shareType=getPrize&prize_id=1'
		})
	},
	btn2:function(){
		let me = this
		me.setData({showOnce:false})
	}
})
