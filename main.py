import webview
from src.backend import API, get_path, config

html = './src/frontend/index.html'
get_path = get_path.get_path('config.ini', use_mei_pass=False)
config = config.config(get_path)


def get_mainwindow_config():
    a = config.get_config([
        {"section": "mainwindow", "option": "width"},
        {"section": "mainwindow", "option": "height"},
        {"section": "mainwindow", "option": "x"},
        {"section": "mainwindow", "option": "y"},
        {"section": "mainwindow", "option": "maximized"},
    ])

    return {
        "width": int(a["mainwindow"]["width"]) if a["mainwindow"]["width"] else None,
        "height": int(a["mainwindow"]["height"]) if a["mainwindow"]["height"] else None,
        "x": int(a["mainwindow"]["x"]) if a["mainwindow"]["x"] else None,
        "y": int(a["mainwindow"]["y"]) if a["mainwindow"]["y"] else None,
        "maximized": a["mainwindow"]["maximized"] == "True",
    }


if __name__ == '__main__':
    width, height, x, y, maximized = get_mainwindow_config().values()

    window = webview.create_window(
        'mcStatus',
        html,
        min_size=(400, 300),
        maximized=maximized,
        x=x,
        y=y,
        width=width or 800,
        height=height or 600,
    )

    api = API.API(window)

    window.events.moved += api.on_moved
    window.events.resized += api.on_resized
    window.events.maximized += api.on_maximized
    window.events.restored += api.on_restored

    webview.start(debug=False)
