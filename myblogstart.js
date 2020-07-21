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
//






////
  //公共页面调用方法
  Date.prototype.pattern=function(fmt) {     
    var o = {     
    "M+" : this.getMonth()+1, //月份     
    "d+" : this.getDate(), //日     
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时     
    "H+" : this.getHours(), //小时     
    "m+" : this.getMinutes(), //分     
    "s+" : this.getSeconds(), //秒     
    "q+" : Math.floor((this.getMonth()+3)/3), //季度     
    "S" : this.getMilliseconds() //毫秒     
    };     
    var week = {     
    "0" : "/u65e5",     
    "1" : "/u4e00",     
    "2" : "/u4e8c",     
    "3" : "/u4e09",     
    "4" : "/u56db",     
    "5" : "/u4e94",     
    "6" : "/u516d"   
    };     
    if(/(y+)/.test(fmt)){     
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));     
    }     
    if(/(E+)/.test(fmt)){     
      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);     
    }     
    for(var k in o){     
      if(new RegExp("("+ k +")").test(fmt)){     
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));     
      }     
    }     
    return fmt;     
  }    
 // 
  var date = new Date();   



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

app.use(config.gettestconnect, function (req, res) {
  mysqlc.testconnect(req,res);
})
//处理登录中间件
//登录
app.use(config.goonlogin,function(req,res){
  verify.login(req, res,config.makemainpage);
  
})
//登出
app.use(config.goonlogout,function(req,res){
  verify.logout(req,res);
  return;
})
//数据获取中间件
app.use(config.getalluser,function(req,res){
  var dataquery='select user_id,user_name,brolename from userinformation ';
  promisetask(res,dataquery,'');
})
app.use(config.getallrole,function(req,res){
  var dataquery=' select * from blogdata.brole';
  promisetask(res,dataquery,'');
})

app.use(config.getcategory,function(req,res){
  var dataquery='select * from blogdata.barticle_category where barticle_category_id<5';
  promisetask(res,dataquery,'');
})


app.use(config.getcategorycontentdata,function(req,res){
  
  var dataquery='select * from  blogdata.articlecategory where barticle_category_id=?';
  promisetask(res,dataquery,req.query.barticle_category_id);

})

///获取文章具体内容

app.use(config.getarticlecontent,function(req,res){
  
  var dataquery='select a.barticle_title,a.barticle_content,b.user_nicname,b.user_profile_photo,a.publishtime,a.modifytime'+
      ' from blogdata.barticle a,blogdata.buser b where a.user_id=b.user_id and a.barticle_id=?';
  promisetask(res,dataquery,req.query.barticle_id);

})
///

app.use(config.submitblog,function(req,res){
   var qstring="insert into blogdata.barticle set ?";
 mysqlc.dopostd(qstring, function(content){
 
  var contentq={barticle_title:content.barticle_title,
    barticle_content:content.barticle_content,
    user_id:req.session.user_id,
    publishtime:date.pattern("yyyy-MM-dd hh:mm:ss"),
    modifytime:date.pattern("yyyy-MM-dd hh:mm:ss") ,
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