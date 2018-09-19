function disableElement(id) {
    document.getElementById(id).setAttribute('disabled', ' ');
}

function enableElement(id) {
    document.getElementById(id).removeAttribute('disabled');
}

function hideElement(id) {
    document.getElementById(id).style.display = "none";
}

function showElement(id) {
    document.getElementById(id).style.display = "";
}

function step() {
    let stepCountElement = document.getElementById("step_count");

    if (stepCountElement.value < 1) {
        stepCountElement.value = 1;
    }

    for (let i = 0; i < stepCountElement.value; i++) {
        result = turingMachine.next();
        if (result != null) {
            break;
        }
    }
}

function autostep() {
    result = turingMachine.next();

    for (step_button of document.getElementById("step_selection").childNodes) {
        step_button.setAttribute('disabled', ' ');
    }

    if (result != null) {
        disableAutostep();
        document.getElementById("step_button").setAttribute("disabled", " ");
        document.getElementById("autostep_button").setAttribute("disabled", " ");
        document.getElementById("finish_button").setAttribute("disabled", " ");
    }

    return result;
}

autostepInterval = null;

function enableAutostep() {
    let input = document.getElementById("autostep_interval");

    if (input.value < 0) {
        input.value = 0
    }

    let interval = input.value;

    disableElement("autostep_interval");
    disableElement("edit_button");
    disableElement("step_button");
    disableElement("step_count");
    disableElement("finish_button");
    disableElement("reset_button");

    let button = document.getElementById("autostep_button");
    button.innerHTML = i18n("autoStop");
    button.onclick = disableAutostep;

    let f = autostep();

    if (f == null) {
        autostepInterval = setInterval(autostep, interval);
    }
}

function disableAutostep() {
    let button = document.getElementById("autostep_button");
    button.innerHTML = i18n("autoStep");
    button.onclick = enableAutostep;

    clearInterval(autostepInterval);

    enableElement("autostep_interval");
    enableElement("edit_button");
    enableElement("step_button");
    enableElement("step_count");
    enableElement("finish_button");
    enableElement("reset_button");

    for (step_button of document.getElementById("step_selection").childNodes) {
        step_button.removeAttribute('disabled');
    }
}

function manualStep(transitionId) {
    turingMachine.next(true, transitionId);
}

function edit() {
    console.log("switching to edit mode");

    unpaintAll();

    controlUnit.regenerateTable();

    let fieldset = document.getElementById("tape_fieldset");

    fieldset.innerHTML = `<legend>${i18n("tapes")}</legend>
    ${i18n("tapeInput")} <input id='tape_input' class='tapeInput' value='${controlUnit.tapeInput}'><br>
    ${i18n("tapeCount")} &nbsp;&nbsp;&nbsp;<input id='tapeCount' onkeydown="if(event.keyCode == 13) {updateTapeCount()}" onblur="updateTapeCount()" value='${controlUnit.tapeCount}' class='tapeCount'><br>`;

    document.querySelectorAll(".green").forEach((element) => {
        element.setAttribute("class", element.getAttribute("class").replace(" green", ""));
    });
    let e = document.getElementById("edit_button")
    e.setAttribute("class", e.getAttribute("class") + " green");

    enableElement("simulation_button");
    disableElement("edit_button");

    hideElement("simulation_mode_buttons");
    showElement("edit_mode_buttons");
    showElement("add_state");
    showElement("add_symbol");

    infoMessage(i18n("switchedEditMode"));
}

function simulation() {
    try {
        console.log(`========= running parser =========`);
        parser = new Parser();

        document.querySelectorAll(".green").forEach((element) => {
            element.setAttribute("class", element.getAttribute("class").replace(" green", ""));
        });
        let e = document.getElementById("simulation_button")
        e.setAttribute("class", e.getAttribute("class") + " green");

        disableElement("simulation_button");
        enableElement("edit_button");

        showElement("simulation_mode_buttons");
        hideElement("edit_mode_buttons");
        hideElement("add_state");
        hideElement("add_symbol");

        enableElement("step_button");
        enableElement("autostep_button");
        enableElement("finish_button");

        turingMachine = new TuringMachine(parser.deltaFunction, controlUnit.tapeInput, controlUnit.tapeCount);

        console.log("switching to simulation mode");

        let fieldset = document.getElementById("tape_fieldset");

        fieldset.innerHTML = `<legend>${i18n("tapes")}</legend>`

        for (let i = 0; i < controlUnit.tapeCount; i++) {
            fieldset.innerHTML += `<div id='tape${i}'></div>`;
            if (i < controlUnit.tapeCount - 1) {
                fieldset.innerHTML += '<hr>';
            }
        }

        console.log(`========= parser finished =========`);

        turingMachine.boot();

        console.log(`====== Turing machine ======`);
        console.log(turingMachine);
        console.log(`====== The machine is humming quietly... ======`);
    } catch (e) {
        edit();
        console.warn(e)
        errorMessage(e['message']);
        if (e.hasOwnProperty("elementId")) {
            console.log(e["elementId"]);
            let element = document.getElementById(e["elementId"]);
            element.setAttribute('class', element.getAttribute("class") + " errorColor");
        }
    }
}

function reset() {
    edit();
    simulation();
}

function finish() {
    let runForever = !document.getElementById('finish_safely').checked;

    let abomination = console.log;
    console.log = (string) => false;

    let t1 = performance.now();
    let t2 = performance.now();
    let result = null;

    for (let i = 2; i < 10000 || runForever; i++) {
        t2 = performance.now();
        result = turingMachine.next(false);
        if (result != null) {
            break;
        }
    }

    for (let i = 0; i < 2; i++) {
        if (result != null) {
            break;
        }
        result = turingMachine.next();
    }

    console.log = abomination;
    console.log("computation took", t2 - t1, "ms");
    console.log("time per step:", (t2 - t1) / turingMachine.stepCounter, "ms");
}

function quickSave() {
    let data = stringify();
    localStorage.setItem('controlUnit', data);

    infoMessage(i18n("machineSaved"));
}

function quickLoad() {
    if (!localStorage.getItem('controlUnit')) {
        errorMessage(i18n("noMachineInStorage"));
        return;
    }
    destringify(localStorage.getItem('controlUnit'));

    infoMessage(i18n("machineLoaded"));
}

function linkSave() {
    let data = stringify();
    let hash = encodeURIComponent(btoa(data));
    window.location.hash = hash;
    console.log(hash);

    infoMessage(i18n("linkCreated"));
}

function linkLoad() {
    let hash = window.location.hash.substr(1);

    if (hash == "" || hash == "#") {
        return;
    }

    let data = atob(decodeURIComponent(hash));
    destringify(data);
    console.log(hash);

    infoMessage(i18n("linkLoaded"));
}

function fileSave() {
    let data = stringify();

    let file = new Blob([data]);
    let a = document.createElement("a");
    let url = URL.createObjectURL(file);

    a.href = url;
    a.download = `turingMachine-${Date.now()}.json`;

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);

    infoMessage(i18n("machineSaved"));
}

function fileLoad(e) {
    let file = e.target.files[0];

    if (!file) {
        errorMessage("Chyba při načítání souboru.")
        return;
    }

    let reader = new FileReader();

    reader.onload = e => {
        let data = e.target.result;
        destringify(data);
    };
    reader.readAsText(file);

    infoMessage(i18n("machineLoaded"));
}

function loadPreset(machine) {
    let data = atob(decodeURIComponent(machines[machine]));
    destringify(data);
    console.log(machines[machine]);
    infoMessage(i18n("machineLoaded"));
}

function clearTable() {
    globalCounter = 0;
    controlUnit = null;
    parser = null;
    turingMachine = null;
    document.getElementById("transition_table").innerHTML = "";
    controlUnit = new ControlUnit();
    edit();
    window.location.hash = "";
    document.getElementById('machine_selector').value = "";

    infoMessage(i18n("tableCleared"));
}