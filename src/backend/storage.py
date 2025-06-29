import json
import os
import sys
from pathlib import Path

def get_app_path(relative_path):
    if getattr(sys, 'frozen', False):  # 打包后
        CONFIG_DIR_NAME = ".mcstatus"
        base_path = Path(sys.executable).parent / CONFIG_DIR_NAME  # exe所在目录
    else:  # 开发环境
        base_path = Path(__file__).parent.parent.parent
    return (base_path / relative_path).resolve()

class Storage:
    def __init__(self):
        self.path = get_app_path("data.json")
        os.makedirs(self.path.parent, exist_ok=True)  # 自动创建目录
        self.data = []
        self.load()

    def load(self):
        try:
            with open(self.path, 'r') as f:
                self.data = json.load(f)
        except FileNotFoundError:
            self.data = []
            self.save()
        except json.JSONDecodeError:
            self.data = []
            self.save()

    def save(self):
        with open(self.path, 'w') as f:
            json.dump(self.data, f, indent=4)

    def addServer(self, data):
        self.data.insert(0, data)  # 插入到顶部
        self.save()
        return True

    def editServer(self, data):
        for i in range(len(self.data)):
            if self.data[i]['id'] == data['id']:
                self.data[i]['name'] = data['name']
                self.data[i]['address'] = data['address']
                self.data[i]['fulladdress'] = data['fulladdress']
                self.data[i]['edittime'] = data['edittime']
                self.save()
                return True
        return False

    def removeServer(self, id):
        for i in range(len(self.data)):
            if self.data[i]['id'] == id:
                self.data.pop(i)
                self.save()
                return True
        return False

    def moveUp(self, id):
        for i in range(1, len(self.data)):
            if self.data[i]['id'] == id:
                self.data[i], self.data[i - 1] = self.data[i - 1], self.data[i]
                self.save()
                return True
        return False

    def moveDown(self, id):
        for i in range(len(self.data) - 1):
            if self.data[i]['id'] == id:
                self.data[i], self.data[i + 1] = self.data[i + 1], self.data[i]
                self.save()
                return True
        return False
