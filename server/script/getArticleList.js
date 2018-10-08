const NodeHttp = require('../request');

exports.getArticle = async function(ctx, parmas){
    params == undefined ? JSON.stringify({page:1, pageSize: 10}) : params;
    let defaultConfig = {
        url: 'http://localhost://3100/getArticleList',
        method: 'post',
        body: params,
        headers: {
            'Content-Type': 'application/json'
        }
    }

   let result = await nodeHttp.init(defaultConfig);
    console.log(result);
}