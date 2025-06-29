import webview
from src.backend import API
url = './src/frontend/index.html'

if __name__ == '__main__':
    webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False

    window = webview.create_window('mcStatus', url, min_size=(400, 300))

    API.API(window)

    webview.start(private_mode=False, debug=False)
