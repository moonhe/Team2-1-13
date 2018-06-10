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

/////
var showroomreturn = function(req, res) {
   console.log('post 모듈 안에 있는 roomreturn 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);




   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

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

            req.app.render('user_roomreturn', context, function(err, html) {
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
   console.log('post 모듈 안에 있는 updaterevpost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 삭제
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
                     title: '예약 수정 ',
                     posts: results,
                     Entities: Entities
                  };

                  req.app.render('user_revupdate', context, function(err, html) {
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

var updaterevpost = function(req, res) {
   console.log('post 모듈 안에 있는 updaterevpost 호출됨.');

    // URL 파라미터로 전달됨
    //var paramId = req.body.id || req.query.id || req.params.id;
    var updateData = {
      id: req.body.id,
      n_facilityname: req.body.facilityname,
      n_starttime: req.body.starttime,
      n_endtime: req.body.endtime,
      n_username: req.body.username,
      n_phone: req.body.phone
    };
    console.log('요청 파라미터 : \n' +
      updateData['id'] + '\n' +
      updateData['n_facilityname'] + '\n' +
      updateData['n_starttime'] + '\n' +
      updateData['n_endtime'] + '\n' +
      updateData['n_username'] + '\n' +
      updateData['n_phone'] + '\n'
    );


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 수정
          database.ReservationModel.update(updateData, function(err, results) {
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



var searchrevget = function(req, res) {
   console.log('revpost 모듈 안에 있는 searchrevget 호출됨!!!!');

    // URL 파라미터로 전달됨
    // var paramCon = req.body.con || req.query.con || req.params.con;

    console.log('요청 파라미터 : ' + paramCon);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 삭제
          database.ReservationModel.load(paramCon, function(err, results) {
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
                     title: '예약 검색 ',
                     posts: results,
                     Entities: Entities
                  };

                  req.app.render('admin_revsearch', context, function(err, html) {
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

var searchrevpost = function(req, res) {
   console.log('revpost 모듈 안에 있는 searchrevpost 호출됨~~~');


       var paramPage = req.body.page || req.query.page;
       var paramPerPage = req.body.perPage || req.query.perPage;

       console.log('요청 파라미터 : ' + paramPage + ', ' + paramPerPage);

      var database = req.app.get('database');


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


                // 예약 검색 조건 설정
                var selcon = req.body.selcon;
                  var searchData = {
                  n_inputcon: req.body.inputcon
                  };
                  console.log('선택된 검색 조건:' + selcon);
                  console.log('입력된 검색 조건 :' +searchData['n_inputcon']);

                // 조건에 따른 검색 메소드 호출
                  if(selcon == "예약자 이름"){
                    // 예약자 이름으로 검색
                    database.ReservationModel.findByUsername(searchData, function(err, results) {
                           var context = {
                              title: '예약 목록',
                              posts: results,
                              page: parseInt(paramPage),
                              pageCount: Math.ceil(count / paramPerPage),
                              perPage: paramPerPage,
                              totalRecords: count,
                              size: paramPerPage
                           };
                            console.dir('예약자 이름 검색 결과 출력: ');
                            console.dir(results);

                            req.app.render('admin_revsearch', context, function(err, html) {
                               res.end(html);
                            });
                   });
                 }
                 else if(selcon == "시설 이름"){
                   database.ReservationModel.findByFacilityname(searchData, function(err, results) {
                          var context = {
                             title: '예약 목록',
                             posts: results,
                             page: parseInt(paramPage),
                             pageCount: Math.ceil(count / paramPerPage),
                             perPage: paramPerPage,
                             totalRecords: count,
                             size: paramPerPage
                          };
                           console.dir('시설 이름 검색 결과 출력: ');
                           console.dir(results);

                           req.app.render('admin_revsearch', context, function(err, html) {
                              res.end(html);
                           });
                  });
                 }
             });
       });
    } else {
       res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
       res.write('<h2>데이터베이스 연결 실패</h2>');
       res.end();
  }

};

var returnget = function(req, res) {
  console.log('/user/return get 패스 요청됨.');

  var paramId = req.body.curFacilityname|| req.query.curFacilityname || req.params.curFacilityname;

  console.log(paramID);

  var database = req.app.get('database');
  if (database.db) {
    database.ReservationModel.load(paramId, function(err, results) {
        if (err) {
          console.error('에앾 조회 중 에러 발생 : ' + err.stack);
          return;
        }
        if (results) {
          //console.dir(results);
          //user_email = session_obj.auth_email;
          // 뷰 템플레이트를 이용하여 렌더링한 후 전송

          var context = {
            user: req.user,
            title: '예약 조회',
            posts: results,
          }
          res.render('user_return.ejs', context);
        }
      });

    }
};



module.exports.revpost = revpost;
module.exports.addpost = addpost;
module.exports.showrevpost = showrevpost;
module.exports.showroomreturn = showroomreturn;
module.exports.delrevpost = delrevpost;
module.exports.updaterevget = updaterevget;
module.exports.updaterevpost = updaterevpost;
module.exports.searchrevget = searchrevget;
module.exports.searchrevpost = searchrevpost;
module.exports.returnget = returnget;
