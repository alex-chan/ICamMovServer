var Model = require("cloud/model.js");

var roleACL = new AV.ACL();
roleACL.setPublicReadAccess(true);
var adminRole = new Model.Role("Admin", roleACL);

exports.adminRole = adminRole;

var query = new AV.Query(Model.User);
query.equalTo("mobilePhoneNumber", "18503"+"007017");
query.first()
    .done(function(obj){
        console.log("find a user, add to admin");
        return obj.fetch();
    }).done(function(user){
        adminRole.getUsers().add(user);
        adminRole.save();
    });

