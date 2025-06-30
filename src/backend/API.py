import json
import time

import webview

from src.backend import storage, listen

storage = storage.Storage()


class API:
    def __init__(self, window):
        self.window: webview.Window = window
        self.window.expose(self.onload_init, self.updateServer, self.addServer, self.editServer,
                           self.refreshList, self.removeServer, self.moveUp, self.moveDown)

    def onload_init(self):
        self.load_data()

    def load_data(self):
        combined_list = []
        for i in storage.data:
            combined = {i['name'], i['address'], i['id']}
            combined_list.append(combined)
        self.window.evaluate_js(f"load_list({json.dumps(storage.data)})")

    def updateServer(self, id):
        for i in storage.data:
            if i['id'] == id:
                status = listen.Server(i['fulladdress']).init()
                combined = {**i, **status}
                self.window.evaluate_js(f"updateServer({json.dumps(combined)})")

    def format_address(self, address):
        if ":" not in address:
            ip = address
            port = '25565'
        else:
            parts = address.rsplit(":", 1)
            ip = parts[0]
            port = parts[1] if parts[1] else "25565"
        fulladdress = ip + ":" + port
        return fulladdress

    def addServer(self, data):
        name, address = data['name'], data['address']
        fulladdress = self.format_address(address)

        server = {"name": name,
                  "address": address,
                  "fulladdress": fulladdress,
                  "id": int(time.time()),
                  "addtime": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                  "edittime": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                  }
        print(server)
        storage.addServer(server)
        self.refreshList()

    def editServer(self, data):
        name, address, id = data['name'], data['address'], data['id']
        fulladdress = self.format_address(address)

        server = {"name": name,
                  "address": address,
                  "fulladdress": fulladdress,
                  "id": id,
                  "edittime": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                  }

        storage.editServer(server)
        self.updateServer(id)

    def refreshList(self):
        self.load_data()

    def removeServer(self, id):
        if storage.removeServer(id):
            # self.refreshServer()
            pass

    def moveUp(self, id):
        storage.moveUp(id)

    def moveDown(self, id):
        storage.moveDown(id)
