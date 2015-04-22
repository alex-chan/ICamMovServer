// 在 Cloud code 里初始化 Express 框架
var model = require("cloud/model.js");
var express = require('express');
var populate  = require("cloud/populate.js");



var app = express();

var avosExpressCookieSession = require('avos-express-cookie-session');


// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 启用 cookieParser
app.use(express.cookieParser('icammov cookie secure '));
// 使用 avos-express-cookie-session 记录登录信息到 cookie
app.use(avosExpressCookieSession({ cookie: { maxAge: 3600000 }, fetchUser: true}));

// 管理入口
function checkAdminRole(req){
    if( ! req.AV.user ){
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        res.redirect("/admin/login?came_from="+fullUrl);
    }
    if(req.AV.user in  populate.adminRole.getUsers() ){
        console.log("current user in admin role");
    }else{
        console.log(" not in admin role");
    }
}

app.get('/admin/subtitles', function(req, res){

    checkAdminRole(req);

    var query = new AV.Query(model.Subtitle );
    query.find().done(function(results){
        console.log(results);

        res.render("admin/subtitles", {subtitles: results});
    }).fail( function(err){
        res.send("Error:"+err.message);
    });
});

app.get('/admin/addsubtitle', function(req, res){

    checkAdminRole(req);

    res.render("admin/addsubtitle");
});

app.post("/admin/addsubtitle", function(req, res){

    checkAdminRole(req);

    var subtitle = new model.Subtitle();
    subtitle.set("english", req.body.english);
    subtitle.set("chinese", req.body.chinese);
    subtitle.save();



    res.redirect("admin/subtitles");
});


app.get('/admin/login', function(req, res){
    if( req.user ){
        console.log('redirect to admin');
        res.redirect("/admin");

    }

    res.render("admin/login");

});

app.post('/admin/login', function(req ,res){


    var phoneNum = req.body.phonenum;
    var password = req.body.password;

    AV.User.logInWithMobilePhone(phoneNum, password)
        .done(function(user){

            var url = req.query.came_from || "/admin";
            console.log("redirect url"+ url);
            res.redirect(url);

        })
        .fail(function(err){
            res.render('admin/login', {err: err.message});
        })


});


app.get('/admin/register', function(req, res){
    if( req.user ){
        res.redirect("/admin");
    }

    res.render("admin/register");

});


// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});



app.get("/videos/:vid", function(req, res){
    var videoQuery = new AV.Query(model.Video);

    videoQuery.get(req.params.vid).then(function(video) {

        console.log('video:' + video);
        console.log('videoFile:' + video.get('videoFile'));

        var owner = video.get('owner');

        console.log('owner:' + owner.id);
        console.log('owner2:' + owner.get('username'));


        owner.fetch().then(function(user){

            console.log('user:' + user.get('username'));
            res.render('video', {
                video: video,
                user: user
            });

        }, function(){
            res.send(500,'Error find user');
        });


    }, function(){
        res.send(500, 'Failed to find specified video');
    });
});



// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();