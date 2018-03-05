

var xw = {
    name:'小王',
    age:20,
    gender:'男',
    say:function (school,grade) {
       console.log(this.name+" , "+this.gender+" ,今年"+this.age+" ,在"+school+"上"+grade)
    }
};
var xh = {
    name:'小红',
    age:19,
    gender:'女'
};

xw.say.call(xh,"实验小学","六年级");
xw.say.apply(xh,['四小','2年级']);
xw.say.bind(xh,'八小','7年级')();

