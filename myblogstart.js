const express = require('express');
const path=require('path');
const config=require(path.join(__dirname, "./config.js"));
const makehtml=require(path.join(__dirname, "./htmls/index.js"));
const mysqlc=require(path.join(__dirname, "./lib/mysqldatautil.js"));
const cookieParser= require('cookie-parser');
const verify=require(path.join(__dirname, "./lib/verify.js"));
//const promise=require('promise')

const app = express();
app.use(cookieParser());
//校验区
//检查传入的字符串是否符合规范,此方法放入客户端

  //公共页面调用方法
function sendpage(res){
  res.send(makehtml.makehtmlplus(''));
  
}


//用户验证,relogin判断是否要重新登录
function scanuser(req, res,login,callback){
  var tmp;
if(login){
  //tmp=[req.query.user_name,req.query.user_passwd];
  tmp=req.query.user_name;
//清除COOKIE
res.clearCookie('user_name');
res.clearCookie('user_profile_photo');
res.clearCookie('user_nicname');
res.clearCookie('user_id');
res.clearCookie('user_menus');
}else{
  tmp=req.cookies.user_name;
}
const promise = new Promise((resolve, reject) => {
 // var q='SELECT * FROM usermessage where user_name=? and user_passwd=?';
 var q='SELECT * FROM usermessage where user_name=? ';
mysqlc.databasequeryin(q,tmp,resolve);
});
promise.then(function(data){
//zheli
if(data){
res.cookie("user_name",data[0].user_name,{maxAge: 900000, httpOnly: true});
res.cookie("user_profile_photo",data[0].user_profile_photo,{maxAge: 900000, httpOnly: true});
res.cookie("user_nicname",data[0].user_nicname,{maxAge: 900000, httpOnly: true});
res.cookie("user_id",data[0].user_id,{maxAge: 900000, httpOnly: true});
res.cookie("user_menus",data[0].brolefunctionname,{maxAge: 900000, httpOnly: true});
callback(res);}
else{
  return;
}

});
}

//登录
app.use(config.login, function (req, res) {
 
  res.send(makehtml.makehtmlplus(config.makelogin));
    });
///////
app.use(config.mainpage, function (req, res) {
  
  //不用登录，用检查用户功能
 scanuser(req, res,false,sendpage);
  console.log("当前顾客为："+req.cookies.user_name);
   });


app.use(config.blogconsolepage, function (req, res) {
  
    res.send(makehtml.makehtmlplus(config.makeblogconsolepage));
      });

app.use(config.test,function(req, res){
  res.send(makehtml.makehtmlplus(config.maketest));

//promise同步
  const promise = new Promise((resolve, reject) => {
    verify.verifypersonexist(['coachfox',''],resolve);
  });
  promise.then(function(data){
    console.log(data);
  }  )
 ////  


})
    
//处理中间件

app.use('/gettestconnect', function (req, res) {
  mysqlc.testconnect(req,res);
})
//处理登录中间件
app.use('/goonlogin',function(req,res){
  scanuser(req, res,true,sendpage);
})
// 监听端口，等待连接
const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志