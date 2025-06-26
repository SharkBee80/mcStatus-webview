import time

import webview
from src.backend import storage

storage = storage.Storage()


class API:
    def __init__(self, window):
        self.window: webview.Window = window
        self.window.expose(self.onload_init, self.addServer, self.refreshServer, self.removeServer, self.moveUp,
                           self.moveDown)

    def onload_init(self):
        # print('data:' + storage.data.__str__())
        self.window.evaluate_js("update(" + storage.data.__str__() + ")")



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
        self.window.evaluate_js("update(" + storage.data.__str__() + ")")

    def removeServer(self, id):
        if storage.removeServer(id):
            # self.refreshServer()
            pass

    def moveUp(self, id):
        storage.moveUp(id)

    def moveDown(self, id):
        storage.moveDown(id)

