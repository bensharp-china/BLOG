const path=require('path');
const mysql=require(path.join(__dirname, "./mysqldatautil.js"));      
const makehtml=require(path.join(__dirname, "../htmls/index.js"));

function getmenus(req,res,what){
  var q='select * from usermessage where user_id=?';
  
  var tmp=req.session.user_id;
  const promise = new Promise((resolve, reject) => {
    mysql.databasequeryin(q,tmp,resolve);
    });
    promise.then(function(data){
    
    if(data){
    res.send(makehtml.makehtmlplus(what,data));
            }
        })
}






module.exports={getmenus}