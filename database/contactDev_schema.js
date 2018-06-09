/**
* 게시판을 위한 데이터베이스 스키마를 정의하는 모듈
*
* @date 2016-11-10
* @author Mike
*/

var utils = require('../utils/utils');

var SchemaObj = {};

SchemaObj.createSchema = function (mongoose) {

  // 글 스키마 정의

  var ContactDevSchema = mongoose.Schema({
    writer: { type: String, trim: true, 'default': '' },      //시작 시간
    kind: { type: String, trim: true, 'default': '' },            //종료시간
    title: { type: String, trim: true, 'default': '' },      // 시설 이름
    content: { type: String, trim: true, 'default': '' }
  });

  // 필수 속성에 대한 'required' validation
  // ReservationSchema.path('username').required(true, '예약자 이름을 입력하셔야 합니다.');
  // ReservationSchema.path('reservedate').required(true, '예약 날짜를 입력하셔야 합니다.');
  //   StudySchema.path('imagefiles').required(true, '글 제목을 입력하셔야 합니다.');
  // 스키마에 인스턴스 메소드 추가
  ContactDevSchema.methods = {
    savePost: function (callback) {      // 글 저장
      var self = this;

      this.validate(function (err) {
        if (err) return callback(err);

        self.save(callback);
      });
    },
    addComment: function (user, comment, callback) {      // 댓글 추가
      this.comment.push({
        contents: comment.contents,
        writer: user._id
      });

      this.save(callback);
    },
    removeComment: function (id, callback) {      // 댓글 삭제
      var index = utils.indexOf(this.comments, { id: id });
      if (~index) {
        this.comments.splice(index, 1);
      } else {
        return callback('ID [' + id + '] 를 가진 댓글 객체를 찾을 수 없습니다.');
      }

      this.save(callback);
    }
  }

  ContactDevSchema.statics = {
    // ID로 글 찾기
    load: function (id, callback) {
      this.findOne({ _id: id })
      .exec(callback);
    },
    list: function (options, callback) {
      var criteria = options.criteria || {};
      this.find(criteria)
      .sort({ 'created_at': -1 })
      .limit(Number(options.perPage))
      .skip(options.perPage * options.page)
      .exec(callback);
    },
    remove: function (id, callback){
      this.deleteOne({ _id: id })
      .exec(callback);
    }
  }

  console.log('ReservationSchema 정의함.');

  return ContactDevSchema;
};

// module.exports에 PostSchema 객체 직접 할당
module.exports = SchemaObj;
