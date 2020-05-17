
const path=require('path');
const mysql=require(path.join(__dirname, "./mysqldatautil.js"));        
const makehtml=require(path.join(__dirname, "../htmls/index.js"));


//
function privilegeverify(req,res,whichpage){
  var dataquery='select * from usermessage where user_id=? and brolefunctionlocat=?';
  var tmp=[req.session.user_id,'/'+whichpage];
  const promise = new Promise((resolve, reject) => {
    mysql.databasequeryin(dataquery,tmp,resolve);
    });
    promise.then(function(data){
    
    if(data[0]){
      
    res.send(makehtml.makehtmlplus(whichpage,null))
            }
            else {
              res.send({flag:'sorry,you have no privilege for this page!'});
            }
        })
}


///取用户目录信息


function getmenus(req,res,what){
  var dataquery='select * from usermessage where user_id=?';
  
  var tmp=req.session.user_id;

  const promise = new Promise((resolve, reject) => {
    mysql.databasequeryin(dataquery,tmp,resolve);
    });
    promise.then(function(data){
    
    if(data){
    res.send(makehtml.makehtmlplus(what,data));

            }
        })
}
//验证用户
function scanuser(req, res,what){
  var q='select user_id from buser where user_id=?';
  var tmp;
  if(req.session.user_id){
  tmp=req.session.user_id; 
}
   else{
    tmp='2';
   }


const promise = new Promise((resolve, reject) => {


mysql.databasequeryin(q,tmp,resolve);
});
promise.then(function(data){

if(data){
    req.session.user_id=data[0].user_id;

getmenus(req,res,what);
}
else{
  return;
}

});
}
//登出用户
function logout(req,res){

var q='select user_id from buser where user_id=?';
  const promise = new Promise((resolve, reject) => {
  mysql.databasequeryin(q,'2',resolve);
  });
  promise.then(function(data){
  //zheli
  if(data){
    req.session.user_id=data[0].user_id;
  res.send({flag:'登出成功！'});

 }
  else{
    return;
  }
  
  });
}

//用户登录
function login(req, res,gotopage){
  var q;
  var tmp;
  tmp=[req.query.user_name,req.query.user_passwd];
  q='select user_id from buser where user_name=? and user_passwd=?';
  const promise = new Promise((resolve, reject) => {
    mysql.databasequeryin(q,tmp,resolve);
    });
    promise.then(function(data){
    
    if(data[0]){
        req.session.user_id=data[0].user_id;
    
    getmenus(req,res,gotopage);
    }
    else{
      res.send({flag:'sorry,incorrect username or passwd!'})
      return;
    }
    
    });
 
};
module.exports={scanuser,logout,login,privilegeverify};