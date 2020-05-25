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
  function GetDate(format) {
    /**
    * format=1表示获取年月日
    * format=0表示获取年月日时分秒
    * **/
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var date = now.getDate();
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    if (format==1){
        _time = year+"-"+month+"-"+date
   }
   else if (format==2){
       _time = year+"-"+month+"-"+date+" "+hour+":"+minu+":"+sec
   }
   return _time
}    



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
  verify.privilegeverify(req,res,'blogconsole');

      });

app.use(config.articlepage,function (req, res) {
  verify.privilegeverify(req,res,'articlepage');

});
app.use(config.publisherpage,function(req,res){
  verify.privilegeverify(req,res,'publisher');

})
////
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
//数据获取中间件
app.use('/getalluser',function(req,res){
  var dataquery='select user_id,user_name,brolename from userinformation ';
  promisetask(res,dataquery,'');
})
app.use('/getallrole',function(req,res){
  var dataquery=' select * from blogdata.brole';
  promisetask(res,dataquery,'');
})

app.use('/getcategory',function(req,res){
  var dataquery='select * from blogdata.barticle_category where barticle_category_id<5';
  promisetask(res,dataquery,'');
})


app.use('/getcategorycontentdata',function(req,res){
  
  var dataquery='select * from  blogdata.articlecategory where barticle_category_id=?';
  promisetask(res,dataquery,req.query.barticle_category_id);

})

///获取文章具体内容

app.use('/getarticlecontent',function(req,res){
  
  var dataquery='select a.barticle_title,a.barticle_content,b.user_nicname,b.user_profile_photo,a.publishtime,a.modifytime'+
      ' from blogdata.barticle a,blogdata.buser b where a.user_id=b.user_id and a.barticle_id=?';
  promisetask(res,dataquery,req.query.barticle_id);

})
///

app.use('/submitblog',function(req,res){
   var qstring="insert into blogdata.barticle set ?";
 mysqlc.dopostd(qstring, function(content){
 
  var contentq={barticle_title:content.barticle_title,
    barticle_content:content.barticle_content,
    user_id:req.session.user_id,
    publishtime:GetDate(1) ,
    modifytime:GetDate(1) ,
    enable:1,
    barticle_category_id:content.barticle_category_id
  };
   return contentq; }
  ,req,res);

})
//promise 任务
function promisetask(res,dataquery,tmp)
{
  //var tmp='';
  
  const promise = new Promise((resolve, reject) => {
    mysqlc.databasequeryin(dataquery,tmp,resolve);
    });
    promise.then(function(data){
    if(data){ 
    res.send(data);
            }
            
        })
}
// 监听端口，等待连接
const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志