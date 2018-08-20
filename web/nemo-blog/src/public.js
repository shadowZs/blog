
import axios from 'axios';
import cookie from './cookie';


function getToken(){
	// let token = cookie.getCookie('token'); console.log(token);
	let token = localStorage.getItem('token');  console.log(token);
	if(token){ 
		return token;
	}
}




let baseUrl = 'http://localhost:3000/'
// let baseUrl = 'http://116.85.48.142:3000/'; //滴滴云服务器
// let baseUrl = 'http://47.106.171.33:3000/';  //aliyun
// let imgUrl = 'http://116.85.48.142:1101/image/';


//插入图片
function addImg(callback){
	let self = this;
	let input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';
	input.addEventListener('change',function(){
		let file = this.files[0];  console.log(file)
		let formData = new FormData();
		formData.append('file',file);


		let url = baseUrl + 'upload'; console.log(url);
		axios({
			method:'post',
			url:url,
			data:formData,
			headers:{'Content-Type':'multipart/form-data'}
		}).then(function(data){
			callback(data);
		})

	})

	input.click();
}


function ajaxJSON (method,url,params,callback){
	showLoadding();
	// let userName = getUser();
	let token = getToken(); 
	console.log('token:',token);
	axios({
		method:method,
		url:url,
		data:params,
		headers:{'Content-Type':'application/json',token:token}
	}).then(function(data){
	 	hideLoadding();
		callback(data)
	}).catch(function(err){
		console.log(err);
	})
}


function ajaxLogin(method,url,params,callback){
	axios({
		method:method,
		url:url,
		data:params,
		headers:{'Content-Type':'application/json'}
	}).then(function(data){
		callback(data)
	}).catch(function(err){
		console.log(err);
	})
}


function showLoadding() {
	
   let loading = '<div class="res-mask loadding"><div class="dis-table"><div class="dis-tablecell"><div class="loadEffect"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div></div></div>'
	let loadingBox = document.createElement('div');
	loadingBox.className = 'loadingBox';
	loadingBox.innerHTML = loading;
	document.body.appendChild(loadingBox);
}

function hideLoadding() {
	let loading = document.querySelector('.loadingBox');
	// $('.loadding').remove();
	document.body.removeChild(loading);
}

export default {
	baseUrl:baseUrl,
	// imgUrl:imgUrl,
	addImg:addImg,
	ajaxJSON:ajaxJSON,
	ajaxLogin:ajaxLogin,
	showLoadding:showLoadding,
	hideLoadding:hideLoadding,
}