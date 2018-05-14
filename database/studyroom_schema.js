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

	var StudySchema = mongoose.Schema({
		facilityname: { type: String, trim: true, 'default': '' },		// 명칭
		postcode: { type: String, trim: true, 'default': '' },			 // 우편번호
		roadnameaddress: { type: String, trim: true, 'default': '' },	//도로명주소
		address: { type: String, trim: true, 'default': '' },				//상세주소
		number: { type: String, trim: true, 'default': '' },				//전화번호
		people: { type: Number, trim: true, 'default': '' },					//인원수
		conve: { type: String, trim: true, 'default': '' },				//편의시설
		time: { type: String, trim: true, 'default': '' },				//시간
		imagefiles: { type: String, trim: true, 'default': '' },		//이미지
		intro: { type: String, trim: true, 'default': '' }			//소개
	});

	// 필수 속성에 대한 'required' validation
	StudySchema.path('facilityname').required(true, '글 제목을 입력하셔야 합니다.');
	StudySchema.path('number').required(true, '글 제목을 입력하셔야 합니다.');
//	StudySchema.path('imagefiles').required(true, '글 제목을 입력하셔야 합니다.');
	// 스키마에 인스턴스 메소드 추가
	StudySchema.methods = {
		savePost: function (callback) {		// 글 저장
			var self = this;

			this.validate(function (err) {
				if (err) return callback(err);

				self.save(callback);
			});
		}
	};

	StudySchema.static('findByNumber', function(paramnumber, callback) {
		return this.find({address:paramnumber}, callback);
	});
	console.log('StudySchema 정의함.');

	return StudySchema;
};

// module.exports에 PostSchema 객체 직접 할당
module.exports = SchemaObj;
