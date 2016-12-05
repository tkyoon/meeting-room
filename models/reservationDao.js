// binding modules
var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

// declare reversation shema
var reservationSchema = new Schema({
    //objectId	: String 시스템 생성, unique key
	date		: String // 날짜(yyyymmdd)
	,id			: String // 회의실별 시간 id
	,rev		: {type : String, "default" : "2" } // 예약여부
	,nm			: String // 예약자명
	,cont		: String // 예약내용
	,regIp		: String // 예약자 ip주소
	,regDd		: { type: Date, "default" : Date.now } // 등록일자
});

/**
 * first parameter : MongoDB에 생성되는 collection 명칭
 * second parameter : MongoDB에 전달되는 객체
 */
module.exports = mongoose.model('reservation', reservationSchema);