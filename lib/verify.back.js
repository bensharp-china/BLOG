
const path=require('path');
const mysql=require(path.join(__dirname, "./mysqldatautil.js"));        


//验证用户
function scanuser(req, res,login,callback){
  var q;
  var tmp;
if(login){
  tmp=[req.query.user_name,req.query.user_passwd];
 // tmp=req.query.user_name;
  var q='SELECT * FROM usermessage where user_name=? and user_passwd=?';
//清除COOKIE
/*res.clearCookie('user_name');
res.clearCookie('user_profile_photo');
res.clearCookie('user_nicname');
res.clearCookie('user_id');
res.clearCookie('user_menus');*/
}else{
  if(req.cookies.user_name){
  tmp=req.cookies.user_name;
  
}
   else{
    tmp='visitor';
   }
   var q='SELECT * FROM usermessage where user_name=? ';
}
const promise = new Promise((resolve, reject) => {
  //

mysql.databasequeryin(q,tmp,resolve);
});
promise.then(function(data){
//zheli
if(data){
res.cookie("user_name",data[0].user_name,{maxAge: 900000, httpOnly: true});
res.cookie("user_profile_photo",data[0].user_profile_photo,{maxAge: 900000, httpOnly: true});
res.cookie("user_nicname",data[0].user_nicname,{maxAge: 900000, httpOnly: true});
res.cookie("user_id",data[0].user_id,{maxAge: 900000, httpOnly: true});
var umenus=[];
 for(var i=0;i<data.length;i++){
     umenus.push(data[i].brolefunctionname);
 }

res.cookie("user_menus",umenus,{maxAge: 900000, httpOnly: true});
console.log(umenus);
callback(res);}
else{
  return;
}

});
}
//登出用户
function logout(res){
res.clearCookie('user_name');
res.clearCookie('user_profile_photo');
res.clearCookie('user_nicname');
res.clearCookie('user_id');
res.clearCookie('user_menus');
var q='SELECT * FROM usermessage where user_name=? ';
  const promise = new Promise((resolve, reject) => {
  mysql.databasequeryin(q,'visitor',resolve);
  });
  promise.then(function(data){
  //zheli
  if(data){
  res.cookie("user_name",data[0].user_name,{maxAge: 900000, httpOnly: true});
  res.cookie("user_profile_photo",data[0].user_profile_photo,{maxAge: 900000, httpOnly: true});
  res.cookie("user_nicname",data[0].user_nicname,{maxAge: 900000, httpOnly: true});
  res.cookie("user_id",data[0].user_id,{maxAge: 900000, httpOnly: true});
  res.cookie("user_menus",data[0].brolefunctionname,{maxAge: 900000, httpOnly: true});
  res.send({flag:'登出成功！'});
  return;
 }
  else{
    return;
  }
  
  });
}

module.exports={scanuser,logout};