import {request,getParams,getSharePath} from './utils/util'
import {miniLogin} from './utils/api'
import {CHANNEL, TOKEN } from './utils/storge'

App({
	/**
	 * @description 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
	 * @param {Object} options
	 * @return {void}
	 */
	onLaunch: function (options): void {
		let me: any = this
		let param = getParams(options)
		me.globalData.channel = param.channel || '-2'		
		wx.setStorageSync(CHANNEL,me.globalData.channel)
	},
	appid: 'wxea8dcedf89df0e63',//wxea8dcedf89df0e63    wxdf04731981c0c3af
	globalData: {
		userInfo: null,
		channel:'-2'
	},
	onShow: function(options) {
        // this.getUserInfo()
    },
    onHide: function(e) {
       
    }
});
