function infoMessage(message) {
    messageBox.setAttribute('class', 'message info');
    messageBox.innerHTML = message;
}

function errorMessage(message) {
    messageBox.setAttribute('class', 'message error');
    messageBox.innerHTML = message;
}