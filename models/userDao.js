var oracledb = require('oracledb');

exports.getUser= function() {
	oracledb.getConnection({
		user: "GW_USER_SEL",
		password: "GW_USER_SEL",
		connectString: "gw.jcone.co.kr:1521/jconedb"
	}, function(err, connection) {
		if (err) {
			console.error(err.message);
	    	return;
		}

		var qry = 	" SELECT "
	    	+		"	u_id"
			+		"	,u_name"
			+		"	,email"
			+		" FROM GW_USER"
			+		" WHERE OUT_DATE IS NULL"
			+		" AND EMAIL IS NOT NULL";

		connection.execute(qry, [],
		function(err, result) {
			if (err) {
		    	console.error("@@ db error! %j", qry);
		        console.error(err.message);
		        doRelease(connection);
		        return;
			}
//			console.log(result.metaData);
//			console.log(result.rows[1]);
//			console.log(makeUserJson(result.rows));

			doRelease(connection);

			return makeUserJson(result.rows);
		});
	});
}

function makeUserJson(rows){
	var json = [];
	for (var i in rows) {
		var row = {
			 id 	: rows[i][0]
			,nm 	: rows[i][1]
			,email 	: rows[i][2]
		};
		json.push(row);
	}
//	console.log(json);
	global.userData = json;
	return json;
}

function doRelease(connection) {
     connection.release(
          function(err) {
               if (err) {console.error(err.message);}
          }
     );
}