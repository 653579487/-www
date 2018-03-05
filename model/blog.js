
var mongoose = require('mongoose');

var BlogSchema = mongoose.Schema({
    title:String,
    img:String,
    date:String,
    author:String,
    body:String,
    editordate:String,
    zan:[
        {
            userName:String
        }
    ]
});

var Blog = mongoose.model('Blog',BlogSchema);

module.exports = Blog;