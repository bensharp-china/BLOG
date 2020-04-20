const express = require('express');
let app=express();
var MongoClient = require('mongodb').MongoClient;
const path=require('path');
const config=require(path.join(__dirname, "../config.js"));
let url=config.databaseurl;
////处理POST传入方法
// 参数l：路由，参数database:数据库,参数table：具体的数据表模型名，参数f：insert or update
function dopost(l,database,tablename,f){
app.use(l, function (req, res) {
    let  str ='';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(database);
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
            console.log(tablemodel(tablename,dataObject,f));
            if(f==="insert"){
                dbo.collection(table).insertOne(tablemodel(tablename,dataObject,f),(error,result)=>{ 
                    if(error)
                    { res.sendStatus(500);
                        console.log('Error:'+ error);
                    }else{
                        res.sendStatus(200);
                       
                    }
                    db.close();
                })
            }else if(f==="update"){           
                dbo.collection("zuishu").updateOne(cxtj(tablename,dataObject),tablemodel(tablename,dataObject,f),(err,result)=>{ 
                    if (err) throw err;
                    console.log(result.result.nModified + " 条文档被更新");
                    res.sendStatus(200);
                   db.close();
                });
            }
        });
    })
})
}

///
////各个数据表模型
//参数tablename:表名，dataObject：要赋值的变量名 f:insert or update
function tablemodel(tablename,dataObject,f){
    var strd=""
    if(f==="insert"){
   if(tablename=='zuishu'){
    strd={
        "shpplu":dataObject.shpplu,
        "pzmc":dataObject.pzmc,
        "zjqk":dataObject.zjqk,
        "sbdm":dataObject.sbdm,
        "gys":dataObject.gys,
        "jyz":dataObject.jyz,
        "cd":dataObject.cd,
        "scdw":dataObject.scdw,
        "zzsj":dataObject.zzsj,
        "sssj":dataObject.sssj,
        "img1":dataObject.img1,
        "img2":dataObject.img2,
        "img3":dataObject.img3,
        "img4":dataObject.img4
     }
   } else if(tablename==="aishangtczl"){
     strd={
        "tcid":dataObject.tcid,
        "tcname":dataObject.tcname,
        "tccoach":dataObject.tccoach,
        "tctime":dataObject.tctime,
        "day":dataObject.day,
        "tcpic":dataObject.tcpic
     }
   }


}
/////表更新的model
else if(f==="update"){
    if(tablename==='zuishu'){
    strd={$set:{
        "pzmc":dataObject.pzmc,
        "zjqk":dataObject.zjqk,
        "sbdm":dataObject.sbdm,
        "gys":dataObject.gys,
        "jyz":dataObject.jyz,
        "cd":dataObject.cd,
        "scdw":dataObject.scdw,
        "zzsj":dataObject.zzsj,
        "sssj":dataObject.sssj,
        "img1":dataObject.img1,
        "img2":dataObject.img2,
        "img3":dataObject.img3,
        "img4":dataObject.img4
     }};
   }  else if(tablename==="aishangtczl"){
     strd={$set:{
        "tcname":dataObject.tcname,
 "tccoach":dataObject.tccoach,
 "tctime":dataObject.tctime,
 "day":dataObject.day,
 "tcpic":dataObject.tcpic
    }}
   }


}
   return strd
}

///
function cxtj(tablename,dataObject){
    var d=""
    if(tablename==='zuishu'){
        d={"shpplu":dataObject.shpplu};
    }else if(tablename==='aishangtczl'){
          d={"tcid":dataObject.tcid};
    }
  return d
}
//处理get请求
///// 参数l：路由，参数database:数据库,参数table：具体的数据表模型名 
///

function doget(l,database,table){
    app.use(l, function (req, res) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(database);
           
            console.log(whereStr)
          if(req.query.gz==="all"){
            dbo.collection(table).find().toArray(function(err, result) {  
                res.send(result)
                 })
            }else if(req.query.gz==="single")
            {    var whereStr=gettablef(table,req.query.query)
                dbo.collection(table).find(whereStr).toArray(function(err, result) { 
                    res.send(result)
                     })
                   
            }
    
    
            db.close();
        })
    
    })
}
////
function gettablef(table,datad){
    var strd=""
    if(table==="aishangtczl")
    {
    strd={"tcid":datad}
} else if(table==='spzl')
{
    strd={"shpname":datad}
}
   return strd
}
///

//处理delete请求
///// 参数l：路由，参数database:数据库,参数table：具体的数据表模型名 
///
function dodelete(l,){
    app.use(l, function (req, res) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("allcontent");
            let vvid=ObjectId(req.query.id);
           
                dbo.collection("aishangtczl").deleteOne({"_id":vvid},(err,result)=>{
                    res.send("删除成功！")
               
                })
        })
    
    })
    
}
///
module.exports={dopost,doget,dodelete}