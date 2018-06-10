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
		endtime: { type: String, trim: true, 'default': '' },				//시간
		starttime: { type: String, trim: true, 'default': '' },				//시간
		imagefiles: { type: String, trim: true, 'default': '' },		//이미지
		intro: { type: String, trim: true, 'default': '' }  		//소개
	});

	// 필수 속성에 대한 'required' validation
	StudySchema.path('facilityname').required(true, '글 제목을 입력하셔야 합니다.');
	StudySchema.path('number').required(true, '글 제목을 입력하셔야 합니다.');
	StudySchema.path('imagefiles').required(true, '글 제목을 입력하셔야 합니다.');
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

	StudySchema.methods = {
		savePost: function (callback) {		// 글 저장
			var self = this;

			this.validate(function (err) {
				if (err) return callback(err);

				self.save(callback);
			});
		},
		addComment: function (user, comment, callback) {		// 댓글 추가
			this.comment.push({
				contents: comment.contents,
				writer: user._id
			});

			this.save(callback);
		},
		removeComment: function (id, callback) {		// 댓글 삭제
			var index = utils.indexOf(this.comments, { id: id });
			if (~index) {
				this.comments.splice(index, 1);
			} else {
				return callback('ID [' + id + '] 를 가진 댓글 객체를 찾을 수 없습니다.');
			}

			this.save(callback);
		}
	}



	StudySchema.statics = {
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
		remove: function (id, callback){
			this.deleteOne({ _id: id })
			.exec(callback);
		},
		findByFacilityname: function (paramFacilityname, callback) { //find? findOne?
			this.find({ facilityname: {$regex : paramFacilityname['n_inputcon']} })
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		findByAddress: function (paramAddress, callback) { //find? findOne?
			this.find({ roadnameaddress:{$regex : paramAddress['n_inputcon']} })
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		findByPeople: function (paramPeople, callback) { //find? findOne?
	console.log('수용 인원 find 쿼리 호출됨');
			this.find({ people: paramPeople['n_inputcon']  })
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		findByConve: function (paramConve, callback) { //find? findOne?
			this.find({ conve : {$regex : paramConve['n_inputcon']} })
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		}
	}

	StudySchema.static('findByNumber', function(paramnumber, callback) {
		return this.find({address:paramnumber}, callback);
	});

	console.log('StudySchema 정의함.');

	return StudySchema;
};

// module.exports에 PostSchema 객체 직접 할당
module.exports = SchemaObj;
