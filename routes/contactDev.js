var Entities = require('html-entities').AllHtmlEntities;

var contactlistpost = function(req, res) {
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

      database.ContactDevModel.list(options, function(err, results) {
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
            database.ContactDevModel.count().exec(function(err, count) {

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

               req.app.render('contactlistpost', context, function(err, html) {
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


var showcontactpost = function(req, res) {
   console.log('post 모듈 안에 있는 showcontactpost 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.body.id || req.query.id || req.params.id;

    console.log('요청 파라미터 : ' + paramId);


   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

      // 1. 글 리스트
      database.ContactDevModel.load(paramId, function(err, results) {
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

            req.app.render('con_info', context, function(err, html) {
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

module.exports.contactlistpost = contactlistpost;
module.exports.showcontactpost = showcontactpost;
