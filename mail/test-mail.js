var email   = require("../node_modules/emailjs/email");
var mail   = require("./mail.js");

/**
 * jc1 메일 발송
 */
var server  = email.server.connect({
	host		: "mail.jcone.co.kr"
	,domain	: "jcone.co.kr"
	,user	: "jc1@jcone.co.kr"
});

/**
 * 모든 메일 전송시 gmail을 통한 메일 발송
 */
//var server  = email.server.connect({
//	host	: "smtp.gmail.com"
//	,user	: "jconeKanban@gmail.com"
//	,password: "jcone4660"
//	,ssl 	: true
//});

var mailParam = {
	from		: "JC1<jc1@jcone.co.kr>"
	,to			: ""
	,subject	: ""
	,attachment	: ""
}

exports.sendEmail = function(to, nm, subject, contents, date, time){
	console.log(to);
	console.log(nm);
	console.log(contents);
	console.log(date);
	console.log(time);

	mailParam.subject = mailParam.subject;
	mailParam.to = to;
	contents = contents.split("\r\n").join("<br/>");
	mailParam.attachment = mail.setAttachment(nm, contents, date, time);

	server.send(mailParam, function(err, message){
		if(err){
			console.log(err || message);

		}else{
			console.log("@@ " + to + "님에게 회의실 예약 메일을 발송하였습니다.");

		}

	});
}


var ea = "윤태경 <tkyoon81@naver.com>";
//var ea = "윤태경 <tkyoon81@gmail.com>";
var ea = "윤태경 <y-friend@daum.net>";
var ea = "윤태경 <tkyoon@jcone.co.kr>";

//this.sendEmail('윤태경 <tkyoon@jcone.co.kr>', 'test', 'content', '2015-00-00 12:00 - 2015-00-00 12:00');
this.sendEmail(ea, '윤태경', '회의실 예약', '2016년 2월 1일', '대회의실\r\n 10:30 ~ 12:00 \r\n 소회의실 \r\n 11:00 ~ 11:30');

