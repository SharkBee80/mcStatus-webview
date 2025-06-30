import os
import sys
from pathlib import Path


def get_program_name():
    program_name = os.path.splitext(os.path.basename(sys.argv[0]))[0]
    return str(program_name)


def get_path(relative_path: str, output_type: str = None, CONFIG_DIR_NAME: str = None, use_mei_pass: bool = False):
    """
    获取相对于 base_path 的路径。

    :param relative_path: 相对路径字符串
    :param output_type: "str" or Path
    :param CONFIG_DIR_NAME: 配置文件夹（用于打包环境,配置文件）
    :param use_mei_pass: 是否强制使用 sys._MEIPASS（用于打包环境,temp文件）
    :return: 组合后的绝对路径
    """
    if use_mei_pass:
        try:
            base_path = sys._MEIPASS
        except AttributeError:
            base_path = Path(sys.argv[0]).parent.resolve()
    else:
        if getattr(sys, 'frozen', False):  # 打包后
            CONFIG_DIR_NAME = CONFIG_DIR_NAME or get_program_name() + "_config"
            base_path = Path(sys.executable).parent / CONFIG_DIR_NAME  # exe所在目录
            base_path.mkdir(exist_ok=True)
            descript = f"这里是{get_program_name}的配置文件"
            try:
                with open(base_path / descript, "w", encoding="utf-8") as f:
                    f.write("")  # 可选：写入初始内容
            except (IOError, OSError) as e:
                print(f"无法创建配置文件: {e}")
        else:
            base_path = Path(sys.argv[0]).parent.resolve()
    out_path = (base_path / relative_path).resolve()
    if output_type == "str":
        out_path = str(out_path)
    else:
        out_path = Path(out_path)
    print(out_path)
    return out_path
