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
		let result = await sql.checkToken(token);
		let deleteResult = await sql.deleteToken(token); 

	}else{

		username = decode.username;

	}


	return username;

}

