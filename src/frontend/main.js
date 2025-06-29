onload = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    btn_ui();
    load_list(servers);
    pywebview.api.onload_init();
};

/*
// show/hide buttons
function showBtns(el) {
    el.querySelectorAll(".btn2").forEach(btn => {
        btn.style.display = "block";
    });
}
function hideBtns(el) {
    el.querySelectorAll(".btn2").forEach(btn => {
        btn.style.display = "none";
    });
}
*/

//server list
const serverList = document.querySelector(".serverList");
const icon = './assets/img/img.png';
const itemid = () => {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
let selected = null;
let servers = [
    {
        able: false,
        address: "0.0.0.0",
        addtime: "2025-06-28 16:28:15",
        edittime: "2025-06-28 16:28:15",
        fulladdress: "0.0.0.0:25565",
        icon: null,
        id: 1751099295,
        max: null,
        motd: "A MineCraft Server",
        name: "MineCraft Server",
        online: null,
        ping: null,
        players: null,
        server: null,
        signal: 0,
        status: "Offline",
        updatetime: "2025-06-28 17:58:19",
        version: null,
    },
]

function load_list(data) {
    servers = data;
    serverList.innerHTML = ""; // 清空现有内容
    selected = null;
    servers.forEach(item => {
        const div = document.createElement("div");
        div.className = "server-item";
        const id = item.id !== ('' || undefined) ? item.id : 'withoutid_' + itemid();
        div.id = 'listitem_' + id;

        div.innerHTML = `
            <div class="server-item-icon">
                <img src="${icon}" alt="Icon"></img>
                <div class="server-item-actions">
                    <button class="btn2 up" onclick="moveUp(${id})">▲</button>
                    <button class="btn2 down" onclick="moveDown(${id})">▼</button>
                </div>
            </div>
            <div class="server-item-info">
                <div class="server-item-name" id="server-item-name">${item.name}</a></div>
                <div class="server-item-motd" id="server-item-motd">A MineCraft Server</a></div>
            </div>
            <div class="server-item-signal">
                <img src="./assets/img/singal/loading.gif" alt="" id="server-item-loading">
            </div>
        `;
        serverList.appendChild(div);
        div.addEventListener("click", (e) => {
            if (e.target.closest('.server-item-actions')) {
                return;
            }
            serverList.querySelectorAll(".server-item").forEach(item => {
                item.classList.remove("selected");
            });
            div.classList.add("selected");
            selected = [div.id, id, item.name, item.address];
            // 双击
            if (e.detail === 2) {
                //noty(item.address)
            }
        });
    });
    updateAll();
}

function updateAll() {
    const imgs = serverList.querySelectorAll(".server-item .server-item-signal img");
    imgs.forEach(img => {
        img.src = "./assets/img/singal/loading.gif";
    });
    servers.forEach(item => {
        pywebview.api.updateServer(item.id);
    });
}

function updateServer(item) {
    console.log(item);
    servers.forEach(ser => {
        if (ser.id === item.id) {
            ser.name = item.name;
            ser.address = item.address;
        };
    });

    const server_item = document.querySelector('#listitem_' + item.id);
    server_item.innerHTML = ""; // 清空现有内容

    const id = server_item.id;
    const motd = item.motd ? parseMOTD(String(item.motd)) : "A MineCraft Server";
    const players = () => {
        if (item.players) {
            a = ''
            item.players.forEach(player => {
                a += `<p>${parseMOTD(player.name)}</p>`
            });
            return `<div class="tooltiptext">${a}</div>`;
        } else {
            return "";
        }
    };
    server_item.innerHTML = `
        <div class="server-item-icon">
            <img src="${item.icon || icon}" alt="Icon"></img>
            <div class="server-item-actions">
                <button class="btn2 up" onclick="moveUp(${item.id})">▲</button>
                <button class="btn2 down" onclick="moveDown(${item.id})">▼</button>
            </div>
        </div>
        <div class="server-item-info">
            <div class="server-item-name" id="server-item-name">${item.name}</a></div>
            <div class="server-item-motd" id="server-item-motd">${motd}</a></div>
        </div>
        <div class="server-item-signal">
            <a>${item.able ? `${item.online}/${item.max}` : ""}</a>
            <img src="./assets/img/singal/${item.signal}.png" alt="">
            <div class="tooltip">
                ${players()}
            </div>
        </div>
    `;
}

function moveUp(id) {
    pywebview.api.moveUp(id);
    const item = document.querySelector(`#listitem_${id}`);
    if (!item) return;

    const prev = item.previousElementSibling;
    if (prev) {
        item.parentNode.insertBefore(item, prev);
    }
}

function moveDown(id) {
    pywebview.api.moveDown(id);
    const item = document.querySelector(`#listitem_${id}`);
    if (!item) return;

    const next = item.nextElementSibling;
    if (next) {
        item.parentNode.insertBefore(next, item);
    }
}

//ui
const form_clickHandler = e => {
    if (!e.target.closest(".form-content")) {
        form_undisplay();
    }
};
const form_undisplay = (args) => {
    const form = document.querySelector(".form");
    form.style.display = "none";
    document.removeEventListener("click", form_clickHandler);
    document.querySelectorAll(".ui .btn").forEach(btn => btn.disabled = false);
    if (args === 0) {
        document.querySelector("#server-name").value = "";
        document.querySelector("#server-address").value = "";
    }
    editid = null;
};

const form_display = async (args) => {
    const form = document.querySelector(".form");
    form.style.display = "";
    //await new Promise(resolve => setTimeout(resolve, 100));
    document.addEventListener("click", form_clickHandler);
    document.querySelectorAll(".ui .btn").forEach(btn => btn.disabled = true);
};

function addServer() {
    form_display();
}

let editid = null;
function confirm() {
    const name = document.querySelector("#server-name").value;
    const address = document.querySelector("#server-address").value;
    if (address) {
        const server = {
            name: name ? name : "MineCraft Server",
            address,
            id: editid
        };
        console.log(server);
        if (editid) {
            if (editid === selected[1]) {
                selected[2] = server.name;
                selected[3] = server.address;
            }
            pywebview.api.editServer(server);
        }
        else {
            pywebview.api.addServer(server);
        }
        form_undisplay(0);
    }
    else if (!name) {
        //alert("请填写服务器名称");
        noty("请填写服务器名称");
        form_undisplay();
    }
    else {
        //alert("请填写服务器地址");
        noty("请填写服务器地址");
    }
}

function cancel() {
    form_undisplay(0);
}

function editServer() {
    //return;
    if (selected) {
        document.querySelector("#server-name").value = selected[2];
        document.querySelector("#server-address").value = selected[3];

        form_display();

        editid = selected[1];
    }
    else {
        noty("请选择一个服务器")
    }
}

function refreshServer() {
    selected = null;
    updateAll();
    noty("正在刷新服务器")
}

function refreshList() {
    selected = null;
    pywebview.api.refreshServer();
    noty("正在刷新服务器列表")
}

function removeServer() {
    if (selected) {
        /*
        const index = server.findIndex(item => item.id === selected.id);
        if (index !== -1) {
            server.splice(index, 1);
            selected = null;
            update(server);
        }*/
        serverList.querySelector(`#${selected[0]}`)?.remove();
        pywebview.api.removeServer(selected[1]);
        noty(`已删除服务器:${selected[2]}`);
        selected = null;
    }
}

function btn_ui() {
    const btns = document.querySelectorAll(".ui .btn");
    btns.forEach(btn => {
        const id = btn.getAttribute("btn_id");
        if (id === 'add') {
            addLongPressListener(btn, (e) => {
                if (e.click) addServer();
            });
        };
        if (id === 'edit') {
            addLongPressListener(btn, (e) => {
                if (e.click) editServer();
                if (e.longPress) {
                    serverList.querySelectorAll(".server-item").forEach(item => {
                        item.classList.remove("selected");
                    });
                    selected = null;
                };
            });
        }
        if (id === 'refresh') {
            addLongPressListener(btn, (e) => {
                if (e.click) refreshServer();
                if (e.longPress) refreshList();
            });
        };
        if (id === 'remove') {
            addLongPressListener(btn, (e) => {
                if (e.click) removeServer();
            });
        };
    });
}

// other

// minecraft motd color
function parseMOTD(input) {
    const colorMap = {
        '§0': 'mc-black',
        '§1': 'mc-dark-blue',
        '§2': 'mc-dark-green',
        '§3': 'mc-dark-aqua',
        '§4': 'mc-dark-red',
        '§5': 'mc-dark-purple',
        '§6': 'mc-gold',
        '§7': 'mc-gray',
        '§8': 'mc-dark-gray',
        '§9': 'mc-blue',
        '§a': 'mc-green',
        '§b': 'mc-aqua',
        '§c': 'mc-red',
        '§d': 'mc-light-purple',
        '§e': 'mc-yellow',
        '§f': 'mc-white'
    };

    const formatMap = {
        '§l': 'mc-bold',
        '§m': 'mc-strikethrough',
        '§n': 'mc-underline',
        '§o': 'mc-italic'
    };

    let result = '';
    let currentSpan = '';
    let currentClasses = [];

    for (let i = 0; i < input.length; i++) {
        if (input[i] === '§' && i + 1 < input.length) {
            if (currentSpan) {
                result += `<span class=${currentClasses.join(' ')}>${currentSpan}</span>`;
                currentSpan = '';
            }

            const code = input.substr(i, 2);
            if (colorMap[code]) {
                currentClasses = [colorMap[code]];
            } else if (formatMap[code]) {
                currentClasses.push(formatMap[code]);
            } else if (code === '§r') {
                currentClasses = [];
            }
            i++;
        } else {
            currentSpan += input[i];
        }
    }

    if (currentSpan) {
        result += `<span class=${currentClasses.join(' ')}>${currentSpan}</span>`;
    }

    return result || 'No description available';
}

// 按钮事件
/**
 * @description 长、短按监听
 * @param {Element} element 监听元素
 * @param {Function} callback 回调函数 {type:}
 * @param {Number} threshold 阈值，默认700ms
 * @example 
 * addLongPressListener(element, (e) => {
 *      e.click === true;
 *      e.longPress === false;
 *      e.element === element;
 * }, 700);
 */
function addLongPressListener(element, callback, threshold = 700) {
    let pressTimer = null;
    let isLongPress = false;

    const start = (e) => {
        if (pressTimer !== null) return;

        isLongPress = false;

        // 防止触发默认行为（如文本选择）
        e.preventDefault();

        // 移动端振动反馈
        if (e.type === 'touchstart' && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }

        pressTimer = setTimeout(() => {
            isLongPress = true;
            callback({ click: false, longPress: true, element: element });
            pressTimer = null;
        }, threshold);
    };

    const cancel = (e) => {
        if (pressTimer !== null) {
            clearTimeout(pressTimer);

            if (!isLongPress && (e.type === 'mouseup' || 'touchend')) {
                callback({ click: true, longPress: false, element: element });
            }

            pressTimer = null;
            isLongPress = false;
        }
    };

    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // 添加事件监听
    // mouse
    element.addEventListener('mousedown', start);
    element.addEventListener('mouseup', cancel);
    element.addEventListener('mouseleave', cancel);
    // touch
    element.addEventListener('touchstart', start);
    element.addEventListener('touchend', cancel);
    element.addEventListener('touchcancel', cancel);
}