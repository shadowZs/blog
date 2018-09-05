<template>
	<div class='main'>
		<xheader></xheader>
		<div class="mainContent">
			<div class="mainBox">
				<div class="detailTitle">
					<div class="detail_top flexBetween">
						<span class='detail_title'>{{message.title}}</span>
						<span class='spanBtn' v-show='isShowEdit' @click='toEdit'>编辑</span>
					</div>
					<div class="sub_detail_title"> 	
						<span>发布于{{message.create_time}}*作者{{message.username}}</span>
						<span>*最近编辑于：{{message.editTime}}</span>
					</div>
				</div>
				
				<div class="detailContent " v-html='message.content'>
					
				</div>
			</div>	
		</div>

		<div class="commentArea showArea" v-show='len != 0'>
			<div class="commentTitle" >{{len}}个回答</div>
			<div class="commentList flex" v-for='(li,index) in comments' >
				<img :src='li.avator' class='avator'>
				<div class="commentMessage">
					<div class="commentShort">
						<span class="commentUser">{{li.username}}</span>
						<span class="commentIndex">{{index + 1}}楼</span>
						<span class="commentTime">{{li.create_time | formateTime}}</span>
					</div>
					<div class="commentContent">{{li.content}}</div>
				</div>
			</div>
		</div>

		<div class="submitComment showArea" v-show='userMessage.username != null'>
			<div class="submitCommentTitle title">添加评论</div>
			<div class="flex" >
				<img :src='userMessage.avator' class='avator'>
				<textarea
				  type="textarea"
				  class='el-textarea__inner'
				  style='width:calc(100% - 120px)'
				  placeholder="请输入内容"
				  v-model="textarea">
				</textarea>

				<button style='width:120px;' class='el-button el-button--primary' @click='submitComment'>提交评论</button>
			</div>
			
		</div>

	</div>
</template>
<script type="text/javascript">
	import xheader from '@/components/xheader'
	import publicJs from '@/public';
	import cookie from '@/cookie';
	export default {
		data () {
			return {
				id:null,
				message:{username:null},
				comments:[],
				len:0,
				userMessage:{username:null},
				textarea:null,
				isShowEdit:false,
			} 
		},
		mounted: function(){
			this.getId();
			this.getUserInfo();
		},
		methods:{

			getUserInfo: function(){
				let userInfo = cookie.getCookie('userInfo'); 
				if(userInfo){
					this.userMessage = JSON.parse(userInfo); 
				}else{
					// location.href = '#/login';
				}
			},

			getId: function(){
				this.id = this.$route.params.id;
				this.getDetail();
				this.getComments();
			},

			getDetail: function(){
				let self = this;
				let url = publicJs.baseUrl + 'getDetail';
				let params = JSON.stringify({id:this.id});
				publicJs.ajaxJSON('post',url,params,function(data){
					console.log(data);
					if(data.data.code == 0){
						self.message = data.data.data;
						if(self.message.edit_time){
							self.message.editTime = publicJs.formateDate(self.message.edit_time);
						}

						self.message.create_time = self.message.create_time.split('T')[0];
						if(self.message.username == self.userMessage.username){
							self.isShowEdit = true;
						}

					}
			
				})

			},

			getComments: function(){
				let self = this;
				let url = publicJs.baseUrl + 'getComments';
				let params = JSON.stringify({id:this.id});
				publicJs.ajaxJSON('post',url,params,function(data){
					console.log(data);
					if(data.data.code == 0){
						self.comments = data.data.data;
						self.len = self.comments.length;
					}
				})
			},

			submitComment: function(){
				let self = this;
				if(this.textarea == null){
					this.$alert('请填写评论内容');
					return
				}

				let params = JSON.stringify({id:this.id,username:this.userMessage.username,avator:this.userMessage.avator,content:this.textarea});
				let url = publicJs.baseUrl + 'submitComment';

				publicJs.ajaxJSON('post',url,params,function(data){
					console.log(data);
					if(data.data.code == 0){
						self.textarea = null;
						self.getComments();
					}
				})



			},

			// 重新编辑文章
			toEdit: function(){
				location.href = '#/publish/' + this.id;
			}

		},
		components:{
			xheader,
		},
		filters:{
			formateTime: function(val){
				if(val){
					return val.split('T')[0];
				}
			}
		}
	}
</script>