// 上传图片
exports.uploadImg = async (ctx,next) => {
	console.log(ctx);
	console.log(ctx.req);
	console.log(ctx.request);
	ctx.body = 'post img'
}

exports.get = async(ctx,next) => {
	ctx.body = 'hello world'
}