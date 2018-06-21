import { CHANNEL } from './storge'

/**
 * @description 将小于十的数转为 0n
 * @param {Number} n 
 * @return {String}
 */
function formatNumber(n: number): string {
	let str = n.toString()
	return str[1] ? str : '0' + str
}

/**
 * @description 将日期转为xxxx/xx/xx xx:xx:xx 格式
 * @param {Date} date
 * @return {String}
 */
export function formatTime(date: Date): string {
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()

	let hour = date.getHours()
	let minute = date.getMinutes()
	let second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * @description 将日期转为xxxx-xx-xx 格式
 * @param {Date} date
 * @return {String}
 */
export function formatDayTime(date: Date): string{
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()

	return [year, month, day].map(formatNumber).join('-')
}
/**
 * @description 将秒数转为00:00格式
 * @param {Number} second 
 * @return {String}
 */
export function formatSecond(second):string{
	let h = parseInt(second / 60 / 60 +'')
	let m = parseInt( (second - h * 60 * 60)  / 60 + '')
	let s = formatNumber(parseInt(second - m * 60 +''))
	return h?`${formatNumber(h)}:${formatNumber(m)}:${s}`:`${formatNumber(m)}:${s}`
}
/**
 * @description 获取options中的参数
 * @param {Object} options
 * @return {Object}
 */
export function getParams(options: any = {}) {
	let query = options.query,scene = decodeURIComponent(options.scene),
		arr = [],
		key, value
		if(query){
			for (let a in query) {
				options[a] = query[a]
			}
		}
	if (scene) {
		console.log('scene'+scene)
		arr = scene.split(",")
		arr.forEach(item => {
			key = item.split(":")[0]
			value = item.split(":")[1]
			options[key] = value
		})
	}
	return options
}
/**
 * @description 调用微信接口
 * @param {Object} params 
 * @return {Promise}
 */
export function request(params): Promise<any> {
	return new Promise((resolve, reject) => {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		wx.request({
			url: params.url,
			data: params.data,
			header: params.header,
			method: params.method || 'GET',
			dataType: params.dataType || 'json',
			responseType: params.responseType || 'text',
			success: res => {
				resolve(res.data)
				wx.hideLoading()
			},
			fail: res => {
				reject(res)
				wx.hideLoading()
			}
		})
	})
}

/**
 * @description 设置微信API(showModal)中success方法的的执行回调
 * @param {Object} con
 * @return {Object} con
 */
export function setModalCall<T>(me,con: any = {}): T {
	con.success = function (res) {
		if (res.confirm) {
			console.log('用户点击确定')
			if (con.confirm && typeof me[con.confirm] == 'function') {
				me[con.confirm]()
			}else{
				console.warn(`${con.confirm} is no a function`)
			}
		} else if (res.cancel) {
			console.log('用户点击取消')
			if (con.confirm && typeof me[con.cancel] == 'function') {
				me[con.cancel]()
			}else{
				console.warn(`${con.cancel} is no a function`)
			}
		}
	}
	return con
}

let pathConfig = {
	index:'/pages/index/index',
	info:'/pages/info/info'
}
/**
 * @description 获取需要分享的链接
 * @param {String} page 需要分享的页面
 * @return {String} 
 */
export function getSharePath(page = 'index',params={}){
	let path,str='',channel = wx.getStorageSync(CHANNEL)
	if(params){
		for (const key in params) {
			str += `&${key}=${params[key]}`
		}
	}
	if(page && pathConfig[page]){
		path = `${pathConfig[page]}?channel=${channel}${str}`
	}else{
		path = `${pathConfig['index']}?channel=${channel}${str}`
	}
	return path
}