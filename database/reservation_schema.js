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

  var ReservationSchema = mongoose.Schema({
    date: { type: String, trim: true, 'default':''},  //날짜
    starttime: { type: String, trim: true, 'default': '' },      //시작 시간
    endtime: { type: String, trim: true, 'default': '' },            //종료시간
    facilityname: { type: String, trim: true, 'default': '' },      // 시설 이름
    username: { type: String, trim: true, 'default': '' },      // 예약자 이름
    phone: { type: String, trim: true, 'default': '' },      // 예약자 전화번호
    email: { type: String, trim: true, 'default': '' }, // 예약자 이메일 정보 저장
  	return: { type: String, trim: true, 'default': 'No' },			//소개
    returntime : { // 반납 시간 = 현재 시간 저장
       type : Date,
       default : ''
     },
    //starttime: { type: String, trim: true, 'default': '' },      //시작 시간
    //endtime: { type: String, trim: true, 'default': '' },            //종료시간
    email: { type: String, trim: true, 'default': '' },
    comment: { type: String, trim: true, 'default': '' },      // 시설 이름
    remark: { type: String, trim: true, 'default': '' },      // 예약자 이름
    imagefiles: { type: String, trim: true, 'default': '' },		// 반납 이미지
    number: { type: String, trim: true, 'default': '' }
  });

  // 필수 속성에 대한 'required' validation
  // ReservationSchema.path('username').required(true, '예약자 이름을 입력하셔야 합니다.');
  // ReservationSchema.path('reservedate').required(true, '예약 날짜를 입력하셔야 합니다.');
  //   StudySchema.path('imagefiles').required(true, '글 제목을 입력하셔야 합니다.');
  // 스키마에 인스턴스 메소드 추가
  ReservationSchema.methods = {
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

  ReservationSchema.statics = {
    // ID로 글 찾기
    load: function (id, callback) {
      this.findOne({ _id: id })
      .populate('writer', 'name provider email')
      .populate('comments.writer')
      .exec(callback);
    },
    list: function (options, callback) {
      var criteria = options.criteria || {};
      this.find(criteria)
      .populate('writer', 'name provider email')
      .sort({ 'created_at': -1 })
      .limit(Number(options.perPage))
      .skip(options.perPage * options.page)
      .exec(callback);
    },
    loadbyemail: function (paramEmail, callback) {
      this.find({ email: paramEmail })
      .exec(callback);
    },
    loadbyemailTime: function (paramEmail, callback) {
      this.find({ email: paramEmail })
      .where('returntime').ne(null)
      .exec(callback);
    },
    loadbyid: function (paramId, callback) {
      this.find({ _id: paramId })
      .exec(callback);
    },
    remove: function (id, callback){
      this.deleteOne({ _id: id })
      .exec(callback);
    },
    update: function (updateData, callback){
      this.updateOne({_id: updateData['id']}, {
        $set:
        {username: updateData['n_username'],
        facilityname: updateData['n_facilityname'],
        starttime: updateData['n_starttime'],
        endtime: updateData['n_endtime'],
        phone: updateData['n_phone']
      }}).exec(callback);
    },
    addreturn: function (returnData, callback){
      this.updateOne({_id: returnData['id']}, {
        $set:
        {comment: returnData['comment'],
        remark: returnData['remark'],
        number: returnData['number'],
        imagefiles: returnData['paramimagefiles'],
        return: returnData['return']
      }}).exec(callback);
    },
    findByUsername: function (paramUsername, callback) { //find? findOne?
      this.find({ username: {$regex : paramUsername['n_inputcon']} })
      .populate('writer', 'name provider email')
      .populate('comments.writer')
      .exec(callback);
    },
    findByFacilityname: function (paramFacilityname, callback) { //find? findOne?
      this.find({ facilityname: {$regex : paramFacilityname['n_inputcon']} })
      .populate('writer', 'name provider email')
      .populate('comments.writer')
      .exec(callback);
    }
  }

  console.log('ReservationSchema 정의함.');

  return ReservationSchema;
};

// module.exports에 PostSchema 객체 직접 할당
module.exports = SchemaObj;
