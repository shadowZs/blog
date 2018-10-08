// const nodeHttp = require('../request');
const list = require('../art/list');
const postArticleList = require('../script/getArticleList');

// 列表
exports.getList = async (ctx, next) => {
    let params = JSON.stringify({
        page: 1,
        pageSize: 10
    })

    // url 若用简写/getArticleList会提示无效uri，原因？

   let responseBody = await nodeHttp.init(config);
    console.log('responseBody:', responseBody);

    let pageList = ['this is a list', 'this is a list'];
    await ctx.render('list', {
        pageList,
    })
}

