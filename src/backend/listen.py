from mcstatus import JavaServer


class Server:
    def __init__(self, fulladdress):
        self.address = fulladdress

        self.version = None
        self.server = None
        self.online = None
        self.max = None
        self.players = None
        self.motd = None
        self.icon = None
        self.ping = None

    def init(self):
        try:
            server_ = JavaServer.lookup(self.address)
            status = server_.status()

            self.version = status.version.name
            self.server = server_.address.host.upper()
            self.online = status.players.online
            self.max = status.players.max
            self.players = [{"name": player.name, "uuid": player.id} for player in status.players.sample] if status.players.sample else None
            self.icon = status.icon
            self.motd = status.description
            self.ping = status.latency

            output = {"version": self.version, "server": self.server, "online": self.online, "max": self.max, "players": self.players, "icon": self.icon, "motd": self.motd, "ping": self.ping}
            return output
        except Exception as e:
            print(e)


if __name__ == "__main__":
    # server-hyyan.dynv6.net:25585
    address = input("请输入服务器地址: ")
    if ":" not in address:
        ip = address
        port = '25565'
    else:
        parts = address.rsplit(":", 1)
        ip = parts[0]
        port = parts[1] if parts[1] else "25565"
    server = ip + ":" + port
    print(server)
    server = Server(server)
    # print(f"版本: {server.version}\n服务器: {server.server}\n在线: {server.online}\n最大: {server.max}\n玩家: {server.players}\n图标: {server.icon}\nMOTD: {server.motd}\n延迟: {server.ping}ms")
    print(server.init())
