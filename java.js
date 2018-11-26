Java.perform(function () {
    console.log("start hooking");
    var application = Java.use("android.app.Application");
    console.log(application.toString());
    application.attach.overload('android.content.Context').implementation = function (context) {
        console.log("hook Application");
        var result = this.attach(context);
        var classloader = context.getClassLoader();
        Java.classFactory.loader = classloader;
        attachAPP();
        return result;
    }
});
var flag = false;
var jiguang;

function attachAPP() {
    if (flag==true){
        return;
    }
    flag = true;
    console.log("strart hook JResponse");
    jiguang = Java.classFactory.use("cn.jiguang.b.a.a");
    console.log(jiguang.toString());
   //setInterval(test,1000);
    //console.log(jiguang.getJuid.overload().type)
    jiguang.a.overload("long", "java.langString", "java.langString", "java.langString", "java.langString").implementation = function () {
        console.log("hooking JResponse");
        //var res = this.a();
        console.log(res);
        return res;
    };
}
function test() {
     console.log(jiguang.a);
}
