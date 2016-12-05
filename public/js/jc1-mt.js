function timeRegx(str){
	return str.replace(/^([0-9]{1,2})?([0-6]{1}[0-9]{1})$/, "$1:$2")
}

function minuteRegx(str){
	return str.replace(/^([0-9]{1,2})?([0-6]{1}[0-9]{1})$/, "$2")
}

function printTime(str,cnt){
	var after;
	var share = parseInt(cnt/2);
	var rest = parseInt(cnt%2);
	if(share >0){
		if(parseInt(str) + share*100  < 1000){
			after = timeRegx("0"+ (parseInt(str) + share*100 + rest==1?(minuteRegx(str)=='00' ? 30 : 70):0));
		} else {
			after = timeRegx((parseInt(str) + share*100 + (rest == 1 ? (minuteRegx(str)=='00' ? 30 : 70):0)).toString());
		}
	} else {
		if(parseInt(str) + share*100 + 30 < 1000){
			after = timeRegx("0"+ (parseInt(str) + (minuteRegx(str)=='00' ? 30 : 70)));
		} else {
			after = timeRegx((parseInt(str) + (minuteRegx(str)=='00' ? 30 : 70)).toString());
		}

	}

	return timeRegx(str) + " ~ " + after;

}

function getMeetingTime(jsonString){
	var cnt = 2;
	var idx;
	for(var i in jsonString){
		if(i >= jsonString.length-1){
			break;
		}
		var now = jsonString[i].id.replace(/[a-z]*[A-Z]*/ig,"");
		var next = jsonString[parseInt(i)+1].id.replace(/[a-z]*[A-Z]*/ig,"");

		if(next - now == 30 || next - now == 70){
			if(idx == null){
				idx = i;
			}
			if(cnt >= 2){
				jsonString[idx]['cnt'] = cnt;

			}else {
				jsonString[i]['cnt'] = cnt;
			}
			cnt++;
			} else {
				cnt = 2;
				idx = null;
			}

	}

	for(var i in jsonString){
//		console.log(jsonString[i]);
	}

	var rstJson = [];
	var strArr = [];
	var idx = 0;
	for(var i in jsonString){
		if(idx > 0){
			idx--;
			continue;
		}

		var time = jsonString[i].id.replace(/[a-z]*[A-Z]*/ig,"");

		if(jsonString[i].id.charAt(0) == 's' && rstJson.length == 0){
			rstJson.push(strArr.toString());
			strArr = [];
		}

		if(jsonString[i].cnt){
			idx = jsonString[i].cnt;
			strArr.push(printTime(time,jsonString[i].cnt));
			idx--;
		} else {
			strArr.push(printTime(time,jsonString[i].cnt));
		}
	}
	rstJson.push(strArr.toString());
	if(rstJson.length == 1){
		rstJson.push("")
	}
	return rstJson;
}