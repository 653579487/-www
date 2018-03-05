var mongoose = require('mongoose');


var DiscussSchema ={
    id:String, // 文章id
    disName:String, //谁评论了
    disBody:String, // 评论的内容
    disTime:String, // 评论的时间
    zanUser:String, // 谁点赞了
    zan:[{
        name:String
    }]

};
var Discuss = mongoose.model('Discuss',DiscussSchema);

module.exports = Discuss;



