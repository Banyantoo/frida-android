function hookDlopen() {
    var didHookApis = false;
    Interceptor.attach(Module.findExportByName(null, "dlopen"), {
        onEnter: function (args) {
            this.path = Memory.readUtf8String(args[0]);
            //console.log(this.path);
        },
        onLeave: function (retval) {
            /*console.log(hexdump(Memory.readPointer(retval.add(128).add(12)).add(0x8370), {
                   offset: 0,
                   length: 5000,
                   header: true,
                   ansi: true
               }));*/
            if (!retval.isNull() && this.path.indexOf('libjiagu') !== -1 && !didHookApis) {
                didHookApis = true;
                console.log("File loaded hooking");
                //hookDlsym();
                //hookMmap();
                //console.log(retval);
                //hooknative2();
                //hooknative4();
            }
        }
    });
}

function hookDlsym() {
    Interceptor.attach(Module.findExportByName(null, "dlsym"), {
        onEnter: function (args) {
            this.path = Memory.readUtf8String(args[1]);
            //console.log(this.path);
        },
        onLeave: function (retval) {
            console.log(this.path + " adr" + retval);
        }
    });
}

function hooknative4() {
    Interceptor.attach(Module.findExportByName('libdvm.so', "_Z31dvmFindDirectMethodByDescriptorPK11ClassObjectPKcS3_"), {
        onEnter: function (args) {
            //console.log(args[0] + "--" + args[1] + "--" +  args[2]);
            console.log(Memory.readCString(args[1]) + "--" + Memory.readCString(args[2]));
            /* if (Memory.readCString(args[1]).indexOf('onCreate') != -1) {
                 hookDvmUseJNIBridge()
             }*/
            // console.log(hexdump(args[1], {
            //     offset: 0,
            //     length: 0,
            //     header: true,
            //     ansi: true
            // }));
        },
        onLeave: function (retval) {
            //console.log("function rest" + retval);
        }
    });
}

function hookRegisterNatives() {
    var dvmUseJNIBridge = Module.findExportByName('libdvm.so', "_Z15dvmUseJNIBridgeP6MethodPv");
    console.log(dvmUseJNIBridge);
    // var func = Instruction.parse(dvmUseJNIBridge.add(0x684));
    // for (var i = 0; i < 26; i++) {
    //     console.log(func.toString());
    //     func = Instruction.parse(func.next);
    // }

    Interceptor.attach(dvmUseJNIBridge.add(0x684), {
        onEnter: function (args) {
            // console.log('Context information:');
            // console.log('Context  : ' + JSON.stringify(this.context));
            // console.log('Return   : ' + this.returnAddress);
            // console.log('ThreadId : ' + this.threadId);
            // console.log('Depth    : ' + this.depth);
            // console.log('Errornr  : ' + this.err);
            if (Memory.readCString(Memory.readPointer(args[2])).indexOf("onCreate") != -1) {
                console.log(args[1] + "--" + Memory.readCString(Memory.readPointer(args[2])) + "--" + Memory.readPointer(args[2].add(8)));
                console.log(Memory.readPointer(args[2].add(8)) + "--" + func.address);
                const func = Instruction.parse(Memory.readPointer(args[2].add(8)));
                console.log(Memory.readPointer(args[2].add(8)) + "--" + func.address);
                console.log(hexdump(func.address, {
                    offset: 0,
                    length: 100,
                    header: true,
                    ansi: true
                }));
                for (var i = 0; i < 40; i++) {
                    console.log(func.mnemonic + " " + func.opStr);
                    func = Instruction.parse(func.next);
                }

            }


        },
        onLeave: function (retval) {
            //console.log("function rest" + retval);

        }
    });

    // Interceptor.attach(Module.findExportByName("libz.so", "uncompress"), {
    //     onEnter: function (args) {
    //         console.log(args[0] + "--" + args[1] + "--" + args[2])
    //         this.arg1 = args[0];
    //         this.arg2 = args[1];
    //         this.arg3 = args[2];
    //         this.arg4 = args[3];
    //         console.log("CCCryptorCreate called from:" + Thread.backtrace(this.context, Backtracer.ACCURATE));
    //
    //     },
    //     onLeave: function (retval) {
    //         console.log("uncompress adr:" + this.arg2 + "--" + Memory.readInt(this.arg2));
    //         if (Memory.readInt(this.arg2) > 10000) {
    //             send('dfds', Memory.readByteArray(arg1, Memory.readInt(this.arg2)));
    //         }
    //         console.log(hexdump(this.arg2, {
    //             offset: 0,
    //             length: 32,
    //             header: true,
    //             ansi: true
    //         }));
    //
    //     }
    // });

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

function soDump() {
    var modules = [];
    Process.enumerateModules({
        onMatch: function onMatch(module) {
            if (module['path'].indexOf("jiagu") != -1) {
                console.log(module['path'] + "--" + module['base'] + "--" + module['size']);
                send(Memory.readByteArray(new NativePointer(module['base']), 0x50000));
                var array = Memory.readByteArray(new NativePointer(module['base']), 0x50000);
                send('dfds', array);
                console.log(hexdump(array, {
                    offset: 0,
                    length: 0xb000,
                    header: true,
                    ansi: true
                }));
                // console.log(hexdump(new NativePointer(module['base']), {
                //     offset: 0,
                //     length: 0xb000,
                //     header: true,
                //     ansi: true
                // }));
            }
            //modules.push(module);
        },
        onComplete: function onComplete() {
            //send({name: '+sync', from: "/process/modules", payload: {items: modules}});
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

function hookMmap() {
    Interceptor.attach(Module.findExportByName(null, "_Z12dvmInterpretP6ThreadPK6MethodP6JValue"), {
        onEnter: function (args) {
            //console.log("mmap:" + args[1] + "--" + args[2])
            //this.size = args[2].toInt32();
            this.arg1 = args[1];
            this.arg2 = args[2];

        }
        ,
        onLeave: function (retval) {
            if (Memory.readCString(Memory.readPointer(this.arg1.add(16))).indexOf('onCreate') != -1) {
                console.log(Memory.readCString(Memory.readPointer(this.arg1.add(16))));
                const classObject = Memory.readPointer(this.arg1.add(20));
                console.log(Memory.readInt(Memory.readPointer(classObject.add(4)).add(0x20)));
                console.log(hexdump(Memory.readPointer(Memory.readPointer(Memory.readPointer(this.arg1))), {
                    offset: 0,
                    length: 2000,
                    header: true,
                    ansi: true
                }));
                //send('dfds', Memory.readByteArray(Memory.readPointer(classObject.add(4)), Memory.readInt(Memory.readPointer(classObject.add(4)).add(0x20))));
                console.log(Memory.readPointer(this.arg1));
                // console.log(hexdump(Memory.readPointer(this.arg1.add(4)), {
                //     offset: 0,
                //     length: 10,
                //     header: true,
                //     ansi: true
                // }));
            }

            // console.log(hexdump(Memory.readPointer(this.arg1.add(16)), {
            //     offset: 0,
            //     length: 20,
            //     header: true,
            //     ansi: true
            // }));
            // if (this.size == 52) {
            //     console.log(Memory.readCString(retval));
            //     //    console.log(hexdump(retval, {
            //     //     offset: 0,
            //     //     length: 200,
            //     //     header: true,
            //     //     ansi: true
            //     // }));
            // }

        }
    });

}

function hookGDvm() {
    const testAdd = Module.findExportByName("libdvm.so", "gDvm");
    console.log(hexdump(testAdd, {
        offset: 0,
        length: 900,
        header: true,
        ansi: true
    }));
    console.log(Memory.readPointer(testAdd.add(0x330)));
    const HashTable = Memory.readPointer(testAdd.add(0x330));
    const HashEntry = Memory.readPointer(HashTable.add(12));

    console.log(hexdump(Memory.readPointer(HashEntry.add(4)), {
        offset: 0,
        length: 1000,
        header: true,
        ansi: true
    }));

}

function hookDvmRawDexFileOpen() {
    //_Z12dexFileParsePKhji
    Interceptor.attach(Module.findExportByName("libdvm.so", "_Z15dvmInvokeMethodP6ObjectPK6MethodP11ArrayObjectS5_P11ClassObjectb"), {
        onEnter: function (args) {
            console.log("mmap:" + args[1] + "--" + args[2])
            //this.size = args[2].toInt32();
            this.arg0 = args[0];
            this.arg1 = args[1];
            this.arg2 = args[2];
            // console.log(hexdump(this.arg0, {
            //     offset: 0,
            //     length: 100,
            //     header: true,
            //     ansi: true
            // }));
             console.log(Memory.readCString(Memory.readPointer(this.arg1.add(16))));
             if (Memory.readCString(Memory.readPointer(this.arg1.add(16))).indexOf('onCreate') != -1) {
                console.log(Memory.readCString(Memory.readPointer(this.arg1.add(16))));
                const classObject = Memory.readPointer(this.arg1.add(20));
                console.log(Memory.readInt(Memory.readPointer(classObject.add(4)).add(0x20)));
                console.log(hexdump(Memory.readPointer(Memory.readPointer(Memory.readPointer(this.arg1))), {
                    offset: 0,
                    length: 2000,
                    header: true,
                    ansi: true
                }));
                //send('dfds', Memory.readByteArray(Memory.readPointer(classObject.add(4)), Memory.readInt(Memory.readPointer(classObject.add(4)).add(0x20))));
                console.log(Memory.readPointer(this.arg1));
                // console.log(hexdump(Memory.readPointer(this.arg1.add(4)), {
                //     offset: 0,
                //     length: 10,
                //     header: true,
                //     ansi: true
                // }));
            }

        }
        ,
        onLeave: function (retval) {

            //  console.log(hexdump(Memory.readPointer(retval.add(4)), {
            //     offset: 0,
            //     length: 500,
            //     header: true,
            //     ansi: true
            // }));
        }
    });


}


Java.perform(function () {


    //hookRegisterNatives();
    //hookMmap();
    hookDvmRawDexFileOpen();
    //hookGDvm();
    //hooknative4();
    //hookDlopen();


    //hooknative4();

});
