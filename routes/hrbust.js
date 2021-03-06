const router = require('koa-router')()
const {
  login,
  logout,
  getCaptcha,
  getWeek,
} = require('../controller/hrbust/login')

const {
  getCourse,
  getHasCourseTerms,
  updateCourse,
} = require('../controller/hrbust/course')

const {
  getGrade,
} = require('../controller/hrbust/grade')

const {
  getExam,
} = require('../controller/hrbust/exam')

const {
  getNews,
  getNewsDetail,
} = require('../controller/hrbust/news')

const {
  roomschedule,
  roomschedulequery,
} = require('../controller/hrbust/roomschedule')

router.prefix('/api/hrbust')

// 登录登出
router.get('/login', ctx => login(ctx))
router.get('/logout', ctx => logout(ctx))

// 获取验证码
router.get('/captcha', ctx => getCaptcha(ctx))

// 获取周数
router.get('/week', ctx => getWeek(ctx))

// 获取课程表
router.get('/course', ctx => getCourse(ctx))

// 更新课程表
router.get('/updateCourse', ctx => updateCourse(ctx))

router.get('/getHasCourseTerms', ctx => getHasCourseTerms(ctx))

// 成绩
router.get('/grade', ctx => getGrade(ctx))

// 考试信息
router.get('/exam', ctx => getExam(ctx))

// 教务在线
router.get('/news', ctx => getNews(ctx))
router.get('/news/:id', ctx => getNewsDetail(ctx))

// 空教室查询
router.get('/roomschedule', ctx => roomschedule(ctx))
router.get('/roomschedulequery', ctx => roomschedulequery(ctx))

module.exports = router
