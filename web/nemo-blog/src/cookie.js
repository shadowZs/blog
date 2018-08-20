//允许设置最大时间
exports.setCookie = function(name,val,expires){
	if(typeof expires == 'number'){
		document.cookie = name + '=' + val + ';expires=' + new Date(new Date().getTime() + expires * 24 * 3600 * 1000) ;
	}else{
		if(expires == 'max'){
			let maxDate = 'Fri, 30 Dec 9999 23:59:59 GMT';
			document.cookie = name + '=' + val + ';expires=' + maxDate ;
		}
	}
	

}

exports.getCookie = function(name){
	let cookie = document.cookie.match('(^| )'+ name +'=([^;]*)(;|$)');
	if(cookie){
		let val = cookie[2];
		return val;
	}else{
		return null;
	}

}

exports.clearCookie = function(name){
	document.cookie = name + '=' + null + ';expires= -1';
},

exports.clearAll = function(){
	let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys){
        for(let i = 0; i < keys.length; i++){
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
    }

}

// exports.setLocal = function(name,val){
// 	localStorage.setItem(name,val)
// }

// exports.getLocal = function(name){
// 	localStorage.getItem(name)
// }

// exports.deleteLocal = function(name){
// 	localStorage.removeItem(name);
// }