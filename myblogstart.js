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
//用户验证,relogin判断是否要重新登录
function scanuser(req, res,relogin,whologin){
if(relogin){
  res.clearCookie('name');
  res.cookie("name",whologin,{maxAge: 900000, httpOnly: true});
}else{
  if(req.cookies.name){
     console.log("当前顾客有效");
     console.log("当前顾客为："+req.cookies.name);
     
   }else{
    console.log("当前没有任何有效的顾客,请重新登录！")
    
   }
}

console.log("当前顾客为："+req.cookies.name);
 
}


///////
app.use(config.mainpage, function (req, res) {
  scanuser(req, res,true,'coachfox');
  res.send(makehtml.makehtmlplus(''));
   });

app.use(config.blogconsolepage, function (req, res) {
  
    res.send(makehtml.makehtmlplus(config.makeblogconsolepage));
      });

app.use(config.test,function(req, res){
  res.send(makehtml.makehtmlplus(config.maketest));

//promise同步
  const promise = new Promise((resolve, reject) => {
    verify.verifypersonexist(1,resolve);
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

app.use(config.login, function (req, res) {
  console.log('123');
    res.send(makehtml.makehtmlplus(config.makelogin));
      });
// 监听端口，等待连接
const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志