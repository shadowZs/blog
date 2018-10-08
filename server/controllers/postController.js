const sql = require('../sql/sql');
const formateDate = require('../formateDate');
const tokenJs = require('../token');
// const imgUrl = 'http://116.85.48.142:3000/upload/'; //滴滴云
// const imgUrl = 'http://47.106.171.33:3000/upload/others/'; //阿里云，给shujie配的博客
const imgUrl = 'http://localhost:3100/upload/others/';

exports.upload = async (ctx,next) => {
	let file = ctx.req.file;
	ctx.body = {
		code: 0,
		message: imgUrl+ file.filename,
	}
}

exports.register = async (ctx,next) => {
	console.log(ctx.request.body);

	let userName = ctx.request.body.userName;
	let password = ctx.request.body.password;
	let avator = ctx.request.body.avator
	
	// let create_time = formateDate.formateDate(new Date());

	let create_time = new Date();

	let checkResult = await sql.checkUser(userName); console.log(checkResult);

	if(checkResult.length == 0){
		let datas = [userName,password,avator,create_time]; console.log(datas);
		let insertResult = await sql.insertUser(datas);
		
		if(insertResult.insertId){
			
			let r = await sql.checkUser(userName);
				ctx.body = {
				code:0,
				message:'注册成功',
				data:r[0],
				token: await tokenJs.createToken(userName),
			}
		}
		
		
	}else{
		ctx.body = {
			code:-1,
			message:'用户名已注册'
		}
	}

}

exports.login = async (ctx,next) => {
	let userName = ctx.request.body.userName;
	let password = ctx.request.body.password;
	let insertResult = await sql.checkUser(userName); 


	if(insertResult.length == 0){
		console.log('length:0')
		ctx.body = {
			code: -1,
			message:'用户不存在'
		}
	}else{


		let checkPassword = insertResult[0].password;

		if(password != checkPassword){
			
			ctx.body = {
				code: -1,
				message:'用户账号或密码错误'
			}
		}else{
			let token = await tokenJs.createToken(userName);
			ctx.body = {
				code: 0,
				message: '成功',
				data:insertResult[0],
				token: token,
			}
		}

	}


}

//  文章

exports.publish = async(ctx,next) =>{
	let token = ctx.request.headers.token;
	let username = await tokenJs.verifyToken(token); console.log(username);
	console.log(ctx.request.body); 

	let params = ctx.request.body;
	let createTime = new Date();
	let title = params.title;
	let content = params.content;
	let arr = [username,title,content,createTime]; console.log(arr)
	let result = await sql.insertArticle(arr);

	console.log(result);
	if(result.insertId && username != null){

		let createComments = await sql.createComments(result.insertId); console.log(createComments);

		ctx.body = {
			code: 0,
			message:'成功'
		}
	}

	if(username == null){
		ctx.body = {
			code:2,
			message:'token 已失效，请重新登录'
		}
	}

	if(username != null && !result.insertId){
		ctx.body = {
			code: -1,
			message:'操作失败'
		}
	}

}

// 更新文章
exports.updateArticle = async(ctx,next) => {
	let token = ctx.request.headers.token;
	let username = await tokenJs.verifyToken(token);
	let id = ctx.request.body.id;
	let title = ctx.request.body.title;
	let content = ctx.request.body.content;
	let edit_time = new Date();
	let arr = [title,content,edit_time]; console.log(arr,id);

	let result = await sql.updateArticle(arr,id);

	if(username != null){
		ctx.body = {
			code: 0,
			message: '成功',
			data: result[0]
		}
	}else{
		ctx.body = {
			code:2,
			message:'token已失效，请重新登录'
		}
	}
	

}

// 获取文章
exports.getArticleList = async(ctx,next) =>{
	let page = ctx.request.body.page;
	let pageSize = ctx.request.body.pageSize;

	let result = await sql.checkArticle('',page -1 ,pageSize);
	let articleLen = await sql.getArticleLen();

	if(result.length > 0){
		let len = result.length;
		for(let i = 0; i < len; i ++){
			let userInfo = await sql.checkUser(result[i].username);
			result[i].avator = userInfo[0].avator;
		}
	}

	ctx.body = {
		code:0,
		message:'成功',
		data:result,
		page:page,
		pageSize:pageSize,
		total:articleLen[0]['count(*)'],
	}
}


exports.getArticleListNew = async(ctx,next) => {
	let page = ctx.request.body.page;
	let pageSize = ctx.request.body.pageSize;

	let result = await sql.checkArticleByTime(page -1 ,pageSize);

	if(result.length > 0){
		let len = result.length;
		for(let i = 0; i < len; i ++){
			let userInfo = await sql.checkUser(result[i].username);
			result[i].avator = userInfo[0].avator;
		}

	}

	ctx.body = {
		code: 0,
		message: '成功',
		data: result,
	}
}

exports.getArticleListMost = async(ctx,next) => {
	let page = ctx.request.body.page;
	let pageSize = ctx.request.body.pageSize;
	let result = await sql.checkArticleByComments(page -1 ,pageSize);

	if(result.length > 0){
		let len = result.length;
		for(let i = 0; i < len; i ++){
			let userInfo = await sql.checkUser(result[i].username);
			result[i].avator = userInfo[0].avator;
		}

	}

	ctx.body = {
		code: 0,
		message: '成功',
		data: result,
	}
}



exports.getArticleByname = async(ctx,next) =>{
	let token = ctx.request.headers.token;
	let name = await tokenJs.verifyToken(token); console.log(name);

	let page = ctx.request.body.page;
	let pageSize = ctx.request.body.pageSize;

	if(name){
		let results = await sql.checkArticleByname(name,page -1,pageSize);
		let user = await sql.checkUser(name);
		let totalLen = await sql.checkArticleBynameTotal(name);

		if(results.length > 0 && user.length > 0){
			for(let i = 0; i < results.length; i++){
				results[i].avator = user[0].avator;
			}
		}

		ctx.body = {
			code: 0,
			message:'成功',
			data: results,
			page:page,
			pageSize:pageSize,
			total:totalLen[0]['count(*)']

		}
	}else{
		ctx.body = {
			code: -1,
			message: 'token已失效，请重新登录'
		}
	}

	
}

exports.getArticleBynameMostComments = async(ctx,next) =>{
	let token = ctx.request.headers.token;
	let name = await tokenJs.verifyToken(token); 

	let page = ctx.request.body.page;
	let pageSize = ctx.request.body.pageSize;

	if(name){
		let results = await sql.checkArticleBynameMostComments(name,page -1,pageSize); 
		let user = await sql.checkUser(name);
		let totalLen = await sql.checkArticleBynameTotal(name);

		if(results.length > 0 && user.length > 0){
			for(let i = 0; i < results.length; i++){
				results[i].avator = user[0].avator;
			}
		}

		ctx.body = {
			code: 0,
			message:'成功',
			data: results,
			page:page,
			pageSize:pageSize,
			total:totalLen[0]['count(*)']

		}
	}else{
		ctx.body = {
			code: 2,
			message: 'token已失效，请重新登录'
		}
	}


}




exports.getDetail = async (ctx,next) => {
	let id = ctx.request.body.id;

	let result = null;
	if(id){
		result = await sql.checkArticle(id);
		let comments = result[0].comments;
		let points = result[0].points;
		if(comments == null){
			comments = 0;
		}

		if(points == null){
			points = 1;

		}else{
			points ++;
		}

		let addComments = await sql.addPoint(id,[points,comments]);

		ctx.body = {
			code: 0,
			data: result[0],
			message:'成功',
		}
	}else{
		ctx.body = {
			code: -1,
			message:'参数不正确',
		}
	}

}

// 评论
exports.getComments = async(ctx,next) => {
	let id = ctx.request.body.id;
	let results = await sql.getComments(id); console.log(results);
	ctx.body = {
		code: 0,
		message:'成功',
		data:results,
	}

}

exports.submitComment = async(ctx,next) => {
	let time = new Date();
	let id = ctx.request.body.id;
	// let username = ctx.request.body.username;
	let token = ctx.request.headers.token;
	let username = await tokenJs.verifyToken(token);


	let avator = ctx.request.body.avator;
	let content = ctx.request.body.content;
	let reference = ctx.request.body.reference;
	let arr = [username,avator,time,content,reference];
	console.log(id,arr)
	let result = await sql.insertComment(id,arr);

	if(username != null){
		if(result.insertId){
			let getCommentsResult = await sql.checkArticle(id);
			let comments = getCommentsResult[0].comments;
			let points = getCommentsResult[0].points;
			if(comments == null){
				comments = 1
			}else{
				comments ++;
			}

			if(points == null){
				points = 0;
			} 
			let insertResult = await sql.addPoint(id,[points,comments])


			ctx.body = {
				code:0,
				message:'成功',
			}
		}else{
			
			ctx.body = {
				code: -1,
				message:'失败'
			}

		}

	}else{
		ctx.body = {
			code: 2,
			message:'token已失效，请重新登录'
		}
	}

	

}



// 聊天
exports.createChatRoom = async(roomId) => {
	let result = await sql.createChatRoom(roomId); console.log(result);
	return result;

}



exports.insertChat = async (roomId,datas) => {

	let arr = [datas.username,datas.avator,datas.message,new Date(datas.create_time)]; 
	let insertResult = await sql.insertChat(roomId,arr); 
	

	ctx.body = {
		code: 0,
		message: 'success'
	}
}

// 获取列表
exports.checkChat = async (ctx,next) =>{
	
	let roomId = ctx.request.body.roomId; 
	let checkRoom = await sql.createChatRoom(roomId);  
	let result = await sql.checkChat(roomId); 

	ctx.body = {
		code:0,
		message:'success',
		data:result,
	}
}


// 聊天用户
exports.createChatRoomUser = async (roomId) => {
	let result = await sql.createChatRoomUser(roomId);
	return result;
}

exports.checkChatRoomUser = async () => {
	let roomId = 'room_1';
	let result = await sql.checkChatRoomUser(roomId);
	return result;

}

exports.addChatRoomUser = async (username,avator) => {
	let roomId = 'room_1';
	let arr = [username,avator];
	
	let result = await sql.addchatRoomUser(arr,roomId);
	let checkResult = await sql.checkChatRoomUser(roomId);
	return checkResult;

}

// 删除聊天用户

exports.deleteChatRoomUser = async(username) => {
	let roomId = 'room_1';
    let result = await sql.deleteChatRoomUser(username,roomId); 
    let checkResult = await sql.checkChatRoomUser(roomId);
    return checkResult;

}