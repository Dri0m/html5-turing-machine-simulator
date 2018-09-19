class Parser {
    constructor() {
        controlUnit.updateInnerRepresentation();
        controlUnit.regenerateTable(true);

        this.controlUnitSymbolSet = new Set();
        this.controlUnitHeaderSymbolSet = new Set();

        this.stateNames = this.getStateNames();
        this.inputSymbolSet = this.getInputSymbols();
        this.deltaFunction = this.parseControlUnit();

        this.log();
        this.checkConstraints();
        this.printFormalDefinition();
    }

    printFormalDefinition() {
        let tapeSymbolSet = new Set(this.controlUnitSymbolSet);
        tapeSymbolSet.add(LEFT);
        tapeSymbolSet.add(RIGHT);
        let formalString = `M = (Q, Σ, Γ, ${LEFT}, ${RIGHT}, δ, qinit, qacc, qrej), ${i18n("where")}:<br>
                            Q = {${[...this.stateNames].join(', ')}},
                            Σ = {${[...this.inputSymbolSet].join(', ')}}, 
                            Γ = {${[...tapeSymbolSet].join(', ')}}`
        infoMessage(formalString);
    }

    log() {
        console.log(`====== control unit symbols ======`);
        console.log(this.controlUnitSymbolSet);

        console.log(`====== control unit header symbols ======`);
        console.log(this.controlUnitHeaderSymbolSet);

        console.log('====== state names ======');
        console.log(this.stateNames);

        console.log(this.deltaFunction);
    }

    checkConstraints() {
        if (/\s/.test(controlUnit.tapeInput.trim())) {
            throw {
                "message": i18n("whitespaceNotAllowed"),
                "elementId": "tape_input"
            };
        }

        let allowedSymbols = new Set(this.controlUnitHeaderSymbolSet);
        allowedSymbols.delete(LEFT);
        allowedSymbols.delete(RIGHT);

        let subset = true;

        for (let elem of this.inputSymbolSet) {
            if (allowedSymbols.has(elem) == false) {
                subset = false;
            }
        }

        if (!subset) {
            throw {
                "message": i18n("unknownSymbolsOnInput"),
                "elementId": "tape_input"
            };
        }
    }

    parseControlUnit() {
        let deltaFunction = new DeltaFunction()

        let state = controlUnit.states[0];
        let columnHeaders = []

        for (let k = 0; k < state.entries.length; k++) {
            let columnHeader = [];

            for (let i = 0; i < controlUnit.tapeCount; i++) {
                let symbol = controlUnit.columns[k][i].trim();

                if (symbol == "") {
                    throw {
                        "message": i18n("unfilledtableHeaderField"),
                        "elementId": `symbol${k}-${i}`
                    };
                }

                columnHeader.push(symbol);
                this.controlUnitHeaderSymbolSet.add(symbol);
            }

            for (let i = 0; i < columnHeaders.length; i++) {
                for (let j = 0; j < columnHeader.length; j++) {
                    let same = 0;
                    if (columnHeaders[i][j] == columnHeader[j]) {
                        same++;
                    }
                    if (same == columnHeader.length) {
                        throw {
                            "message": i18n("duplicatedColumn"),
                            "elementId": `symbol${k}-0`
                        };
                    }
                }
            }

            columnHeaders.push([...columnHeader]);
        }

        console.log(this.controlUnitHeaderSymbolSet);

        let allEmpty = true

        for (let j = 0; j < controlUnit.states.length; j++) {
            let state = controlUnit.states[j];

            for (let k = 0; k < state.entries.length; k++) {
                let entry = state.entries[k];
                let parsedEntry;

                try {
                    parsedEntry = this.parseEntry(entry);
                    if (parsedEntry != null) {
                        allEmpty = false;

                        if (k == 0) {
                            for (let x = 0; x < parsedEntry.length; x++) {
                                if (parsedEntry[x][1] != LEFT) {
                                    throw i18n("cannotOverwriteFirstSymbol");
                                }
                                if (parsedEntry[x][2] == "L") {
                                    throw i18n("cannotMoveOutsideTheTape");
                                }
                            }
                        }
                    }
                } catch (e) {
                    //state.entryElements[k].setAttribute('class', state.entryElements[k].getAttribute("class") + " errorColor");
                    throw {
                        "message": e,
                        "elementId": state.entryElements[k].getAttribute('id')
                    };
                }

                let currentSymbols = "";

                for (let i = 0; i < controlUnit.tapeCount; i++) {
                    currentSymbols += controlUnit.columns[k][i].trim();
                }

                deltaFunction.addEntry(state.name.trim(), currentSymbols, parsedEntry, state.entryElements[k], document.getElementById(state.idName));
            }
        }

        if (allEmpty) {
            throw {
                "message": i18n("tableIsEmpty"),
                "elementId": controlUnit.states[0].idName
            };
        }

        return deltaFunction;
    }

    getStateNames() {
        let names = new Set()

        let states = controlUnit.states;

        for (let j = 0; j < states.length; j++) {
            let name = states[j].name.trim()
            if (names.has(name)) {
                throw {
                    "message": i18n("duplicatedState"),
                    "elementId": states[j].idName
                };
            }
            if (name == "") {
                throw {
                    "message": i18n("missingStateName"),
                    "elementId": states[j].idName
                };
            }
            names.add(states[j].name);
        }

        return names;
    }

    getInputSymbols() {
        let symbolSet = new Set(controlUnit.tapeInput);

        return symbolSet;
    }

    parseEntry(entryString) {
        // parses one table input field

        if (entryString == '' || entryString == '-') {
            return null;
        }

        let tapeCount = controlUnit.tapeCount;

        let parsed = [];

        // regex split all transitions
        let match_transitions = /(\([^\(\)]*\))/g;
        let transitions = [];
        let match = match_transitions.exec(entryString);

        while (match != null) {
            transitions.push(match[0]);
            match = match_transitions.exec(entryString);
        }

        if (transitions.length == 0) {
            throw i18n("incorrectTransitionFormat");
        }

        for (let transition of transitions) {
            transition = transition.replace('(', '').replace(')', '');
            let parsedTransition = transition.split(',');

            if (parsedTransition.length != 1 + 2 * tapeCount) {
                throw i18n("incorrectTransitionFormat");
            }

            parsedTransition = parsedTransition.map(s => s.trim());

            if (parsedTransition[0] != "qacc" && parsedTransition[0] != "qrej") { // ignore other fields if the next state in qacc/qrej
                for (let i = 0; i < tapeCount; i++) {
                    let tapeDirection = parsedTransition[1 + tapeCount + i]

                    if (tapeDirection != 'L' && tapeDirection != 'R' && tapeDirection != 'S') {
                        throw i18n("incorrectTapeDirection");
                    }
                }

                if (!this.stateNames.has(parsedTransition[0])) {
                    throw `${i18n("stateNotFound")} '${parsedTransition[0]}'.`;
                }

                for (let i = 0; i < tapeCount; i++) {
                    let symbol = parsedTransition[1 + i];

                    this.controlUnitSymbolSet.add(symbol);

                    if (!this.controlUnitHeaderSymbolSet.has(symbol)) {
                        throw `${i18n("unknownSymbol")} '${symbol}'.`;
                    }
                }
            }

            parsed.push(parsedTransition);
        }

        return parsed;
    }
}