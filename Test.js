// (function () {
//     // var baseadd = Process.getModuleByName("libanti_spam.so");
//     // console.log(baseadd.base)
//     // var naticePointer = baseadd.base.add(0x3b70);
//     // send(naticePointer)
//     // Interceptor.attach(naticePointer, {
//     //     onEnter: function (args) {
//     //         send(Memory.readCString(args[1]));
//     //     },
//     //     onLeave: function (retval) {
//     //         console.log(retval);
//     //     }
//     // });
//
//     Interceptor.attach(Module.findExportByName("libanti_spam.so", "Java_com_baidu_miaoda_common_net_AntiSpamNative_nativeGetSign"), {
//         onEnter: function (args) {
//             send(Memory.readCString(args[0]));
//         },
//         onLeave: function (retval) {
//             //send(Memory.readCString(retval));
//         }
//     });
// })();

function test(soBase) {
    console.log(soBase);
    // Memory.scan(soPointer, 49152, "61 6f 73 70", {
    //     onMatch: function(address, size){
    //         console.log(address +":" + size);
    //     },
    //     onError: function(reason){}
    //     ,
    //     onComplete: function(){
    //         console.log("done");
    //     }
    // });
    // var soPointer = new NativePointer(soBase);
    // var targetAddrPointer = soPointer.add(0x3a20 + 1);     // offset of some instruction, +1 means Thumb
    // var serverPointer = Memory.readPointer(soPointer.add(0xbdd4));
    // console.log(hexdump(serverPointer, {
    //     offset: 0,
    //     length: 136,
    //     header: true,
    //     ansi: true
    // }));
    // console.log("targetAddr:" + targetAddrPointer)
    //
    // Interceptor.attach(targetAddrPointer, {
    //     onEnter: function (args) {
    //         r1 = args[1];
    //         if (!r1.isNull()) {
    //             offset = r1 - soBase - 1
    //             console.log(offset.toString(16))
    //         }
    //     },
    //     onLeave: function (retval) {
    //         console.log(retval);
    //         console.log(retval.add(0x4));
    //         console.log(Memory.readPointer(retval.add(0x8)));
    //         console.log(Memory.readCString(Memory.readPointer(retval.add(0x4))))
    //         console.log(hexdump(retval, {
    //             offset: 0,
    //             length: 54,
    //             header: true,
    //             ansi: true
    //         }));
    //         console.log(hexdump(Memory.readPointer(retval.add(0x4)), {
    //             offset: 0,
    //             length: 54,
    //             header: true,
    //             ansi: true
    //         }));
    //
    //     }
    // });
    var didHookApis = false;
    Interceptor.attach(Module.findExportByName(null, "dlopen"), {
        onEnter: function (args) {
            this.path = Memory.readUtf8String(args[0]);
            console.log(this.path);
        },
        onLeave: function (retval) {
            if (!retval.isNull() && this.path.indexOf('libanti_spam.so') !== -1 && !didHookApis) {
                didHookApis = true;
                console.log("File loaded hooking");
                hooknative2();
                hooknative3();
            }
        }
    });

}

function hooknative2() {
    Interceptor.attach(Module.findExportByName("libanti_spam.so", "createSpamServer"), {
        onEnter: function (args) {
            send(args[0] + ":" + args[1] + ":" + args[2] + ":" + args[3] + ":" + args[4]);
            //console.log(Memory.readUtf8String(args[1]))
            console.log(hexdump(Memory.readPointer(args[0]), {
                offset: 0,
                length: 136,
                header: true,
                ansi: true
            }));
        },
        onLeave: function (retval) {
            send(Memory.readCString(retval));
            console.log(hexdump(Memory.readPointer(retval), {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
            console.log(hexdump(Memory.readPointer(Memory.readPointer(retval)), {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
            console.log(hexdump(Memory.readPointer(Memory.readPointer(retval).add(0x4)), {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
            console.log(hexdump(Memory.readPointer(Memory.readPointer(retval).add(0x8)), {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
            console.log(hexdump(Memory.readPointer(Memory.readPointer(retval).add(0xc)), {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
            console.log(hexdump(Memory.readPointer(Memory.readPointer(retval).add(0x10)), {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
            console.log(hexdump(Memory.readPointer(Memory.readPointer(retval).add(0x14)), {
                offset: 0,
                length: 60,
                header: true,
                ansi: true
            }));
            console.log(hexdump(Memory.readPointer(Memory.readPointer(retval).add(0x18)), {
                offset: 0,
                length: 24,
                header: true,
                ansi: true
            }));


        }
    });
}

// constCharToChar
function hooknative3() {
    var testAdd = Module.findExportByName("libanti_spam.so", "constCharToChar");
    console.log(testAdd.sub(0x1).sub(0x6670));
    Interceptor.attach(testAdd, {
        onEnter: function (args) {
            //send(Memory.readCString(args[0]));
        },
        onLeave: function (retval) {
            //send(Memory.readCString(retval));
        }
    });

    var soPointer = new NativePointer(testAdd.sub(0x1).sub(0x6670));
    var targetAddrPointer = soPointer.add(0x6518 + 1);     // offset of some instruction, +1 means Thumb
    Interceptor.attach(targetAddrPointer, {
        onEnter: function (args) {
            console.log(args[0] + ":" + Memory.readCString(args[1]) + ":" + args[2].toString(10));
        },
        onLeave: function (retval) {
            console.log(Memory.readCString(retval));
            
        }
    });

    targetAddrPointer = soPointer.add(0x5294 + 1);     // offset of some instruction, +1 means Thumb
    Interceptor.attach(targetAddrPointer, {
        onEnter: function (args) {
            console.log(Memory.readCString(args[0]));
        },
        onLeave: function (retval) {
            console.log(Memory.readCString(retval));
        }
    });
}

function beforeAPPLaunch() {
    console.log("start tun");
    var runtime = Java.use("java.lang.System");
    // runtime.loadLibrary.implementation = function (name) {
    //     console.log("start tun");
    //     console.log(name);
    //     if (name.indexOf("libanti_spam.so") != -1) {
    //         console.log("get libanti_spam.so base.");
    //         var soModule = Process.getModuleByName("libanti_spam.so");
    //         if (soModule == null) {
    //             console.log("libanti_spam.so not found.");
    //         } else {
    //             test(soModule.base);
    //         }
    //     }
    //     var ret = this.loadLibrary(name);
    //     return ret;
    // };
}

function attachAPP() {
    // var soModule = Process.findModuleByName("libanti_spam.so");
    // if (soModule == null) {
    //     console.log("libname not found.");
    //     return;
    // }
    test('0x256896');
}

Java.performNow(function () {
    //beforeAPPLaunch();
    attachAPP();
});
