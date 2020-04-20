const express = require('express');
const path=require('path');
const config=require(path.join(__dirname, "./config.js"));
const makehtml=require(path.join(__dirname, "./htmls/index.js"));


const app = express();

app.use(config.mainpage, function (req, res) {
  console.log('456');
 res.send(makehtml.makehtmlplus(''));
   });

app.use(config.blogconsolepage, function (req, res) {
  console.log('123');
    res.send(makehtml.makehtmlplus(config.makeblogconsolepage));
      });

// 监听端口，等待连接
const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志