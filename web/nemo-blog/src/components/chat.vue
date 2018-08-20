<template>
	<div class='main'>
		<xheader active='chat'></xheader>
		<div class="mainContent flex" style='height:calc( 100% - 130px)'>
			<div class="mainBox" style='height:calc( 100% - 80px);width:calc(100% - 460px)'>
				<div class="chatBox" style='margin:20px 0;line-height:30px;height:calc(100% - 110px);border-bottom:1px solid #efefef;overflow-y:auto;'>
					<div class="chatMessage " v-for='li in chatList' style='margin:10px 10px' >
						<div class="chatLeft flex" v-if='li.username != username'>
							<img :src='li.avator' class='avator'>
							<div class="chatMain">
								<div class="chatTime" style='margin-right:20px'>{{li.create_time | formateTime}}</div>
								<div>{{li.message}}</div>
							</div>
						</div>
						
						<div class="charRight flexEnd" v-if='li.username == username'>
							<div class="chatMain" style='margin-right:20px'>
								<div class="chatTime" style='text-align:right'>{{li.create_time | formateTime}}</div>
								<div style='text-align:right'>{{li.message}}</div>
							</div>
							<img :src='li.avator' class='avator'>		
						</div>
					
					</div>
				</div>
				
				<div class="chatSend flex">
					<textarea
					  style='width:calc(100% - 100px)'
					  rows="2"
					  class='el-textarea__inner'
					  placeholder="请输入内容"
					  v-model="input">
					</textarea>
					<button class='el-button el-button--primary' @click='send' style='width:100px'>发送</button>
				</div>	
			</div>

			<div class="chatUserList" style='width:380px;margin-left:40px;background:#fff;padding:20px 0;border-radius:6px;height:calc(100% - 120px);overflow-y:auto'> 
				<div class="chatUserHeader">
					在线用户列表
				</div>
				<div class="chatUser alignCenter" v-for='li in users' style='padding:10px 20px'>
					<img :src='li.avator' class='avator'>
					<span class='username'>{{li.username}}</span>
				</div>
			</div>
		
		</div>
	</div>
</template>
<script type="text/javascript">
	import xheader from '@/components/xheader'
	import publicJs from '@/public';
	import cookie from '@/cookie';
	import io from 'socket.io-client';

	export default {
		data () {
			return {
				chatList:[],
				input:null,
				socket:null,
				username: null,
				isKeyDown:false, //解决按键触发多次问题，
				chatUsers:[],
				users:[],
			
			}
		},
		mounted: function(){
			this.getUserInfo();

			let self = this;

			// this.socket = io();  //如果没有指向url,默认会连接当前页面的主机
			this.socket = io('http://localhost:3001');

			// this.socket = io('http://116.85.48.142:3001');
			// this.socket.emit('system',`${this.username} 进入聊天室`);
// 
			// this.socket.emit('addUser',this.username); 

			
			this.socket.on('message',function(message){
				self.receiveMessage(message);
			})

			this.socket.on('system',function(message){
				self.receiveSystemMessage(message);
			})

			this.socket.on('connect',function(){
				console.log('connecte to server')
			})

			this.socket.on('userList',function(userList){
				self.users = userList; 
				console.log(self.users);
			})

			this.getChatList('room_1');

			let i = 0

			//enter发送消息，并解决keydown重复触发问题
			window.addEventListener('keyup',function(e){
				// console.log('code:',e.keyCode);

				if(e.keyCode == 13 && i == 0){
					self.send();
					i ++;

					setTimeout(function(){
						i = 0;
					},1500)

				}

			})

			
		},

		methods:{
			getUserInfo: function(){

				let userInfo = cookie.getCookie('userInfo'); console.log(userInfo);
				if(userInfo){
					userInfo = JSON.parse(userInfo);
					this.username = userInfo.username;
					this.avator = userInfo.avator;
					
				}
			},

			sendMessage: function(message){

				let sendMessage = {message:message,username:this.username,avator:this.avator,create_time:new Date()};
				this.socket.emit('message',sendMessage);
				this.chatList.push(sendMessage);
				this.input = '';		
				this.scrollToBottom();
				this.isKeyDown = true;
			},

			send: function(){
			
				if(this.input == null || this.input == ' '){
				
					return;
				}

				this.sendMessage(this.input);


			},

			receiveMessage: function(message){
				console.log(message);
				this.chatList.push(message);
				this.scrollToBottom();


			},

			receiveSystemMessage: function(message){
				console.log(`receive system message ${message}`);
				// this.$message({message});
			},

			// 获取聊天列表
			getChatList: function(roomId){
				let self = this;
				let url = publicJs.baseUrl + 'chatList';
				let params = JSON.stringify({roomId:roomId});
				publicJs.ajaxJSON('post',url,params,function(data){
					console.log(data);
					if(data.data.code == 0){
						self.chatList = data.data.data;
						self.scrollToBottom();
					}
				})

			},

			getChatUsers: function(){
				let self = this;
				let url = publicJs.baseUrl + '/getchatUsers';

			},

			//聊天框滚动条置底
			scrollToBottom: function(){
				this.$nextTick(function(){
					let chatBox = document.querySelector('.chatBox');
					let h = chatBox.offsetHeight;
					let scrollTop = chatBox.scrollTop;
					let scrollH = chatBox.scrollHeight;
		
					chatBox.scrollTop  = scrollH;

				})
			
			},




		},

		components:{
			xheader,
		},
		filters:{
			formateTime: function(val){
				if(val){
					val = new Date(val);
					let year = val.getFullYear();
					let month = val.getMonth() + 1;
					let day = val.getDate();
					let h = val.getHours();
					let m = val.getMinutes();
					let s = val.getSeconds();

					if(month < 10){
						month = '0' + month;
					}
					if(day < 10){
						day = '0' + day;
					}
					if(h < 10){
						h = '0' + h;
					}
					if(m < 10){
						m = '0' + m;
					}
					if(s < 10){
						s = '0' + s;
					}

					return year + '-' + month + '-' + day + ' ' +  h + ':' + m + ':' + s;

				}
			},

			//设置聊天时间显示问题，如果是在当前小时内，就显示分秒；若在当天显示时分秒，若不在当天显示全部时间
			formateChatTime: function(){

			}
		}
		
	}
</script>