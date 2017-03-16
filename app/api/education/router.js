const log = require('bole')('customers/router');
const express = require('express');

const router = new express.Router();

const eduLogin = require('./edu-login');
const eduGetCourse = require('./edu-getCourse');
const eduGetName = require('./edu-getName');
const eduGetExam = require('./edu-getExam');
const eduGetGrade = require('./edu-getGrade');
const eduGetWeek = require('./edu-getWeek');
const eduGetNews = require('./edu-getNews');
const eduGetCet = require('./edu-getCet');
const eduGetJob = require('./edu-getJob');


function handleParams(req, callback) {
  const username = req.query.username;
  const password = req.query.password;
  const yourCookie = req.query.cookie;
  const simulateIp = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  return {
    username,
    password,
    yourCookie,
    simulateIp,
    callback,
  };
}

function handleRes(result, res) {
  if (result.error) {
    log.error(result.error, 'error handleRes');
    res.status(400).json({
      error: result.error,
    });
    return;
  }
  res.json(result);
}


function getCourse(req, res) {
  const getCourseParmas = handleParams(req, (result) => {
    handleRes(result, res);
  });

  eduGetCourse.getCourse(getCourseParmas);
}

function login(req, res) {
  const loginParmas = handleParams(req, (result) => {
    handleRes(result, res);
  });
  eduLogin.login(loginParmas);
}

function getUserName(req, res) {
  const getNameParmas = handleParams(req, (result) => {
    handleRes(result, res);
  });
  eduGetName.getUserName(getNameParmas);
}

function getExam(req, res) {
  const getExamParmas = handleParams(req, (result) => {
    handleRes(result, res);
  });
  eduGetExam.getExam(getExamParmas);
}

function getGrade(req, res) {
  const getGradeParmas = {
    username: req.query.username,
    password: req.query.password,
    year: req.query.year,
    term: req.query.term,
    yourCookie: req.query.cookie,
    simulateIp: req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress,
    callback(result) {
      handleRes(result, res);
    },
  };

  eduGetGrade.getGrade(getGradeParmas);
}

function getWeek(req, res) {
  eduGetWeek.getWeek().then((result) => {
    handleRes(result, res);
  });
}

function getNews(req, res) {
  const page = req.query.page;
  eduGetNews.getNews(page).then((result) => {
    handleRes(result, res);
  });
}

function getCet(req, res) {
  const num = req.query.username;
  eduGetCet.getCet(num).then((result) => {
    handleRes(result, res);
  });
}

function getJob(req, res) {
  const page = req.query.page;
  eduGetJob.getJob(page).then((result) => {
    handleRes(result, res);
  });
}

function home(req, res) {
  res.render('api/education/home');
}
router.get('/', home);
router.get('/getCourse', getCourse);
router.get('/login', login);
router.get('/getUserName', getUserName);
router.get('/getExam', getExam);
// router.post('/getGrade', getGrade);
router.get('/getGrade', getGrade);
router.get('/getWeek', getWeek);
router.get('/getNews', getNews);
router.get('/getCet', getCet);
router.get('/getJob', getJob);
module.exports = router;
