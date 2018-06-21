"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const host = 'https://lesson.fsstudy.com/';
// const host = 'https://lesson-dev.gogopin.cn/';

exports.TOKEN = 'token';
exports.CHANNEL = 'channel';
exports.littleOsType = 102;
exports.ostype = 1;
exports.shareTitle = '丰盛微课堂—你的终生学习神器';
exports.sharePath = '';
exports.url = {
    logPush: 'https://lesson-mb.fsstudy.com/user/visit/push',
    logVist: host + 'api/com.rocket.api.User/logVist',
    miniLogin: host + 'api/com.rocket.api.User/miniLogin',
    queryCourses: host + 'api/com.rocket.api.Course/queryCourses',
    queryBanners: host + 'api/com.rocket.api.Common/queryBanners',
    findCourseById: host + 'api/com.rocket.api.Course/findCourseById',
    queryChapters: host + 'api/com.rocket.api.Course/queryChapters',
    getMyCourse: host + 'api/com.rocket.api.User/getMyCourse',
    createOrder: host + 'api/com.rocket.api.Order/createOrder',
    createComplexOrder: host + 'api/com.rocket.api.Order/createComplexOrder',
    queryCoupons: host + 'api/com.rocket.api.Coupon/queryCoupons',
    grantCoupon: host + 'api/com.rocket.api.Coupon/grantCoupon',
    getValidActivity: host + 'api/com.rocket.api.Coupon/getValidActivity',
    addLittleTemplateMsg: host + 'api/com.rocket.api.User/addLittleTemplateMsg',
    checkValidAct: host + 'api/com.rocket.api.Coupon/checkValidAct',
};
