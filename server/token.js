// token处理
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sql = require('./sql/sql');


// 生成token
exports.createToken = async (data) =>{

	var token = jwt.sign({ username: data}, 'secret',{expiresIn: 60 * 60 * 1000});
	let insertResult = await sql.insertToken(token); 

	return token;
} 

       
exports.verifyToken = async (token) => {	
	let username = null;
	let decode = jwt.verify(token,'secret');
	let nowTime = Date.now();    //jwt.exp时间是按照秒来计算，而非毫秒

	if(nowTime / 1000 > decode.exp){
		
		let deleteResult = await sql.deleteToken(token);    // 大于过期时间，表示已过期，删除数据

	}else{

		let result = await sql.checkToken(token);      //查询token是否有效，避免重复登录

		if(result.length > 0){		
			username = decode.username;
		}
		
	}


	return username;

}

