<!-- 编写一个quillEditor富文本组件
编写于 2018.9.7
 -->
<template>
	<div>
		<quill-editor 
			style='height:500px;margin-top:20px;padding:20px'
			v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
			@change='onEditorChange($event)'>      
		</quill-editor>

	</div>
</template>
<script>
	import {quillEditor} from 'vue-quill-editor'  //通过组件方式引入vue-quill-editor
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	import publicJs from '@/public.js'

	export default {
		data () {
			return {
				// content: null,
				editorOption:{
					modules:{
						toolbar:[

							['bold', 'italic', 'underline', 'strike'],
			                ['blockquote', 'code-block'],
			                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
			                [{ 'indent': '-1' }, { 'indent': '+1' }],
			                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			                [{ 'font': [] }],
			                [{ 'color': [] }, { 'background': [] }],
			                [{ 'align': [] }],
			                ['link', 'image', ]
						]
					}
				}
			}
		},

		props:{
			content:null,
		},

		mounted: function(){

			let self = this;
			this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image',self.imgHandler);  //修改toolbar中image绑定事件
		},
		methods: {
			onEditorBlur (event) {
				this.$emit('editorBlur',event);
			},

			onEditorFocus (event) {
				this.$emit('editorFocus',event);
			},

			onEditorReady (event) {
				this.content = this.propContent;
				this.$emit('editorReady',event);
			},

			onEditorChange (event) {
				this.$emit('editorChange',this.content);
			},

			//  image绑定事件
			imgHandler (bool) {
				let self = this;
				if(bool){
					let quill = self.$refs.myQuillEditor.quill;
					let index = quill.getSelection();    //当前光标位置
					publicJs.addImg(function(data){
						if(data.data.code == 0){
							let url = data.data.message;
							quill.insertEmbed(index,'image',url);
							quill.setSelection(index + 1);
						}else{
							alert('插入图片失败');
							return
						}
					})
				}
			}


		},

		components:{
			quillEditor,
		},

		watch:{
			propContent:function(newVal){
				if(newVal != null){
					console.log(propContent);
				}
			}
		}
		
	}
</script>