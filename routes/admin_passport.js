/**
* 패스포트 라우팅 함수 정의
*
* @date 2016-11-10
* @author Mike
*/
//등록
var Entities = require('html-entities').AllHtmlEntities;


var multer = require('multer');

var _storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: _storage
});

module.exports = function(router, passport) {
  console.log('admin_passport 호출됨.');



  // 관리자 홈 화면
  router.route('/admin/home').get(function(req, res) {
    res.redirect('/admin/login');
    // console.log('/ 패스 요청됨.');
    //
    // console.log('req.user의 정보');
    // console.dir(req.user);
    //
    // // 인증 안된 경우
    // if (!req.user) {
    //     console.log('사용자 인증 안된 상태임.');
    //     res.render('admin_login.ejs', {login_success:false});
    // } else {
    //     console.log('사용자 인증된 상태임.');
    //     res.render('admin_login.ejs', {login_success:true});
    // }
  });
  //관리자 로그인 화면
  router.route('/admin/login').get(function(req, res) {
    console.log('/ 패스 요청됨.');

    console.log('req.user의 정보');
    console.dir(req.user);

    //인증 안된 경우
    if (!req.user) {
      console.log('사용자 인증 안된 상태임.');
      console.log('/admin/login 패스 요청됨.');
      res.render('admin_login.ejs', {message: req.flash('loginMessage')});
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/admin/home 패스 요청됨.');
      console.dir(req.user);

      if (Array.isArray(req.user)) {
        res.render('admin_index.ejs', {user: req.user[0]._doc});
      } else {
        res.render('admin_index.ejs', {user: req.user});
      }
    }
  });
  // 프로필 화면
  router.route('/admin/profile').get(function(req, res) {
    console.log('/profile 패스 요청됨.');

    // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
    console.log('req.user 객체의 값');
    console.dir(req.user);
    // 인증 안된 경우
    if (!req.user) {
      //if(!req.user[1].auth != 'auth'){
      console.log('사용자 인증 안된 상태임.');
      res.redirect('/');
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/profile 패스 요청됨.');
      console.dir(req.user);

      if (Array.isArray(req.user)) {
        res.render('admin_profile.ejs', {user: req.user[0]._doc});
      } else {
        res.render('admin_profile.ejs', {user: req.user});
      }
    }
  });

  // 관리자 로그인 인증
  router.route('/admin/login').post(passport.authenticate('admin-login', {
    successRedirect : '/admin/home',
    failureRedirect : '/admin/login',
    failureFlash : true
  }));





  // 스터디룸 조회
  router.route('/room/info').get(function(req, res) {
    console.log('/room/info 패스 요청됨.');
    res.render('room_info.ejs', {message: req.flash('registerMessage')});
  });







  //관리자 등록 화면
  router.route('/admin/register').get(function(req, res) {
    console.log('/register 패스 요청됨.');
    if (!req.user || req.session.auth_admin != "1") {
      console.log('사용자 인증 안된 상태임.');
      res.render('admin_login.ejs', {message: req.flash('loginMessage')});
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/register 패스 요청됨.');
      console.dir(req.user);

      res.render('admin_register.ejs',{message: req.flash('registerMessage')})
    }
  });

  //로그아웃
  router.route('/admin/logout').get(function(req, res) {
    console.log('/admin/logout 패스 요청됨.');
    req.logout();
    res.redirect('/admin/home');
  });

  //관리자 등록 인증
  /*
  router.route('/admin/register').post(passport.authenticate('admin-register', {
  successRedirect : '/admin/home',
  failureRedirect : '/admin/home',
  failureFlash : true
}));
*/


router.route('/admin/registSuccess').get(function(req, res) {
  console.log('/registSuccess 패스 요청됨.');
  res.render('admin_registSuccess.ejs', {message: req.flash('registerMessage')});
});





//등록
router.post('/admin/register' , upload.single('uploadfile'), function(req, res){
  console.log('admin_passport 모듈 안에 있는 /admin/register 호출됨.');

  var paramfacilityname = req.body.facilityname || req.query.facilityname;
  var parampostcode = req.body.postcode || req.query.postcode;
  var paramroadnameaddress = req.body.roadnameaddress || req.query.roadnameaddress;
  var paramaddress = req.body.address || req.query.address;
  var paramnumber = req.body.number || req.query.number;
  var parampeople = req.body.people || req.query.people;
  var paramconve = req.body.conve || req.query.conve;
  var paramtime = req.body.time || req.query.time;
  var paramimagefiles = req.file.path || req.query.file.path;
  var paramintro = req.body.intro || req.query.intro;

  console.log('요청 파라미터 : ' + paramfacilityname + ', ' + parampostcode +  ', ' + paramroadnameaddress + ', ' + paramaddress +  ', ' +
  paramnumber + ', ' + paramconve + ', ' + paramtime + ', ' + paramimagefiles + ', ' + paramintro );

  var database = req.app.get('database');

  // 데이터베이스 객체가 초기화된 경우
  if (database.db) {

    // 1. 아이디를 이용해 사용자 검색
    database.StudyModel.findByNumber(paramnumber, function(err, results) {
      /*
      if (err) {
      console.error('시설 등록 에러 : ' + err.stack);

      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>시설 정보 추가 중 에러 발생</h2>');
      res.write('<p>' + err.stack + '</p>');
      res.end();

      return;
    }

    if (results != undefined || results.length > 0) {
    console.log(results);
    res.redirect('/public/failure.html');
    return;
  }
  */

  // save()로 저장
  // PostModel 인스턴스 생성
  var post = new database.StudyModel({
    facilityname: paramfacilityname,
    postcode: parampostcode,
    roadnameaddress: paramroadnameaddress,
    address: paramaddress,
    number: paramnumber,
    people: parampeople,
    conve: paramconve,
    time: paramtime,
    imagefiles: paramimagefiles,
    intro: paramintro
  });

  post.savePost(function(err, result) {
    if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<<script>alert("jpg png gif 파일만 가능합니다")</script>');
      res.write('<script>window.location.href="/admin/register"</script>');
      res.end();
    }

    if (err) {

      console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<script>alert("모든 값을 입력해주세요")</script>');
      res.write('<script>window.location.href="/admin/register"</script>');
      res.end();
      return;
    }


    console.log("시설 데이터 추가함.");
    return res.redirect('/admin/registSuccess');
  });
});




} else {
  res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
  res.write('<h2>데이터베이스 연결 실패</h2>');
  res.end();
}
});
};
