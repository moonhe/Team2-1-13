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

var listpost = function(req, res) {
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

		database.StudyModel.list(options, function(err, results) {
			if (err) {
                console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();

                return;
            }

			if (results) {

				// 전체 문서 객체 수 확인
				database.StudyModel.count().exec(function(err, count) {

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

					req.app.render('listpost', context, function(err, html) {
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


var showpost = function(req, res) {
	console.log('post 모듈 안에 있는 showpost 호출됨.');

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

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

				// 뷰 템플레이트를 이용하여 렌더링한 후 전송
				var context = {
					title: '글 조회 ',
					posts: results,
					Entities: Entities
				};

				req.app.render('room_info', context, function(err, html) {
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



var searchroomget = function(req, res) {
   console.log('roompost 모듈 안에 있는 searchroomget 호출됨!!!!');
    // URL 파라미터로 전달됨
  //var paramCon = req.body.con || req.query.con || req.params.con;
    console.log('요청 파라미터 : ' + paramCon);
   var database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우
   if (database.db) {

         //시설 찾기
          database.StudyModel.load(paramCon, function(err, results) {
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
                     title: '시설 검색 ',
                     posts: results,
                     Entities: Entities
                  };

                  req.app.render('user_roomsearch.ejs', context, function(err, html) {
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

var searchroompost = function(req, res) {
   console.log('roompost 모듈 안에 있는 searchroompost 호출됨~~~');


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

       database.StudyModel.list(options, function(err, results) {
          if (err) {
                 console.error('게시판 글 목록 조회 중 에러 발생 : ' + err.stack);

                 res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
             res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');
                 res.write('<p>' + err.stack + '</p>');
             res.end();

                 return;
             }

          if (results) {
             // 전체 문서 객체 수 확인
             database.StudyModel.count().exec(function(err, count) {

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

								// 스터디룸 검색 조건 설정
								var selcon = req.body.selcon;

                  var searchData = {
                  n_inputcon: req.body.inputcon
                  };
									console.log('선택된 검색 조건:' + selcon);
									console.log('입력된 검색 조건 :' +searchData['n_inputcon']);

									if(selcon == "시설 이름"){
                    // 예약자 이름으로 검색
                    database.StudyModel.findByFacilityname(searchData, function(err, results) {
                           var context = {
                              title: '시설 목록',
                              posts: results,
                              page: parseInt(paramPage),
                              pageCount: Math.ceil(count / paramPerPage),
                              perPage: paramPerPage,
                              totalRecords: count,
                              size: paramPerPage
                           };
                            console.dir('시설 이름 검색 결과 출력: ');
                            console.dir(results);

                            req.app.render('user_roomsearch', context, function(err, html) {
                               res.end(html);
                            });
                   });
                 }
                 else if(selcon == "시설 주소"){
                   database.StudyModel.findByAddress(searchData, function(err, results) {
                          var context = {
                             title: '시설 목록',
                             posts: results,
                             page: parseInt(paramPage),
                             pageCount: Math.ceil(count / paramPerPage),
                             perPage: paramPerPage,
                             totalRecords: count,
                             size: paramPerPage
                          };
                           console.dir('시설 주소 검색 결과 출력: ');
                           console.dir(results);

                           req.app.render('user_roomsearch', context, function(err, html) {
                              res.end(html);
                           });
                  });
                 }
								 else if(selcon == "수용 인원"){
									 database.StudyModel.findByPeople(searchData, function(err, results) {
													var context = {
														 title: '시설 목록',
														 posts: results,
														 page: parseInt(paramPage),
														 pageCount: Math.ceil(count / paramPerPage),
														 perPage: paramPerPage,
														 totalRecords: count,
														 size: paramPerPage
													};
													 console.dir('수용 인원 검색 결과 출력: ');
													 console.dir(results);

													 req.app.render('user_roomsearch', context, function(err, html) {
															res.end(html);
													 });
									});
								 }
								 else if(selcon == "편의 시설"){
									 database.StudyModel.findByConve(searchData, function(err, results) {
													var context = {
														 title: '시설 목록',
														 posts: results,
														 page: parseInt(paramPage),
														 pageCount: Math.ceil(count / paramPerPage),
														 perPage: paramPerPage,
														 totalRecords: count,
														 size: paramPerPage
													};
													 console.dir('편의 검색 결과 출력: ');
													 console.dir(results);

													 req.app.render('user_roomsearch', context, function(err, html) {
															res.end(html);
													 });
									});
								 }
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


module.exports.listpost = listpost;
module.exports.addpost = addpost;
module.exports.showpost = showpost;
module.exports.searchroomget = searchroomget;
module.exports.searchroompost = searchroompost;
