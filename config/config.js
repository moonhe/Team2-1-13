
module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
		{file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
		,{file:'./admin_schema', collection:'admin', schemaName:'AdminSchema', modelName:'AdminModel'}
		,{file:'./post_schema', collection:'post', schemaName:'PostSchema', modelName:'PostModel'}
		,{file:'./studyroom_schema', collection:'studyroom', schemaName:'StudySchema', modelName:'StudyModel'}
		,{file:'./reservation_schema', collection:'reservation', schemaName:'ReservationSchema', modelName:'ReservationModel'}
		,{file:'./contactDev_schema', collection: 'contactDev', schemaName:'ContactDevSchema', modelName:'ContactDevModel'}
	],
	route_info: [
		{file:'./post', path:'/process/addpost', method:'addpost', type:'post'}
		,{file:'./post', path:'/user/search/:id', method:'showpost', type:'get'}
		,{file:'./post', path:'/user/search', method:'listpost', type:'post'}
		,{file:'./post', path:'/user/search', method:'listpost', type:'get'}
		,{file:'./post', path:'/user/roomsearch', method:'searchroompost', type:'post'}
		,{file:'./post', path:'/user/roomsearch', method:'searchroomget', type:'get'}
		,{file:'./post', path:'/user/roomsearch', method:'searchroomget', type:'post'}
		,{file:'./post', path:'/user/roomsearch', method:'searchroomget', type:'get'}
		,{file:'./revpost', path:'/admin/revlist/:id', method:'showrevpost', type:'get'}
		,{file:'./revpost', path:'/user/revlist/:id', method:'showrevpost', type:'get'}
		,{file:'./revpost', path:'/user/roomreturn/:id', method:'showroomreturn', type:'get'}
		,{file:'./revpost', path:'/admin/deleteuser/:id', method:'delrevpost', type:'get'}
		,{file:'./revpost', path:'/admin/revlist', method:'revpost', type:'post'}
		,{file:'./revpost', path:'/admin/revlist', method:'revpost', type:'get'}
		,{file:'./revpost', path:'/admin/updateuser/:id', method:'updaterevget', type:'get'}
		,{file:'./revpost', path:'/admin/updateuser', method:'updaterevpost', type:'post'}
		,{file:'./revpost', path:'/admin/revsearch/', method:'searchrevget', type:'get'}
		,{file:'./revpost', path:'/admin/revsearch', method:'searchrevpost', type:'post'}
		,{file:'./contactDev', path:'/admin/contactlist', method:'contactlistpost', type:'post'}
		,{file:'./contactDev', path:'/admin/contactlist', method:'contactlistpost', type:'get'}
		,{file:'./contactDev', path:'/admin/contactlist/:id', method:'showcontactpost', type:'get'}
		,{file:'./roompost', path:'/admin/roomlist', method:'roomlistpost', type:'get'}
		,{file:'./roompost', path:'/admin/roomlist', method:'roomlistpost', type:'post'}
		,{file:'./roompost', path:'/admin/roomlist/:id', method:'showroompost', type:'get'}
		,{file:'./roompost', path:'/admin/deleteroom/:id', method:'delroompost', type:'get'}
		,{file:'./roompost', path:'/admin/updateroom/:id', method:'updateroomget', type:'get'}
		,{file:'./roompost', path:'/admin/updateroom', method:'updateroompost', type:'post'}
		,{file:'./returnpost', path:'/user/return/:id', method:'usershowreturnstatus', type:'get'}
		,{file:'./returnpost', path:'/admin/returnlist', method:'returnlistpost', type:'post'}
		,{file:'./returnpost', path:'/admin/returnlist', method:'returnlistpost', type:'get'}
		,{file:'./returnpost', path:'/admin/returnlist/:id', method:'showreturnstatus', type:'get'}
	]
}
