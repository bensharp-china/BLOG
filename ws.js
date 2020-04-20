// 引用 express 来支持 HTTP Server 的实现
const express = require('express');
//var ObjectId = require('mongodb').ObjectID;
var querystring = require('querystring');
//需要下载模块

const path=require('path');
//获取read方法
const read=require(path.join(__dirname,"./lib/readfileutil.js"));
const postgetfix=require(path.join(__dirname,"./lib/commonfunction.js"));
//载入需求页面
const config=require(path.join(__dirname, "./config.js"));
const makehtml=require(path.join(__dirname, "./htmls/index.js"));
//
const systempicpath=path.join(__dirname, "./img/");
var url = config.databaseurl;
// 创建一个 express 实例
const app = express();

//页面变量

// 返回网页
//网页返回

///追溯信息页
app.use(config.zuishuweb, function (req, res) {
    res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
 res.end(makehtml.makehtmlplus('zuishuwebpage'));

   });
// 查询追溯数据
app.use(config.zuishuget, function (req, res) {
    postgetfix.doget(currentdatabase,'zuishu',req, res)
   });
//提交追溯资料数据,更新或者插入
app.use(config.submitzhuisuzl, function (req, res) {
    postgetfix.dopost(currentdatabase,'zuishu',req, res)
   });
///删除追溯数据资料
app.use(config.delzszl, function (req, res) {
    postgetfix.dodelete(currentdatabase,'zuishu',req,res)
  })



/*团操资料插入或者修改*/


// 监听端口，等待连接
 const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志
console.log(`Server listening at http://127.0.0.1:${port}`);
