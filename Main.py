# coding=utf-8
import frida
import sys


def main():
    # 第一种方式，在app运行后附加进去
    # session = frida.get_remote_device().attach("com.baidu.miaoda")
    # device = frida.get_usb_device()
    # session = device.attach("com.banyan.test")

    # 第二种方式，重启app，在app启动时附加
    device = frida.get_usb_device()
    pid = device.spawn(["com.banyan.finance"])
    session = device.attach(pid)

    # 加载需要注入的js
    scr = open("java.js").read()

    script = session.create_script(scr)
    script.on("message", on_message)
    script.load()

    # resume
    device.resume(pid)
    sys.stdin.read()


def on_message(message, data):
    if message['type'] == 'send':
        print(message['payload'])
        if message['payload'] == 'dump_dex':
            f = open('dump.dex', 'w')
            f.write(data)
            f.close()
    elif message['type'] == 'error':
        print(message['stack'])


if __name__ == '__main__':
    main()
