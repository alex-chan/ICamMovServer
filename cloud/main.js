require("cloud/app.js");
var _ = require("cloud/lib/underscore.js");
var model = require("cloud/model.js");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


AV.Cloud.define("getHost", function(req, res){

    console.log("req:"+req)
    console.log("protocol:"+ req.protocol)
    console.log("hostname:"+ req.hostname)
    var ret = req.protocol + "://" + req.hostname
    var host = "icam.avosapps.com"
    if(__production){
        res.success("https://"+host)
    }else{
        res.success("https://dev."+host)
    }


});

AV.Cloud.define("fetchRandomSubtitle", function(req, res){
   var query = new AV.Query(model.Subtitle);
    query.count().done(function(count){
        var random = _.random(count-1);
        query.skip(random);
        query.limit(1);
        query.ascending("createdAt");
        query.first().done(function(result){
            res.success(result);
        }).fail(function(err){
            res.error("err"+err.message)
        })

    })
});

AV.Cloud.define("refreshVideos", function(req, res){

    var timeline = req.params.timeline;
    console.log( req.user );

    var curUser = req.user;

    var query = new AV.Query(model.Video);

    query.limit(10);
    query.descending("updateAt");

    //res.error("No data");

    query.find().then(function(videos){
        console.log("success return videos");
        res.success(videos);
    }).catch(function(error){
        res.error("Error:"+error);
    })



})