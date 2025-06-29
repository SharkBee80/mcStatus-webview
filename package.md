# `!!请在虚拟环境下执行!!`
* 查看所有包
```shell
pip freeze
```
* 卸载所有包
```shell
pip uninstall -y -r packages.txt
pip cache purge
```
* 安装所有包
```shell
pip install -r requirements.txt
```
* 安装打包工具
```shell
pip install pyinstaller
```
* 打包
```shell
pyinstaller --onefile --noconsole --clean --add-data="src;src" --exclude-module=PyQt5 --name mcstatus --icon=mc.ico main.py
```
* 打包了哪些模块
```shell
pyi-archive_viewer dist/mcstatus.exe
```