class DeltaFunction {
    constructor() {
        this.deltas = {};
        this.elements = {};
        this.stateElements = {};
    }

    addEntry(currentState, currentSymbolsString, transition, entryElement, stateElement) {
        let key = `${currentState},${currentSymbolsString}`;
        this.deltas[key] = transition;
        this.elements[key] = entryElement;
        this.stateElements[key] = stateElement;
    }

    getEntryDelta(currentState, currentSymbolsString) {
        let key = `${currentState},${currentSymbolsString}`;
        return this.deltas[key];
    }

    getEntryElement(currentState, currentSymbolsString) {
        let key = `${currentState},${currentSymbolsString}`;
        return this.elements[key];
    }

    getStateElement(currentState, currentSymbolsString) {
        let key = `${currentState},${currentSymbolsString}`;
        return this.stateElements[key];
    }
}