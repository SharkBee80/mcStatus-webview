onload = () => {
    update(server);
    setTimeout(() => pywebview.api.onload_init(), 200);
};
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

//server list
const serverList = document.querySelector(".serverList");
const icon = './assets/img/img.png';
const itemid = () => {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
let selected = null;
const server = [
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
function update(servers) {
    console.log(servers);
    serverList.innerHTML = ""; // 清空现有内容
    servers.forEach(item => {
        const div = document.createElement("div");
        div.className = "server-item";
        const id = item.id !== ('' || undefined) ? item.id : 'withoutid_' + itemid();
        div.id = 'listitem_' + id;
        div.innerHTML = `
            <div class="server-item-icon" onmouseover="showBtns(this)" onmouseout="hideBtns(this)">
                <img src="${item.icon || icon}" alt="Icon"></img>
                <div class="server-item-actions">
                    <button class="btn2 up" onclick="moveUp(${id})">▲</button>
                    <button class="btn2 down" onclick="moveDown(${id})">▼</button>
                </div>
            </div>
            <div class="server-item-info">
                <div class="server-item-name"><a id="server-item-name">${item.name}</a></div>
                <div class="server-item-motd"><a id="server-item-motd">${item.motd}</a></div>
                <!--<div class="server-item-status">Status: <a id="server-item-status" style="color: ${item.able ? "green" : "red"}">${item.status}</a></div>-->
            </div>
            <div class="server-item-signal">
                    <a id="server-item-online">${item.able ? `${item.online}/${item.max}` : ""}</a>
                    <img src="./assets/img/singal/${item.signal}.png" alt="" id="server-item-loading">
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
            selected = [div.id, id];
        });
    });
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
};

async function addServer() {
    const form = document.querySelector(".form");
    form.style.display = "";
    //await new Promise(resolve => setTimeout(resolve, 100));
    document.addEventListener("click", form_clickHandler);
}

function confirm() {
    const name = document.querySelector("#server-name").value;
    const address = document.querySelector("#server-address").value;
    if (address) {
        const server = {
            name: name ? name : "MineCraft Server",
            address,
        };
        console.log(server);
        pywebview.api.addServer(server);
        form_undisplay(0);
    }
    else if (!name) {
        //alert("请填写服务器名称");
        console.log("请填写服务器名称");
        form_undisplay();
    }
    else {
        //alert("请填写服务器地址");
        console.log("请填写服务器地址");
    }
}

function cancel() {
    form_undisplay(0);
}

function editServer() {
    return;
    if (selected) {
        const server = serverList.querySelector(`#${selected}`);
        const name = server.querySelector("#server-item-name").textContent;
        const address = server.querySelector("#server-item-address").textContent;
        document.querySelector("#server-name").value = name;
        document.querySelector("#server-address").value = address;
        const form = document.querySelector(".form");
        form.style.display = "";
        //await new Promise(resolve => setTimeout(resolve, 100));
        document.addEventListener("click", form_clickHandler);
    }
}

function refreshServer() {
    selected = null;
    pywebview.api.refreshServer();
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
    }
}

