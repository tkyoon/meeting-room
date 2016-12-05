// 모듈을 추출합니다.
var express 	= require('express');
var path 		= require('path');
var http 		= require('http');
var moment 		= require('moment');
var url 		= require( "url" );
var socketio 	= require('socket.io');
var queryString = require( "querystring" );
var seatDao 	= require('./models/seatDao.js');
var userDao 	= require('./models/userDao.js');
var reservationCtrl = require('./controllers/reservation-controller.js');

//웹 서버를 생성합니다.
var app = express();
var bodyParser = require('body-parser');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./db.js').connect();

require('./router.js').route(app);

/**
 * 사용자 정보 oracle db에서 조회
 * global.userData = {
 *      id : 'tkyoon'
 *     ,name : '윤태경'
 *     ,email : 'tkyoon@jcone.co.kr'
 */
userDao.getUser();

global.userPool = new Array();

function setUserPool(userNm){
	for (var i in global.userPool) {
		console.log(global.userPool[i]+":"+userNm);
		if(global.userPool[i] == userNm){
			console.log("@@ 로그인사용자 중복로그인!!!");
			global.io.sockets.emit('dup_user', userNm);
			global.userPool.splice(i, 1);
			break;
		}
	}
	global.userPool.push(userNm);
}

/**
 * DB에서 등록되어 있는 예약 목록 조회
 * 아이디(id), 예약여부(rev)(0:예약가능, 1:예약중, 2:예약완료), 예약자명(nm), 예약내용(cont)
 * data example)
 * allSeats = [
 * 	 date : '20160101', items : [
 * 							 {id:'b0900', rev:'2', nm:'윤태경', cont:'회의'}
 * 							,{id:'b0930', rev:'0', nm:'', cont:''}
 * 						]
 * 	,date : '20160102', items : [
 * 							 {id:'b1000', rev:'2', nm:'윤태경', cont:'회의'}
 * 							,{id:'b0930', rev:'1', nm:'천지훈', cont:''}
 * 						]
 * ];
 */
var allSeats = new Array();
function loadDataCallBack(dbData){
	allSeats = dbData;
}
reservationCtrl.list(loadDataCallBack);

function isFromLoginPage(request){
	var referer = request.headers['referer'];
	referer = referer.substring(0, referer.length-1);

//	console.log(request);
//	console.log(referer);
//	console.log(origin);

	if(referer == "http://127.0.0.1:3002"
		|| referer == "http://localhost:3002"
		|| referer == "http://dev1st.jcone.co.kr:3002" ){
		return true;

	}else {
		return false;

	}
}

function loadMain(obj){

	if(obj.e_flag == undefined){
		obj.e_flag = 'first';
	}

	var retObj = {
		 today 		: moment(Date.now()).format('YYYYMMDD')
		,today_txt 	: moment(Date.now()).format('YYYY년 MM월 DD일')
		,user_id 	: obj.inp_user_id
		,user_nm 	: obj.nm
		,e_flag 	: obj.e_flag
		,bgc	 	: obj.bgc
	};

//	console.log("obj.e_flag:" + obj.e_flag);

	//요일
	var week = new Array(' 일요일', ' 월요일', ' 화요일', ' 수요일', ' 목요일', ' 금요일', ' 토요일');
	var dayOfWeek;

	if(!obj.cur_date) {
		dayOfWeek = moment(Date.now()).format('e');
		retObj.today_txt = retObj.today_txt + week[dayOfWeek];

		retObj["cur_date"] = retObj.today;
		retObj["cur_date_txt"] = retObj.today_txt;


	} else {
		var cDate = obj.cur_date;
		dayOfWeek = moment(cDate).format('e');

		retObj["cur_date"] = cDate;
		retObj["cur_date_txt"] = cDate.substring(0, 4)+"년 " + cDate.substring(4, 6)+"월 " + cDate.substring(6, 8) +"일" + week[dayOfWeek];

	}

	if(dayOfWeek == 0){
		//일요일
		retObj["date_color"] = "#FF0000";

	}else if(dayOfWeek == 6){
		//토요일
		retObj["date_color"] = "#1200FF";

	}else{
		retObj["date_color"] = "#000000";
	}

	var curRevData = seatDao.getCurrentSeats(allSeats, retObj.cur_date);
	retObj["data"] = curRevData;
//	console.log("retObj = %j", retObj);
	return retObj;
}

function doLogin(nm){
	for(var i in global.userData){
		if(nm == global.userData[i].nm){
			return true;
		}
	}
	return false;
}
/**
 * login process by url
 */
app.post('/main', function (request, response, next) {
//	console.log(request);
	var domain = "http://127.0.0.1:3002/";
	var origin = request.headers['origin'];

//	console.log(origin);

	var nm = request.body.nm;

	if(doLogin(nm)) {
		if(isFromLoginPage(request)) {
			console.log("@@ login 성공! %j", nm);
			//console.log(global.userData);
			setUserPool(nm);
		};

		var data = loadMain(request.body);
		response.render('main', {
			param:escape(encodeURIComponent(JSON.stringify(data)))
		});

	} else {
		console.log("@@ login 실패! %j", nm);
		response.render('error', {
			msg : escape(encodeURIComponent("로그인 사용자가 존재하지 않습니다."))
		});
	}
});

/**
 * 서버 실행
 */
var server = http.createServer(app)
server.listen(3002, function () {
    console.log('Server Running Port : 3002');
});

/**
 * 소켓 서버 실행
 */
global.io = socketio.listen(server);
global.io.sockets.on('connection', function (socket) {
    socket.on('book', function (recData) {
    	console.log("@@ socket on book");
    	socket.id = recData.nm;
//    	console.log(recData);
    	seatDao.setSeats(allSeats, recData);
    	global.io.sockets.emit('book', recData);
    });

    socket.on('unbook', function (recData) {
    	console.log("@@ socket on unbook");
    	seatDao.unSetSeats(allSeats, recData);
    	global.io.sockets.emit('unbook', recData);
    });

    socket.on('booked', function (recData) {
    	console.log("@@ socket on booked");
//    	console.log(recData);
    	//예약중 삭제
    	seatDao.unSetSeats(allSeats, recData);

    	//예약완료 추가
    	seatDao.setSeats(allSeats, recData);
    	global.io.sockets.emit('booked', recData);
    });

    socket.on('cancelBook', function (recData) {
    	console.log("@@ socket on cancelBook");
//    	console.log(recData);
    	seatDao.unSetSeats(allSeats, recData);
    	global.io.sockets.emit('cancelBook', recData);
    });

    socket.on('disconnect', function (data1, data2) {
//    	console.log("Call socket disconnect!!");
//    	console.log(socket);
//    	console.log(socket.id);
    	seatDao.releaseSeats(allSeats, socket.id);
    	global.io.sockets.emit('disconnected');
    });
});

