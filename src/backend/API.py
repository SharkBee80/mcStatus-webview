import json
import time
from concurrent.futures import ThreadPoolExecutor

import webview
from src.backend import storage, listen

storage = storage.Storage()


class API:
    def __init__(self, window):
        self.window: webview.Window = window
        self.window.expose(self.onload_init, self.addServer, self.refreshServer, self.removeServer, self.moveUp,
                           self.moveDown)

    def onload_init(self):
        self.load_data()

    def load_data(self):
        def fetch_status(ser):
            status = listen.Server(ser['fulladdress']).init()
            return {**ser, **status}

        start_time = time.time()  # 开始计时

        with ThreadPoolExecutor(max_workers=5) as executor:
            combined_list = list(executor.map(fetch_status, storage.data))

        end_time = time.time()  # 结束计时
        elapsed_time = end_time - start_time
        if elapsed_time < 1:
            print(f"执行耗时: {elapsed_time * 1000:.0f} ms")
        else:
            print(f"执行耗时: {elapsed_time:.2f} s")

        self.window.evaluate_js(f"update({json.dumps(combined_list)})")

    def addServer(self, data):
        name, address = data['name'], data['address']
        if ":" not in address:
            ip = address
            port = '25565'
        else:
            parts = address.rsplit(":", 1)
            ip = parts[0]
            port = parts[1] if parts[1] else "25565"
        fulladdress = ip + ":" + port

        server = {"name": name,
                  "address": address,
                  "fulladdress": fulladdress,
                  "id": int(time.time()),
                  "addtime": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                  "edittime": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                  }
        print(server)
        storage.addServer(server)
        self.refreshServer()

    def refreshServer(self):
        self.load_data()

    def removeServer(self, id):
        if storage.removeServer(id):
            # self.refreshServer()
            pass

    def moveUp(self, id):
        storage.moveUp(id)

    def moveDown(self, id):
        storage.moveDown(id)
