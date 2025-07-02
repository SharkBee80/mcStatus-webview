import time

from mcstatus import JavaServer

have_address = []


class Server:
    def __init__(self, fulladdress):
        self.address = fulladdress

        self.able = None
        self.on_off = None

        self.version = None
        self.server = None
        self.online = None
        self.max = None
        self.players = None
        self.motd = None
        self.icon = None
        self.ping = None
        self.elapsed_time = None

        self.signal = None

    def init(self):
        if self.address in have_address:
            return None
        have_address.append(self.address)
        self.elapsed_time = time.time()
        max_retries = 3  # 最大重试次数
        retry_delay = 2  # 重试间隔(秒)

        for attempt in range(max_retries):
            try:
                server_ = JavaServer.lookup(self.address)
                status = server_.status()

                self.able = True
                self.on_off = "Online"
                self.version = status.version.name
                self.server = server_.address.host.upper()
                self.online = status.players.online
                self.max = status.players.max
                self.players = [{"name": player.name, "uuid": player.id} for player in
                                status.players.sample] if status.players.sample else None
                self.icon = status.icon
                self.motd = status.description
                self.ping = f"{float(status.latency):.2f} ms"

                def rate_signal():
                    if status.latency < 50:
                        return 5
                    elif status.latency < 125:
                        return 4
                    elif status.latency < 250:
                        return 3
                    elif status.latency < 400:
                        return 2
                    else:
                        return 1

                self.signal = rate_signal()
                break  # 成功则跳出循环

            except Exception as e:
                print(f"尝试 {attempt + 1}/{max_retries} 失败: {e} 服务器: {self.address}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                else:
                    self.able = False
                    self.on_off = "Offline"
                    self.version = None
                    self.server = None
                    self.online = None
                    self.max = None
                    self.players = None
                    self.motd = None
                    self.icon = None
                    self.ping = None
                    self.signal = 0
            finally:
                continue
        have_address.remove(self.address)
        self.elapsed_time = f"{(time.time() - self.elapsed_time):.2f} ms"
        output = {"able": self.able, "status": self.on_off, "version": self.version, "server": self.server,
                  "online": self.online, "max": self.max, "players": self.players, "icon": self.icon,
                  "motd": self.motd, "ping": self.ping, "signal": self.signal,
                  "updatetime": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                  "elapsed_time": self.elapsed_time
                  }
        return output


if __name__ == "__main__":
    # server-hyyan.dynv6.net:25585
    # play.orwoe.cn:25565
    # kowkmc.mcone.cc:25565
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
