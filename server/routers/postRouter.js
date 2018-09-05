const router = require('koa-router')();
const multer = require('koa-multer');

const controller = require('../controllers/postController')

let storage = multer.diskStorage({
	destination: (req,file,cb) => {
		cb(null,'upload/others/')
	},

	filename: (req,file,cb) => {
		let name = file.originalname.split('.');
		cb(null,Date.now() + '.' + name[name.length - 1]);
	}
})

let upload = multer({
	storage:storage
})

router.post('/upload',upload.single('file'),controller.upload);

router.post('/register',controller.register);

router.post('/login',controller.login);

router.post('/publish',controller.publish);

router.post('/updateArticle',controller.updateArticle)

router.post('/getArticleList',controller.getArticleList);

router.post('/getArticleListNew',controller.getArticleListNew);

router.post('/getArticleListMost',controller.getArticleListMost);

router.post('/getDetail',controller.getDetail);

router.post('/getArticleByname',controller.getArticleByname);

router.post('/getArticleBynameMostComments',controller.getArticleBynameMostComments);

router.post('/getComments',controller.getComments);

router.post('/submitComment',controller.submitComment);

router.post('/chatList',controller.checkChat);

// router.post('/addChatRoomUser',controller.addChatRoomUser);

// router.post('/deleteChatRoomUser',controller.deleteChatRoomUser);

module.exports = router;