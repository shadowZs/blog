// 封装上传图片插件
import publicJs from '../public.js';

function uploadFile(){
	return new Promise((resolve,reject) => {
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.addEventListener('change',function(){
			let file = this.files[0];
			let formData = new FormData();
			formData.append('file',file);
			
			return publicJs.upload(formData).then(function(data){
				if(data.data.code == 0){
					resolve(data);
				}else{
					reject(data);
				}
			}).catch (err => {
			  console.log(err);
      })

		})

		input.click();
	})
	
}




export default {
	uploadFile,
}
