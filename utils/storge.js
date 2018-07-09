"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const host = 'http://192.168.1.15:8081/';
const host = 'https://lesson.fsstudy.com/';

exports.TOKEN = 'token';
exports.CHANNEL = 'channel';
exports.littleOsType = 102;
exports.ostype = 1;
exports.shareTitle = '丰盛微课—你的终生学习神器';
exports.sharePath = '';
exports.url = {
    miniLogin: host + 'api/mini/login',
    logVist: host + 'api/misc/visit',
    queryGroups: host + 'api/findAllCourseGroup',
    queryCourses: host + 'api/getCourses',
    queryBanners: host + 'api/common/queryBanners',
    queryCourseByName: host + 'api/findCourseByName',
    latelyStudy: host + 'api/user/latelyStudy',
    mycourses: host + 'api/user/mycourses',
    mycoupons: host + 'api/mycoupons',
    queryCourseById: host + 'api/course/',
    checkValidAct: host + 'api/coupons',
    grantCoupon: host + 'api/grantCoupon',
    
    queryChapters: host + 'api/course/{cid}/chapters',
    courseFinish: host + 'api/course/{cid_chid}/finish',
    createOrder: host + 'api/order',
};
