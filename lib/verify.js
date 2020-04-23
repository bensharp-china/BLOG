
const path=require('path');
const mysql=require(path.join(__dirname, "./mysqldatautil.js"));        




function verifypersonexist(who,resolve){
  var qstring="SELECT user_name FROM blogdata.buser where user_id=?";
  mysql.databasequeryin(qstring,who,resolve);
}

module.exports={verifypersonexist};