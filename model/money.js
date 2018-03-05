var mongoose = require('mongoose');

var moneySchema = mongoose.Schema({
    date:String,
    howMoney:Number,
    guess:String,
    year:String,
    month:String
});
var Money = mongoose.model('Money',moneySchema);

module.exports = Money;