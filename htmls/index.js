

const path=require('path');
let output="";
const config=require(path.join(__dirname, "../config.js"));
//待读取文件路径

const headfilepathplus=path.join(__dirname,"./httphead.html");
const myblogconsolefilepath=path.join(__dirname,"./myblogcosole.html");
const myblogmainpagehtmlfilepath=path.join(__dirname,"./myblogmainpage.html");
//获取READ方法
const read=require(path.join(__dirname,"../lib/readfileutil.js"));

//html拼装器


function makehtmlplus(what){
  
    output='';
  /* output='<!DOCTYPE html>'+
   '<html lang=\"zh\"><head><meta charset="utf-8"><meta name=\"referrer\" content=\"never\">'+
 '<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no\" />';
 output+='<script src=\"https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js\"></script>'+
         '<script src=\"https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js\"></script>'+
         '<link href=\"https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css\" rel=\"stylesheet\" />'+
         '</head><body>';
 */
       output+=read.outputfile(headfilepathplus);
         output+= '<script type=\"text/javascript\">; const ajaxdir=\"'+config.mybloghost+'\";</script>';
       
         switch(what)
         {
        
             case config.makeblogconsolepage:
                    output+=read.outputfile(myblogconsolefilepath);
                 break;
            default:
           
                output+=read.outputfile(myblogmainpagehtmlfilepath);
         }
        
        output+='</body></html>';
    // console.log(output);
return output;

}


module.exports={makehtmlplus}