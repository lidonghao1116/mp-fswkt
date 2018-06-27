const host = 'https://lesson-dev.gogopin.cn/'
export const TOKEN = 'token'
export const CHANNEL ='channel'
export const littleOsType = 102
export const ostype = 1
export const shareTitle ='丰盛微课堂—你的终生学习神器'
export const sharePath =''

export const url = {
    logVist:host+'api/com.rocket.api.User/logVist',                     //统计
    miniLogin:host+'api/com.rocket.api.User/miniLogin',                 //登录
    queryCourses:host+'api/com.rocket.api.Course/queryCourses',         //主页播放列表
    queryBanners:host+'api/com.rocket.api.Common/queryBanners',         //主页banner图
    findCourseById:host+'api/com.rocket.api.Course/findCourseById',     //获取课程详情列表
    queryChapters:host+'api/com.rocket.api.Course/queryChapters',       //获取课程章节列表
    getMyCourse:host+'api/com.rocket.api.User/getMyCourse',             //获取我的课程
    createOrder:host+'api/com.rocket.api.Order/createOrder',            //下单
    createComplexOrder:host+'api/com.rocket.api.Order/createComplexOrder',            //下单
    queryCoupons:host+'api/com.rocket.api.Coupon/queryCoupons',         //查询所有优惠券
    grantCoupon:host+'api/com.rocket.api.Coupon/grantCoupon',           //发放优惠券
    addLittleTemplateMsg:host+'api/com.rocket.api.User/addLittleTemplateMsg',  //上传form_id
    checkValidAct:host+'api/com.rocket.api.Coupon/checkValidAct',              //检查当前活动是否可用
}