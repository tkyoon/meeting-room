function frmSubmit(url, params, method) {
    method = method || "post";  //method 부분은 입력안하면 자동으로 post가 된다.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", url);
    //input type hidden name(key) value(params[key]);
    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}

function convertDate(dateStr){
	var year        = dateStr.substring(0,4);
	var month       = dateStr.substring(4,6);
	var day         = dateStr.substring(6,8);
	var date        = new Date(year, month-1, day);
	return date;
}

function initPopup(openOnEvent){
	var popupHtml =
		  '<span style="font-weight:bold;">JC1 회의실 예약</span>'
		+ '<p id="p_header" style="padding: 0px 0px 5px 0px;margin: 15px 0 0;"></p>'
		+ '<div style="display:inline-flex;">'
		+ '<div style="border:1px solid #DDDDDD;height:100px;width:190px;overflow-y:auto;">'
		+ '<ul id="ul_bmr" style="padding:0 0 0 5px;margin:5px 0 0 0;">□ 대회의실 예약시간</ul>'
		+ '</div>'
		+ '<div id="div_smr"style="border:1px solid #DDDDDD;border-left:0px;height:100px;width:190px;float:right;overflow-y:auto;">'
		+ '<ul id="ul_smr" style="padding:0 0 0 5px;margin:5px 0 0 0;">□ 소회의실 예약시간</ul>'
		+ '</div>'
		+ '</div>'
		+ '<div style="display:inline-flex; padding-top:5px;">'
		+ '<textarea id="txa_cont" placeholder="내용을 입력해주세요" style="border-color:#DDDDDD;width:377px;height:50px;resize:none;">'
		+ '</textarea>'
		+ '</div>'
		+ '<span style="float:right;">'
		+ '<a href="#" onclick="saveRev()" class="twitter">확인</a>'
		+ '<a href="#" onclick="closePopup()" class="dribble">취소</a>'
		+ '</span>';

	$('#btn_rev').avgrund({
		height			: 260,
		holderClass		: 'custom',
		showClose		: true,
		showCloseText	: 'X',
		onBlurContainer	: '.body',
		openOnEvent		: openOnEvent,
		template		: popupHtml
	});
}

function closePopup(){
	$('.avgrund-ready').removeClass("avgrund-active");
	$('.avgrund-popin').remove();
}

function sendMail(param){
	var url = "/sendMail"
	$.ajax({
		type	: "POST"
		,url	: url
		,data	: param
	});
}

function disableF5(e) {
	if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault();
}

function getNextDay(dateStr){
	var date = convertDate(dateStr);
    date.setDate(date.getDate() + 1);
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    return (date.getFullYear() + ((mymonth < 10) ? "0" : "") + mymonth + ((myweekday < 10) ? "0" : "") + myweekday);
}

function getPrevDay(dateStr){
	var date = convertDate(dateStr);
    date.setDate(date.getDate() - 1);
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    return (date.getFullYear() + ((mymonth < 10) ? "0" : "") + mymonth + ((myweekday < 10) ? "0" : "") + myweekday);
}