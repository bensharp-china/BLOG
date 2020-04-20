

$(document).ready(
    ()=>{
        const ajaxdir="http://127.0.0.1:8124/"; //主机域名设置
  $('#testbutton1').bind('click',()=>{

    $.get(ajaxdir+'lgetshpzl?gz=getdetailcontent&shpidd=5be3babab133ff9b0143db33',function(data,status){
        alert(data[0].shpname);
    $('#resultlabel').html(data[0].shpname);
    });
  })

    }
)