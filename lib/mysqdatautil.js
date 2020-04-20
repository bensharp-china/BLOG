


var mysql = require('mysql'); 
var querystring = require('querystring');
const path=require('path');
const config=require(path.join(__dirname, "../config.js"));

//当前使用的数据库

var client = mysql.createPool({ 
    host     : config. mysqlHost,
    user     : config.mysqluser,
    password : config.mysqlpassword,
    port: config.mysqlport,
    database: config.mysqldatabase
 
  }); 
 

//新的结构


function dodelete(qstring,req,res){
  databasequery(qstring,req.query.query,res,'delete');
}
///服务器内部查询操作
//判断一个数据存在性,直接将结果返回页面
function checkexist(qstring,req,res){
  databasequery(qstring,req.query.query,res,'checkexit');
}
//判断一个数据的存在性，将结果返回后台
function checkexistquery(qstring,callback)
{
  client.getConnection(function(err,connection){
 
    connection.query(qstring,function(err, results, fields){
      if (err) { 
        throw err; 
      } 
    
       callback(results);
    })
  })
}

//代理方法
//POST代理
function dopostd(qstring,callback,req,res)
{     let str="";
////MYSQL部分
  req.on('data', data => {
    str += data
  });
 ///////
  req.on('end', function () {
    str= decodeURI(str);
    var dataObject = querystring.parse(str);
    var contentq= callback(dataObject);
    databasequery(qstring,contentq,res,'post');
    
})
}
////get 代理方法
function dogetd(qstring,req,res){
      console.log("123"+req.query.query);
      databasequery(qstring,req.query.query,res,'get');

}
// 数据库启动查询组件
function databasequery(qstring,condition,res,resultmode)
{   client.getConnection(function(err,connection){
  connection.query(qstring,condition,function selectCb(err, results, fields) {
    if (err) { 
        throw err; 
      } 
 
       if(results)
        {
           if(resultmode==='get'){
          res.send(results);}
           else if(resultmode==='post'){
            res.sendStatus(200);
           }
           else if(resultmode==='checkexit')
           {
             if(results.length===0)
            {   
              res.send({result:"noexist"});
    
            } 
            else{
              
                res.send({result:"exist"});
               
            }
           }
            else if(resultmode==='delete'){
              res.send("deletesuccesful！")
            }
        } 
        connection.release();
})


})
  
}



/////
module.exports={dodelete,checkexist,dogetd,dopostd,checkexistquery}
