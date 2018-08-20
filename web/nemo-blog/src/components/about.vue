<template>
	<div class='main'>
		<xheader active='about'></xheader>
		<div class="mainContent editBox">
			<div class="mainBox">
				<div class="innerBox">
					<h3 style='font-size:26px'>关于</h3>

					<div class="myInfo">
						这是个人Blog，项目前端基于Vue来开发，后端采用Koa2，数据库采用Mysql，项目部署于阿里云服务器。<br/>
						github 地址：
						<a href='#'></a>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script type="text/javascript">
	import xheader from './xheader';
	import E from 'wangeditor';
	import publicJs from '@/public';


	export default {
		data: function(){
			return {
				title:null,
				content:null,
				editor:null,
				userName:null,
			}
		},

		mounted: function(){

		},


		methods:{

		



		},
		components:{
			xheader,
		}
	}
</script>