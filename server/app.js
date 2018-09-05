const Koa = require('koa');
const app = new Koa();

const router = require('koa-router')();
router.get('/',async (ctx) => {
	ctx.body = 'hello world'
})

const cors = require('koa2-cors');
app.use(cors())

// 静态服务器
const path = require('path');
const server = require('koa-static');
app.use(server(path.join(__dirname)));


const bodyParser = require('koa-bodyparser')();
app.use(bodyParser);


// 日志
const logger = require('koa-logger');
app.use(logger());

// 错误处理z
const onerror = require('koa-onerror');
onerror(app);


app.use(router.routes());

const postRouter = require('./routers/postRouter');
app.use(postRouter.routes());

const controller = require('./controllers/postController');

const cookie = require('./cookie');

const sql = require('./sql/sql');

const session = require('koa-session');

const CONFIG = {
	key: 'koa:sess',
	maxAge: 864000,
}

app.use(session(CONFIG,app));

const utf8 = require('utf8');  // 解决socket获取cookie编码问题

//scoket.io
let websocketServer = require('http').createServer(app.callback());
let io = require('socket.io')(websocketServer);


io.use(function(socket, next){
    if (socket.request.headers.cookie) {
    	return next();
    }
    next(new Error('Authentication error'));
});


io.on('connection',async (socket) =>{
	let roomId = 'room_' + 1;
	socket.join(roomId);

	controller.createChatRoom(roomId);
	controller.createChatRoomUser(roomId);

	let userInfo = null;
	if(socket.request.headers.cookie){
		let cookies = socket.request.headers.cookie;
		userInfo = JSON.parse(cookie.getCookie(cookies,'userInfo'));
	
		let username = utf8.decode(userInfo.username);
		let avator = userInfo.avator;
		let users = await controller.addChatRoomUser(username,avator);

		socket.to(roomId).emit('system',`${username} 进入了聊天室`);

	    io.sockets.emit('userList',users);

		socket.on('message',function(data){
			socket.to(roomId).emit('message',data);
			controller.insertChat(roomId,data);
		})

		socket.on('disconnect',async() =>{
			console.log(`${username} 离开了`)
			let currentUsers = await controller.deleteChatRoomUser(username);
			console.log('离开后的聊天列表：',currentUsers);

			socket.to(roomId).emit('system',`${username} 离开了`);
			io.sockets.emit('userList',currentUsers);

    	})

	}	

})


		
websocketServer.listen(3101);
app.listen(3100);
console.log(`server started at 3100`);
console.log('socket listen at 3101');