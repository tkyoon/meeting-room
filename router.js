var reservationCtrl = require('./controllers/reservation-controller.js');

// exports route function for app.js, take express() as argument
exports.route = function(app){
	/**
	 *
	 */
//	app.get('/getTask', taskCtrl.list);
//	app.get('/deleteTask', taskCtrl.remove);
//	app.get('/putTask', taskCtrl.update);
//	console.log(app);
	app.post('/postReservation', reservationCtrl.add);
	app.post('/delReservation', reservationCtrl.remove);
	app.post('/sendMail', reservationCtrl.sendMail);
	//app.get('/getReservation', reservationCtrl.list);

	/**
	 * TODO
	 * login 페이지 gw연동시에는 필요치 않음
	 */
	app.get('/', function (request, response, next) {
		response.render('login', {});
	});

	app.get('/error', function (request, response, next) {
		response.render('error', {msg : '같은 ID로 로그인됐습니다. 이미 로그인한 사용자는 로그아웃합니다!'});
	});
};

