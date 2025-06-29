import webview
from src.backend import API

if __name__ == '__main__':
    webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False

    window = webview.create_window('mc', './src/frontend/index.html', min_size=(400, 300))

    API.API(window)

    webview.start(private_mode=False, debug=True)
