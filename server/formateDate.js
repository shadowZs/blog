exports.formateDate = function(val){
	let year = val.getFullYear();
	let month = val.getMonth();
	let day = val.getDate();

	if(month < 10){
		month = '0' + month;
	}

	if(day < 10 ){
		month = '0' + day;
	}

	return year + '-' + month + '-' + day;
}