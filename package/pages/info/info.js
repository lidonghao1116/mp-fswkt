"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../../wxAPI.d.ts"/>
const util_1 = require("./../../../utils/util")
const api_1 = require("./../../../utils/api")
const storge_1 = require("./../../../utils/storge")

const app = getApp()
let coupons = undefined // 我的优惠券

const infoConfig = {
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
            cancelText: '取消',
            confirm: 'pay',
            cancel: ''
        }]
};
let infoData = {
    showBenefit: false,
    curPlayChapterIndex: 0, //当前播放章节索引
    showPacket: false, // 是否显示红包弹窗
    showCommonSendCoupon: false, // 是否显示通用发券弹窗
    vlogplaying: false,
    vlogplayingPause: false,
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
    currentCoupon: {}, // 当前使用的优惠券
    couponData: {
        totalMoney: '0',
        couponMoney: '0',
        desc: '0',
        endtime: '0',
        hasGotCoupon: false,
        granting: false
    },
    jumpCouse: {
        '1128':	1000,
        '1129':	1075,
        '1175':	1157,
        '1169':	1100,
        '1170':	1076
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
    blacklist:[1157,1128,1130,1129,1132,1136,1158,1154,1159,1169,1160,1170,1172, 1175, 1187, 1106, 1119],
};
Page({
    data: infoData,
    infoConfig,
    onLoad (options) {
        if (!app.globalData.userInfo || !wx.getStorageSync(storge_1.TOKEN)) 
            util_1.router(getCurrentPages(), '/package/pages/auth/auth')

        else {
            const params = util_1.getParams(options);
            this.setData({ id: params.cid });
            
            if (params.actId)
                this.checkValidAct(3, params.actId) // 直接发券
                
            this.findCourse()

            let logData = { event: 200, cid: params.cid }
            api_1.vLog(logData);
        }
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target);
        }
        return {
            title: this.data.course.title,
            path: util_1.getSharePath('info', { cid: this.data.id }),
            success: function (res) {
                // 转发成功
                let logData = { event: 600 }
                api_1.vLog(logData);
            },
            fail: function (res) {
                // 转发失败
            }
        };
    },
    /**
     * @description 获取所有可用优惠券
     * @return {void}
     */
    findCoupon: function () {
        return api_1.mycoupons().then(res => {
            coupons = res.data.record || []
        });
    },
    /**
     * 进来时检查是否有直接发券活动
     * grantType 发券类型   1：每天发券  2：购买后发券  3：直接发券
     */
    checkValidAct: function (grantType, actId=null) {
        actId = actId ? Number(actId) : ''
        api_1.checkValidAct({
            activity_type: grantType,
            activity_id: actId
        }).then(res => {
            if (res.data) {
                if (grantType === 2)
                    this.getCoupon(res.data.actId, grantType);
                else {
                    // 显示红包弹窗
                    this.setData({
                        couponData: {
                            actId,
                            grantType
                        },
                        showPacket: true
                    })
                }
                }
        })
        
    },
    openPacket: function (e) {
        const p = e.currentTarget.dataset
        this.getCoupon(Number(p.actId), Number(p.grantType))
    },
    /**
     * 领取优惠券
     */
    getCoupon: function (actId, grantType) {
        api_1.grantCoupon({
            activity_id: Number(actId)
        }).then(res => {
            let obj = res.data || {};
            if (!obj.couponCode) {
                return;
            }
            this.setData({
                couponData: {
                    desc: obj.title,
                    endtime: util_1.formatDayTime(new Date(obj.endTime)),
                    granting: false,
                    actId,
                    couponMoney: obj.fee / 100
                }
            })

            if (grantType === 2) {
                // 显示通用发券弹窗
                this.setData({
                    showCommonSendCoupon: true
                })
            } else {
                // 关闭红包弹窗 显示通用发券弹窗
                this.setData({
                    showPacket: false,
                    showCommonSendCoupon: true
                })
            }
    
            coupons = undefined // 重置优惠券
        }).catch(() => {
            this.setData({
                showPacket: false
            })
            wx.showToast({
                icon: 'none',
                title: '优惠券已发完，请下次赶早哦'
            })
        });
    },
    /**
     * @description 获取所有课程
     * @return {void}
     */
    findCourse: function () {
        api_1.findCourseById(Number(this.data.id)).then(res => {
            let course = res.data.course;
            let tutor = res.data.tutor;
            let chapters = res.data.chapters;
            let isOrdered = res.data.isOrdered;
            let infoImg = JSON.parse(course.introImg);
            /** 转化需要的字段 start */
            course.price = (course.price / 100).toFixed(2);
            /** 转化需要的字段 end */
            this.setData({
                course, tutor, chapters, infoImg, isOrdered
            });

            if (!course.isOrdered) {
                this.findCoupon()
            }
        });
    },
    /**
     * @description 重新获取课程列表
     * @return {void}
     */
    getChapters: function () {
        let me = this;
        api_1.queryChapters({
            pageno: 1,
            pagesize: 100,
            cid: this.data.id
        }).then(res => {
            let chapters = res.data.record;
            me.setData({
                chapters
            });
        });
    },
    /**
     * @description 详情页切换导航
     * @param {Event} e
     * @return {void}
     */
    changeNav: function (e) {
        let me = this, canScroll = false;
        let tab = e.currentTarget.dataset.tab;
        if (tab == 'catalog') {
            canScroll = true;
        }
        me.setData({
            tab, canScroll
        });
    },
    /**
     * @description 播放音视频
     * @param {Event} e
     * @return {void}
     */
    targetMedia: function (e, index) {
        let mediaSrc, mediaName, showControls = false, playId, sliderVal, pauseId, st, //是否可以播放
        playStatus = 2, me = this, cid = 0, cidMap = {}, 
        id = index != undefined ? this.data.chapters[index].chId : this.data.chapters[e.currentTarget.dataset.index].chId, 
        chapters = me.data.chapters, 
        reg = new RegExp(/\.CD|\.OGG|\.MP3|\.ASF|\.WMA|\.WAV|\.MP3PRO|\.RM|\.REAL|\.APE|\.MODULE|\.MIDI|\.VQF/i);

        this.setData({
            curPlayChapterIndex: index != undefined ? index : e.currentTarget.dataset.index
        })

        if (id == me.data.playId) {
            playId = 0;
            pauseId = id;
            me.pause();
            me.setData({ playId, pauseId, vlogplayingPause: true });
            return;
        }
        else if (id == me.data.pauseId) {
            this.MediaContext.play();
            pauseId = id;
            playId = id;
            if (reg.test(me.data.mediaSrc)) {
                showControls = true;
            }
            me.setData({ pauseId, playId, showControls });
            return;
        }
        else {
            //根据id筛选出对应的媒体音视频
            chapters.forEach((ele, index) => {
                if (ele.chId == id) {
                    st = me.canPlay(ele);
                    if (st == 0) {
                        /**todo begin */
                        if (cidMap = me.data.jumpCouse1[me.data.id]) {
                            if (cid = cidMap[index]) {
                                util_1.router(getCurrentPages(), `/package/pages/info/info?cid=${cid}`)
                                return;
                            }
                        }
                        if (cid = me.data.jumpCouse[id]) {
                            util_1.router(getCurrentPages(), `/package/pages/info/info?cid=${cid}`)
                            return;
                        }
                        /**todo end */
                    }
                    if (me.showModal(st)) {
                        return;
                    }
                    sliderVal = 0;
                    mediaSrc = ele.content;
                    playId = id;
                    pauseId = id;
                    mediaName = ele.title;
                    if (reg.test(mediaSrc)) {
                        playStatus = 3;
                        me.setData({
                            playStatus: 0, audioTime: {
                                currentTime: '00:00',
                                duration: '00:00',
                                second: 0
                            }, changing: true
                        }); //切换音频时需要重新加载下才能完成播放
                        showControls = true;
                    }
                    // if(me.MediaContext) me.MediaContext.seek(0)
                    me.setData({ showControls, mediaSrc, playStatus, playId, pauseId, mediaName, sliderVal, vlogplaying: false })
                    
                    let lastPlayTime = undefined
                    lastPlayTime = wx.getStorageSync(this.data.id + '_' + id)

                    if (playStatus == 3) {
                        // me.MediaContext = wx.createAudioContext('myAudio');
                        if (me.MediaContext) me.MediaContext.destroy()
                        me.MediaContext = wx.createInnerAudioContext()
                        me.MediaContext.autoplay = true
                        me.MediaContext.src = mediaSrc
                        lastPlayTime && (me.MediaContext.startTime = lastPlayTime)
                        // startTime = 
                        me.MediaContext.onPlay(this.mediaPlay)
                        me.MediaContext.onPause(this.mediaPause)
                        me.MediaContext.onTimeUpdate(this.audioTimeupdate)
                        me.MediaContext.onEnded(this.ended)
                        me.MediaContext.onError((res) => {
                            wx.showModal({title: res.errMsg})
                            console.log(res.errMsg)
                            console.log(res.errCode)
                        })
                    }
                    else {
                        me.MediaContext = wx.createVideoContext('myVideo');
                        me.MediaContext.play()
                        lastPlayTime && me.MediaContext.seek(lastPlayTime)
                        
                    }
                    
                    // console.log('播放时获取前一次播放时间', this.data.id + '_' + id, lastPlayTime)
                    // if (lastPlayTime){
                        // wx.showModal({title: lastPlayTime+''})
                        // me.MediaContext.startTime = 11
                        // me.MediaContext.seek(lastPlayTime)
                    // }
                    let logData = { event: 500, cid: this.data.id, ch_id: id }
                    api_1.vLog(logData);
                    return;
                }
            });
        }
    },
    /**
     * @description 音视频主动播放事件
     * @return {void}
     */
    mediaPlay: function () {
        
        wx.setKeepScreenOn({
            keepScreenOn: true
        })
        let playId = this.data.pauseId;
        this.setData({ playId});
        if (!this.data.vlogplayingPause) {
            this.setData({
                vlogplaying: false
            })
        }
    },
    /**
     * @description 音视频主动暂停事件
     * @return {void}
     */
    mediaPause: function () {
        wx.setKeepScreenOn({
            keepScreenOn: false
        })
        let playId = 0;
        this.setData({ playId });
        this.setData({ vlogplayingPause: true });
    },
    /**
     * @description 手动播放媒体
     * @return {void}
     */
    play: function () {
        this.MediaContext.play();
    },
    /**
     * @description 手动暂停媒体
     * @return {void}
     */
    pause: function () {
        this.MediaContext.pause();
    },
    /**
     * @description 校验当前媒体是否可以播放
     * @param {Object} course
     * @return {Number} st  //0:还未上线，不可播放  1：试听或者已经付款，可以播放  2：未付款切不是视听内容，不可播放
     */
    canPlay: function (course) {
        let me = this, st, chapters = me.data.chapters, isOrdered = me.data.isOrdered;
        let price = me.data.course.price;
        if (course.status == 0) {
            st = 0;
        }
        else if (course.isFree) {
            st = 1;
        }
        else if (+price == 0) {
            st = 1;
        }
        else if (isOrdered) {
            st = 1;
        }
        else if (!isOrdered) {
            st = 2;
        }
        /** todo */
        return st;
        // return 1
    },
    /**
     * @description 检查播放时是否弹窗提示
     * @param {Number} st 当前是否可以播放状态 0,1,2
     * @return {Boolean}
     */
    showModal: function (st) {
        let me = this, con = me.infoConfig.playModal[st];
        if (con.showModal) {
            con = util_1.setModalCall(me, con);
            wx.showModal(con);
        }
        return con.showModal;
    },
    /**
     * @description 视频播放进度
     * @param {Event} e
     */
    videoTimeupdate: function(e) {
        let cur = e.detail.currentTime
        let dur = e.detail.duration 

        wx.setStorageSync(this.data.id + '_' + this.data.chapters[this.data.curPlayChapterIndex].chId, cur)

        if (!this.data.vlogplaying && cur >= (dur * 0.8)) {
            this.setData({vlogplaying: true})
            let logData = { event: 502, cid: this.data.course.cid, ch_id: this.data.pauseId };
            api_1.vLog(logData);
            api_1.courseFinish({
                cid: this.data.course.cid,
                ch_id: this.data.pauseId,
                duration: Math.floor(dur)
            })
        }
    },
    /**
     * @description 音频播放进度
     * @param {Event} e
     * @return {void}
     */
    audioTimeupdate: function () {
        const audio = this.MediaContext


        // console.log(1)
        let me = this, sliderVal;
        let cur = audio.currentTime;
        let dur = audio.duration;
        let currentTime = util_1.formatSecond(Math.floor(cur));
        let duration = util_1.formatSecond(Math.floor(dur));

        // console.log('设置当前播放进度', this.data.id + '_' + this.data.chapters[this.data.curPlayChapterIndex].chId, wx.getStorageSync(this.data.id + '_' + this.data.chapters[this.data.curPlayChapterIndex].chId))
        wx.setStorageSync(this.data.id + '_' + this.data.chapters[this.data.curPlayChapterIndex].chId, cur)

        if (!this.data.vlogplaying && cur >= (dur * 0.8)) {
            this.setData({vlogplaying: true})
            let logData = { event: 502, cid: this.data.course.cid, ch_id: this.data.pauseId }
            api_1.vLog(logData);
            api_1.courseFinish({
                cid: this.data.course.cid,
                ch_id: this.data.pauseId,
                duration: Math.floor(dur)
            })
        }

        if (me.data.changing) {
            me.setData({ changing: false });
            return;
        }
        if (me.data.isGrag) {
            me.setData({
                audioTime: {
                    currentTime,
                    duration,
                    second: dur
                }
            });
        }
        else {
            sliderVal = Math.ceil(cur / dur * 100);
            me.setData({
                audioTime: {
                    currentTime,
                    duration,
                    second: dur
                },
                sliderVal
            });
        }
    },
    /**
     * // 设置一张可用的优惠券 如果有的话
     * @return {void}
     */
    checkCoupon: function () {
        let coup = {
            fee: "",
            id: 0,
            endTime: 0,
            lastFee: ""
          }
          if (!coupons || coupons.length == 0) {
            return
          }
    
          const cid = Number(this.data.id)
    
          if (cid === 1197) {
            const cps = coupons.find(coupon => coupon.couponId === 1032)
            if (cps) {
              coup.fee = (cps.fee / 100).toFixed(2)
              coup.endTime = cps.endTime
              coup.id = cps.couponId
              let lastPri = this.course.price / 100 - cps.fee / 100
              coup.lastFee = (lastPri <= 0 ? 0 : lastPri).toFixed(2)
              this.coup = coup;
              return
            }
          } else {
            coupons = coupons.filter(coupon => coupon.couponId !== 1032)
          }
    
          if (!coupons || coupons.length == 0) {
            return
          }
    
          coupons.sort((a, b) => {
            return b.fee - a.fee
          })
          coup.fee = coupons[0].fee;
          coup.endTime = coupons[0].endTime
          coupons = coupons.filter(
            ele => ele.fee >= coup.fee && ele.endTime <= coup.endTime
          )
          coupons.sort((a, b) => {
            return a.endTime - b.endTime
          })
          
          coup.fee = (coupons[0].fee / 100).toFixed(2)
          coup.endTime = coupons[0].endTime
          coup.id = coupons[0].couponId
          let lastPri = this.data.course.price - coupons[0].fee / 100
          coup.lastFee = (lastPri <= 0 ? 0 : lastPri).toFixed(2)

          this.setData({
            currentCoupon: coup
          })
    },
    // 关闭通用弹窗
   closeCommonCoupon: function (e) {
        this.setData({
            showCommonSendCoupon: false
        })
    },
    // 关闭红包领取界面
    closePacket: function () {
        this.setData({
            showPacket: false
        })
    },

    /**
     * @description 下单
     * @return {void}
     */
    pay: function () {
        const me = this
        let showBenefit = this.data.showBenefit;
        let flag = this.data.blacklist.indexOf(this.data.id) == -1;
        if (coupons.length > 0 && !showBenefit && flag) {
            this.checkCoupon();
            if (this.data.currentCoupon && this.data.currentCoupon.fee) {
                this.setData({ showBenefit: true });
                return;
            }
        }
        api_1.createOrder({
            cid: Number(me.data.id), 
            coupon_id: this.data.currentCoupon.id
        }).then(res => {
            if (res.errorCode !== 1) {
                wx.showToast({
                    icon: 'none',
                    title: '创建订单失败'
                })
                return
            }
            let obj = res.data;
            let timeStamp = obj.timeStamp;
            let nonceStr = obj.nonceStr;
            let packageStr = obj.packageStr;
            let signType = obj.signType;
            let paySign = obj.paySign;
            // if (me.data.currentCoupon.lastFee == 0 && coupons.length > 0) {
            //     me.getChapters();
            //     me.setData({ isOrdered: true, showBenefit: false });
            //     return;
            // }
            wx.requestPayment({
                timeStamp,
                nonceStr,
                package: packageStr,
                signType,
                paySign,
                success: function (res) {
                    me.checkValidAct(2);// 购买后发券
                    me.getChapters();
                    me.setData({ isOrdered: true, showBenefit: false });
                    let logData = { event: 700, cid: me.data.id }
                    api_1.vLog(logData);
                },
                fail: function (res) {
                    me.getChapters();
                    me.setData({ showBenefit: false });
                }
            });
        });
    },
    /**
     * @description 开始学习
     * @return {void}
     */
    gotoStudy: function () {
        let playId = this.data.playId;
        let pauseId = this.data.pauseId;
        if (playId || pauseId) {
            return;
        }
        else {
            this.setData({
                tab: 'catalog',
                canScroll: true
            });
            this.targetMedia(null, 0);
            return;
        }
    },
    /**
     * @description 关闭音频控制组控件
     * @return {void}
     */
    close: function () {
        let me = this;
        me.setData({
            showControls: false
        });
    },
    /**
     * @description 控制组滑块滑动完成事件
     * @param {Event} e
     * @return {void}
     */
    sliderChange: function (e) {
        let me = this;
        let val = e.detail.value;
        let dur = me.data.audioTime.second;
        this.MediaContext.seek(val / 100 * dur);
        me.setData({
            isGrag: false
        });
    },
    /**
     * @description 控制组滑块正在滑动事件
     * @param {Event} e
     * @return {void}
     */
    sliderChanging: function () {
        let me = this;
        me.setData({
            isGrag: true
        });
    },
    /**
     * @description 回到小程序首页
     * @returns {void}
     */
    goIndex: function () {
        util_1.router(getCurrentPages(), '/pages/index/index')
    },
    /**
     * @description 播放完成
     * @return {void}
     */
    ended: function () {{}
        let logData = { event: 501, cid: this.data.id, ch_id: this.data.id }
        api_1.vLog(logData);
        if (this.data.curPlayChapterIndex === this.data.chapters.length - 1)
            wx.showToast({
                icon: 'none',
                title: '播放结束'
            })
        else
            this.targetMedia(null, this.data.curPlayChapterIndex + 1)
    },
    /**
     * @description 关闭优惠券选取界面
     * @return {void}
     */
    closeBenefit: function (e) {
        this.setData({ showBenefit: false });
    },
    onHide: function () {
        // wx.showModal({'title': 'aaa'})
        this.MediaContext && this.MediaContext.pause()
    },
    onUnload: function () {
        this.MediaContext && this.MediaContext.pause()
    }
});
