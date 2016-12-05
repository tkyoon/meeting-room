// 소켓 이벤트를 수행합니다.
var socket = io.connect();

// 이벤트를 연결합니다.
socket.on('book', function (data) {
	//console.log(data);
	if(data.nm != gUserNm && data.cDate == gCDate) {
		setName(data.id, data.nm);
		$("#"+data.id).addClass("booking");
		$("#"+data.id+" ul:eq(1)").addClass("bookingCont").text("Booking...");
	}
});

socket.on('booked', function (data) {
	if(data.nm != gUserNm && data.cDate == gCDate) {
		setName(data.id, data.nm);
		$("#"+data.id).removeClass("booking");
		$("#"+data.id+"").addClass("occupy");
		$("#"+data.id+" ul:eq(1)").removeClass("bookingCont").html(data.cont.split("\n").join("<br/>"));
	}
});

socket.on('cancelBook', function (data) {
	console.log("cancelBook");
	console.log(data);
	if(data.nm != gUserNm && data.cDate == gCDate) {
		//예약자 이름 제거
		$("#"+data.id+" li").text("");

		//내용 제거
		$("#"+data.id+" ul:eq(1)").text("");

		$("#"+data.id+"").removeClass("occupy");
	}

});

socket.on('unbook', function (data) {
	if(data.cDate == gCDate) {
    	unSetName(data.id);
		$("#"+data.id).removeClass("booking");
		$("#"+data.id+" ul:eq(1)").removeClass("bookingCont").text("");
	}
});

socket.on('occupy', function (data) {
	if(data.nm != gUserNm && data.cDate == gCDate) {
		//setOccupy(data);
	}
});

socket.on('dup_user', function (userNm) {
	if(userNm == gUserNm) {
    	location.href="/error";
	}
});

socket.on('disconnected', function() {
	socket.emit('disconnected', gUserNm);
});