Java.performNow(function () {
    attachAPP();
});

/**
 * Hook sendtol获取发送数据
 */
function attachAPP(interceptor = Interceptor) {
    const testAdd = Module.findExportByName("libc.so", "sendto");
    interceptor.attach(testAdd, {
        onEnter: function (args) {
            send(Memory.readCString(args[1]));
            console.log(hexdump(args[1], {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
        },
        onLeave: function (retval) {
            //send(Memory.readCString(retval));
        }
    });
}