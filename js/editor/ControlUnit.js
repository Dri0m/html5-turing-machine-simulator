class ControlUnit {
    constructor() {
        this.states = [];
        this.id = `control_unit`;
        this.tapeCount = 1;
        this.tapeInput = "";

        this.columns = []

        this.leftDiv = document.getElementById("left");
        this.table = document.getElementById("transition_table");

        let temp = this.updateInnerRepresentation;

        // temporarily disable representation update
        this.updateInnerRepresentation = () => false;
        this.addRow('qinit');
        this.addRow('qacc');
        this.addRow('qrej');
        this.addColumn(LEFT)
        this.addColumn(RIGHT)
        this.updateInnerRepresentation = temp;

        this.regenerateTable();
    }

    stringify() {
        this.updateInnerRepresentation();

        let reducedStates = [];
        for (let state of this.states) {
            reducedStates.push(state.reducedForm());
        }

        let data = {
            states: reducedStates,
            tapeCount: this.tapeCount,
            tapeInput: this.tapeInput,
            columns: this.columns
        }
        return JSON.stringify(data);
    }

    destringify(string) {
        let data = JSON.parse(string);
        this.updateInnerRepresentation();

        this.states = [];

        for (let state of data.states) {
            let newState = new State(null, 0);
            newState.destringify(state);
            this.states.push(newState);
        }

        this.tapeCount = data.tapeCount;
        this.tapeInput = data.tapeInput;
        this.columns = data.columns;

        this.regenerateTable();
        edit();
    }

    updateTapeCount() {
        this.updateInnerRepresentation();

        let tapeCountElement = document.getElementById("tapeCount");
        let tapeCount = parseInt(tapeCountElement.value);

        if (isNaN(tapeCount) || tapeCount < 1) {
            errorMessage(`${i18n("incorrectTapeCount")} '${tapeCountElement.value}'.`);
            return;
        }

        if (this.tapeCount == tapeCount) {
            return;
        }

        this.tapeCount = tapeCount;
        this.regenerateTable();

        infoMessage(i18n("updatedTapeCount"));
    }

    addRow(name = '') {
        this.updateInnerRepresentation();

        let state = new State(name, this.columns.length);
        this.states.push(state);


        this.regenerateTable();

        let stateElement = document.getElementById(state.idName);

        if (name == '') {
            stateElement.focus();
        }
    }

    deleteRow(id) {
        this.updateInnerRepresentation();

        let found = this.states.find((state) => {
            return state.id == id;
        });
        let index = this.states.indexOf(found);
        this.states.splice(index, 1);

        this.regenerateTable();
    }

    addColumn(name = '') {
        this.updateInnerRepresentation();

        this.columns.push(name);

        for (let i = 0; i < this.states.length; i++) {
            this.states[i].addEntry();
        }

        this.regenerateTable();

        // get the new first symbol input field and focus it
        this.table.firstChild.lastChild.firstChild.nextSibling.focus()
    }

    deleteColumn(number) {
        this.updateInnerRepresentation();

        this.columns.splice(number - 1, 1);

        for (let i = 0; i < this.states.length; i++) {
            this.states[i].deleteEntry(number - 1);
        }

        this.regenerateTable();
    }

    regenerateHeader(table, readOnly) {
        let row = document.createElement("tr")
        table.appendChild(row)

        let empty = document.createElement("th")
        row.appendChild(empty)

        for (let c = 0; c < this.columns.length; c++) {
            let th = document.createElement("th")
            th.setAttribute('class', `${c}`);

            if (!readOnly) {
                let removeButton = document.createElement("button");
                removeButton.innerHTML = "✖";
                removeButton.setAttribute('class', "headerControls controlColors");
                removeButton.setAttribute('onclick', `deleteColumn('${c+1}')`);

                if (c < 2) {
                    removeButton.setAttribute('disabled', '');
                }

                th.appendChild(removeButton);
            }

            for (let i = 0; i < this.tapeCount; i++) {
                let symbolField = document.createElement("input");
                let symbol = this.columns[c][i];

                if (symbol === undefined) {
                    if (c == 0) {
                        symbol = LEFT;
                    } else if (c == 1) {
                        symbol = RIGHT;
                    } else {
                        symbol = "";
                    }
                }

                symbolField.value = symbol;
                symbolField.setAttribute('class', "singleSymbol");
                symbolField.setAttribute('id', `symbol${c}-${i}`);
                symbolField.setAttribute('maxlength', "1");

                if (readOnly) {
                    symbolField.setAttribute('disabled', true);
                }

                if (c < 2) {
                    symbolField.setAttribute('disabled', '');
                }

                th.appendChild(symbolField);
            }

            row.appendChild(th);
        }
    }

    isStaticRow(state) {
        return state.name == "qinit" || state.name == "qacc" || state.name == "qrej";
    }

    regenerateRow(table, state, readOnly) {
        let row = document.createElement("tr");
        row.id = state.id;
        table.appendChild(row);

        // row name
        let name = document.createElement("th");
        let div = document.createElement("div");
        div.setAttribute('class', 'nowrap');

        name.appendChild(div);

        if (!readOnly) {
            let removeButton = document.createElement("button");
            removeButton.innerHTML = "✖";
            removeButton.setAttribute('class', "tableControls controlColors");
            removeButton.setAttribute('onclick', `deleteRow('${row.id}')`);

            if (this.isStaticRow(state)) {
                removeButton.setAttribute('disabled', true);
            }

            div.appendChild(removeButton);
        }

        let nameField = document.createElement("input");
        nameField.id = state.idName;
        nameField.value = state.name;
        nameField.setAttribute('class', "stateName");

        if (this.isStaticRow(state)) {
            nameField.setAttribute('disabled', " ");
        }

        if (readOnly) {
            nameField.setAttribute('disabled', true);
        }

        div.appendChild(nameField);

        row.appendChild(name);

        // row entries
        for (let c = 0; c < this.columns.length; c++) {
            let cell = document.createElement("td");
            let cellField = document.createElement("input");

            cellField.value = state.entries[c];
            cellField.placeholder = "-";
            cellField.setAttribute('class', `${c}inputRow controlUnitInput`);
            cellField.setAttribute('id', `cellField${state.idName}-${c}`);

            if (readOnly) {
                cellField.setAttribute('disabled', true);
            }

            cell.appendChild(cellField);
            row.appendChild(cell);
        }
    }

    regenerateTable(readOnly = false) {
        console.log("regenerating table");

        let newTable = document.createElement("table");
        newTable.id = "transition_table";

        this.regenerateHeader(newTable, readOnly);

        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].name == "qinit") {
                this.regenerateRow(newTable, this.states[i], readOnly);
            }
        }

        for (let i = 0; i < this.states.length; i++) {
            if (!this.isStaticRow(this.states[i])) {
                this.regenerateRow(newTable, this.states[i], readOnly);
            }
        }

        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].name == "qacc") {
                this.regenerateRow(newTable, this.states[i], readOnly);
            }
        }

        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].name == "qrej") {
                this.regenerateRow(newTable, this.states[i], readOnly);
            }
        }

        this.table.parentNode.replaceChild(newTable, this.table);
        this.table = newTable;

        formatStateTable();

        for (let i = 0; i < this.states.length; i++) {
            this.states[i].updateElements();
        }

        console.log("table regenerated");
    }

    updateInnerRepresentation() {
        // save contents of table's input fields
        console.log("saving table")

        this.tapeInput = document.getElementById("tape_input").value.trim();
        console.log(this.tapeInput);

        let rows = this.table.childNodes;

        if (rows.length == 1) {
            console.log("table empty. not saved");
            return false;
        }

        // abandon all hope ye who enter here
        for (let r = 0; r < rows.length; r++) {
            let cols = rows[r].childNodes;

            if (r == 0) { // update header/symbols

                for (let c = 1; c < cols.length; c++) {

                    let columnSymbols = [];

                    for (let symbolElement = cols[c].firstChild.nextSibling; symbolElement != null; symbolElement = symbolElement.nextSibling) {
                        columnSymbols.push(symbolElement.value.trim());
                    }

                    this.columns[c - 1] = columnSymbols;
                }

            } else {
                // rows shuffle around because of fixed qinit/qacc/qrej positions in the table, so this shuffles around the names correctly
                let index = this.states.indexOf(this.states.find((state) => {
                    return state.id == rows[r].getAttribute('id');
                }));
                this.states[index].name = cols[0].firstChild.lastChild.value.trim(); // update state names

                for (let c = 1; c < cols.length; c++) { // update state entires
                    this.states[index].entries[c - 1] = cols[c].firstChild.value.trim();
                }
            }
        }

        console.log("table saved");
    }
}