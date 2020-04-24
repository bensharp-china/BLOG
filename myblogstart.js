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
function verifyinput(stringtoverify){

}
//检验登录传入的req字符串

function resetreq(req){
   if(req.username===''||req.passwd==='')
   { return false;}
}
//用户验证,relogin判断是否要重新登录
function scanuser(req, res,login){
if(login){
//promise同步

const promise = new Promise((resolve, reject) => {
  console.log(req.query.username+''+req.query.passwd);
  verify.verifypersonexist([req.query.username,req.query.passwd],resolve);
});
promise.then(function(data){
  if(data.userflag){
     res.send({userflag:data.userflag})
  }else{
     res.clearCookie('user_name');
     res.clearCookie('user_profile_photo');
     res.clearCookie('user_nicname');
     res.clearCookie('user_id');
 
    
    res.cookie("user_name",data.user_name,{maxAge: 900000, httpOnly: true});
    res.cookie("user_profile_photo",data.user_profile_photo,{maxAge: 900000, httpOnly: true});
    res.cookie("user_nicname",data.user_nicname,{maxAge: 900000, httpOnly: true});
    res.cookie("user_id",data.user_id,{maxAge: 900000, httpOnly: true});
    res.send({flag:'登录成功！'});
    console.log(data);
  }
}  )
////  
  
 
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

//登录
app.use(config.login, function (req, res) {
 
  res.send(makehtml.makehtmlplus(config.makelogin));
    });
///////
app.use(config.mainpage, function (req, res) {
  //scanuser(req, res,true,'coachfox');
  res.send(makehtml.makehtmlplus(''));
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
  scanuser(req, res,true);
  //res.send(makehtml.makehtmlplus(''));
})
// 监听端口，等待连接
const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志