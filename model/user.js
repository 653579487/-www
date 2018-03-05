/**
 *
 * Created by Administrator on 2018/1/28.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    name: String,
    password:String,
    email:String,
    blog:[{
        title:String,
        img:String,
        body:String,
        date:String
    }]
});



var User = mongoose.model('User',userSchema);



module.exports = User;


