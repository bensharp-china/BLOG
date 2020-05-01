const express = require('express');
const path=require('path');
const config=require(path.join(__dirname, "./config.js"));
const makehtml=require(path.join(__dirname, "./htmls/index.js"));
const mysqlc=require(path.join(__dirname, "./lib/mysqldatautil.js"));
const cookieParser= require('cookie-parser');
var session = require('express-session');
const verify=require(path.join(__dirname, "./lib/verify.js"));
//const promise=require('promise')

const app = express();
app.use(cookieParser('tvxqcooler'));
app.use(session({
  secret: 'tvxqcooler',//与cookieParser中的一致
  resave: true,
  saveUninitialized:true
}));
//校验区
//检查传入的字符串是否符合规范,此方法放入客户端

  //公共页面调用方法
 



//登录
app.use(config.login, function (req, res) {
 
  res.send(makehtml.makehtmlplus(config.makelogin));
    });
///////
app.use(config.mainpage, function (req, res) {
   console.log('当前用户：'+req.session.user_id);
  //用检查用户功能
  verify.scanuser(req, res,config.makemainpage);
   return;
   });


app.use(config.blogconsolepage, function (req, res) {
  
    res.send(makehtml.makehtmlplus(config.makeblogconsolepage,null));
      });

app.use(config.test,function(req, res){
  res.send(makehtml.makehtmlplus(config.maketest,null));
//promise同步

 ////  

})
    
//处理中间件

app.use('/gettestconnect', function (req, res) {
  mysqlc.testconnect(req,res);
})
//处理登录中间件
//登录
app.use('/goonlogin',function(req,res){
  verify.login(req, res,config.makemainpage);
  
})
//登出
app.use('/goonlogout',function(req,res){
  verify.logout(req,res);
  return;
})
// 监听端口，等待连接
const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志