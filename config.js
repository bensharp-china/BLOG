
module.exports = {
    //基础配置
    serverPort: '8305',
    //mybloghost:'https://coachfox.cn',
   mybloghost:'http://127.0.0.1:8305',
    //database信息
    database:'blogdata',
    //mysql数据库链接配置信息
    
    mysqlhost:{
   host:'132.232.109.62',
   user:'xiabin',
   password:'753951xh',
    port:'3306',
    database:'blogdata'},
 
    localmysqlhost:{
    host:'127.0.0.1',
    user:'xiabin',
    password:'741862xh',
    port:'3306',
    database:'blogdata'},
    //客户端路由
    blogconsole:'/blogconsole',

    //服务端路由
    mainpage:'/index',
    blogconsolepage:'/blogconsole',
    login:'/login',
    test:'/test',
    //创造页面设置
    makeblogconsolepage:'blogconsole',
    makelogin:'bloglogin',
    maketest:'test',
    makemainpage:''
};

