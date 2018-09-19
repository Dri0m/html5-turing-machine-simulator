class TuringMachine {
    constructor(deltaFunction, inputTape, tapeCount) {
        this.deltaFunction = deltaFunction;
        this.inputTape = inputTape;
        this.tapeCount = tapeCount
        this.qinit = "qinit";
        this.qacc = "qacc";
        this.qrej = "qrej";
        this.stepCounter = 0;

        this.lastElement = null;
        this.lastStateElement = null;
        this.lastPostions = [];

        this.tapePositions = [];
        this.tapeLenghts = [];
        this.nextTransitions;

        this.qaccNameElement = document.getElementById("transition_table").lastChild.previousSibling.firstChild.firstChild.lastChild;
        this.qrejNameElement = document.getElementById("transition_table").lastChild.firstChild.firstChild.lastChild;
        this.stepSelectionDiv = document.getElementById("step_selection");
    }

    makeSymbolElement(symbol, tapeId, opacity = 1) {
        let element = document.createElement("input");
        element.type = 'text';
        element.placeholder = RIGHT;
        element.setAttribute('id', `tape${tapeId}symbol${this.tapeLenghts[tapeId]}`);
        element.setAttribute('class', "tapeSymbol");
        element.setAttribute('maxlength', "1");
        element.setAttribute('value', `${symbol}`);
        element.setAttribute('disabled', ' ');
        element.style.opacity = opacity;

        this.tapeLenghts[tapeId]++;
        return element;
    }

    appendTail(tapeId) {
        let div = document.getElementById(`tape${tapeId}`);
        div.appendChild(this.makeSymbolElement("_", tapeId, 3 / 5));
        div.appendChild(this.makeSymbolElement("_", tapeId, 2 / 5));
        div.appendChild(this.makeSymbolElement("_", tapeId, 1 / 5));
        div.appendChild(this.makeSymbolElement("_", tapeId, 1 / 10));
        this.tapeLenghts[tapeId] -= 4;
    }

    removeTail(tapeId) {
        let div = document.getElementById(`tape${tapeId}`);
        div.removeChild(this.getSymbolElement(tapeId, this.tapeLenghts[tapeId] + 3));
        div.removeChild(this.getSymbolElement(tapeId, this.tapeLenghts[tapeId] + 2));
        div.removeChild(this.getSymbolElement(tapeId, this.tapeLenghts[tapeId] + 1));
        div.removeChild(this.getSymbolElement(tapeId, this.tapeLenghts[tapeId]));
    }

    generateTapes() {
        for (let i = 0; i < this.tapeCount; i++) {
            let div = document.getElementById(`tape${i}`);

            this.tapePositions.push(0);
            this.tapeLenghts.push(0);
            this.lastPostions.push(0);

            div.appendChild(this.makeSymbolElement(LEFT, i));

            this.selectElement(div.firstChild);

            if (i == 0) {
                for (let char of this.inputTape) {
                    div.appendChild(this.makeSymbolElement(char, i));
                }
            }

            div.appendChild(this.makeSymbolElement(RIGHT, i));
            this.appendTail(i);
        }
    }

    addSymbol(tapeId) {
        let div = document.getElementById(`tape${tapeId}`);
        div.appendChild(this.makeSymbolElement(RIGHT, tapeId));
    }

    removeSymbol(tapeId) {
        let div = document.getElementById(`tape${tapeId}`);
        div.removeChild(this.getSymbolElement(tapeId, this.tapeLenghts[tapeId] - 1));
        this.tapeLenghts[tapeId]--;
    }

    pastElement(element) {
        element.setAttribute("class", element.getAttribute("class") + " pastColor");
    }

    selectElement(element) {
        element.setAttribute("class", element.getAttribute("class") + " selectedColor");
    }

    markElement(element) {
        element.setAttribute("class", element.getAttribute("class") + " errorColor");
    }

    getSymbolElement(tape, symbol) {
        return document.getElementById(`tape${tape}symbol${symbol}`);
    }

    prepareNextStep(paint = true) {
        console.log("currently processed delta:", this.nextTransitions);

        if (this.nextTransitions == null) {
            this.end(false);
            return false;
        }

        if (paint) {
            // update step selection buttons
            this.stepSelectionDiv.innerHTML = "";

            for (let i = 0; i < this.nextTransitions.length; i++) {
                let button = document.createElement('button');
                button.setAttribute('class', 'wide menu');
                button.setAttribute('onClick', `manualStep(${i});`);
                button.innerHTML = this.nextTransitions[i];
                this.stepSelectionDiv.appendChild(button);
            }
        }

        return true;
    }

    boot() {
        unpaintAll();
        this.tapes = this.generateTapes();
        this.nextTransitions = this.deltaFunction.getEntryDelta(this.qinit, LEFT.repeat(this.tapeCount));
        this.selectElement(this.deltaFunction.getEntryElement(this.qinit, LEFT.repeat(this.tapeCount)));
        this.selectElement(this.deltaFunction.getStateElement(this.qinit, LEFT.repeat(this.tapeCount)));
        this.lastElement = this.deltaFunction.getEntryElement(this.qinit, LEFT.repeat(this.tapeCount));
        this.lastStateElement = this.deltaFunction.getStateElement(this.qinit, LEFT.repeat(this.tapeCount));
        this.prepareNextStep();
    }

    end(accepted, message = i18n("unknownErrorOccured")) {
        unpaintAll();
        this.pastElement(this.lastElement);
        this.pastElement(this.lastStateElement);

        for (let tapeId = 0; tapeId < this.tapeCount; tapeId++) {
            this.pastElement(this.getSymbolElement(tapeId, this.tapePositions[tapeId]));
        }

        let stepWord = i18n("perStepPlural");
        if (this.stepCounter == 1) {
            stepWord = i18n("perStepSingular");
        }

        document.getElementById("step_button").setAttribute("disabled", " ");
        document.getElementById("autostep_button").setAttribute("disabled", " ");
        document.getElementById("finish_button").setAttribute("disabled", " ");
        this.stepSelectionDiv.innerHTML = "";

        if (accepted == true) {
            this.selectElement(this.qaccNameElement);
            alert(`${i18n("machineAccepterAfter")} ${this.stepCounter} ${stepWord}.`);
            return true;
        } else if (accepted == false) {
            this.markElement(this.qrejNameElement);
            alert(`${i18n("machineDeniedAfter")} ${this.stepCounter} ${stepWord}.`);
            return false;
        }

        alert(message);
        return false;
    }

    next(paint = true, transitionId = null) {

        if (paint) {
            unpaintAll();
        }

        console.log(`======== step ${this.stepCounter} ========`);

        // nondeterminism
        let chosenTransition;

        if (transitionId == null) {
            chosenTransition = Math.floor(Math.random() * this.nextTransitions.length);
            console.log(chosenTransition);
        } else {
            chosenTransition = transitionId;
        }

        let nextTransition = this.nextTransitions[chosenTransition];
        console.log("next transition: ", chosenTransition, nextTransition);

        let tapeCount = this.tapeCount;
        let nextState = nextTransition[0];
        let nextSymbols = nextTransition.slice(1, 1 + tapeCount);
        let nextMovements = nextTransition.slice(1 + tapeCount, nextTransition.length);

        console.log("next state: ", nextState);
        console.log("next symbols: ", nextSymbols);
        console.log("next movements: ", nextMovements);

        if (nextState == this.qacc) {
            return this.end(true);
        }

        if (nextState == this.qrej) {
            return this.end(false);
        }

        let nextKey = "";

        for (let tapeId = 0; tapeId < this.tapeCount; tapeId++) {
            let nextSymbol = nextSymbols[tapeId];
            let nextMovement = nextMovements[tapeId];
            let symbolElement = this.getSymbolElement(tapeId, this.tapePositions[tapeId]);

            // first symbol must be LEFT
            if (this.tapePositions[tapeId] == 0) {
                if (nextSymbol != LEFT) {
                    this.end(null, `${i18n("firstSymbolCannotBeOverwritten")} ${i18n("attemptToOverwriteDetected")} ${tapeId+1} ${i18n("bySymbol")} '${nextSymbol}'.`);
                    this.markElement(symbolElement);
                    return false;
                }
            }

            // move outside the tape
            if (nextMovement == 'L' && this.tapePositions[tapeId] == 0) {
                this.end(null, `${i18n("cannotMoveOutsideTheTape")} ${i18n("attemptToOverwriteDetected")} ${tapeId+1}.`);
                this.markElement(symbolElement);
                return false;
            }

            // rewrite tape
            symbolElement.value = nextSymbol;

            this.lastPostions[tapeId] = this.tapePositions[tapeId];

            // move tape
            if (nextMovement == 'R') {
                this.tapePositions[tapeId]++;
            } else if (nextMovement == 'L') {
                this.tapePositions[tapeId]--;
            }

            this.removeTail(tapeId);

            // generate more tape if needed
            if (this.getSymbolElement(tapeId, this.tapeLenghts[tapeId] - 1).value != RIGHT) {
                this.addSymbol(tapeId);
            } else if (this.tapePositions[tapeId] == this.tapeLenghts[tapeId]) {
                this.addSymbol(tapeId);
            }

            // remove tape if too long
            if (this.tapePositions[tapeId] < this.tapeLenghts[tapeId] - 2 && this.getSymbolElement(tapeId, this.tapeLenghts[tapeId] - 1).value == RIGHT && this.getSymbolElement(tapeId, this.tapeLenghts[tapeId] - 2).value == RIGHT) {
                this.removeSymbol(tapeId);
            }

            this.appendTail(tapeId);

            let lastSymbolElement = this.getSymbolElement(tapeId, this.lastPostions[tapeId]);
            symbolElement = this.getSymbolElement(tapeId, this.tapePositions[tapeId]);

            // mark the moved tape
            if (paint) {
                this.pastElement(lastSymbolElement);
                this.selectElement(symbolElement);
            }

            // grab the key
            nextKey += symbolElement.value;
        }

        this.nextTransitions = this.deltaFunction.getEntryDelta(nextState, nextKey);

        if (this.nextTransitions === undefined) {
            this.end(null, `${i18n("undefinedConfigError")} (${nextState}, ${nextKey}) ${i18n("undefinedInTable")}`);
            for (let tapeId = 0; tapeId < this.tapeCount; tapeId++) {
                this.markElement(this.getSymbolElement(tapeId, this.tapePositions[tapeId]));
            }

            return false;
        }

        let entryElement = this.deltaFunction.getEntryElement(nextState, nextKey);
        let stateElement = this.deltaFunction.getStateElement(nextState, nextKey);

        if (paint) {
            this.pastElement(this.lastElement);
            this.pastElement(this.lastStateElement);
            this.selectElement(stateElement);
            stateElement.scrollIntoView();
            this.selectElement(entryElement);
            entryElement.scrollIntoView();
        }

        this.lastElement = entryElement
        this.lastStateElement = stateElement

        let lastCheck = this.prepareNextStep(paint);

        if (!lastCheck) {
            return lastCheck;
        };

        this.stepCounter++;
        return null;
    }
}