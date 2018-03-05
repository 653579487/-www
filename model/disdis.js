var mongoose = require('mongoose');

var disdisSchema = {
    id:String, //那个评论的回复；
    name:String, //谁评论了
    body:String, // 评论的内容
    time:String, // 评论的时间
};

var disdis = mongoose.model('disdis',disdisSchema);

module.exports = disdis;