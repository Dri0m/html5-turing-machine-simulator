function addRow() {
    console.log(`adding row`);
    controlUnit.addRow();
    console.log(`row added`);
}

function addColumn() {
    console.log(`adding column`);
    controlUnit.addColumn();
    console.log(`column added`);
}

function deleteRow(number) {
    console.log(`deleting row ${number}`);
    controlUnit.deleteRow(number);
    console.log(`row ${number} deleted`);
}

function deleteColumn(number) {
    console.log(`deleting column ${number}`);
    controlUnit.deleteColumn(number);
    console.log(`column ${number} deleted`);
}

function updateTapeCount() {
    controlUnit.updateTapeCount();
}