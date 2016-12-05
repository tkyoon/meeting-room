var reservationDao = require('../models/reservationDao.js');
var mailObj = require('../mail/mail.js');

/**
 * reservation 등록
 */
exports.add = function(req, res) {
	console.log("@@ 회의실 예약등록이 호출되었습니다.");
	var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

	new reservationDao({
		 date	 	: req.body.date
		,id		 	: req.body.id
		,nm		 	: req.body.nm
		,cont	 	: req.body.cont
		,regIp		: ip
	}).save(function(err, obj) {

		if(err){
			console.log(err);

		}else{
			/**
			//저장이 완료되면 메일 발송
			var nm = obj.chrgr;

			var qObj = userDao.find();
			if(nm != "" && nm != undefined) {
				qObj = qObj.and({ 'nm': nm });
			}else{

			}

			qObj.sort({nm:1})
			.exec(function(err, user){
				if(err){
					conole.log(err);

				}else{
					console.log("user: %j", user);
					console.log("user0: %j", user[0]);
					mailObj.sendEmail(nm+' <'+user[0].email+'>', obj.subject, obj.contents, obj.fromDd+' - ' + obj.toDd);

				}
			});
			*/
		}

		//Allow-Methods setting
		res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
		res.setHeader("Access-Control-Allow-Origin", "*");
//		console.log("Saved reservation Obj:%j", obj);
		res.json([{result :  true, message : "등록하였습니다."}, obj]);
	});
};

/**
 * reservation 삭제
 */
exports.remove = function(req, res) {
	console.log("@@ reservation 삭제 호출되었습니다.");
	var id = req.body.id;
	var date = req.body.date;
//	console.log(id);
//	console.log(date);
	if(id == null || id == ""){
		res.json({message : '삭제할 id를 전달받지 못했습니다.'});
		return;
	}

	reservationDao.remove({
		id : id
		,date : date
	}, function(err, obj) {
		res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
		res.setHeader("Access-Control-Allow-Origin", "*");

		if (err){
			res.send(err);

		}else{
//			console.log("Remove reservation: %j", obj);
			res.json([{result :  true, message : "삭제하였습니다."}, obj]);
		}
	});
};


/**
 * reservation 목록
 */
exports.list = function(callBackFn) {
	var allSeats = [];
//	console.log("@@ load Reservation db data!!!");
//	var taskDiv = req.query.taskDiv;
//	var chrgr = req.query.chrgr;

//	console.log(taskDiv);
//	console.log(chrgr);
	var qObj = reservationDao.find();

	qObj.sort({date:1})
	.exec(function(err, dbObj) {
		//console.log("reservations: %j", dbObj);

		var compareDate = "";
		var tempItems = [];
		for (var i in dbObj) {
			//console.log(dbObj[i].date+":"+compareDate);

			if(dbObj[i].date != compareDate){
				var items = [];
				var row = {
						date : dbObj[i].date
						,items : items
				}
				allSeats.push(row);
				compareDate = dbObj[i].date;
			}
		}

		for (var i in dbObj) {
			for (var j in allSeats) {
//				console.log(allSeats[i].date);
				if(allSeats[j].date == dbObj[i].date) {
					var item = {
						id : dbObj[i].id
						,rev : dbObj[i].rev
						,nm : dbObj[i].nm
						,cont : dbObj[i].cont
					};
//					console.log(item);

					allSeats[j].items.push(item);
//					console.log("date:" + allSeats[j].date);
//					console.log(allSeats[j].items);
					break;
				}
			}
		}

//		console.log(allSeats[0].items);
//		console.log(allSeats[1].items);

		callBackFn(allSeats);
	});
};

exports.sendMail = function(req, res) {
	console.log("@@ 메일발송 호출 sendMail!");
	var date = req.body.date;
	var nm = req.body.nm;
	var cont = req.body.cont;
	var btime = req.body.btime;
	var stime = req.body.stime;
	var subject = "JC1-공지]회의실 예약 알림";

//	console.log(date);
//	console.log(nm);
//	console.log(cont);
//	console.log(btime);
//	console.log(stime);

	//TODO 서버 올릴때 주석으로 변경해야 함
	mailObj.sendEmail('윤태경 <tkyoon@jcone.co.kr>', nm, subject, cont, date, btime, stime);
	//mailObj.sendEmail('천지훈 <kingmag@jcone.co.kr>', nm, subject, cont, date, btime, stime);

	for(var i in global.userData){
		//console.log(global.userData[i].email);
		//mailObj.sendEmail(global.userData[i].nm+' <'+global.userData[i].email+'>', subject, cont, date, time);
	}
}