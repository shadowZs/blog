
<template>
	<div style='width:100%;height:100%'>
		<xheader active='login'></xheader>
		<div class="mainContent flexCenter">
			<div class="registerMain">
				<div class="mainTitle">用户注册</div>
				<div class="flex top-50 alignCenter left-100">
					<span class="subtitle">用户名：</span>
					<input v-model='userName' class='width-200 el-input__inner' style='width:300px'placeholder='请输入用户名'></input>
				</div>

				<div class="flex top-20 alignCenter left-100">
					<span class="subtitle">密码：</span>
					<input v-model='password' class='width-200 el-input__inner' style='width:300px' placeholder='请输入密码'></input>
				</div>
				<div class="flex top-20 alignCenter left-100" style='margin-left:200px;margin-top:50px'>
					<button class='el-button el-button--primary' @click='loginIn'>登录</button>
				</div>
			</div>
		</div>
	</div>
	
</template>
<script type="text/javascript">
	import xheader from '@/components/xheader';
	import addImg from '@/assets/addImg.png';
	import publicJs from '@/public';
	import cookie from '@/cookie';

	export default {
		data () {
			return {
				addImg:addImg,
				userName:null,
				password:null,
				repeatPass:null,
			}
		},
		mounted: function(){
			this.getCookie();

			let self = this;

			// 多个事件监听会导致冲突？
			
			// window.addEventListener('keyup',function(event){

			// 	let e = event || window.event;
			// 	if(e.keyCode == 13){
			// 		self.loginIn();
			// 	}
			// })
		},

		methods:{
			getCookie:function(){
				let userInfo = cookie.getCookie('userInfo'); console.log(userInfo)
				if(userInfo != undefined && userInfo != 'undefined'){
					let message = JSON.parse(userInfo);

					this.userName = message.username;
					this.password = message.password;

				}

			},

			loginIn: function(){
				let self = this;

				if(this.userName == null || this.password == null){
					alert('请输入用户名或密码');
					return;
				}

				let url = publicJs.baseUrl + 'login';
				let params = JSON.stringify({userName:this.userName,password:this.password});
				publicJs.ajaxLogin('post',url,params,function(data){
					console.log(data);
					if(data.data.code == 0){
						cookie.setCookie('userInfo',JSON.stringify(data.data.data),'max');
						let token = data.data.token;

						localStorage.setItem('token',token);
						location.href = '#/list';

					}else{
						alert(data.data.message);
					}
				})


			}
		},

		components:{
			xheader,
		}
	}
</script>