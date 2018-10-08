
import axios from 'axios';
import cookie from './cookie';


function getToken(){
	let token = localStorage.getItem('token'); 
	if(token){ 
		return token;
	}
}


let baseUrl = 'http://localhost:3100/';
// let baseUrl = 'http://47.106.171.33:3/Z000/';  //aliyun

function upload(params){
	let url = baseUrl + 'upload';
	return axios({
		method:'post',
		url: url,
		data:params,
		headers: {'Content-Type':'multipart/form-data'}
	}).then(res => {
	  console.log('uploadRes:', res);
	  return res;
  }).catch(err => {
    console.log(err);

  })
}

//插入图片
function addImg(callback){
	let self = this;
	let input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';
	input.addEventListener('change',function(){
		let file = this.files[0];  
		let formData = new FormData();
		formData.append('file',file);


		let url = baseUrl + 'upload'; 
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

// ajax json
function ajaxJSON (method,url,params,callback){
	showLoadding();
	let token = getToken(); 
	axios({
		method:method,
		url:url,
		data:params,
		headers:{'Content-Type':'application/json',token:token}
	}).then(function(data){
	 	hideLoadding();

	 	if(data.data.code == 0){
	 		callback(data);
	 	}

	 	if(data.data.code == -1){
	 		alert(data.data.message);
	 	}

	 	if(data.data.code == 2){          //code 2表示token已失效，过期或在其他地方登录
	 		localStorage.removeItem('token'); 
	 		alert(data.data.message);
	 	}

		
	}).catch(function(err){
		console.log(err);
	})
}

// login 
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

function ajaxRegister(method, url, params, callback){
  axios({
    method: method,
    url: url,
    data: params,
    headers: {'Content-Type': 'application/json'}
  }).then( (data) => {
    callback(data)
  }).catch(err => {
    console.log(err);
  })
}



function showLoadding() {
   let loading = '<div class="res-mask loadding"><div class="dis-table"><div class="dis-tablecell"><div class="loadEffect"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div></div></div>'
	let loadingBox = document.createElement('div');
	loadingBox.className = 'loadingBox';
	loadingBox.innerHTML = loading;
  loadingBox.style.position = 'fixed';;
	loadingBox.style.top = 0;

	document.body.appendChild(loadingBox);
}
 
function hideLoadding() {
	let loading = document.querySelector('.loadingBox');
	document.body.removeChild(loading);
}

function formateDate(val){
	if(val){
		val = new Date(val);
		let year = val.getFullYear();
		let month = val.getMonth() + 1;
		let date = val.getDate();
		let h = val.getHours();
		let m = val.getMinutes();
		let s = val.getSeconds();

		month > 9 ? month = month : month = '0' + month;
    date > 9 ? date = date : date = '0' + date;
    h > 9 ? h = h : h = '0' + h;
    m > 9 ? m = m : m = '0' + m;
    s > 9 ? s = s : s = '0' + s;

		return year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + s;
	}

}

export default {
	baseUrl:baseUrl,
	// imgUrl:imgUrl,
	addImg:addImg,
	ajaxJSON:ajaxJSON,
	ajaxLogin:ajaxLogin,
	showLoadding:showLoadding,
	hideLoadding:hideLoadding,
	formateDate:formateDate,
	upload:upload,
  ajaxRegister: ajaxRegister
}
