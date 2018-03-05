const express = require('express');
const app = express();
const router = require('./router/router');
const db = require('./model/db');
const session = require('express-session');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

//模板引擎
// app.engine('.htm', require('ejs').__express);
// app.set('view engine','.htm');
app.set('view engine','.ejs');
//静态
app.use(express.static('public'));
app.use(express.static('views'));
app.get('/',router.showindx);
app.get('/blog',router.showblog);
app.get('/demo',router.showdemo);
app.get('/money',router.showmoney);
app.get('/money/addmoneyBase',router.addmoneyBase);
app.post('/money/DoAddmoneyBase',router.DoAddmoneyBase);
app.get('/money/search',router.search);
app.get('/movie/:sid',router.showmovie_in_theaters);



//发表密码
app.get('/blog/:bid',router.MyBlog);
//天加文章
app.post('/blog/add/editer',router.addblog);
app.get('/regi',router.regi);
app.post('/doregi',router.doregi);
app.use('/blog/api/:api',router.api);





//登录
app.get('/login',router.login);
app.post('/dologin',router.dologin);
//退出登录
app.get('/logout',router.logout);
//查看详情
app.get('/blog/user-:name/:article/:id',router.article);
// 删除
app.get('/blog/:id/remove',router.remove);
app.get('/blog/editor/user-:name/:id',router.editor);
app.post('/blog/doEditor/:id',router.doEditor);







//404页面
app.use(function (req,res) {
   res.send('404')
});




app.listen(8000,function () {
    console.log(8000)
});


