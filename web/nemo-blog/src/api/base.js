import axios from 'axios';
import qs from 'qs';
import cookie from '../cookie'

axios.interceptors.request.use(function (config) {
// Do something before request is sent
	let token = localStorage.getItem('token');
	if(token){
		config.headers.token = token;
	}

return config;
}, function (error) {
// Do something with request error
return Promise.reject(error);
})

axios.interceptors.response.use(function (response) {
  	let data = response.data;

  	if(data.code === 0 || data.code === -1 || data.code == 1){
  		return response;
  	}


  }, function (err) {
    
  	if(err && err.response){
  		switch(err.response.status){
  			case 400:
  				err.message = '请求错误'
  				break;

  			case 401:
  				err.message = '未授权'
  				break;

  			case 403:
  				err.message = '拒绝访问'
  				break;

  			case 404:
  				err.message = '请求地址错误'
  				break;

  			case 500:
  				err.message = '服务器内部错误'
  				break;

  			case 501:
  				err.message = '服务未实现'
  				break;

  			case 502:
  				err.message = '网关错误'
  				break;

  			case 503:
  				err.message = '服务不可用'
  				break;

  			case 504:
  				err.message = '网关超时'
  				break;

  			case 505:
  				err.message = 'http版本不受支持'
  				break;
  		}
  	}


    return Promise.reject(error);
  });


export const GET =  (url,params) => {
	return axios.get(url,{params: params}).then(res =>  res.data);
}

export const POST = (url,params) => {
	return axios.post(url,params).then(res => res.data);
}

export const POSTFORM = (url,params) => {
	return axios.post(url,qs.stringify(params)).then(res => res.data);
}

export const POSTFILE = (url,params,cb) => {
	return axios({
		method: 'post',
		url: url,
		data: params,
		headers: {'Content-type': 'multipart/form-data'}
	}).then( (res) => {
		cb(res);
	})
}