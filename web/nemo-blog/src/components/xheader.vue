<template>
	<div class='xheader flexBetween alignCenter flexWrap'>
		<img :src='logo' class='logoIcon'>
		<div class="functionBtns flexEnd">
			<a href='#/list' class="function" :class='active == "index" ? "activeItem" : ""'>首页</a>
			<a href='#/my' class="function" v-show='isLogin' :class='active == "my" ? "activeItem" : ""'>我的文章</a>
			<a href='#/publish/0' class="function" v-show='isLogin' :class='active == "publish" ? "activeItem" : ""'>发表文章</a>
			<a href='#/about' class="function" :class='active == "about" ? "activeItem" : ""'>关于</a>
			<a href='#/chat' class="function" :class='active == "chat" ? "activeItem" : ""' v-show='isLogin' >交流</a>
			<a href='#/register' class="function" v-show='!isLogin' :class='active == "register" ? "activeItem" : ""'>注册</a>
			<a href='#/login' class="function" v-show='!isLogin' :class='active == "login" ? "activeItem" : ""'>登录</a>
			<a href='#' class="function" @click='loginOut' v-show='isLogin' :class='active == "loginOut" ? "activeItem" : ""'>登出</a>
		</div>
	</div>
</template>
热负荷                                   
<script type="text/javascript">
	import logo from '@/assets/logo.png';
	import cookie from '@/cookie';
	export default {
		data () {
			return {
				logo:logo,
				isLogin:null,
				// active:'index'
			}
		},
		props:['active'],
		mounted: function(){
			this.getUserInfo();
		},

		methods:{
			getUserInfo: function(){
				let userInfo = cookie.getCookie('userInfo'); 
				if(userInfo){
					this.isLogin = true
				}else{
					this.isLogin = false;
				}
			},


			loginOut: function(){
				cookie.clearAll();
				location.href = '#/login'
			},

		}
	}
</script>
<style type="text/css">
	.function{display:inline-block;padding: 0 20px;}
</style>