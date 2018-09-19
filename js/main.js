const LEFT = '>' //'▷';
const RIGHT = '_' //'⊔';
const ERROR_RED = "#f88";
const OK_GREEN = "#8f8";
const DEFAULT_COLOR = "#fff";

let globalCounter = 0;
let controlUnit = null;
let parser = null;
let turingMachine = null;
let messageBox = null;

function gid() {
    globalCounter++;
    return globalCounter;
}

function init() {
    console.log(`translating static stuff`);
    translate()
    console.log(`translated`);

    console.log(`initializing`);
    messageBox = document.getElementById('messageBox');
    document.getElementById('machine_selector').value = "";

    controlUnit = new ControlUnit();
    edit();

    linkLoad();
    document.getElementById('file_input').addEventListener('change', fileLoad, false);

    console.log(`initialized`);

    // // blinky help button
    // let colorButton = document.getElementById("help_button");
    // let time = 100;
    // for (let i = 1; i < 8; i += 2) {
    //     setTimeout(() => {
    //         colorButton.style.background = "#8f8"
    //     }, time * i);
    //     setTimeout(() => {
    //         colorButton.style.background = ""
    //     }, time * (i + 1));
    // }

    // let overlay = document.getElementById('overlay');
    // let span = document.getElementById("close");

    // colorButton.onclick = () => {
    //     overlay.style.display = "block";
    // }

    // span.onclick = () => {
    //     overlay.style.display = "none";
    // }

    // window.onclick = (event) => {
    //     if (event.target == overlay) {
    //         overlay.style.display = "none";
    //     }
    // }

    // document.body.onkeydown = (event) => {
    //     if (event.key === "Escape") {
    //         overlay.style.display = "none";
    //     }
    // }

    // let disableHelp = document.getElementById("disableHelp");

    // disableHelp.onclick = () => {
    //     localStorage.setItem('firstTimeHelp', "hide");
    //     overlay.style.display = "none";
    // }

    // if (localStorage.getItem('firstTimeHelp') != "hide") {
    //     overlay.style.display = "block";
    // }
}

function stringify() {
    let data = controlUnit.stringify();
    data.gid = globalCounter;
    return data;
}

function destringify(string) {
    controlUnit.destringify(string);
    globalCounter = JSON.parse(string).gid;
}

function unpaintAll() {
    // TODO would be nice to replace these replacers with Element.classList stuff 
    document.querySelectorAll(".pastColor").forEach((element) => {
        element.setAttribute("class", element.getAttribute("class").replace(" pastColor", ""));
    });

    document.querySelectorAll(".selectedColor").forEach((element) => {
        element.setAttribute("class", element.getAttribute("class").replace(" selectedColor", ""));
    });

    document.querySelectorAll(".errorColor").forEach((element) => {
        element.setAttribute("class", element.getAttribute("class").replace(" errorColor", ""));
    });
}