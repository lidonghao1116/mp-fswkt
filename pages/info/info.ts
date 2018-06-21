/// <reference path="../../wxAPI.d.ts"/>
import { getParams, setModalCall, formatSecond, getSharePath, formatDayTime } from './../../utils/util'
import { findCourseById, queryChapters, createOrder, vLog, findCoupons, getValidActivity, grantCoupon, addLittleTemplateMsg, createComplexOrder } from './../../utils/api'
import { shareTitle, sharePath } from './../../utils/storge'

interface chaptersM {
    chId: number
    chNo: number
    cid: number
    content: string                              //课程媒体地址
    ctime: string                                //课程创建时间
    duration: number                             //
    limitTime: number
    title: string                                //课程标题
    titleImg: string
}

interface infoDataM {
    id: number									 //课程id
    playStatus: number                           //播放状态 1：未加载音视频 2：在播放视频 3：在播放音频
    playId: number                               //0：表示(未播放 || 暂停)媒体(视频暂停时playId = 0,pauseId = id)
    pauseId: number                              //!0: 正在播放媒体(视频播放时playId = pauseId = id)
    canScroll: boolean                            //播放列表是否可以滑动
    showControls: boolean                        //是否显示控制组
    sliderVal: number                            //滑块当前值
    isGrag: boolean                              //是否正在拖拽
    changing: boolean                             //是否正在更换音视频（即使媒体变更，还会再次调用audioTimeupdate方法将一些条件改掉）
    mediaName: string                            //正在播放的媒体名称
    audioTime: {                                 //正在播放的媒体时间
        currentTime: string                         //当前播放事件
        duration: string                            //媒体总时长
        second: number                              //媒体总长度   单位秒
    }
    tab: string                                  //当前nav页
    isOrdered: number                            //是否付款
    tinfo: {
        headImgUrl: string                          //教师头像
        intro: string                               //教师简介
        introImg: string
        tags: string
        tid: number
        tname: string                               //教师名称
    }
    chapters: chaptersM[]                        //课程列表
    infoImg: string[]                            //课程详情
    coupons: any[]
    coup: {
        fee: string,
        id: number,
        endTime: number,
        lastFee: string
    }
    couponData: {
        totalMoney: string,
        couponMoney: string,
        desc: string,
        endtime: string,
        hasGotCoupon: boolean,
        granting: boolean
    }
    jumpCouse: {}
    jumpCouse1: {},
    blacklist: number[]
}

interface playModal extends WXModal {
    showModal: boolean                          //是否显示modal
    confirm?: string                            //用户点击modal确定时回调函数名称
    cancel?: string                             //用户点击modal取消时回调函数名称
}

interface infoConfigM {
    playModal: playModal[]
}

let pageConfig = {
    showBackTopHeight: 600,        //滑动高度超出时显示返回顶部按钮
    pageSize: 10,
    page: 1,
    flag: true                //是否还可以再次获取列表 
}

const infoConfig: infoConfigM = {
    playModal: [{
        showModal: true,
        title: '提醒',
        content: '当前内容还未上线，敬请期待!',
        showCancel: false,
        confirm: '',
        cancel: ''
    }, {
        showModal: false,
        title: '',
        content: '',
    }, {
        showModal: true,
        title: '提醒',
        content: '请先购买，当前项目为付费内容!',
        confirmText: '购买',
        cancelText: '确定',
        confirm: 'pay',
        cancel: ''
    }]
}
let infoData: infoDataM = {
    id: 0,
    playStatus: 1,
    playId: 0,
    pauseId: 0,
    canScroll: false,
    showControls: false,
    sliderVal: 0,
    isGrag: false,
    changing: false,
    mediaName: '',
    audioTime: {
        currentTime: '00:00',
        duration: '00:00',
        second: 0
    },
    tab: 'decs',
    isOrdered: 0,
    tinfo: {
        headImgUrl: '',
        intro: '',
        introImg: '',
        tags: '',
        tid: 0,
        tname: ''
    },
    infoImg: [],
    chapters: [],
    coupons: [],
    coup: {
        fee: '0',
        id: 0,
        endTime: 0,
        lastFee: ''
    },
    couponData: {
        totalMoney: '0',
        couponMoney: '0',
        desc: '0',
        endtime: '0',
        hasGotCoupon: false,
        granting: false
    },
    jumpCouse: {
        '1128': 1000,
        '1129': 1075,
        '1136': 1108
    },
    jumpCouse1: {
        '1145': {
            '9': 1000,
            '18': 1075,
            '26': 1108,
            '36': 1043,
            '40': 1100,
            '46': 1122
        }
    },
    blacklist: [1157, 1128, 1130, 1129, 1132, 1136, 1158, 1154, 1159, 1169, 1160, 1170, 1172]
}


let infoApp = getApp()

Page({
    data: infoData,
    infoConfig,
    onLoad: function (options): void {
        let me = this, params: any = getParams(options)
        me.setData({ id: params.cid })
        infoApp.getUserInfo(me.findCourse)
        let logData = [{ event: '200', cid: params.cid }]
        vLog(logData)
        me.findCoupon()
    },
    onShow: function (): void {

    },
    onHide: function () {
        let me = this
        // me.goIndex()
    },
    onShareAppMessage: function (res): any {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: this.data.course.title,
            path: getSharePath('info', { cid: this.data.id }),
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
     * @description 获取所有可用优惠券
     * @return {void}
     */
    findCoupon: function () {
        findCoupons([1, 1, 999]).then(res => {
            let me = this
            let obj = res.obj || {}
            let record = obj.record || []
            me.setData({ coupons: record })
        })
    },
    /**
     * @description 获取所有课程
     * @return {void}
     */
    findCourse: function () {
        findCourseById([Number(this.data.id)]).then(res => {
            let me = this, obj = res.obj
            let course = obj.course
            let tutor = obj.tutor
            let chapters = obj.chapters
            let isOrdered = obj.isOrdered
            let infoImg = JSON.parse(course.introImg)
            /** 转化需要的字段 start */
            course.price = (course.price / 100).toFixed(2)
            /** 转化需要的字段 end */
            me.setData({
                course, tutor, chapters, infoImg, isOrdered
            })
            /** todo */
            pageConfig.pageSize = chapters.length
        })
    },
    /**
     * @description 重新获取课程列表
     * @return {void}
     */
    getChapters: function (): void {
        let me = this
        queryChapters([Number(me.data.id), pageConfig.page, pageConfig.pageSize]).then(res => {
            let obj = res.obj || {}
            let chapters = obj.record
            me.setData({
                chapters
            })
        })
    },
    /**
     * @description 详情页切换导航
     * @param {Event} e
     * @return {void}
     */
    changeNav: function (e): void {
        let me = this, canScroll = false
        let tab: string = e.currentTarget.dataset.tab
        if (tab == 'catalog') {
            canScroll = true
        }
        me.setData({
            tab, canScroll
        })
    },
    /**
     * @description 播放音视频
     * @param {Event} e
     * @return {void}
     */
    targetMedia: function (e, chid): void {
        let mediaSrc: string,
            mediaName: string,
            showControls: boolean = false,
            playId: number,
            sliderVal: number,
            pauseId: number,
            st: number,//是否可以播放
            playStatus: number = 2,
            me = this,
            cid = 0,
            cidMap = {},
            id: number = chid ? chid : e.currentTarget.dataset.id,
            chapters: chaptersM[] = me.data.chapters,
            reg: RegExp = new RegExp(/\.CD|\.OGG|\.MP3|\.ASF|\.WMA|\.WAV|\.MP3PRO|\.RM|\.REAL|\.APE|\.MODULE|\.MIDI|\.VQF/i)
        if (id == me.data.playId) { //暂停当前的播放
            playId = 0
            pauseId = id
            me.pause()
            me.setData({ playId, pauseId })
            return
        } else if (id == me.data.pauseId) { //继续播放当前媒体
            me.play()
            pauseId = id
            playId = id
            if (reg.test(me.data.mediaSrc)) {
                showControls = true
            }
            me.setData({ pauseId, playId, showControls })
            return
        } else {
            //根据id筛选出对应的媒体音视频
            chapters.forEach((ele, index) => {
                if (ele.chId == id) {
                    st = me.canPlay(ele)
                    if (st == 0) {
                        /**todo begin */
                        if (cidMap = me.data.jumpCouse1[me.data.id]) {
                            if (cid = cidMap[index]) {
                                let url: string = `../info/info?cid=${cid}`
                                wx.navigateTo({
                                    url
                                })
                                return
                            }
                        }
                        if (cid = this.jumpCouse[id]) {
                            let url: string = `../info/info?cid=${cid}`
                            wx.navigateTo({
                                url
                            })
                            return
                        }
                        /**todo end */
                    }
                    if (me.showModal(st)) {//不可以正常播放
                        return
                    }
                    sliderVal = 0
                    mediaSrc = ele.content
                    playId = id
                    pauseId = id
                    mediaName = ele.title
                    if (reg.test(mediaSrc)) {
                        playStatus = 3
                        me.setData({
                            playStatus: 0, audioTime: {
                                currentTime: '00:00',
                                duration: '00:00',
                                second: 0
                            }, changing: true
                        }) //切换音频时需要重新加载下才能完成播放
                        showControls = true
                    }
                    me.setData({ showControls, mediaSrc, playStatus, playId, pauseId, mediaName, sliderVal })
                    if (playStatus == 3) {  //音频处理
                        me.MediaContext = wx.createAudioContext('myAudio')
                    } else {
                        me.MediaContext = wx.createVideoContext('myVideo')
                    }
                    me.play()

                    let logData = [{ event: '500', cid: this.data.id, ch_id: id }]
                    vLog(logData)
                    return
                }
            })
        }
    },
    /**
     * @description 音视频主动播放事件
     * @return {void}
     */
    mediaPlay: function (): void {
        let me = this, playId: number = this.data.pauseId
        me.setData({ playId })
    },
    /**
     * @description 音视频主动暂停事件
     * @return {void}
     */
    mediaPause: function (): void {
        let me = this, playId: number = 0
        me.setData({ playId })
    },
    /**
     * @description 手动播放媒体
     * @return {void}
     */
    play: function () {
        this.MediaContext.play()
    },
    /**
     * @description 手动暂停媒体
     * @return {void}
     */
    pause: function () {
        this.MediaContext.pause()
    },
    /**
     * @description 校验当前媒体是否可以播放
     * @param {Object} course
     * @return {Number} st  //0:还未上线，不可播放  1：试听或者已经付款，可以播放  2：未付款切不是视听内容，不可播放
     */
    canPlay: function (course): number {
        let me = this, st: number,
            chapters: any = me.data.chapters,
            isOrdered: Boolean = me.data.isOrdered
        let price = me.data.course.price
        if (course.status == 0) {
            st = 0
        } else if (course.isFree) {
            st = 1
        } else if (+price == 0) {
            st = 1
        } else if (isOrdered) {
            st = 1
        } else if (!isOrdered) {
            st = 2
        }
        /** todo */
        return st
        // return 1
    },
    /**
     * @description 检查播放时是否弹窗提示
     * @param {Number} st 当前是否可以播放状态 0,1,2
     * @return {Boolean} 
     */
    showModal: function (st): boolean {
        let me = this,
            con = me.infoConfig.playModal[st]
        if (con.showModal) {
            con = setModalCall(me, con)
            wx.showModal(con)
        }
        return con.showModal
    },
    /**
     * @description 音频播放进度
     * @param {Event} e
     * @return {void}
     */
    audioTimeupdate: function (e): void {
        let me = this, sliderVal
        let cur = e.detail.currentTime
        let dur = e.detail.duration
        let currentTime = formatSecond(Math.floor(cur))
        let duration = formatSecond(Math.floor(dur))
        if (me.data.changing) {
            me.setData({ changing: false })
            return
        }
        if (me.data.isGrag) { //拖拽过程 sliderVal 不参与计算            
            me.setData({
                audioTime: {
                    currentTime,
                    duration,
                    second: dur
                }
            })
        } else {
            sliderVal = Math.ceil(cur / dur * 100)
            me.setData({
                audioTime: {
                    currentTime,
                    duration,
                    second: dur
                },
                sliderVal
            })
        }
    },
    /**
     * @description 自动挑选合适的优惠券进行折扣
     * 优先挑选折扣价格高并且有效期短的
     * @return {void}
     */
    checkCoupon: function () {
        let me = this
        let coupons = me.data.coupons
        let coup = {
            fee: '',
            id: 0,
            endTime: 0,
            lastFee: ''
        }
        if (coupons.length == 0) {
            return
        }
        coupons.sort((a, b) => {
            return b.fee - a.fee
        })
        coup.fee = coupons[0].fee
        coup.endTime = coupons[0].endTime
        coupons = coupons.filter(ele => ele.fee >= coup.fee && ele.endTime <= coup.endTime)
        coupons.sort((a, b) => {
            return a.endTime - b.endTime
        })
        coup.fee = (coupons[0].fee / 100).toFixed(2)
        coup.endTime = coupons[0].endTime
        coup.id = coupons[0].couponId
        let lastPri = me.data.course.price - coupons[0].fee / 100
        coup.lastFee = (lastPri <= 0 ? 0 : lastPri).toFixed(2)
        me.setData({
            coup
        })

    },
    /**
    * @description 获取可领取优惠券
    * @return {void}
    */
    getValidActivity: function () {
        getValidActivity().then(res => {
            let me = this
            let obj = res.obj || {}
            if (obj.actId) {
                me.getCoupon(obj.actId)
            }
        })
    },
    /**
     * @description 领取优惠券
     * @param {Number} actId
     * @return {void}
     */
    getCoupon: function (actId) {
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
    },
    /**
     * @description 下单
     * @return {void}
     */
    pay: function (): void {
        let me = this
        let showBenefit = me.data.showBenefit
        let coupons = me.data.coupons
        let coupId = me.data.coup.id
        let flag = me.data.blacklist.indexOf(me.data.id) == -1
        if (coupons.length > 0 && !showBenefit && flag) {
            me.setData({ showBenefit: true })
            me.checkCoupon()
            return
        }
        (!coupId ? createOrder([Number(me.data.id)]) : createComplexOrder([Number(me.data.id), coupId])).then(res => {
            let obj = res.obj
            let timeStamp = obj.timeStamp
            let nonceStr = obj.nonceStr
            let packageStr = obj.packageStr
            let signType = obj.signType
            let paySign = obj.paySign
            if (me.data.coup.lastFee == 0 && coupons.length > 0) {
                me.getChapters()
                me.getValidActivity()
                me.setData({ isOrdered: true, showBenefit: false })
                return
            }
            wx.requestPayment({
                timeStamp,
                nonceStr,
                package: packageStr,
                signType,
                paySign,
                success: function (res) {
                    me.getChapters()
                    me.getValidActivity()
                    me.setData({ isOrdered: true, showBenefit: false })
                },
                fail: function (res) {
                    me.getChapters()
                    me.setData({ showBenefit: false })
                }
            })
        })
    },
    /**
     * @description 开始学习
     * @return {void}
     */
    gotoStudy: function () {
        let me = this
        let playId = me.data.playId
        let pauseId = me.data.pauseId
        if (playId || pauseId) {
            return
        } else {
            me.targetMedia(null, me.data.chapters[0].chId)
            return
        }
    },
    /**
     * @description 关闭音频控制组控件
     * @return {void}
     */
    close: function () {
        let me = this
        me.setData({
            showControls: false
        })
    },
    /**
     * @description 控制组滑块滑动完成事件
     * @param {Event} e
     * @return {void}
     */
    sliderChange: function (e) {
        let me = this
        let val = e.detail.value
        let dur = me.data.audioTime.second
        this.MediaContext.seek(val / 100 * dur)
        me.setData({
            isGrag: false
        })
    },
    /**
     * @description 控制组滑块正在滑动事件
     * @param {Event} e
     * @return {void}
     */
    sliderChanging: function () {
        let me = this
        me.setData({
            isGrag: true
        })
    },
    /**
     * @description 回到小程序首页
     * @returns {void}
     */
    goIndex: function () {
        wx.switchTab({
            url: '../index/index'
        })
    },
    /**
     * @description 播放完成
     * @return {void}
     */
    ended: function () {
        let logData = [{ event: '501', cid: this.data.id, ch_id: this.data.id }]
        vLog(logData)
    },
    /**
     * @description 关闭优惠券选取界面
     * @return {void}
     */
    closeBenefit: function (e) {
        let me = this
        if (e.target.dataset.close == '1') { //关闭按钮可以关闭红包
            me.setData({ showBenefit: false })
        }
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
            console.log(res)
        })
    }
})