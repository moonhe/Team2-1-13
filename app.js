// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');
//
// Session 미들웨어 불러오기
var expressSession = require('express-session');

//===== Passport 사용 =====//
var passport = require('passport');
var flash = require('connect-flash');


// 모듈로 분리한 설정 파일 불러오기ÇÇ
var config = require('./config/config');

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// 모듈로 분리한 라우팅 파일 불러오기
var route_loader = require('./routes/route_loader');




// 익스프레스 객체 생성
var app = express();

//***멀터 모듈 등록*****
var multer = require('multer');

var _storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});

var upload = multer({storage: _storage});

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');



// //****이미지 등록
// app.get('/admin/register', function(req, res){
//   res.render('admin_register');
// });
// app.post('/admin/register', upload.single('uploadfile'), function(req, res){
//   console.log('app.js의 포스트 호출됨');
//
//   console.log('post 모듈 안에 있는 /admin/register 호출됨.');
//
//   var paramfacilityname = req.body.facilityname || req.query.facilityname;
//   var parampostcode = req.body.postcode || req.query.postcode;
//   var paramroadnameaddress = req.body.roadnameaddress || req.query.roadnameaddress;
//   var paramaddress = req.body.address || req.query.address;
//   var paramnumber = req.body.number || req.query.number;
//   var parampeople = req.body.people || req.query.people;
//   var paramconve = req.body.conve || req.query.conve;
//   var paramtime = req.body.time || req.query.time;
//   console.log('paramtime 호출됨.');
//
//   var paramimagefiles = req.file.path || req.query.file.path;
//
//   console.log( 'pramfile 호출됨.');
//
//   var paramintro = req.body.intro || req.query.intro;
//
//   console.log('요청 파라미터 : ' + paramfacilityname + ', ' + parampostcode +  ', ' + paramroadnameaddress + ', ' + paramaddress +  ', ' +
//   paramnumber + ', ' + paramconve + ', ' + paramtime + ', ' + paramimagefiles + ', ' + paramintro );
//
// var database = req.app.get('database');
//
// // 데이터베이스 객체가 초기화된 경우
// if (database.db) {
//
//   // 1. 아이디를 이용해 사용자 검색
//   database.StudyModel.findByNumber(paramnumber, function(err, results) {
//     /*
//     if (err) {
//       console.error('시설 등록 에러 : ' + err.stack);
//
//       res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//       res.write('<h2>시설 정보 추가 중 에러 발생</h2>');
//       res.write('<p>' + err.stack + '</p>');
//       res.end();
//
//       return;
//     }
//
//     if (results != undefined || results.length > 0) {
//       console.log(results);
//       res.redirect('/public/failure.html');
//       return;
//     }
//     */
//
//     // save()로 저장
//     // PostModel 인스턴스 생성
//     var post = new database.StudyModel({
//       facilityname: paramfacilityname,
//       postcode: parampostcode,
//       roadnameaddress: paramroadnameaddress,
//       address: paramaddress,
//       number: paramnumber,
//       people: parampeople,
//       conve: paramconve,
//       time: paramtime,
//       imagefiles: paramimagefiles,
//       intro: paramintro
//     });
//
//     post.savePost(function(err, result) {
//       // if (err) {
//       //     console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);
//       //     res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//       //     res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
//       //     res.write('<p>' + err.stack + '</p>');
//       //     return res.end('Error uploading your new avatar');
//       // }
//         console.log("시설 데이터 추가함.");
//
//         return res.redirect('/admin/home');
//     });
//
//   });
//
// } else {
//   res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
//   res.write('<h2>데이터베이스 연결 실패</h2>');
//   res.end();
// }
//
//
//  res.redirect('/admin/registSuccess');
// });






//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);


// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
   secret:'my key',
   resave:true,
   saveUninitialized:true
}));



//===== Passport 사용 설정 =====//
// Passport의 세션을 사용할 때는 그 전에 Express의 세ㅌ4션을 사용하는 코드가 있어야 함
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//라우팅 정보를 읽어들여 라우팅 설정
var router = express.Router();
route_loader.init(app, router);


// 패스포트 설정
var configPassport = require('./config/passport');
configPassport(app, passport);

// 패스포트 라우팅 설정
var userPassport = require('./routes/user_passport');
userPassport(router, passport);
var adminPassport = require('./routes/admin_passport');
adminPassport(router, passport);


//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
   console.log('uncaughtException 발생함 : ' + err);
   console.log('서버 프로세스 종료하지 않고 유지함.');

   console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
   console.log("Express 서버 객체가 종료됩니다.");
   if (database.db) {
      database.db.close();
   }
});

// 시작된 서버 객체를 리턴받도록 합니다.
var server = http.createServer(app).listen(app.get('port'), function(){
   console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

   // 데이터베이스 초기화
   database.init(app, config);

});
