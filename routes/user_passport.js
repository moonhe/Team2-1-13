/**
* 패스포트 라우팅 함수 정의
*
* @date 2016-11-10
* @author Mike
*/


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
  console.log('user_passport 호출됨.');

  // 홈 화면
  router.route('/').get(function(req, res) {
    console.log('/ 패스 요청됨.');
    session_obj = req.session;
    user_name = session_obj.auth_name;
    console.log('req.user의 정보');
    console.dir(req.user);

    // 인증 안된 경우
    if (!req.user) {
      console.log('사용자 인증 안된 상태임.');
      res.render('user_index.ejs', {login_success:false});
    } else {
      console.log('사용자 인증된 상태임.');
      res.render('user_index.ejs', {login_success:true});
    }
  });

  // 로그인 화면
  router.route('/user/login').get(function(req, res) {
    if (!req.user) {
      console.log('사용자 인증 안된 상태임.');
      console.log('/user/login 패스 요청됨.');
      session_obj = req.session;
      user_name = session_obj.auth_name;
      res.render('user_login.ejs', {message: req.flash('loginMessage')});
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/user/profile 패스 요청됨.');
      res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<script>alert("이미 로그인 중입니다!")</script>');
      res.write('<script>window.location.href="/user/profile"</script>');
      res.end();
      return;
      console.dir(req.user);

      if (Array.isArray(req.user)) {
        res.render('user_profile.ejs', {user: req.user[0]._doc});
      } else {
        res.render('user_profile.ejs', {user: req.user});
      }
    }
  });

  // 회원가입 화면
  router.route('/user/signup').get(function(req, res) {
    console.log('/signup 패스 요청됨.');
    res.render('user_signup.ejs', {message: req.flash('signupMessage')});
  });


  //개발자 문의 성공 화면
  router.route('/user/contactSuccess').get(function(req, res) {
    console.log('/contactSuccess 패스 요청됨.');
    res.render('user_contactSuccess.ejs', {
      message: req.flash('registerMessage')
    });
  });

  // 시설조회 화면
  router.route('/user/search').get(function(req, res) {
    var database = req.app.get('database');
    database.StudyModel.find(function(err, users){
      if(err) return res.status(500).send({error:'database find failure'});
      res.json(users);
    })
    console.log('/find 패스 요청됨.');
  });

  // 프로필 화면
  router.route('/user/profile').get(function(req, res) {
    console.log('/user/profile 패스 요청됨.');
    session_obj = req.session;
    user_name = session_obj.auth_name;

    // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
    console.log('req.user 객체의 값');
    console.dir(req.user);
    // 인증 안된 경우
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
    } else {
      console.log('사용자 인증된 상태임.');
      console.log('/profile 패스 요청됨.');
      console.dir(req.user);

      if (Array.isArray(req.user)) {
        res.render('user_profile.ejs', {user: req.user[0]._doc});
      } else {
        var database = req.app.get('database');
        if (database.db) {
          database.ReservationModel.loadbyemail(req.user.email, function(err, results) {
            if (err) {
              console.error('에앾 조회 중 에러 발생 : ' + err.stack);
              return;
            }
            if (results) {
              //console.dir(results);
              //user_email = session_obj.auth_email;
              // 뷰 템플레이트를 이용하여 렌더링한 후 전송
              for(i =0; i<results.length; i++){
                console.dir(results[i]._doc);
              }
              var context = {
                user: req.user,
                title: '예약 조회',
                posts: results,
              };
              res.render('user_profile.ejs', context);
            } else {}
          });

        } else {
          //res.write('<h2>데이터베이스 연결 실패</h2>');
        }
        //res.render('user_profile.ejs', {user: req.user});

      }
    }
  });

  // 로그아웃
  router.route('/user/logout').get(function(req, res) {
    console.log('/user/logout 패스 요청됨.');
    req.session.destroy();
    req.logout();

    res.redirect('/');
  });

  //회원 삭제
  router.route('/user/delete').post(function(req, res){
    console.log('/user/delete 패스 요청됨.');


    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);
    var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

      //예약 삭제
      database.UserModel.remove(paramId, function(err, results) {
        if (err) {
          console.error('사용자 삭제 중 에러 발생 : ' + err.stack);
          return;
        }

        if (results) {
          console.dir(results);
          // 뷰 템플레이트를 이용하여 렌더링한 후 전송
          var context = {
            title: '사용자 삭제 ',
            posts: results,
            Entities: Entities
          };
        } else {}
      });

    } else {
      //res.write('<h2>데이터베이스 연결 실패</h2>');
    }
    req.logout();
    res.redirect('/user/DeleteSuccess');
  });


  router.route('/user/deleteSuccess').get(function(req, res) {
    console.log('/DeleteSuccess 패스 요청됨.');
    res.render('user_deleteSuccess.ejs', {
      message: req.flash('registerMessage')
    });
  });




  //회원 수정
  router.route('/user/update').get(function(req, res){
    console.log('/user/update 패스 요청됨.');
    // URL 파라미터로 전달됨

    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);
    var database = req.app.get('database');
    // 데이터베이스 객체가 초기화된 경우
    if (database.db) {

      //회원 수정
      database.UserModel.load(paramId, function(err, results) {
        if (err) {
          console.error('사용자 수정 중 에러 발생 : ' + err.stack);
          return;
        }

        if (results) {
          console.dir(results);
          // 뷰 템플레이트를 이용하여 렌더링한 후 전송
          session_obj = req.session;
          user__id = session_obj.auth__id;
          user_name = session_obj.auth_name;
          user_phone = session_obj.auth_phone;
          user_birth = session_obj.auth_birth;
          user_gender = session_obj.auth_gender;
          user_email = session_obj.auth_email;
          user_postcode = session_obj.auth_postcode;
          user_roadnameaddress = session_obj.auth_roadnameaddress;
          user_address = session_obj.auth_address;
          var context = {
            title: '사용자 수정 ',
            posts: results,
            //Entities: Entities,
            user__id : user__id,
            user_name: user_name,
            user_phone: user_phone,
            user_birth: user_birth,
            user_gender: user_gender,
            user_postcode: user_postcode,
            user_roadnameaddress: user_roadnameaddress,
            user_address: user_address
          };


          /*
          if (!req.user) {
          console.log('사용자 인증 안된 상태임.');
          res.render('user_index.ejs', {login_success:false});
        } else {
        console.log('사용자 인증된 상태임.');
        res.render('user_updatesignup.ejs', context, {login_success:true});
      }
      */
      res.render('user_updatesignup.ejs', context);
    } else {}
  });

} else {
  //res.write('<h2>데이터베이스 연결 실패</h2>');
}
//res.redirect('/user/update');
});


//회원 수정
router.route('/user/update').post(function(req, res){
  console.log('/user/update 패스 요청됨.');
  // URL 파라미터로 전달됨
  //var paramId = req.body.id || req.query.id || req.params.id;

  var updateData = {
    id: req.body.id,
    n_username: req.body.username,
    n_useremail:req.body.email,
    n_birth: req.body.birth,
    n_gender: req.body.gender,
    n_phone: req.body.phone,
    n_postcode: req.body.postcode,
    n_roadnameaddress: req.body.roadnameaddress,
    n_address: req.body.address
  };
  console.log('요청 파라미터 : \n' +
  updateData['id'] + '\n' +
  updateData['n_useremail'] + '\n'+
  updateData['n_birth'] + '\n' +
  updateData['n_gender'] + '\n' +
  updateData['n_phone'] + '\n' +
  updateData['n_postcode'] + '\n' +
  updateData['n_roadnameaddress'] + '\n' +
  updateData['n_address'] + '\n'
);
var database = req.app.get('database');
// 데이터베이스 객체가 초기화된 경우
if (database.db) {

  //회원 수정
  database.UserModel.update(updateData, function(err, results) {
    if (err) {
      console.error('사용자 수정 중 에러 발생 : ' + err.stack);
      return;
    }
    if (results) {
      console.dir(results);
      res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
      });
      res.write('<script>alert("수정완료! 다시 로그인 해주세요")</script>');
      req.session.destroy();
      res.write('<script>window.location.href="/user/login"</script>');
      res.end();
      return;
    } else {
      //res.write('<h2>데이터베이스 연결 실패</h2>');
    }
    //res.redirect('/user/update');
  });
}
});

/*
//개발자 문의 화면
router.route('/user/contactDev').get(function(req, res) {
if (!req.user) {
console.log('사용자 인증 안된 상태임.');
console.log('/user/contactDev 패스 요청됨.');
res.writeHead('200', {
'Content-Type': 'text/html;charset=utf8'
});
res.write('<script>alert("로그인이 필요합니다")</script>');
res.write('<script>window.location.href="/user/login"</script>');
res.end();
return;
} else {
console.log('/contactDev 패스 요청됨.');
res.render('user_contactDev.ejs', {message: req.flash('')});
}
*/

//개발자 문의 화면
router.route('/user/contactDev').get(function(req, res){
  console.log('/user/contactDev 패스 요청됨.');
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
  } else {
    // URL 파라미터로 전달됨
    //var paramId = req.body.id || req.query.id || req.params.id;
    session_obj = req.session;
    user__id = session_obj.auth__id;
    user_name = session_obj.auth_name;
    console.dir(req.session);
    var context = {
      title: '회원 이름 ',
      //Entities: Entities,
      user__id : user__id,
      user_name: user_name
    };
    res.render('user_contactDev.ejs', context);
  }
});


// 개발자문의 등록
router.post('/user/contactDev', function(req, res){
  console.log('user_passport 모듈 안에 있는 /user/contactDev 호출됨.');
  var paramwriter = req.body.writer || req.query.writer;
  var paramkind = req.body.kind || req.query.kind;
  var paramtitle = req.body.title || req.query.title;
  var paramcontent = req.body.content || req.query.content;

  console.log('요청 파라미터 : '+ paramwriter +', ' + paramkind + ', '  + paramtitle + ', ' + paramcontent);

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
var post = new database.ContactDevModel({
  writer : paramwriter,
  kind: paramkind,
  title: paramtitle,
  content: paramcontent,
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
    res.write('<script>window.location.href="/user/contactDev"</script>');
    res.end();
    return;
  }
  console.log("개발자 문의 전송됨.");
  return res.redirect('/user/contactSuccess');
});
} else {
  res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
  res.write('<h2>데이터베이스 연결 실패</h2>');
  res.end();
}
});



//사용자 반납 정보 등록
router.post('/user/roomreturn',upload.single('uploadfile'),function(req, res) {
  console.log('/user/roomreturn post 패스 요청됨.');
  // URL 파라미터로 전달됨
  //   var paramId = req.body.id || req.query.id || req.params.id;
  //   console.log('요청 파라미터 : ' +paramID );


  // 반납 정보 등록
  var paramId = req.body.id;
  var paramcomment = req.body.comment || req.query.comment;
  var paramremark = req.body.remark || req.query.remark;
  var paramreturntime= new Date();
  console.log('요청 파라미터 : '+ paramId+', '+ paramcomment + ', ' + paramremark + ', ' + paramreturntime );

  console.log(req.uploadfile);
  if (req.file.path != "" || req.query.file.path != "") {
    var paramimagefiles = req.file.path || req.query.file.path;
  }
  var paramnumber = req.body.number || req.query.number;

  console.log('요청 파라미터 : ' + paramcomment + ', ' + paramremark + ', ' + paramreturntime + ', ' + paramimagefiles);

  var database = req.app.get('database');
  // 데이터베이스 객체가 초기화된 경우
  if (database.db) {

    // PostModel 인스턴스 생성
    var returnData = {
      id: paramId,
      comment: paramcomment,
      remark: paramremark,
      number: paramnumber,
      imagefiles: paramimagefiles,
      returntime: paramreturntime,
      return : 'Yes'
    }
    //회원 수정
    database.ReservationModel.addreturn(returnData, function(err, results) {
      if (err) {
        console.error('사용자 수정 중 에러 발생 : ' + err.stack);
        return;
      }
      if (results) {
        console.dir(results);
        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<script>alert("반납 완료!")</script>');
        res.write('<script>window.location.href="/user/profile"</script>');
        res.end();
        return;
      } else {
        //res.write('<h2>데이터베이스 연결 실패</h2>');
      }
      //res.redirect('/user/update');
    });
  }
});


// 로그인 인증
router.route('/user/login').post(passport.authenticate('local-login', {
  successRedirect : '/user/profile',
  failureRedirect : '/user/login',
  failureFlash : true
}));

// 회원가입 인증
router.route('/user/signup').post(passport.authenticate('local-signup', {
  successRedirect : '/user/profile',
  failureRedirect : '/user/signup',
  failureFlash : true
}));





router.route('/user/roomreturn').get(function(req, res) {
  console.log('/roomreturn 패스 요청됨.');
  res.render('user_roomreturn.ejs', {message: req.flash('signupMessage')});
});

//추후삭제

};
