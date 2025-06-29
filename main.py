import webview
from src.backend import API, get_path
url = get_path.get_path('./src/frontend/index.html')

if __name__ == '__main__':
    webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False

    window = webview.create_window('mcStatus', url, min_size=(400, 300))

    API.API(window)

    webview.start(private_mode=False, debug=False)
