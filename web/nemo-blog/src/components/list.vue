<template>
	<div class='main'>
		<xheader active='index'></xheader>
		<div class="mainContent">
			<div class="mainBox">
				
				<div class="selectLi">
					<span class="selectBtn activBtn hover" :class='active == "all" ? "isActive" : ""' @click='changeItem("all")'> 全部</span>
				<!-- 	<span class="selectBtn hover" @click='changeItem("new")' :class='active == "new" ? "isActive" : ""'>最新</span> -->
					<span class="selectBtn hover" @click='changeItem("most")' :class='active == "most" ? "isActive" : ""'>最多评论</span>
				</div>
				<div class="empty" v-show='list.length == 0'>目前还没有任何文章</div>
				<div class="topic_title  topic_list flexBetween" v-show='list.length != 0' v-for='li in list' @click='toDetail(li.id)'>
					<div class="topic_left alignCenter">
						<img :src='li.avator' class='avator'>
						<div>
							<div class="topic_title_short">{{li.title}}</div>
							<div class="messageShort">
								<span>点击数：<span class="colorB">{{li.points}}</span></span>
								<span style='margin-left:20px'>评论数：<span class="colorB">{{li.comments}}</span></span>
							</div>	
						</div>
					</div>

					<div class="topic_right">{{li.create_time | formateTime}}</div>
						
				</div>

				<div class="page flexEnd">
				<!-- 	<el-pagination
					  background
					  layout="prev, pager, next"
					  @size-change="handleSizeChange"
	      			  @current-change="handleCurrentChange"
	      			  :current-page="page"
	      			  :page-size="pageSize"
					  :total="total">
					</el-pagination> -->

					<ul class="pagination">
						 <li>«</li>
						 <li v-show='pageDetail[0] != 1'>...</li>
						 <li v-for='i in pageDetail' :class='activePage == i ? "active" : ""' @click='changePage(i)'>{{i}}</li>
						 <li v-show='pageDetail[pageDetail.length - 1] != totalPage'>...</li>
						  <li>»</li>
					</ul>
				</div>
			</div>

		
		
		</div>
	</div>
</template>
<script type="text/javascript">
	import xheader from '@/components/xheader'
	import publicJs from '@/public';

	export default {
		data () {
			return {
				list:[],
				page:1,
				pageSize:10,
				total:1,
				active:'all',
				totalPage:1,
				pageDetail:[],
				activePage:1,
			}
		},
		mounted: function(){
			this.getList();
		},
		methods:{
			handleSizeChange: function(){

			},

			handleCurrentChange: function(val){
				this.page = val;
			},

			changeItem: function(item){
				this.active = item;
				
			},

			changePage:function(i){
				this.page = i;

			},
			getList: function(){
				let self = this;
				let url = null;

				if(this.active == 'all'){
					url = publicJs.baseUrl + 'getArticleList';
				}

				if(this.active == 'new'){
					url = publicJs.baseUrl + 'getArticleListNew';
				}

				if(this.active == 'most'){
					url = publicJs.baseUrl + 'getArticleListMost';
				}

				let params = JSON.stringify({page:this.page,pageSize:this.pageSize});
				publicJs.ajaxJSON('post',url,params,function(data){
					console.log(data);

					if(data.data.code == 0){
						self.list = data.data.data;
						self.total = data.data.total;

						self.totalPage = Math.ceil(self.total / self.pageSize);  
						self.pageDetail = [];
						if(self.totalPage >= 5){
							for(let i = 1; i <= 5 ; i++){
								self.pageDetail.push(i + self.page);
							}		
						}else{
							for(let i=1; i <= self.totalPage; i++){
								self.pageDetail.push(i);
							}
						}
					
					}
				})

			},

			toDetail: function(id){
				location.href = '#/detail/' + id;
			}
		},
		components:{
			xheader,
		},
		watch:{
			page:function(newVal){
				this.getList();
			}
		},

		filters:{
			formateTime: function(val){
	
				if(val){
					let nowTime = Date.now();
					let lastTime = new Date(val).getTime();
					let str = ''

					let min = Math.ceil((nowTime - lastTime) / (1000 *  60));

					let h = Math.floor(min / 60);

					let d = Math.floor(h / 24);

					let m = Math.floor(d / 30);

					let y = Math.floor(m / 12);

					// console.log(min,h,d,m,y);
					// console.log(d > 1 && d < 30)

					if(min < 60){
						str = min + '分钟前'; 
					}

					if(h >= 1 && h < 24){
						str = h + '小时前'; 
					}

					if(d >= 1 && d < 30){
						str = d + '天前';  
					}

					if(m >= 1 && m < 12){  
						str = m + '月前';   
					} 

					if(y >= 1){
						str = y + '年前';  
					}

					return str;


				}
				
			}
		}
	}
</script>