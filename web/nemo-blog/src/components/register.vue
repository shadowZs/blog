
<template>
	<div style='width:100%;height:100%'>
		<xheader active='register'></xheader>
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

				<div class="flex top-20 alignCenter left-100">
					<span class="subtitle">确认密码： </span>
					<input v-model='repeatPass' class='width-200 el-input__inner' style='width:300px' placeholder='请确认密码'></input>
				</div>

				<div class="flex top-20 alignCenter left-100" style='height:80px'>
					<!-- <el-button type='text' class="subtitle" @click='selectImg' style='text-align: left'>上传头像</el-button> -->
					<span class="hover" @click='selectImg' style='text-align: left;color:#409EFF;margin-right:30px'>上传头像</span>
					<img :src='addImg' class='addImg hover' style='width:64px;height:64px' v-show='addImg'>
				</div>

				<div class="flex top-20 alignCenter left-100">
					<button class='el-button el-button--primary' @click='submitRegister'>注册</button>
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

	import upload from '../plugins/upload';

	export default {
		data () {
			return {
				addImg:null,
				userName:null,
				password:null,
				repeatPass:null,
			}
		},
		mounted:function(){
			let url = publicJs.baseUrl 
	
		},

		methods:{

			selectImg: function(){
				let self = this;
				// publicJs.addImg(function(data){
				// 	if(data.data.code == 0){
				// 		self.addImg = data.data.message
				// 	}
				// });

				upload.uploadFile().then(function(data){
					console.log(data);
					self.addImg = data.data.message
				})
			},

			submitRegister: function(){
				let self = this;
				let url = publicJs.baseUrl + 'register';

				if(this.userName == null) {
					alert('注册名必填');
					return
				}

				if(this.password == null){
					alert('请输入密码');
					return 
				}

				if(this.repeatPass == null){
					alert('请确认密码');
					return
				}

				if(this.password != this.repeatPass){
					alert('密码和确认密码必须一致，请重庆输入');
					return
				}

				if(this.addImg == null){
					alert('请上传头像');
					return
				}

				let params = JSON.stringify({
					userName:this.userName,
					password:this.password,
					avator: this.addImg
				})
				publicJs.ajaxLogin('post',url,params,function(data){
					console.log(data);

					if(data.data.code == 0){
						cookie.setCookie('userInfo',JSON.stringify(data.data.data),'max');

						localStorage.setItem('token',data.data.token);
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