/**
* 패스포트 라우팅 함수 정의
*
* @date 2016-11-10
* @author Mike
*/

module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');

    // 홈 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');

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
             res.render('user_login.ejs', {message: req.flash('loginMessage')});
         } else {
             console.log('사용자 인증된 상태임.');
             console.log('/user/profile 패스 요청됨.');
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

    //개발자 문의 화면
    router.route('/user/contactDev').get(function(req, res) {
        console.log('/contactDev 패스 요청됨.');
        res.render('user_contactDev.ejs', {message: req.flash('')});
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

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);
        // 인증 안된 경우
        if (!req.user) {
        //if(!req.user[1].auth != 'auth'){
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/user/login');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profile 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('user_profile.ejs', {user: req.user[0]._doc});
            } else {
                res.render('user_profile.ejs', {user: req.user});
            }
        }
    });

    // 로그아웃
    router.route('/user/logout').get(function(req, res) {
        console.log('/user/logout 패스 요청됨.');
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
      res.redirect('/');
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
                  user_name = session_obj.auth_name;
                  user_phone = session_obj.auth_phone;
                  user_birth = session_obj.auth_birth;
                  user_gender = session_obj.auth_gender;
                  user_postcode = session_obj.auth_postcode;
                  user_roadnameaddress = session_obj.auth_roadnameaddress;
                  user_address = session_obj.auth_address;
                  var context = {
                     title: '사용자 수정 ',
                     posts: results,
                     //Entities: Entities,
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
                n_birth: req.body.birth,
                n_gender: req.body.gender,
                n_phone: req.body.phone,
                n_postcode: req.body.postcode,
                n_roadnameaddress: req.body.roadnameaddress,
                n_address: req.body.address
              };
              console.log('요청 파라미터 : \n' +
                updateData['id'] + '\n' +
                updateData['n_username'] + '\n' +
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
/*
                        // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                        session_obj = req.session;
                        user_name = session_obj.auth_name;
                        user_phone = session_obj.auth_phone;
                        user_birth = session_obj.auth_birth;
                        user_gender = session_obj.auth_gender;
                        user_postcode = session_obj.auth_postcode;
                        user_roadnameaddress = session_obj.auth_roadnameaddress;
                        user_address = session_obj.auth_address;
                        var context = {
                           title: '사용자 수정 ',
                           posts: results,
                           //Entities: Entities,
                           user_name: user_name,
                           user_phone: user_phone,
                           user_birth: user_birth,
                           user_gender: user_gender,
                           user_postcode: user_postcode,
                           user_roadnameaddress: user_roadnameaddress,
                           user_address: user_address
                        };
*/

                    database.ReservationModel.load(updateData['id'], function(err, results) {
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

                          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

      // 뷰 템플레이트를 이용하여 렌더링한 후 전송
      var context = {
         title: '회원 수정 ',
         posts: results,
         Entities: Entities
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
                        res.render('user_profile.ejs', context);
                     } else {}
                  });

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

};
