// 引用 express 来支持 HTTP Server 的实现
const express = require('express');
var ObjectId = require('mongodb').ObjectID;
var querystring = require('querystring');
//需要下载模块
const multiparty = require('multiparty');
const waferSession = require('wafer-node-session'); 
const MongoStore = require('connect-mongo')(waferSession);
var MongoClient = require('mongodb').MongoClient;
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
let shppicfolder='';
var currentdatabase=config.database
// 返回网页
//网页返回
//商城部分
app.use(config.mainpage, function (req, res) {
    res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
 res.end(makehtml.makehtml('mainpage'));
   });
//动态返回中间需求网页数据
///追溯
app.use(config.zuishu, function (req, res) {
    res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
 res.end(makehtml.makehtml('zuishumainpage'));
   });
///追溯信息页
app.use(config.zuishuweb, function (req, res) {
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
//////////////////
/*爱尚健身 */
/* 后台 */
app.use(config.aishangconsole, function (req, res) {

 res.end(makehtml.makehtmlplus('aishangconsole'));

   });
/*团操资料插入或者修改*/
app.use(config.inserttczl,function(req,res){
    postgetfix.dopost(currentdatabase,'aishangtczl',req,res)
})

////团操资料GET getalltczl
app.use(config.getalltczl, function (req, res) {
    postgetfix.doget(currentdatabase,'aishangtczl',req, res)
   });


/////删除团操资料
app.use(config.deltczl, function (req, res) {
  postgetfix.dodelete(currentdatabase,'aishangtczl',req,res)
})

//预约团操功能

//初始化预约

app.use(config.yycourceini,function(req,res){
  
    // JSON化传过来的数据
   
   var json1=JSON.parse(req.query.todaycourceid)
    console.log(json1)

   for(let i=0;i<json1.length;i++)
    {
        var wherestr={rq:req.query.rq,userid:req.query.userid,todaycourceid:json1[i].tcid}
        ////检查今天的特定会员的课程是否存在在预约课程表里
        var cond={  "rq":req.query.rq,
        "userid":req.query.userid,
        "todaycourceid":json1[i].tcid,
        "inclassstu":req.query.inclassstu,
        "yyflagstu": req.query.yyflagstu
    }
       ///如果存在，就不创建，不存在就创建
        postgetfix.checkexist(currentdatabase,'aishangtcyyzl',wherestr,cond,res)
      
    }
})
//更新预约数据
app.use(config.yycource, function (req, res) {
var wherestr={rq:req.query.rq,userid:req.query.userid,todaycourceid:req.query.todaycourceid}
var cond={$set:{yyflagstu:req.query.yyflagstu}}
console.log( wherestr)

postgetfix.nomalupdate(currentdatabase,'aishangtcyyzl',wherestr,cond,res)


  })
///////////////////////

///根据商品名字返回查询数据


//提交新增商品资料处理
app.use(config.submitspzl,function(req,res)
{    let str="";
   MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("allcontent");
    //////
    req.on('data', data => {
        str += data
      });
//接受RESPONSE 的内容
      req.on('end', function () {
        //（1）.对url进行解码（url会对中文进行编码）
        str= decodeURI(str);
        /**post请求参数不能使用url模块解析，因为他不是一个url，而是一个请求体对象 */
        //（2）.使用querystring对url进行反序列化（解析url将&和=拆分成键值对），得到一个对象
        //querystring是nodejs内置的一个专用于处理url的模块，API只有四个，详情见nodejs官方文档
        var dataObject = querystring.parse(str);
        var contentq={
            "shpname":dataObject.shpname,
            "shpprice":dataObject.shpprice,
            "danbaizhi":dataObject.danbaizhi,
            "tanshui":dataObject.tanshui,
            "xianweisu":dataObject.xianshuisu,
            "shpjj":dataObject.shpjj,
            "zhifang":dataObject.zhifang,
            "shplb":dataObject.shplb,
            "mainpicurl":dataObject.mainpicurl,
            "alldetailpic":[dataObject.alldetailpic1,dataObject.alldetailpic2,dataObject.alldetailpic3,dataObject.alldetailpic4,dataObject.alldetailpic5]
         }
        if(!("id" in dataObject )){
            
        console.log(dataObject);
        ///调用存储过程
      
            //插入资料,中转一下，因为传过来的数组有问题
            
            //
            dbo.collection("spzl").insertOne(contentq,(error,result)=>{ 
                if(error)
                { res.sendStatus(500);
                    console.log('Error:'+ error);
                }else{
                    res.sendStatus(200);
                   
                }
                db.close();
            })
            //创建文件夹模块
    
       
        ///////    
        }else{//更新资料
             console.log(dataObject);
            let kkid=ObjectId(dataObject.id);
            var queryupdate={"_id":kkid};
            var v1= {$set:{"shpname":contentq.shpname,
            "shpprice":contentq.shpprice,
            "danbaizhi":contentq.danbaizhi,
            "tanshui":contentq.tanshui,
            "xianweisu":contentq.xianweisu,
            "shpjj":contentq.shpjj,
            "zhifang":contentq.zhifang,
            "shplb":contentq.shplb,
            "mainpicurl":contentq.mainpicurl,
            "alldetailpic.0":contentq.alldetailpic[0],
            "alldetailpic.1":contentq.alldetailpic[1],
            "alldetailpic.2":contentq.alldetailpic[2],
            "alldetailpic.3":contentq.alldetailpic[3],
            "alldetailpic.4":contentq.alldetailpic[4]

        }};
       

            dbo.collection("spzl").updateOne(queryupdate,v1,(err,result)=>{ 
                if (err) throw err;
                console.log(result.result.nModified + " 条文档被更新");
                res.sendStatus(200);
               db.close();
            });
        }
    });
})
    }); 
      ///接收随图片上传的ID
app.use(config.uploadfileid,function(req,res){

  ///创建图片文件夹
  console.log("ID路由成功！");
  console.log(req.query.shppicid);
  if(req.query.shppicid===''){
    res.sendStatus(500);
  }
  else{
    res.sendStatus(200);
  }
  shppicfolder=req.query.shppicid;


 })

      ///接收上传的文件  ggg 

app.post(config.uploadfile,function(req,res){
////真正图片上传
    if(shppicfolder===''){
        console.log("文件夹名为空，请联系管理员！");
    }else{
   
        console.log(path.join(systempicpath,shppicfolder));
        //如果文件夹不存在就创建文件夹
        read.filefoldermaker(systempicpath,shppicfolder);
    var form = new multiparty.Form({uploadDir:path.join(__dirname, "./img/",shppicfolder)});//存放路径
    form.parse(req, function (err, fields, files) {
       
        if(err) res.json({msg:"文件上传失败！"});
        else  {
            res.json({msg:"文件上传成功！"});
        }
    })
}
    });

 
////商品删除

////删除追溯资料

////
//测试页面
app.use(config.test,function(req,res){
    res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});
    res.end(makehtml.makehtml('test'));
    
})

///
/*sessions处理*/
// 添加会话中间件，登录地址是 /login
app.use(waferSession({ 
    appId: config.appId, 
    appSecret: config.appSecret, 
    loginPath: '/login',
    store: new MongoStore({ 
        url: `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoHost}:${config.mongoPort}/${config.mongoDb}` 
    }) 
})); 


// 在路由 /me 下，输出会话里包含的用户信息
app.use('/me', (request, response, next) => { 
    response.json(request.session ? request.session.userInfo : { noBody: true }); 
    if (request.session) {
        console.log(`Wafer session success with openId=${request.session.userInfo.openId}`);
    }
}); 
// 实现一个中间件，对于未处理的请求，都输出 "Response from express"
app.use((request, response, next) => {
    response.write('Response from express');
    response.end();
});

// 监听端口，等待连接
 const port=config.serverPort;
app.listen(port);
// 输出服务器启动日志
console.log(`Server listening at http://127.0.0.1:${port}`);
