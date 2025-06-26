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
const icon = './assets/img/block.png';
const itemid = () => {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
let selected = null;
const server = [
    {
        icon: "",
        name: "MineCraft Server",
        address: "127.0.0.1:25565",
        status: "0/20",
        id: 1
    },
]
function update(servers) {
    serverList.innerHTML = ""; // 清空现有内容
    servers.forEach(item => {
        const div = document.createElement("div");
        div.className = "server-item";
        const id = item.id !== ('' || undefined) ? item.id : 'withoutid_' + itemid();
        div.id = 'listitem_' + id;
        div.innerHTML = `
            <div class="server-item-icon">
                <img src="${item.icon || icon}" alt="Icon"></img>
            </div>
            <div class="server-item-info">
                <div class="server-item-name">Name: <a id="server-item-name">${item.name}</a></div>
                <div class="server-item-address">Address: <a id="server-item-address">${item.address}</a></div>
                <div class="server-item-status">Status: <a id="server-item-status">${item.status}</a></div>
            </div>
            <div class="server-item-actions" onmouseover="showBtns(this)" onmouseout="hideBtns(this)">
                <button class="btn2 btn-hid" onclick="moveUp(${id})">▲</button>
                <button class="btn2 btn-hid" onclick="moveDown(${id})">▼</button>
            </div>
        `;
        serverList.appendChild(div);
        div.addEventListener("click", () => {
            serverList.querySelectorAll(".server-item").forEach(item => {
                item.classList.remove("selected");
            });
            div.classList.add("selected");
            selected = [div.id, id];
        });
    });
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