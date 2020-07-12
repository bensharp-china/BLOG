
module.exports = {
    //基础配置
    serverPort: '8305',
    //mybloghost:'http://coachfox.cn/pages',
   mybloghost:'http://127.0.0.1:8305/pages',
    //database信息
    database:'blogdata',
    //mysql数据库链接配置信息


 //数据库连接
    localmysqlhost:{
    host:'127.0.0.1',
    user:'xiabin',
    password:'741862xh',
    //服务器上的密码用下面这个
   // password:'753951xh',
    port:'3306',
    database:'blogdata'},
    //客户端路由
    blogconsole:'/pages/blogconsole',

    //服务端路由
    mainpage:'/pages/index',
    blogconsolepage:'/pages/blogconsole',
    login:'/pages/login',
    test:'/pages/test',
    articlepage:'/pages/articlepage',
    publisherpage:'/pages/publisher',
    //中间件路由
     gettestconnect:'/pages/gettestconnect',
     goonlogin:'/pages/goonlogin',
     goonlogout:'/pages/goonlogout',
    getalluser:'/pages/getalluser',
    getallrole:'/pages/getallrole',
    getcategory:'/pages/getcategory',
    getcategorycontentdata:'/pages/getcategorycontentdata',
    getarticlecontent:'/pages/getarticlecontent',
    submitblog:'/pages/submitblog',


    //创造页面设置
    makeblogconsolepage:'blogconsole',
    makelogin:'bloglogin',
    maketest:'test',
    makemainpage:'',
    makearticlepage:'articlepage',
    makepublisherpage:'publisher'
};

