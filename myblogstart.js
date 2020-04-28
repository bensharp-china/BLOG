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

//登录
app.use(config.login, function (req, res) {
 
  res.send(makehtml.makehtmlplus(config.makelogin));
    });
///////
app.use(config.mainpage, function (req, res) {
  
  //不用登录，用检查用户功能
  verify.scanuser(req, res,false,sendpage);
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
//登录
app.use('/goonlogin',function(req,res){
  verify.scanuser(req, res,true,sendpage);
})
//登出
app.use('/goonlogout',function(req,res){
  verify.logout(res);

})
// 监听端口，等待连接
const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志