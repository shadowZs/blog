import {GET, POST, POSTFORM, POSTFILE} from './base.js';

let base = 'http://47.106.171.33:3000/';

// 上传图片
export const CHOOSEFILE = function(cb){
	// return new Promise( (resolve,reject) => {
		let input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.addEventListener('change', function(){
			let file = this.files[0];
			let formData = new FormData();
			formData.append('file', file);
			let url = base + 'upload';
			
			POSTFILE(url, formData, cb);
			
		// })

		
	})
		
	input.click();
}


// 登录
export const LOGINS = (params) => {
	let url = base + 'login'; 
	return POST(url, params);

}

// 注册
export const REGISTER = (params) => {
	let url = base + 'register'
	return POST(url, params);
}

// 