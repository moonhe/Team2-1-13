/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */
 //등록
var Entities = require('html-entities').AllHtmlEntities;


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


    //등록
    router.route('/admin/register').post(function(req, res){
      console.log('post 모듈 안에 있는 /admin/register 호출됨.');

        var paramfacilityname = req.body.facilityname || req.query.facilityname;
        var paramnumber = req.body.number || req.query.number;

        console.log('요청 파라미터 : ' + paramfacilityname + ', ' + paramnumber);

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
            number: paramnumber
    			});

    			post.savePost(function(err, result) {
    				if (err) {
                        if (err) {
                            console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();
                            return;
                        }
                    }
    			    console.log("시설 데이터 추가함.");

    			    return res.redirect('/admin/home');
    			});

    		});

    	} else {
    		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    		res.write('<h2>데이터베이스 연결 실패</h2>');
    		res.end();
    	}
    });
};
