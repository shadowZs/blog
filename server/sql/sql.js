// mysql操作

const config = require('../config');
const mysql = require('mysql');

let pool = mysql.createPool({
	user: config.user,
	password: config.password,
	port: config.port,
	database: config.database,
	host: config.host,
})

// 封装query方法
function query(sql,values){
	return new Promise((resolve,reject) => {
		pool.getConnection((err,connection) => {
			if(err){
				reject(err)
			}else{
				connection.query(sql,values,(err,datas) => {
					if(err){
						reject(err)
					}else{
						resolve(datas);
					}

					connection.release();
				})
			}


		})
	})
}


function createTable(sql){
	return query(sql,[])

}

function createUsers(){
	let _sql = `
		create table if not exists users(
			id INT NOT NULL AUTO_INCREMENT,
			username VARCHAR(10) NOT NULL COMMENT '用户名',
			password VARCHAR(10) NOT NULL COMMENT '密码',
			avator VARCHAR(100) NOT NULL COMMENT '头像',	
			create_time datetime NOT NULL COMMENT '创建时间',	
			PRIMARY KEY(id)
		)
	`
	createTable(_sql)
}


function createToken(){
	let _sql = `create table if not exists token(
		id NOT NULL AUTO_INCREMENT,
		token NOT NULL CHARCHAR(1000) COMMENT 'token',
		valid_time NOT NULL CHARCHAR(100) COMMENT '有效期',
		PRIMARY KEY(id)

	)`
	createTable(_sql);

}

// 创建文章
function createArticle(){
	let _sql = `create table if not exists article(
		id INT NOT NULL AUTO_INCREMENT,
		username VARCHAR(10) NOT NULL COMMENT '用户',
		title VARCHAR(100) NOT NULL COMMENT '文章标题',
		content VARCHAR(10000) NOT NULL COMMENT '文章内容',
		create_time datetime NOT NULL  COMMENT '创建时间',
		edit_time datetime COMMENT '修改日期',
		comments INT DEFAULT 0 COMMENT '评论数' ,
		points INT DEFAULT 0 COMMENT '点赞数',
		PRIMARY KEY(id)

	)`

	createTable(_sql);
}



// 用户信息
createUsers();
createArticle();

// createToken();


exports.insertUser = function(datas){
	let _sql = `insert into users set username=?,password=?,avator=?,create_time=?`;
	return query(_sql,datas);
}

exports.checkUser = function(userName){
	let _sql = `select * from users where username='${userName}'`;
	return query(_sql)
}

exports.deleteUser = function(userName){
	let _sql = `delete from users where userName=${userName}`;
	return query(_sql);
}

exports.updateUser = function(userName,password){
	let _sql = `update users where userName=${userName} set password=${password}`;
	return query(_sql,datas)
}


// 创建文章
exports.insertArticle = function(datas){
	let _sql = `insert into article set username=?,title=?,content=?,create_time=?`;
	return query(_sql,datas)
}

//修改文章
exports.updateArticle = function(datas,id){
	let _sql = `update article set title=?,content=?,edit_time=? where id=${id}`;
	console.log(_sql);
	return query(_sql,datas);
}

// 点赞文章和评论
exports.addPoint = function(id,datas){
	let _sql = `update article set points=?,comments=? where id=${id}`;
	return query(_sql,datas);
}


exports.deleteArticle = function(id){
	let _sql = `delete form article where id=${id}`;
	return query(_sql)
}

exports.checkArticle = function(id,start,len){
	let _sql = null;
	if(id == null || id == ''){

		if(start != null && len != null){
			_sql = `select * from article order by create_time desc limit ${start},${len}`;
		}else{
			_sql = `select * from article order by create_time desc`;
		}
		


	}else{
		_sql = `select * from article where id=${id}`;
	}

	return query(_sql);
	
}


exports.checkArticleByTime = function(start,len){
	let _sql = `select * from article order by create_time desc limit ${start},${len}`;
	return query(_sql);
}

exports.checkArticleByComments = function(start,len){
	let _sql = `select * from article order by comments desc limit ${start},${len}`;
	return query(_sql);
}

// 查询姓名
exports.checkArticleByname = function(name,page,pageSize){
	let _sql = `select * from article where username='${name}' order by create_time desc limit ${page},${pageSize} `;
	return query(_sql);
}

exports.checkArticleBynameMostComments = function(name,page,pageSize){
	let _sql = `select * from article where username = '${name}' order by comments desc limit ${page},${pageSize} `;
	return query(_sql);
}

exports.checkArticleBynameTotal = function(name){
	let _sql =`select count(*) from article where username='${name}'`;
	return query(_sql);
}


exports.getArticleLen = function(){
	let _sql = `select count(*) from article`;
	return query(_sql);
}


// 评论
exports.createComments = function(id){
	let table = 'comment_' + id;
	let _sql = `create table if not exists ${table}(
		id INT NOT NULL AUTO_INCREMENT,
		username VARCHAR(10) NOT NULL COMMENT '用户名',
		avator VARCHAR(100) NOT NULL COMMENT '用户头像',
		create_time datetime NOT NULL COMMENT '评论时间',
		content VARCHAR(100) NOT NULL COMMENT '评论内容',
		reference INT COMMENT '引用@对象id',
		PRIMARY KEY(id)
	)`
	return query(_sql);

}


exports.getComments = function(id){
	let table = 'comment_' + id;
	let _sql = `select * from ${table}`;
	return query(_sql)
}

exports.insertComment = function(id,datas){
	let table = 'comment_' + id;
	let _sql = `insert into ${table} set username=?,avator=?,create_time=?,content=?,reference=?`;

	return query(_sql,datas);
}

exports.deleteComment = function(article_id,commentid){
	let table = 'comment_' + article_id;
	let _sql = `delete from ${table} where id=${commentid}`;
	return query(_sql);
}

//创建token 表
function createToken(){
	
	let _sql = `
		create table if not exists token(
			id INT NOT NULL AUTO_INCREMENT,
			token VARCHAR(1000) NOT NULL COMMENT '用户token',
			create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',	
			PRIMARY KEY(id)
		)
	`

	createTable(_sql);

}

createToken();

// 插入token
exports.insertToken = function(token){
	let _sql = `insert into token set token=?`;
	return query(_sql,[token]);
}

//删除token
exports.deleteToken = function(token){
	let _sql = `delete from token where token='${token}'`; 
	return query(_sql);
}

//更新token
// exports.updateToken = function(oldToken,datas){
// 	let _sql = `update token set token=?,create_time=? `
// }

//查找token
exports.checkToken = function(token){
	let _sql = `select * from token where token='${token}'`; 
	return query(_sql);
}

// 聊天记录保存,根据roomId来区分
exports.createChatRoom = (roomId) =>{
	let table = roomId;
	let _sql = `
		create table if not exists ${table}(
			id INT NOT NULL AUTO_INCREMENT,
			username VARCHAR(10) NOT NULL COMMENT '用户名',
			avator VARCHAR(100) NOT NULL COMMENT '用户头像',
			message VARCHAR(100) COMMENT '消息',
			create_time datetime NOT NULL COMMENT '时间',
			PRIMARY KEY(id)
		)
	`
	// console.log(_sql);
	return createTable(_sql);
}

//插入聊天记录
exports.insertChat = (roomId,datas) => {
	console.log('insertChat:',roomId,datas);
	let _sql = `insert into ${roomId} set username=?,avator=?,message=?,create_time=?`;
	return query(_sql,datas);
}

//查询聊天记录
exports.checkChat = (roomId) => {
	let _sql = `select * from ${roomId} limit 100`;
	return query(_sql);
}

//当数据超过100条时，删除之前的消息
exports.deleteChat = (roomId) => {
	// let _sql = `delete from ${roomId} where id not in (select * from ${roomId} order by create_time desc limit 100) as t `;

	let _sql = `delete from ${roomId} where id not in(select t.id from (select * from ${roomId} order by create_time desc limit 100) as t)`
	return query(_sql);
}

exports.createChatRoomUser = (roomId) =>{
	let table = 'user_' + roomId;
	let _sql = `
		create table if not exists ${table}(
			id INT NOT NULL AUTO_INCREMENT,
			username VARCHAR(10) NOT NULL COMMENT '用户名',
			avator VARCHAR(100) NOT NULL COMMENT '用户头像',
			PRIMARY KEY(id),
			UNIQUE(username)
		)
	`
	return createTable(_sql);
}

exports.checkChatRoomUser = (roomId) => {
	let table = 'user_' + roomId;
	let _sql = `select * from ${table}`;
	return query(_sql);
}

exports.addchatRoomUser = (datas,roomId) => {
	let username = datas[0];
	let table = 'user_' + roomId;
	let _sql = `insert ignore into ${table} set username=?,avator=? `;  //ignore 只是按照主键有无重复？
	// let _sql = `insert into ${table} set username=?,avator=? select username from dual where not exists(select * from ${table} where username = ${username})`; //无论有无都不会添加

	
	return query(_sql,datas);
}

exports.deleteChatRoomUser = (username,roomId) => {
	let table = 'user_' + roomId;
	let _sql = `delete from ${table} where username = '${username}'`;
	return query(_sql);
}
