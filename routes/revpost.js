var Entities = require('html-entities').AllHtmlEntities;


var addpost = function(req, res) {
   console.log('post 모듈 안에 있는 addpost 호출됨.');

    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.body.writer || req.query.writer;

    console.log('요청 파라미터 : ' + paramTitle + ', ' + paramContents + ', ' +
               paramWriter);

   var database = req.app.get('database');

   // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

      // 1. 아이디를 이용해 사용자 검색
      database.UserModel.findByEmail(paramWriter, function(err, results) {
         if (err) {
                console.error('게시판 글 추가 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>게시판 글 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
            res.end();

                return;
            }

         if (results == undefined || results.length < 1) {
            res.redirect('/public/failure.html');
            return;
         }

         var userObjectId = results[0]._doc._id;
         console.log('사용자 ObjectId : ' + paramWriter +' -> ' + userObjectId);

         // save()로 저장
         // PostModel 인스턴스 생성
         var post = new database.PostModel({
            title: paramTitle,
            contents: paramContents,
            writer: userObjectId
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

             console.log("글 데이터 추가함.");
             console.log('글 작성', '포스팅 글을 생성했습니다. : ' + post._id);

             return res.redirect('/process/showpost/' + post._id);
         });

      });

   } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
   }

};

var revpost = function(req, res) {
   console.log('post 모듈 안에 있는 listpost 호출됨.');

    var paramPage = req.body.page || req.query.page;
    var paramPerPage = req.body.perPage || req.query.perPage;

    console.log('요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {
      // 1. 글 리스트
      var options = {
         page: paramPage,
         perPage: paramPerPage
      }

      database.ReservationModel.list(options, function(err, results) {
         if (err) {
                console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
            res.end();

                return;
            }

         if (results) {
            console.dir(results);

            // 전체 문서 객체 수 확인
            database.ReservationModel.count().exec(function(err, count) {

               res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

               // 뷰 템플레이트를 이용하여 렌더링한 후 전송
               var context = {
                  title: '글 목록',
                  posts: results,
                  page: parseInt(paramPage),
                  pageCount: Math.ceil(count / paramPerPage),
                  perPage: paramPerPage,
                  totalRecords: count,
                  size: paramPerPage
               };

               req.app.render('revpost', context, function(err, html) {
                        if (err) {
                            console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                            res.write('<p>' + err.stack + '</p>');
                            res.end();

                            return;
                        }

                  res.end(html);
               });

            });

         } else {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>글 목록 조회  실패</h2>');
            res.end();
         }
      });
   } else {
      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
      res.write('<h2>데이터베이스 연결 실패</h2>');
      res.end();
   }

};


var showrevpost = function(req, res) {
   console.log('post 모듈 안에 있는 showpost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {
/*
         //예약 삭제
          database.ReservationModel.remove(paramId, function(err, results) {
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
                     title: '예약 삭제 ',
                     posts: results,
                     Entities: Entities
                  };

                  req.app.render('admin_index', context, function(err, html) {
                     if (err) {
                              console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                              res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                              res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                              res.write('<p>' + err.stack + '</p>');
                              res.end();

                              return;
                          }

                     console.log('응답 웹문서 : ' + html);
                     res.end(html);
                  });

               } else {
                  res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                  res.write('<h2>글 조회  실패</h2>');
                  res.end();
               }
            });
*/

      // 1. 글 리스트
      database.ReservationModel.load(paramId, function(err, results) {
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
               title: '글 조회 ',
               posts: results,
               Entities: Entities
            };

            req.app.render('rev_info', context, function(err, html) {
               if (err) {
                        console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();

                        return;
                    }

               console.log('응답 웹문서 : ' + html);
               res.end(html);
            });

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

};

var delrevpost = function(req, res) {
   console.log('post 모듈 안에 있는 delrevpost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 삭제
          database.ReservationModel.remove(paramId, function(err, results) {
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
                     title: '예약 삭제 ',
                     posts: results,
                     Entities: Entities
                  };

                  req.app.render('admin_index', context, function(err, html) {
                     if (err) {
                              console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                              res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                              res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                              res.write('<p>' + err.stack + '</p>');
                              res.end();

                              return;
                          }

                     console.log('응답 웹문서 : ' + html);
                     res.end(html);
                  });

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

};


var updaterevget = function(req, res) {


}
/*
var updaterevpost = function(req, res) {
   console.log('post 모듈 안에 있는 updaterevpost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 삭제
          database.ReservationModel.update(paramId, function(err, results) {
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
                     title: '예약 수정 ',
                     posts: results,
                     Entities: Entities
                  };

                  req.app.render('admin_index', context, function(err, html) {
                     if (err) {
                              console.error('응답 웹문서 생성 중 에러 발생 : ' + err.stack);

                              res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                              res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                              res.write('<p>' + err.stack + '</p>');
                              res.end();

                              return;
                          }

                     console.log('응답 웹문서 : ' + html);
                     res.end(html);
                  });

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

};
*/


module.exports.revpost = revpost;
module.exports.addpost = addpost;
module.exports.showrevpost = showrevpost;
module.exports.delrevpost = delrevpost;
//module.exports.updaterevpost = updaterevpost;
