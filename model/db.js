/**
 *
 * Created by Administrator on 2018/1/28.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yanye');

var db = mongoose.connection;
db.once('open', function() {
   console.log('数据库成功打开')
});