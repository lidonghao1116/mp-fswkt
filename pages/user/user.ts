/// <reference path="../../wxAPI.d.ts"/>
import { getParams,getSharePath} from './../../utils/util'
import {getMyCourse,vLog,findCoupons} from './../../utils/api'
import { shareTitle, sharePath } from './../../utils/storge'

interface userDataM {
	courseList:{
        category:number
		cid:number
		ctime:string
		intro:string
		introImg:string
		orderNum:number
		price:string
		slogo:string
		status:number
		tags:string
		tid:number
		title:string
		titleImg:string
	}[]                //课程列表
	couponsNum:string   //优惠券张数
}

let app = getApp()

let pageConfig = {
	showBackTopHeight: 600,         //滑动高度超出时显示返回顶部按钮
	pageSize: 10,
	page:1
}

let userData :userDataM= {
	courseList:[],
	couponsNum:'0'
}

Page({
	data: userData,
	onLoad: function (options) {
		let params: any = getParams(options)
		let me = this
		let logData =[{event:'300'}]
		vLog(logData)
    },    
    onShow:function(){
		let me = this
		//获取个人课程信息
		getMyCourse().then(res=>{
            let obj = res.obj||{}
			let courses = obj.courses
			if(courses){
				courses.forEach(ele => {
					let course = ele.course
					/** 转化需要的字段 start */
					course.tname = ele.tutor.tname
					course.headImgUrl = ele.tutor.headImgUrl
					course.price = (course.price/100).toFixed(2)					
					/** 转化需要的字段 end */
				});
			}
			me.setData({
                courseList:courses,
                headImgUrl:obj.user.headImgUrl,
                lessonBean:obj.lessonBean
            })
		})
		findCoupons([1,1,100]).then(res => {
			let obj = res.obj || {}
			let recordCount = obj.recordCount || 0		
			me.setData({
                couponsNum:recordCount>99?'99+':(''+recordCount)
            })
		})
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
				let logData =[{event:'600'}]
				vLog(logData)
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
	/**
	* @description 进入课程详情页
	* @param {Event} e
	* @return {void}
	*/
	goCourseInfo: function (e) {
		let cid: string = e.currentTarget.dataset.id
		let url: string = `../info/info?cid=${cid}`
		wx.navigateTo({
			url
		})
	}
})
