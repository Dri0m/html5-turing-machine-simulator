const czechLang = {
    // static HTML
    turingMachineSimulator: `Simulátor Turingova stroje`,
    controls: `Ovládání`,
    help: `Nápověda`,
    editMode: `Režim editace`,
    simulationMode: `Režim simulace`,
    quickSave: `Rychlé uložení`,
    quickLoad: `Rychlé načtení`,
    createLink: `Vytvořit odkaz`,
    loadLink: `Načíst odkaz`,
    saveToFile: `Uložit do souboru`,
    loadFromFile: `Načíst ze souboru`,
    clearTable: `Vyčistit tabulku`,

    premadeMachines: `Výběr z vestavěných strojů`,
    machineNotPrime: `{ a^p | p není prvočíslo }`,
    machineAnBn: `{ a^nb^n | n ∈ ℕ0 }`,
    machineTwice: `{ ww | w = {a, b}* }`,
    machineMultiplication: `{ a^ib^jc^k | k = i*j, i ∈ ℕ0, j ∈ ℕ0 }`,
    machineEqualab: `{ {a,b}* | #a(w) = #b(w) }`,
    machineCycle: `{} CYKLÍ pro každý vstup`,
    machineShuffle: `ND: Náhodný přepis řetězce a* na řetězec {X, Y, Z}* o stejné délce`,
    machineanban: `2 pásky: { a^nba^n | n ∈ ℕ0 }`,

    doStep: `Přejdi`,
    autoStep: `Krokuj`,
    autoStop: `Zastav`,
    finish: `Dokonči`,
    safetyLimit: `Bezpečnostní limit`,
    reset: `Reset`,
    stepSelection: `Výběr kroku`,
    transitionTable: `Tabulka přechodů δ`,
    addState: `Přidat stav`,
    addColumn: `Přidat sloupec`,
    font: `Font`,
    close: `Zavřít`,
    doNotShowAgain: `Znovu nezobrazovat`,

    // static HTML - help section
    webTuringMachineSimulator: `Webový simulátor Turingova stroje`,
    helpSection: `:)`,

    // dynamic strings
    incorrectTapeCount: `Nesprávný počet pásek`,
    updatedTapeCount: `Změna počtu pásek úspěšně provedena.`,
    tapes: `Pásky`,
    tapeInput: `Vstup na pásce`,
    tapeCount: `Počet pásek`,
    switchedEditMode: `Přepnuto do režimu editace.`,
    machineSaved: `Stroj uložen.`,
    noMachineInStorage: `Úložiště neobsahuje žádný stroj.`,
    machineLoaded: `Stroj načten.`,
    linkCreated: `Odkaz vytvořen.`,
    linkLoaded: `Odkaz načten.`,
    tableCleared: `Tabluka vyčištěna.`,
    where: `kde`,
    whitespaceNotAllowed: `Vstup nesmí obsahovat bílé znaky.`,
    unknownSymbolsOnInput: `Vstup obsahuje symboly, které stroj nezná.`,
    unfilledtableHeaderField: `Nevyplněné políčko v záhlaví tabulky.`,
    duplicatedColumn: `Duplicitní sloupec.`,
    cannotOverwriteFirstSymbol: `První symbol nesmí být přepsán.`,
    cannotMoveOutsideTheTape: `Nelze se posunout mimo pásku.`,
    tableIsEmpty: `Tabulka je prázdná.`,
    duplicatedState: `Duplicitní stav.`,
    missingStateName: `Chybějící název stavu.`,
    incorrectTransitionFormat: `Nesprávný zápis přechodu.`,
    incorrectTapeDirection: `Nesprávný směr posunu pásky.`,
    stateNotFound: `Neznámý stav`,
    unknownSymbol: `Neznámý symbol`,
    unknownErrorOccured: `Nastala neznámá chyba.`,

    perStepSingular: `kroku`,
    perStepPlural: `krocích`,

    machineAccepterAfter: `Stroj akceptoval po`,
    machineDeniedAfter: `Stroj zamítnul po`,
    firstSymbolCannotBeOverwritten: `První symbol nesmí být přepsán.`,

    attemptToOverwriteDetected: `Byl zaznamenán pokus přepsat počáteční symbol na pásce`,
    bySymbol: `symbolem`,

    attemptToMoveBeforeTapeDetected: `Byl zaznamenán pokus posunout se před počáteční symbol na pásce`,
    undefinedConfigError: `Chyba: stroj přešel do konfigurace`,
    undefinedInTable: `nedefinované v tabulce.`,

    language: "Změnit jazyk",
    saveWarning: "Uložte si váš rozdělaný stroj!",
    english: "Angličtina",
    czech: "Čeština",

    stepsSP: "krok(ů)",
    every: "po",

    safetyAlt: "Zastaví po 10000 krocích.",
}

const englishLang = {
    // static HTML
    turingMachineSimulator: `Turing Machine Simulator`,
    controls: `Controls`,
    help: `Help`,
    editMode: `Edit mode`,
    simulationMode: `Simulation mode`,
    quickSave: `Quick save`,
    quickLoad: `Quick load`,
    createLink: `Create URL`,
    loadLink: `Load URL`,
    saveToFile: `Export to file`,
    loadFromFile: `Import from file`,
    clearTable: `Clear the table`,

    premadeMachines: `Select a predefined TM`,
    machineNotPrime: `{ a^p | p is not a prime }`,
    machineAnBn: `{ a^nb^n | n ∈ ℕ0 }`,
    machineTwice: `{ ww | w = {a, b}* }`,
    machineMultiplication: `{ a^ib^jc^k | k = i*j, i ∈ ℕ0, j ∈ ℕ0 }`,
    machineEqualab: `{ {a,b}* | #a(w) = #b(w) }`,
    machineCycle: `{} LOOPS for any input`,
    machineShuffle: `ND: Randomly rewrites string a* to string {X, Y, Z}* of the same length`,
    machineanban: `2 tapes: { a^nba^n | n ∈ ℕ0 }`,

    doStep: `Step`,
    autoStep: `Auto step`,
    autoStop: `Stop`,
    finish: `Finish`,
    safetyLimit: `Safety limit`,
    reset: `Reset`,
    stepSelection: `Step selection`,
    transitionTable: `Transition table δ`,
    addState: `Add state`,
    addColumn: `Add column`,
    font: `Font`,
    close: `Close`,
    doNotShowAgain: `Do not show again`,

    // static HTML - help section
    webTuringMachineSimulator: `HTML5 Turing Machine Simulator`,
    helpSection: `:)`,

    // dynamic strings
    incorrectTapeCount: `Invalid tape count.`,
    updatedTapeCount: `Tape count successfully changed.`,
    tapes: `Tapes`,
    tapeInput: `Tape input`,
    tapeCount: `Tape count`,
    switchedEditMode: `Switched to edit mode.`,
    machineSaved: `TM saved.`,
    noMachineInStorage: `No machine in storage.`,
    machineLoaded: `TM loaded.`,
    linkCreated: `URL created.`,
    linkLoaded: `URL loaded.`,
    tableCleared: `Table cleared.`,
    where: `where`,
    whitespaceNotAllowed: `Input cannot contain whitespace symbols.`,
    unknownSymbolsOnInput: `Unknown symbols on input.`,
    unfilledtableHeaderField: `Unfilled table header field.`,
    duplicatedColumn: `Duplicated column.`,
    cannotOverwriteFirstSymbol: `Cannot overwrite the first symbol.`,
    cannotMoveOutsideTheTape: `Cannot move outside the tape.`,
    tableIsEmpty: `Table is empty.`,
    duplicatedState: `Duplicated state.`,
    missingStateName: `Mising state name.`,
    incorrectTransitionFormat: `Invalid trasition format.`,
    incorrectTapeDirection: `Invalid tape direction.`,
    stateNotFound: `State not found`,
    unknownSymbol: `Unknown symbol`,
    unknownErrorOccured: `Unknown error occured.`,

    perStepSingular: `step`,
    perStepPlural: `steps`,

    machineAccepterAfter: `TM accepted after`,
    machineDeniedAfter: `TM rejected after`,
    firstSymbolCannotBeOverwritten: `The first symbol cannot be overwritten`,

    attemptToOverwriteDetected: `An attempt to overwrite the first tape symbol`,
    bySymbol: `by symbol`,

    attemptToMoveBeforeTapeDetected: `An attempt to move before the first tape symbol detected on tape`,
    undefinedConfigError: `Error: TM has enter a configuration`,
    undefinedInTable: `not defined in the table.`,

    language: "Change language",
    saveWarning: "Save your machine before doing this!",
    english: "English",
    czech: "Czech",

    stepsSP: "step(s)",
    every: "by",

    safetyAlt: "Stops after 10000 steps.",
}

if (localStorage.getItem('lang') === null) {
    localStorage.setItem('lang', "en");
}

let currentLang = englishLang;

if (localStorage.getItem('lang') === "en") {
    currentLang = englishLang;
} else if (localStorage.getItem('lang') === "cz") {
    currentLang = czechLang;
}

function changeLang(name) {
    localStorage.setItem('lang', name);
    location.reload();
}

function i18n(key) {
    return currentLang[key];
}


function translate() {
    var markup = document.documentElement.innerHTML;
    matches = markup.match(/(\[\[.+?\]\])/g);
    for (i = 0; i < matches.length; i++) {
        var match = matches[i]
        var key = match.substring(2, match.length - 2);
        console.log(`replacing ${match} with ${currentLang[key]}`);
        markup = markup.replace(match, currentLang[key]);
    }
    document.documentElement.innerHTML = markup;
}