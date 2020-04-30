
const path=require('path');
const mysql=require(path.join(__dirname, "./mysqldatautil.js"));        
const getdatad=require(path.join(__dirname, "./getdata.js"));    

//验证用户
function scanuser(req, res,login,what){
  var q;
  var tmp;
if(login){
  tmp=[req.query.user_name,req.query.user_passwd];
  q='select user_id from buser where user_name=? and user_passwd=?';
}else{
  if(req.session.user_id){
  tmp=req.session.user_id; 

}
   else{
    tmp='2';
   }
   q='select user_id from buser where user_id=?';
}
const promise = new Promise((resolve, reject) => {


mysql.databasequeryin(q,tmp,resolve);
});
promise.then(function(data){

if(data){
    req.session.user_id=data[0].user_id;

getdatad.getmenus(req,res,what);
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

module.exports={scanuser,logout};