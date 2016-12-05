var reservationCtrl = require('../controllers/reservation-controller.js');

exports.setSeats = function(allSeats, data){
//		console.log("Call setSeats!!!");
//		console.log(data);
	for (var i in allSeats) {
//			console.log(allSeats[i].date);
		if(allSeats[i].date == data.cDate) {
			for (var j in allSeats[i].items) {
				if(allSeats[i].items[j].id == data.id){
					//이미 생성된 Data overwrite
					var newData = {
						id : data.id
						,rev : data.rev
						,nm : data.nm
						,cont : data.cont
					};
					allSeats[i].items[j] = newData;
//						console.log("Set");
//						console.log(newData);
					break;
				}
			}

			//Data가 생성되지 않았을 경우 Data 생성
			var newData = {
				id : data.id
				,rev : data.rev
				,nm : data.nm
				,cont : data.cont
			};
			allSeats[i].items.push(newData);
		}
	}
}

exports.unSetSeats = function(allSeats, data){
	for (var i in allSeats) {
		if(allSeats[i].date == data.cDate) {
			for (var j in allSeats[i].items) {
				if(allSeats[i].items[j].id == data.id){
//					console.log("unset complete!");
//					console.log(data.id);
//					console.log(data.cDate);
					allSeats[i].items.splice(j, 1);
//					console.log("unSetSeats");
//					console.log(allSeats[i]);
				}
			}
			break;
		}
	}
}

exports.releaseSeats = function(allSeats, nm){
//	console.log("Call releaseSeats!!!");
	for (var i in allSeats) {
		for (var j in allSeats[i].items) {
			if(allSeats[i].items[j].nm == nm && allSeats[i].items[j].rev == '1'){
				var newData = {
					id : allSeats[i].items[j].id
					,rev : '0'
					,nm : ''
					,cont : ''
					,cDate :  allSeats[i].date
				};
				allSeats[i].items[j].rev = '0';
				allSeats[i].items[j].nm = '';
//				console.log(newData.id);
//				allSeats[i].items.splice(j, 1);
				global.io.sockets.emit('unbook', newData);
			}
		}
	}
}

exports.getCurrentSeats = function(allSeats, cDate) {
//	console.log("getCurrentSeats! " + cDate);
	for (var i in allSeats) {
//		console.log(allSeats[i].date);
		if(allSeats[i].date == cDate) {
//			console.log("allSeats[i].items");
//			console.log(allSeats[i].items);
			return allSeats[i].items;
		}
	}

//	console.log("allseats");
//	console.log(allSeats[0].date);
//	console.log(allSeats[0].items);

	var seats = [];
//	console.log("Make new date = " + cDate);

	var newData = {
		date : cDate
		,items : seats
	};

	allSeats.push(newData);

	return seats;
}




