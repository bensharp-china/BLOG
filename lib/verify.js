
const path=require('path');
const mysql=require(path.join(__dirname, "./mysqldatautil.js"));        




function verifypersonexist(who,resolve){
  var qstring="SELECT user_id,user_nicname,user_profile_photo,user_name FROM blogdata.buser where user_name=? and user_passwd=?";
  mysql.databasequeryin(qstring,who,resolve);
}

module.exports={verifypersonexist};