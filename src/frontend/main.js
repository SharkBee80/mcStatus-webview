onload = async () => {
    await new Promise(resolve => setTimeout(resolve, 200));

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
                <button class="btn2 up" onclick="moveUp(${id})">▲</button>
                <button class="btn2 down" onclick="moveDown(${id})">▼</button>
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
    if (!e.target.closest(".form-content") && !e.target.closest(".btn")) {
        form_undisplay();
    }
};
const form_undisplay = (args) => {
    const form = document.querySelector(".form");
    form.style.display = "none";
    document.removeEventListener("click", form_clickHandler);

    if (args === 0) {
        document.querySelector("#server-name").value = "";
        document.querySelector("#server-address").value = "";
    }
    editid = null;
};

async function addServer() {
    const form = document.querySelector(".form");
    form.style.display = "";
    //await new Promise(resolve => setTimeout(resolve, 100));
    document.addEventListener("click", form_clickHandler);
}

let editid = null;
function confirm() {
    const name = document.querySelector("#server-name").value;
    const address = document.querySelector("#server-address").value;
    if (address) {
        const server = {
            name: name ? name : "MineCraft Server",
            address,
        };
        console.log(server);
        if (editid) {
            server.id = editid;
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
        const form = document.querySelector(".form");
        form.style.display = "";
        //await new Promise(resolve => setTimeout(resolve, 100));
        document.addEventListener("click", form_clickHandler);

        editid = selected[1];
    }
}

function refreshServer() {
    selected = null;
    //pywebview.api.refreshServer();
    updateAll();
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

// other
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