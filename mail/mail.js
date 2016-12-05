var email   = require("../node_modules/emailjs/email");

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

//console.log(server);

/**
 * @pram to : 받는 사람 (윤태경 <tkyoon@jcone.co.kr>)
 * @pram nm : 예약자
 * @pram contents : 내용
 * @pram date : 예약일자
 * @pram btime : 대회의실 예약시간
 * @pram stime : 소회의실 예약시간
 *
 */
exports.sendEmail = function(to, nm, subject, contents, date, btime, stime){
//	console.log(to);
//	console.log(title);
//	console.log(contents);
//	console.log(period);

	/**
	 * 시간 html
	 *
	 *
	 */
	var mailParam = {
		from		: "JC1<jc1@jcone.co.kr>"
		,to			: ""
		,subject	: "JC1-공지]회의실 예약 알림"
		,attachment	: ""
	}

	mailParam.to = to;
	contents = contents.split("\n").join("<br/>");

	var time = ""; //시간대 태그 설정
	var btimeArr = "";
	var stimeArr = "";

	if("" != btime){
		time = '<ul style="padding:0 0 10px 0;margin:0;">□ 대회의실';
		btimeArr = btime.split(",");

		for(var i in btimeArr){
			time += '<li style="padding:5px 0 0 15px;list-style: none;">☞ ' + btimeArr[i] + '</li>';
		}
		time += '</ul>';
	}

	if("" != stime){
		time += '<ul style="padding:10px 0 10px 0;margin: 0;">□ 소회의실';
		stimeArr = stime.split(",");

		for(var i in stimeArr){
			time += '<li style="padding:5px 0 0 15px;list-style: none;">☞ ' + stimeArr[i] + '</li>';
		}
		time += '</ul>';
	}

	mailParam.attachment = this.setAttachment(nm, contents, date, time);

	server.send(mailParam, function(err, message){
		if(err){
			console.log(err || message);

		}else{
			console.log("@@ " + to + "님에게 업무등록 메일을 발송하였습니다.");

		}

	});
};

exports.setAttachment = function(nm, contents, date, time){
	var html =
		'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
		+'<html lang="en">'
		+'<head>'
		+'<title></title>'
		+'<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />'
		+'<style>li{list-style: none;}</style>'
		+'</head>'
		+'<body>'
		+'	<div id="formskin_gathering">'
		+'	<table width="550" align="center" cellspacing="0" cellpadding="0" border="0" style="text-align:left;">'
		+'	<tbody><tr>'
		+'    <td valign="top" style="font-size:12px; font-family:돋움,돋움체,Dotum,sans-serif;padding:20px;">'
		+'        <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0" style="text-align:left;">'
		+'        <tbody><tr>'
		+'            <th valign="top" style="padding:7px 0;font-size:35px;color:#333;text-align: center;">'
		+'				<img src="cid:jc1-ci.png" width="200px" style="vertical-align:middle;">'
		+'            <strong style="font-family: Roboto Condensed,Droid Sans,arial,sans-serif; margin:0 0 5px 0;color:#8C8C8C;vertical-align: bottom;">회의실 예약</strong>'
		+'            </th>'
		+'        </tr>'
		+'        <tr>'
		+'            <td valign="top" style="padding:0px 0 30px 0;font-size:13px;font-weight:bold;color:#999;text-align: center;letter-spacing:-1px;">'
		+'            Jump & Creative to No.<font color="#FE8900">1</font> Service !'
		+'            </td>'
		+'        </tr>'
		+'        <tr>'
		+'            <td height="55" valign="top" style="font-size:12px;color:#333;line-height:160%;">'
		+'                <div style="border-top:3px solid #333;border-bottom:1px solid #333;">'
		+'                <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0">'
		+'                <tbody><tr>'
		+'                    <th width="84px" valign="middle" align="left" bgcolor="#ccc" valign="top" style="padding:10px 0px 5px 14px;font-size:12px;letter-spacing:-1px;border-top:1px solid #BABABA;">'
		+'				예약자'
		+'                    </th>'
		+'                    <td valign="top" style="padding:10px 10px 5px 18px;font-size:12px;border-top:1px solid #eaeaea">'
		+				nm
		+'                    </td>'
		+'                </tr>'
		+'                </tbody></table>'
		+'                <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0">'
		+'                <tbody><tr>'
		+'                    <th width="84px" align="left" bgcolor="#ccc" valign="top" style="padding:10px 0px 5px 14px;font-size:12px;letter-spacing:-1px;border-top:1px solid #BABABA;">'
		+'              날짜'
		+'                    </th>'
		+'                    <td valign="top" style="padding:10px 10px 5px 18px;font-size:12px;border-top:1px solid #eaeaea">'
		+				date
		+'                    </td>'
		+'                </tr>'
		+'                </tbody></table>'
		+'                <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0">'
		+'                <tbody><tr>'
		+'                    <th width="84px" align="left" bgcolor="#ccc" valign="top" style="padding:10px 0px 5px 14px;font-size:12px;letter-spacing:-1px;border-top:1px solid #BABABA;">'
		+'				시간'
		+'                    </th>'
		+'                    <td valign="top" style="padding:10px 10px 5px 18px;font-size:12px;border-top:1px solid #eaeaea">'
		+				time
		+'                    </td>'
		+'                </tr>'
		+'                </tbody></table>'
		+'                <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0">'
		+'                <tbody><tr>'
		+'                    <th width="84px" align="left" bgcolor="#ccc" valign="top" style="padding:10px 0px 5px 14px;font-size:12px;letter-spacing:-1px;border-top:1px solid #BABABA;">'
		+'              내용'
		+'                    </th>'
		+'                    <td valign="top" style="padding:10px 10px 5px 18px;font-size:12px;border-top:1px solid #eaeaea">'
		+				contents
		+'                    </td>'
		+'                </tr>'
		+'                </tbody></table>'
		+'                </div>'
		+'            </td>'
		+'        </tr>'
		+'		<tr>'
		+'		<td valign="top" align="center" style="padding:20px 0;font-size:12px;color:#333;line-height:160%;">'
		+'		<table style="text-align: left;" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">'
		+'		<tbody><tr>'
		+'			<th style="font-size: 12px;letter-spacing:-1px; height: 30px;">기타사항</th>'
		+'		</tr>'
		+'		<tr>'
		+'		<td style="border: 1px solid #e9e9e9; font-size: 12px; line-height: 120%;" bgcolor="#f8f8f8">'
		+'		<ul style="margin-top:11px"><li style="list-style:initial;">회의실 예약은 그룹웨어 > 회의실 예약 메뉴을 이용해주세요.</ul>'
		+'		<ul style="margin-top:11px"><li style="list-style:initial;"><a href="http://gw.jcone.co.kr/">JC1 그룹웨어 바로가기</a></li></ul>'
		+'		<ul style="margin-top:11px"><li style="list-style:initial;">이 메일은 발신전용입니다.</li></ul>'
		+'		</td>'
		+'		</tr>'
		+'		</tbody></table>'
		+'			</td>'
		+'			</tr>'
		+'        </tbody></table>'
		+'    </td>'
		+'</tr>'
		+'</tbody></table>'
		+'</div>'
		+'</body></html>';
	return [{data:html, alternative:true}, {path:"mail/jc1-ci.png", type:"image/png", name: "jc1-ci.png",  headers:{"content-id":"<jc1-ci.png>"}}];
};


