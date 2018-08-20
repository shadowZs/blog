<template>
	<div>
		<xheader></xheader>
		<div class="mainContent">
			this is index page
		</div>
		
		
	</div>
</template>
<script type="text/javascript">
	import xnav from '@/components/xnav';
	import xheader from '@/components/xheader';

	export default {
		data () {
			return {


			}
		},

		methods:{

		},
		components:{
			xnav,
			xheader,

		}
	}
</script>
<style type="text/css">
	/*.mainContent{height:calc( 100% - 88px );width:100%;}*/
</style>