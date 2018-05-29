var Entities = require('html-entities').AllHtmlEntities;

module.exports = function(router, passport) {
  console.log('room 호출됨.');

  router.route('/room/info').get(function(req, res) {
    console.log('/room/info 패스 요청됨.');
    res.render('room_info.ejs', {message: req.flash('registerMessage')});
  });
}
