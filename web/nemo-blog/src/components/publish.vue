<template>
	<div class='main'>
		<xheader active='publish'></xheader>
		<div class="mainContent editBox">
			<div class="mainBox">
				<div class="flex margin_20 alignCenter" style='margin-top:30px'>
					<span class="right_20" >标题:</span>
					<input v-model='title' class='el-input__inner' placeholder='请输入文章标题' style='width:500px'></input>
				</div>

				<div id="editor" class='margin_20 top-50' style='width:90%;height:calc(100% - 220px)'></div>

				<button @click='saveEdit' class='el-button el-button--primary' style='margin-left:20px;margin-top:30px;width:120px'>保存</button>
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
				id: null, // 文章id，若新增文章则id为0
			}
		},

		mounted: function(){

			this.createEditor();
			this.getId();
		},


		methods:{

			createEditor: function(){
				this.editor = new E('#editor');
				
				this.editor.customConfig.menus = [
			        'head',  // 标题
				    'bold',  // 粗体
				    'fontSize',  // 字号
				    'fontName',  // 字体
				    'italic',  // 斜体
				    'underline',  // 下划线
				    'strikeThrough',  // 删除线
				    'foreColor',  // 文字颜色
				    'backColor',  // 背景颜色
				    'link',  // 插入链接
				    'list',  // 列表
				    'justify',  // 对齐方式
				    'quote',  // 引用
				    'emoticon',  // 表情
				    'image',  // 插入图片
				    'table',  // 表格
				    'code',  // 插入代码
				    'undo',  // 撤销
				    'redo'  // 重复
				    ]
				this.editor.customConfig.uploadImgServer = publicJs.baseUrl + 'upload';
				this.editor.customConfig.uploadFileName = 'file'
				this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
				this.editor.customConfig.uploadImgHooks = {
				    before: function (xhr, editor, files) {
				        // 图片上传之前触发
				        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
				        
				        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
				        // return {
				        //     prevent: true,
				        //     msg: '放弃上传'
				        // }
				    },
				    success: function (xhr, editor, result) {
				        // 图片上传并返回结果，图片插入成功之后触发
				        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
				    },
				    fail: function (xhr, editor, result) {
				        // 图片上传并返回结果，但图片插入错误时触发
				        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
				    },
				    error: function (xhr, editor) {
				        // 图片上传出错时触发
				        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
				    },
				    timeout: function (xhr, editor) {
				        // 图片上传超时时触发
				        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
				    },

				    // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
				    // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
				    customInsert: function (insertImg, result, editor) {
				    	console.log('result:',result);
				        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
				        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

				        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
				        // var url = JSON.parse(result.message); console.log(url)
				        var url = null;

				        if(result.code == 0){
				        	url = result.message;
				        }
				        
				        insertImg(url)

				        // result 必须是一个 JSON 格式字符串！！！否则报错
				    }
				
				}

				this.editor.create();

			},

			getId: function(){
				this.id = this.$route.params.id;
				if(this.id != 0){
					this.getDetail();
				}
			},

			getDetail: function(){
				let self = this;
				let url = publicJs.baseUrl + 'getDetail';
				let params = JSON.stringify({id:this.id});
				publicJs.ajaxJSON('post',url,params,function(data){
					if(data.data.code == 0){
						console.log(data);
						self.title = data.data.data.title;
						self.editor.txt.html(data.data.data.content);

					}
				})
			},

			saveEdit: function(){
				let self = this;
				let url = null;

				if(this.id == 0){
					url = publicJs.baseUrl + 'publish';

				}else{
					url = publicJs.baseUrl + 'updateArticle';
				}

				if(this.title == null){
					// this.$alert('标题必填');
					alert('标题必填');
					return
				}

				this.content = this.editor.txt.html(); console.log(this.content);
				let params = JSON.stringify({title:this.title,content:this.content,id:this.id}); 
				publicJs.ajaxJSON('post',url,params,function(data){
					console.log(data);
					if(data.data.code == 0){
						// self.$message({message:'发布成功',type:'success'});
						location.href = '#/my'
					}
				})
				
			}




		},
		components:{
			xheader,
		}
	}
</script>