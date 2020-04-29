
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
  if(req.cookies.user_name){
  tmp=req.cookies.user_name; 
}
   else{
    tmp='visitor';
   }
   q='select user_id from buser where user_name=?';
}
const promise = new Promise((resolve, reject) => {


mysql.databasequeryin(q,tmp,resolve);
});
promise.then(function(data){

if(data){
    req.session.user_id=data[0].user_id;
console.log(req.session.user_id);
getdatad.getmenus(req,res,what);
}
else{
  return;
}

});
}
//登出用户
function logout(req,res){

var q='select user_id from buser where user_name=?';
  const promise = new Promise((resolve, reject) => {
  mysql.databasequeryin(q,'visitor',resolve);
  });
  promise.then(function(data){
  //zheli
  if(data){
    req.session.user_id=data[0].user_id;
  res.send({flag:'登出成功！'});
  return;
 }
  else{
    return;
  }
  
  });
}

module.exports={scanuser,logout};