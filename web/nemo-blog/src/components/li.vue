<template>
	<div>
		<div class="topic_title  topic_list flexBetween" v-show='list.length != 0' v-for='li in list' @click='getDetail(li.id)'>
			<div class="topic_left alignCenter">
				<img :src='li.avator' class='avator'>
				<div>
					<div class="topic_title_short">{{li.title}}</div>
					<div class="messageShort">
						<span>点击数：<span class="colorB">{{li.points}}</span></span>
						<span style='margin-left:20px'>评论数：<span class="colorB">{{li.comments}}</span></span>
						<span style='margin-left:20px' class="editTime" v-show='li.edit_time != null'>  最近编辑时间：{{li.edit_time}}</span>
					</div>	

				</div>
			</div>

		<div class="topic_right">{{li.create_time | formateTime}}</div>
	  </div>
   </div>
</template>
<script type="text/javascript">
	export default {
		props: {
			list:null,
		},

		methods:{
			getDetail: function(li){
				this.$emit('getDetail',li);
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