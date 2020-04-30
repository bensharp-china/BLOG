

const path=require('path');
let output="";
const config=require(path.join(__dirname, "../config.js"));
//待读取文件路径

const headfilepathplus=path.join(__dirname,"./httphead.html");
const myblogconsolefilepath=path.join(__dirname,"./myblogcosole.html");
const myblogmainpagehtmlfilepath=path.join(__dirname,"./myblogmainpage.html");
const myblogloginhtmlfilepath=path.join(__dirname,"./login.html");
const mytestfilepath=path.join(__dirname,"../test/test.html");
//获取READ方法
const read=require(path.join(__dirname,"../lib/readfileutil.js"));



//数据处理方法
function dothemeuns(data){
    var umenus=[];
    for(var i=0;i<data.length;i++){
        umenus.push(data[i].brolefunctionname);
    }
   return umenus;
}
//html拼装器


function makehtmlplus(what,data){
  
    output='';

       output+=read.outputfile(headfilepathplus);
         output+= '<script type=\"text/javascript\">; const ajaxdir=\"'+config.mybloghost+'\";</script>';
         if(data){
         output+='<script type=\"text/javascript\">; const user_name=\"'+data[0].user_name+'\"; user_menus=\"'+dothemeuns(data)+'\"</script>';

        }
         switch(what)
         {
        
             case config.makeblogconsolepage:
                    output+=read.outputfile(myblogconsolefilepath);
                 break;
                 case config.makelogin:
                    output+=read.outputfile(myblogloginhtmlfilepath);
                    break
                    case config.maketest:
                      output+='<script type=\"text/javascript\">; const hostmessage=\"host:'+config.localmysqlhost.host+'\";</script>';
                      output+=read.outputfile(mytestfilepath);
                      break;
            default:
           
                output+=read.outputfile(myblogmainpagehtmlfilepath);
         }
        
        output+='</body></html>';
    //console.log(output);
return output;

}


module.exports={makehtmlplus}