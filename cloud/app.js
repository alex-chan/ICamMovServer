// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});


var _User = AV.Object.extend('_User');
var Video = AV.Object.extend('Video');

app.get("/videos/:vid", function(req, res){
    var videoQuery = new AV.Query(Video);

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