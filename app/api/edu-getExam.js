const SimulateLogin = require('./util/simulateLogin');
const cheerio = require('cheerio');
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));

// 浏览器请求报文头部部分信息
const browserMsg = {
  'Accept-Encoding': 'gzip, deflate',
  Origin: 'http://jwzx.hrbust.edu.cn',
  'Content-Type': 'application/x-www-form-urlencoded',
};

function getStudentId(cookie, callback) {
  superagent
    .get('http://jwzx.hrbust.edu.cn/academic/student/currcourse/currcourse.jsdo?groupId=&moduleId=2000')
    .charset()
    .set(browserMsg)
    .set('Cookie', cookie)
    .end((err, response) => {
      if (err) {
        // loginHandlerInner(usernameW, passwordW, callback);
      } else {
        const body = response.text;
        const $ = cheerio.load(body);
        const str = $('.button')[0].attribs.onclick;
        const id = str.match(/id=(\S*)&yearid/)[1];
        // console.log(id+'dfsd');
        callback(id);
      }
    });
}


function getExam(params) {
  const SimulateLoginParams = {
    username: params.username,
    password: params.password,
    simulateIp: params.simulateIp,
    yourCookie: params.yourCookie,
  };
  const simulateLogin = new SimulateLogin();
  simulateLogin.init(SimulateLoginParams).then((result) => {
    if (result.error) {
      params.callback({
        error: result.error,
      });
    } else {
      getStudentId(result.cookie, (id) => {
        superagent
          .get(`http://jwzx.hrbust.edu.cn/academic/student/exam/index.jsdo?stuid=${id}`)
          .charset()
          .set(browserMsg)
          .set('Cookie', result.cookie)
          .redirects(0)
          .end((error, response) => {
            if (error) {
              params.callback({
                error,
              });
            } else {
              const body = response.text;
              const $ = cheerio.load(body);
              const examInfo = {};
              $('.infolist_tab tr') && $('.infolist_tab tr').each((i, e) => {
                examInfo[i] = [];
                if (i === 0) {
                  $(e).children('th') && $(e).children('th').each((j, ele) => {
                    examInfo[i].push($(ele).text());
                  });
                  return;
                }
                $(e).children('td') && $(e).children('td').each((j, ele) => {
                  const str = $(ele).text();
                  const strF = str.replace(/(\s+)|(javascript(.*);)|(&nbsp;)/g, '');
                  examInfo[i].push(strF);
                });
              });
              params.callback(examInfo);
            }
          });
      });
    }
  });
}

exports.getExam = getExam;