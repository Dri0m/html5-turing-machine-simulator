function formatStateTable() {
    let inputs = document.querySelectorAll('input.controlUnitInput');
    let divs = document.querySelectorAll('input.stateName');

    for (let i = 0; i < inputs.length; ++i) {
        inputs[i].addEventListener('input', resizeInputs);
        resizeInputs.call(inputs[i]);
    }

    for (let i = 0; i < divs.length; ++i) {
        divs[i].addEventListener('input', resizeDivs);
        resizeDivs.call(divs[i]);
    }
}

function resizeInputs() {
    let inputs = document.querySelectorAll('input[class*="inputRow"]');

    let tapeCount = 0;

    if (controlUnit != null) {
        tapeCount = controlUnit.tapeCount;
    }

    let thisNumber = parseInt(this.getAttribute('class'));
    let max = 0;

    correctInputs = [];

    for (input of inputs) {
        if (parseInt(input.getAttribute('class')) == thisNumber) {
            correctInputs.push(input);
            let number = input.value.length;
            max = Math.max(max, number);
        }
    }

    let inputWidth = max < 3.3 + tapeCount * 2.7 ? 3.3 + tapeCount * 2.7 : max;

    for (input of correctInputs) {
        input.style.width = inputWidth + 1 + "ch";
    }
}

function resizeDivs() {
    let inputs = document.querySelectorAll('input.stateName');

    let max = 0;

    for (input of inputs) {
        let number = input.value.length;
        max = Math.max(max, number);
    }

    let inputWidth = max < 7 ? 7 : max;

    for (input of inputs) {
        let offset = 4;

        if (input.getAttribute('disabled') == "true") {
            offset = 0;
            input.style.width = "100%";
        } else {
            input.style.width = "calc(100% - 1.5em)";
        }

        input.parentElement.style.minWidth = inputWidth + offset + "ch";
        input.parentElement.style.width = inputWidth + offset + "ch";
    }
}