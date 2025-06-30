import json
from src.backend import get_path


class Storage:
    def __init__(self):
        self.path = get_path.get_path("data.json", use_mei_pass=False)
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
