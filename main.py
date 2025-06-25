import webview

if __name__ == '__main__':
    webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False

    webview.create_window('mc', './src/frontend/index.html',min_size=(400, 300))
    webview.start(debug=True)
