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
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: _storage
});

module.exports = function(router, passport) {
  console.log('admin_passport 호출됨.');

//관리자 검색
  router.route('/admin/revsearch').get(function(req, res) {
    console.log('/admin/revsearch 패스 요청됨.');
    res.render('admin_revsearch.ejs', {
      message: req.flash('registerMessage')
    });
  });

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
      res.render('admin_login.ejs', {
        message: req.flash('loginMessage')
      });
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/admin/home 패스 요청됨.');
      console.dir(req.user);

      if (Array.isArray(req.user)) {
        res.render('admin_index.ejs', {
          user: req.user[0]._doc
        });
      } else {
        res.render('admin_index.ejs', {
          user: req.user
        });
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
        res.render('admin_profile.ejs', {
          user: req.user[0]._doc
        });
      } else {
        res.render('admin_profile.ejs', {
          user: req.user
        });
      }
    }
  });

  // 관리자 로그인 인증
  router.route('/admin/login').post(passport.authenticate('admin-login', {
    successRedirect: '/admin/home',
    failureRedirect: '/admin/login',
    failureFlash: true
  }));





  // 스터디룸 조회
  router.route('/room/info').get(function(req, res) {
    console.log('/room/info 패스 요청됨.');
    res.render('room_info.ejs', {
      message: req.flash('registerMessage')
    });
  });

// 스터디룸 예약
  router.route('/room/reserve/:id').get(function(req, res) {
    console.log('/room/reserve 패스 요청됨.');

    if (!req.user) {
    //if(!req.user[1].auth != 'auth'){
        console.log('사용자 인증 안된 상태임.');
        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<script>alert("로그인이 필요합니다")</script>');
        res.write('<script>window.location.href="/user/login"</script>');
        res.end();
        return;
      }
else{
        // URL 파라미터로 전달됨
        var paramId = req.body.id || req.query.id || req.params.id;

        console.log('요청 파라미터 : ' + paramId);

       var database = req.app.get('database');

        // 데이터베이스 객체가 초기화된 경우
       if (database.db) {
          // 1. 글 리스트
          database.StudyModel.load(paramId, function(err, results) {
             if (err) {
                    console.error('게시판 글 조회 중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                res.end();

                    return;
                }

             if (results) {
                console.dir(results);

                //res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                session_obj = req.session;
                user_name = session_obj.auth_name;
                user_phone = session_obj.auth_phone;
                //console.dir(req.session);
                //console.log(user_name);
                //console.log("@@@$@$@@$@$@$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                var context = {
                   title: '글 조회 ',
                   posts: results,
                   Entities: Entities,
                   user_name: user_name,
                   user_phone: user_phone
                };
            res.render('room_reserve.ejs', context);
             } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>글 조회  실패</h2>');
                res.end();
             }
          });
       } else {
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>데이터베이스 연결 실패</h2>');
          res.end();
       }

     }
  });


  //관리자 시설 등록 화면
  router.route('/admin/register').get(function(req, res) {
    console.log('/register 패스 요청됨.');
    if (!req.user || req.session.auth_admin != "1") {
      console.log('사용자 인증 안된 상태임.');
      res.render('admin_login.ejs', {
        message: req.flash('loginMessage')
      });
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/register 패스 요청됨.');
      console.dir(req.user);

      res.render('admin_register.ejs', {
        message: req.flash('registerMessage')
      })
    }
  });



  //시설 예약 화면
  router.route('/room/reserve').get(function(req, res) {
    console.log('/room/reserve get 요청됨.');
    if (!req.user || req.session.auth_admin != "1") {
      console.log('사용자 인증 안된 상태임.');
      res.render('admin_login.ejs', {
        message: req.flash('loginMessage')
      });
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/room/reserve get 패스 요청됨.');
      console.dir(req.user);

      res.render('admin_register.ejs', {
        message: req.flash('registerMessage')
      })
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

//예약 성공 화면
router.route('/admin/registSuccess').get(function(req, res) {
  console.log('/registSuccess 패스 요청됨.');
  res.render('admin_registSuccess.ejs', {
    message: req.flash('registerMessage')
  });
});





// 스터디룸 등록
router.post('/admin/register', upload.single('uploadfile'), function(req, res) {
  console.log('admin_passport 모듈 안에 있는 /admin/register 호출됨.');

  var paramfacilityname = req.body.facilityname || req.query.facilityname;
  var parampostcode = req.body.postcode || req.query.postcode;
  var paramroadnameaddress = req.body.roadnameaddress || req.query.roadnameaddress;
  var paramaddress = req.body.address || req.query.address;
  var paramnumber = req.body.number || req.query.number;
  var parampeople = req.body.people || req.query.people;
  var paramconve = req.body.conve || req.query.conve;
  var paramstarttime = req.body.starttime || req.query.starttime;
  var paramendtime = req.body.endtime || req.query.endtime;
  if(req.file.path!=""||req.query.file.path!=""){
    var paramimagefiles = req.file.path || req.query.file.path;
  }

  console.log('asdasd12121');
  var paramintro = req.body.intro || req.query.intro;

  console.log('요청 파라미터 : ' + paramfacilityname + ', ' + parampostcode + ', ' + paramroadnameaddress + ', ' + paramaddress + ', ' +
  paramnumber + ', ' + paramconve + ', ' + paramstarttime + ', ' + paramendtime + ', '+ paramimagefiles + ', ' + paramintro);

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
    endtime: paramendtime,
    starttime: paramstarttime,
    imagefiles: paramimagefiles,
    intro: paramintro
  });

  post.savePost(function(err, result) {


    if (err) {
      console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
      res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<script>alert("모든 값을 입력해주세요")</script>');
      res.write('<script>window.location.href="/admin/register"</script>');
      res.end();
      return;
    }


    else if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<<script>alert("jpg png gif 파일만 가능합니다")</script>');
      res.write('<script>window.location.href="/admin/register"</script>');
      res.end();
      return;
    }


    console.log("시설 데이터 추가함.");
    return res.redirect('/admin/registSuccess');
  });
});

} else {
  res.writeHead('200', {
    'Content-Type': 'text/html;charset=utf8'
  });
  res.write('<h2>데이터베이스 연결 실패</h2>');
  res.end();
}


});


// 시설 예약

router.post('/room/reserve', function(req, res){
  console.log('user_passport 모듈 안에 있는 /room/reserve호출됨.');
  var paramdate = req.body.date || req.query.date;
  var paramstarttime = req.body.starttime || req.query.starttime;
  var paramendtime = req.body.endtime || req.query.endtime;
  var paramfacilityname = req.body.facilityname || req.query.facilityname;
  var paramusername = req.body.username || req.query.username;
  var paramphone = req.body.phone || req.query.phone;


  console.log('요청 파라미터 : '+ paramdate +', ' + paramstarttime + ', '  + paramendtime + ', ' + paramfacilityname +  ', ' +
  paramusername + ', ' + paramphone);

  var database = req.app.get('database');

  // 데이터베이스 객체가 초기화된 경우
  if (database.db) {

    // 1. 아이디를 이용해 사용자 검색

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
var post = new database.ReservationModel({
  date : paramdate,
  starttime: paramstarttime,
  endtime: paramendtime,
  facilityname: paramfacilityname,
  username: paramusername,
  phone: paramphone
});

post.savePost(function(err, result) {
  // if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
  //   res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
  //   res.write('<<script>alert("jpg png gif 파일만 가능합니다")</script>');
  //   res.write('<script>window.location.href="/"</script>');
  //   res.end();
  // }

  if (err) {

    console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<script>alert("모든 값을 입력해주세요")</script>');
    res.write('<script>window.location.href="/"</script>');
    res.end();
    return;
  }


  console.log("예약 데이터 추가함.");
  return res.redirect('/admin/registSuccess');
});




} else {
  res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
  res.write('<h2>데이터베이스 연결 실패</h2>');
  res.end();
}
});
};
