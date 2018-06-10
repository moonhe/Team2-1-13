var Entities = require('html-entities').AllHtmlEntities;

var roomlistpost = function(req, res) {
   console.log('post 모듈 안에 있는 contactlistpost 호출됨.');

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

      database.StudyModel.list(options, function(err, results) {
         if (err) {
                console.error('문의내역 조회 중 에러 발생 : ' + err.stack);

            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>문의내역 조회 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();

                return;
            }

         if (results) {
            console.dir(results);

            // 전체 문서 객체 수 확인
            database.StudyModel.count().exec(function(err, count) {

               res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

               // 뷰 템플레이트를 이용하여 렌더링한 후 전송
               var context = {
                  title: '조회내역 목록',
                  posts: results,
                  page: parseInt(paramPage),
                  pageCount: Math.ceil(count / paramPerPage),
                  perPage: paramPerPage,
                  totalRecords: count,
                  size: paramPerPage
               };

               req.app.render('studyroomlistpost', context, function(err, html) {
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


var showroompost = function(req, res) {
   console.log('post 모듈 안에 있는 showcontactpost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

      // 1. 글 리스트
      database.StudyModel.load(paramId, function(err, results) {
         if (err) {
                console.error('내역조회 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>내역조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
            res.end();

                return;
            }

         if (results) {
            console.dir(results);

            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

            // 뷰 템플레이트를 이용하여 렌더링한 후 전송
            var context = {
               title: '내역 조회 ',
               posts: results,
               Entities: Entities
            };

            req.app.render('roomlist_info', context, function(err, html) {
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


var delroompost = function(req, res) {
   console.log('post 모듈 안에 있는 delroompost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 삭제
          database.StudyModel.remove(paramId, function(err, results) {
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
                     title: '시설 삭제 ',
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

var updateroomget = function(req, res) {
   console.log('post 모듈 안에 있는 updateroomget 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 삭제
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

                  res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

                  // 뷰 템플레이트를 이용하여 렌더링한 후 전송
                  var context = {
                     title: '예약 수정 ',
                     posts: results,
                     Entities: Entities
                  };

                  req.app.render('admin_roomupdate', context, function(err, html) {
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

var updateroompost = function(req, res) {
   console.log('post 모듈 안에 있는 updateroompost 호출됨.');

    // URL 파라미터로 전달됨
    //var paramId = req.body.id || req.query.id || req.params.id;
    var updateData = {
      id: req.body.id,
      n_facilityname: req.body.facilityname,
      n_postcode: req.body.postcode,
      n_roadnameaddress: req.body.roadnameaddress,
      n_address: req.body.address,
      n_number: req.body.number,
      n_people : req.body.people,
      n_conve : req.body.conve,
      n_endtime : req.body.endtime,
      n_starttime : req.body.starttime,
      n_imagefiles : req.body.imagefiles,
      n_intro : req.body.intro
    };
    console.log('요청 파라미터 : \n' +
      updateData['id'] + '\n' +
      updateData['n_facilityname'] + '\n' +
      updateData['n_postcode'] + '\n' +
      updateData['n_roadnameaddress'] + '\n' +
      updateData['n_address'] + '\n' +
      updateData['n_number'] + '\n' +
      updateData['n_people'] + '\n' +
      updateData['n_conve'] + '\n' +
      updateData['n_endtime'] + '\n' +
      updateData['n_starttime'] + '\n' +
      updateData['n_imagefiles'] + '\n' +
      updateData['n_intro'] + '\n'
    );


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //예약 수정
          database.StudyModel.update(updateData, function(err, results) {
               if (err) {
                      console.error('시설 조회 중 에러 발생 : ' + err.stack);

                      res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                  res.write('<h2>게시판 글 조회 중 에러 발생</h2>');
                      res.write('<p>' + err.stack + '</p>');
                  res.end();

                      return;
                  }

               if (results) {
                  console.dir(results);
                  database.StudyModel.load(updateData['id'], function(err, results) {
                     if (err) {
                            console.error('시설 조회 중 에러 발생 : ' + err.stack);

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

                        req.app.render('roomlist_info', context, function(err, html) {
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


module.exports.roomlistpost = roomlistpost;
module.exports.showroompost = showroompost;
module.exports.delroompost = delroompost;
module.exports.updateroomget = updateroomget;
module.exports.updateroompost = updateroompost;
