import json
from json import JSONDecodeError


class Storage:
    def __init__(self):
        self.path = 'data.json'
        self.data = []
        self.load()

    def load(self):
        try:
            with open(self.path, 'r') as f:
                self.data = json.load(f)
        except FileNotFoundError:
            self.data = []
            self.save()
        except JSONDecodeError:
            self.data = []
            self.save()

    def save(self):
        with open(self.path, 'w') as f:
            json.dump(self.data, f, indent=4)

    def addServer(self, data):
        self.data.insert(0, data)  # 插入到顶部
        self.save()
        return True

    def removeServer(self, id):
        for i in range(len(self.data)):
            if self.data[i]['id'] == id:
                self.data.pop(i)
                self.save()
                return True
        return False
