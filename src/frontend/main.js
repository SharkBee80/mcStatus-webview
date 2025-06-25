
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

//ui
const form_clickHandler = e => {
    if (!e.target.closest(".form-content") && !e.target.closest(".btn")) {
        form_display();
    }
};
const form_display = () => {
    const form = document.querySelector(".form");
    form.style.display = "none";
    document.removeEventListener("click", form_clickHandler);
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
        //window.api.send("addServer", server);
        form_display();
    }
    else if (!name) {
        //alert("请填写服务器名称");
        console.log("请填写服务器名称");
        form_display();
    }
    else {
        //alert("请填写服务器地址");
        console.log("请填写服务器地址");
    }
}

function cancel() {
    document.querySelector("#server-name").value = "";
    document.querySelector("#server-address").value = "";
    form_display();
}