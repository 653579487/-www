var request = require('request');
var formidable = require('formidable');
var User = require('../model/user');
var md5 = require('../model/md5');
var fs = require('fs');
var path = require('path');
var sd = require('silly-datetime');
var Blog = require('../model/blog');
var Money = require('../model/money');
var async = require('async');
var mongoose = require('mongoose');
var discuss = require('../model/discuss');
var disdis = require('../model/disdis');
var D = require('../model/di');


exports.showindx = function (req, res) {
    console.log(req.headers['user-agent']);
    res.render('index', {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: false
    })
};

exports.showblog = function (req, res, next) {
    Blog.find({}, function (err, result) {
        if (err) {
            res.render('404')
        }
        res.render('blog', {
            login: req.session.login == '1' ? true : false,
            username: req.session.login == '1' ? req.session.username : '',
            blog: result,
            money: false
        })
    });
};
exports.showdemo = function (req, res, next) {
    res.render('demo', {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: false
    })
};
//电影
exports.showmovie_in_theaters = function (req, res, next) {
    var sid = req.params.sid;
    switch (sid) {
        case 'in_theaters':
            request('https://api.douban.com//v2/movie/in_theaters?start=0&count=50', function (error, response, body) {
                res.render('movie', {
                    'body': JSON.parse(body),
                    login: req.session.login == '1' ? true : false,
                    username: req.session.login == '1' ? req.session.username : '',
                    money: false
                })
            });
            break;
        case 'coming_soon':
            request('https://api.douban.com//v2/movie/coming_soon?start=0&count=50', function (error, response, body) {
                res.render('movie', {
                    'body': JSON.parse(body),
                    login: req.session.login == '1' ? true : false,
                    username: req.session.login == '1' ? req.session.username : '',
                    money: false
                })
            });
            break;
        case 'Top250':
            request('https://api.douban.com//v2/movie/top250?start=0&count=50', function (error, response, body) {
                res.render('movie', {
                    'body': JSON.parse(body),
                    login: req.session.login == '1' ? true : false,
                    username: req.session.login == '1' ? req.session.username : '',
                    money: false
                })
            });
            break;
        default:
            res.render('404', {
                login: req.session.login == '1' ? true : false,
                username: req.session.login == '1' ? req.session.username : '',
                money: false
            });
            break;
    }
};
//注册业务
exports.regi = function (req, res, next) {
    res.render('regi', {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: false
    });
};
exports.doregi = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var username = fields.name;
        var userpassword = fields.password;
        var email = fields.email;
        User.find({"name": username}, function (err, result) {
            if (err) {
                res.json({err: 1, msg: '服务器出错啦'})
            } else if (result.length != 0) {
                res.json({err: -1, msg: '用户名被占用'})
            } else {
                User.create({
                    name: username,
                    password: md5(md5(md5(userpassword + 'yy') + 'llp')),
                    email: email
                }, function (err) {
                    if (err) {
                        console.log(err);
                        res.json({'err': 1, 'msg': '数据库错误'});
                        return;
                    }
                    req.session.login = '1';
                    req.session.username = username;
                    res.json({'err': 0, 'msg': '用户存入成功'})
                })
            }
        });
    });
};
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.render('login', {
                login: false,
                username: ''
            })
        }
    })
};
//登录页面
exports.login = function (req, res) {
    res.render('login', {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: false
    })
};
//登录验证
exports.dologin = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var password = fields.password;
        var Userpassword = md5(md5(md5(password + 'yy') + 'llp'));
        User.find({name: fields.name}, function (err, result) {
            if (err) {
                res.json({err: '1', msg: '服务器错误'});
                return;
            }
            if (result.length == 0) {
                res.json({'err': '1', msg: '没有这个人'});
                return
            }
            if (result[0].password == Userpassword) {
                req.session.login = '1';
                req.session.username = result[0].name;
                res.json({err: 0, msg: '登录成功'});
            } else {
                res.json({err: 1, msg: '密码错误'});
            }
        })

    });
};


//blog
exports.MyBlog = function (req, res, next) {
    var bid = req.params.bid;
    switch (bid) {
        case 'add':
            res.render('blog_add', {
                login: req.session.login == '1' ? true : false,
                username: req.session.login == '1' ? req.session.username : '',
                money: false
            });
            break;
        default:
            res.render('404', {
                login: req.session.login == '1' ? true : false,
                username: req.session.login == '1' ? req.session.username : '',
                money: false
            });
            break;
    }
};
//add blog
exports.addblog = function (req, res, next) {
    function isEmptyObject(e) {   // 判断是否为空对象的方法
        var t;
        for (t in e)
            return !1;
        return !0
    }

    if (req.session.login == '1') {
        var form = new formidable.IncomingForm();
        form.keepExtensions = true; // 保留拓展名
        form.parse(req, function (err, fields, files) {
            var ttt = sd.format(new Date(), 'YYYY-MM-DD-HH-mm-ss-');
            var date = sd.format(new Date(), 'YYYY-MM-DD');
            var ran = parseInt(Math.random() * 9999 + 9999);
            var newPath;
            if (!isEmptyObject(files)) {
                var oldPath = files.img.path;
                var extname = path.extname(oldPath);  // 拓展名
                newPath = path.join(__dirname, '../', 'public', '/upload/' + ttt + ran + extname); // 现在的路径
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        console.log('改名失败');
                    }
                });
            } else {
                newPath = 't1.jpg'; // 现在的路径
            }
            Blog.create({
                title: fields.title,
                img: path.basename(newPath),
                body: fields.body,
                date: date,
                author: req.session.username
            }, function (err1, result2) {
                if (err1) {
                    fs.unlink(newPath);// 删除图片
                    res.json({err: '1', msg: '服务器错误'});
                    return
                } else {
                    res.json({err: '0', msg: '发表成功'});
                }
            })
        });


    } else {
        res.json({err: '1', msg: '请登录...'})
    }
};
//article 文章
exports.article = function (req, res, next) {
    var data = {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: false
    };
    var id = req.params.id;
    var sid = mongoose.Types.ObjectId(id);
    Blog.find({"_id": sid}, function (err, result) {
        if (err) {
            res.send('Not Found')
        } else if (result.length != 0) {
            var c = 0;
            data.img = result[0].img;
            data.title = result[0].title;
            data.body = result[0].body;
            data.date = result[0].date;
            data.author = result[0].author;
            data.editordate = result[0].editordate;
            data.id = result[0]._id;
            result[0].zan.forEach(function (t) {
                c++
            });
            data.zanSum = c;
            D.find({contentId: id}).sort({"_id": -1}).limit(5).skip(0).exec(function (err, resulta) {// 限制发挥条数为五条
                var da = {};
                var count = 0;
                if(resulta.length != 0){ // 如果有评论 就荀川查找 评论的评论
                    async.series([
                        function(callback){
                            resulta.forEach(function (f) { // 查询评论下的评论
                                D.find({ contentId: mongoose.Types.ObjectId(f._id)}, function (err, result) {
                                    count++;
                                    da[f._id] = [result];
                                    if(count == resulta.length){
                                        callback()
                                    }
                                });
                            });
                        }
                    ],function(err, results) {
                        D.count({contentId: id}, function (err, result) {
                            data.da = da;
                            data.count = result;
                            data.discuss = resulta;
                            //查询点赞总数
                            res.render('blog_detailed', data)
                        });
                    });
                }else{  // 如果没有评论 直接战术
                    D.count({contentId: id}, function (err, result) {
                        data.da = da;
                        data.count = result;
                        data.discuss = resulta;
                        //查询点赞总数
                        res.render('blog_detailed', data)
                    });
                }
            });
        } else {
            res.send('Not Found')
        }

    })
};
//remove
exports.remove = function (req, res) {
    if (req.session.login == '1') {
        var id = req.query.id;
        var sid = mongoose.Types.ObjectId(id);

        Blog.remove({"_id": sid}, function (err) {
            if (err) {
                res.json({err: '1', msg: '服务器错误'})
            } else {
               D.remove({"contentId": id}, function (err) {
                   if(err){
                       console.log(err)
                   }else{
                       res.json({err: '0', msg: '删除成功'})
                   }

                });
            }
        })
    } else {
        res.json({err: '1', msg: '非法闯入!!!请登录验证...'})
    }

};
//editor
exports.editor = function (req, res) {
    var data = {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: false
    };
    var id = req.params.id;
    var sid = mongoose.Types.ObjectId(id);
    Blog.find({"_id": sid}, function (err, result) {
        if (err) {
            res.send('Not Found')
        } else if (result.length != 0) {
            data.img = result[0].img;
            data.title = result[0].title;
            data.body = result[0].body;
            data.date = result[0].date;
            data.author = result[0].author;
            data.id = result[0]._id
            res.render('blog_editor', data);


        } else {
            res.send('Not Found')
        }

    });

};
//doEditor
exports.doEditor = function (req, res) {
    if (req.session.login == '1') {
        var data = {
            login: req.session.login == '1' ? true : false,
            username: req.session.login == '1' ? req.session.username : ''
        };
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var id = req.params.id;
            var sid = mongoose.Types.ObjectId(id);
            var author = fields.author;
            var newtitle = fields.title;
            var newbody = fields.body;
            var ttt = sd.format(new Date(), 'YYYY年MM月DD日HH时mm分ss秒');
            Blog.update({"_id": sid}, {
                title: newtitle,
                body: newbody,
                editordate: ttt
            }, function (err) {
                if (err) {
                    res.json({err: '1', msg: '服务器错误'})
                }
                res.json({err: '0', msg: '修改成功'})
            });
        });
    } else {
        res.json({err: '1', msg: '非法闯入!!!请登录验证...'})
    }


};
exports.api = function (req, res, next) {
    var api = req.params.api;
    switch (api) {
        case 'zan':
            var id = req.query.id;
            var sid = mongoose.Types.ObjectId(id);
            var userName = req.query.name;

            Blog.find({"_id": sid}, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    var arr = [];
                    result[0].zan.forEach(function (t) {
                        arr.push(t.userName);
                    });
                    if (arr.indexOf(userName) != -1) {
                        res.json({err: '2', msg: '已经赞过了'})
                    } else {
                        Blog.update({"_id": sid}, {$push: {zan: {userName: userName}}}, function (err, result) {
                            if (err) {
                                res.json({err: '1', msg: '服务器粗错了'})
                            } else {
                                res.json({err: '0', msg: 'ok', sum: arr.length})
                            }
                        });
                    }
                }
            });

            break;
        case 'discuss'://评论
            if (req.session.login == '1') {
                var form = new formidable.IncomingForm();
                var newDate = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                form.parse(req, function (err, fields) {
                    var id = fields.id;
                    D.create({
                        contentId: id,
                        contentTitle: fields.contentTitle,
                        author: fields.author,
                        replyAuthor: fields.author,
                        content: fields.disBody,
                        date: newDate
                    }, function (err, result) {
                        if (err) {
                            res.json({err: '1', msg: '错误'})
                        } else {
                            res.json({err: '0', msg: '评论成功', data: result})
                        }
                    });
                });
            } else {
                res.json({err: '1', msg: '非法闯入!请登录验证...'})
            }

            break; //评论
        case 'paging':
            var id = req.query.id;
            var limit = parseInt(req.query.pageamount);
            var skip = parseInt(req.query.page);
            D.find({contentId: id}).sort({"_id": -1}).limit(limit).skip(skip * limit).exec(function (err, resulta) {
                res.json({err: '0', data: resulta})
            });
            break;
        case 'diszan':
            var id = req.query.id;
            var sid = mongoose.Types.ObjectId(id);
            var userName = req.query.name;
            D.find({'_id': sid}, function (err, result) {
                if (result[0].praiseMembers.indexOf(userName) == -1) {
                    D.update({'_id': sid}, {
                        $inc: {praiseNum: 1},
                        $push: {praiseMembers: userName}
                    }, function (err, result) {
                        console.log(result)
                    });
                }
            });
            break;
        case 'disdis':
            var id = req.query.id;
            var sid = mongoose.Types.ObjectId(id);
            var ttt = sd.format(new Date(), 'YYYY/MM/DD  HH:mm:ss');
            var data = {
                id: id,
                name: req.query.name,
                body: req.query.body,
                time: ttt
            };
            D.create({
                replyAuthor: req.query.name,// 留言者的名字
                adminAuthor: req.query.bname,//被留言者的名字
                content: req.query.body, //留言内容
                date: ttt,//留言时间
                contentId: id
            }, function (err, result) {
                if (err) {
                    console.error(1)
                }else{
                    res.json({err:'0',msg:'ok'})
                }

            });
            break;
        default:
            next();
            break;
    }

};


//addmoneyBase 钱
exports.addmoneyBase = function (req, res) {
    var date = sd.format(new Date(), 'YYYY-M-D');
    var year = date.split('-')[0];
    var month = date.split('-')[1];
    var day = date.split('-')[2];
    var data = {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: false
    };
    data.year = year;
    data.month = month;
    data.day = day;
    res.render('money_add', data)
};
exports.DoAddmoneyBase = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        if (err) {
            console.log(err);
            return
        }
        Money.create({
            date: fields.date,
            howMoney: fields.howMoney,
            guess: fields.guess,
            year: fields.date.split('/')[0],
            month: fields.date.split('/')[1]
        }, function (err) {
            if (err) {
                console.log(err)
            } else {
                res.json({err: '0', msg: '成功'})
            }
        })
    });
};
exports.showmoney = function (req, res) {
    var date = sd.format(new Date(), 'YYYY-M-D');
    var year = date.split('-')[0];
    var month = date.split('-')[1];
    var day = date.split('-')[2];
    var data = {
        login: req.session.login == '1' ? true : false,
        username: req.session.login == '1' ? req.session.username : '',
        money: true
    };
    Money.find({}).sort({'howMoney': -1}).exec(function (err, result) {
        if (err) {
            res.render('404')
        }
        var num = 0;
        data.baseday = [];
        data.max = result[0].howMoney;
        data.little = result.pop().howMoney;
        data.length = result.length;
        result.forEach(function (t) {
            num += t.howMoney
        });
        data.num = num;
        data.average = parseInt(num / result.length);

        // 全年消费总览
        function all(input) {
            var cc = 0;
            result.filter(function (item, index) {
                if (item.guess == input) {
                    cc += item.howMoney;
                }
            });
            return cc
        }

        data.chifan = all('吃饭');
        data.gouwu = all('购物');
        data.jiaotong = all('交通');
        data.renqing = all('人情');
        data.tongxin = all('通信');
        data.month = month;
        data.year = year;
        // 当前月份每天消费明细
        Money.find({year: '2018', month: "02"}).sort({date: 1}).exec(function (err, result) {
            if (err) {
                console.log(err);
                res.render('404');
            }

            function baseday(day) {
                var bb = 0;
                result.filter(function (item, index) {
                    if (item.date == '2018/02/' + day + '') {
                        bb += item.howMoney;
                    }
                });
                return bb
            }

            for (var i = 2; i < 31; i++) {
                data.baseday.push(baseday(i < 10 ? '0' + i : i));
            }
            res.render('money', data)
        });

    });
};
exports.search = function (req, res) {

    function serach(md, mdf, err, result, year, months, date) {
        var data = [];
        var Array = [];
        var inpu;
        if (err) {
            console.log(err);
            res.json({err: '1', msg: '出错了'})
        } else {

        }

        function all(input) {
            var cc = 0;
            result.filter(function (item) {
                if (item.guess == input) {
                    cc += item.howMoney;
                }
            });
            return cc
        }

        data.push(all('吃饭'));
        data.push(all('购物'));
        data.push(all('交通'));
        data.push(all('人情'));
        data.push(all('通信'));
        // 全年每月消费明细

        if (date != null) {

        } else {
            function month(input) {
                var m = 0;
                result.filter(function (item) {
                    if (item['' + md + ''] == input) {
                        m += item.howMoney;
                    }
                });
                return m
            }

            if (year && months) {
                inpu = '' + year + '/' + months + '/'
            } else if (year) {
                inpu = ''
            }

            for (var i = 1; i < mdf; i++) {
                Array.push(month(inpu + (i < 10 ? '0' + i : i)));
            }
            res.json({err: '0', result: data, Array: Array})
        }

    }

    var year = req.query.year;
    var month = req.query.month;
    var day = req.query.day;
    if (year && month && day) {
        Money.find({date: '' + year + '/' + month + '/' + day + ''}, function (err, result) {
            serach(null, null, err, result, null, null)
        })
    } else if (year && month) {
        Money.find({year: year, month: month}, function (err, result) {
            serach('date', 32, err, result, year, month)
        })
    } else if (year) {
        Money.find({year: year}, function (err, result) {
            serach('month', 13, err, result, year);
        });
    } else {
        console.log(err);
        res.render('404')
    }
};


























