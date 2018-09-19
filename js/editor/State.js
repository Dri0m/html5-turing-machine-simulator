class State {
    constructor(name, entryCount) {
        this.id = `state${gid()}`;
        this.idName = this.id + 'name';
        this.name = name;
        this.entries = [];

        this.entryElements = [];

        for (let i = 0; i < entryCount; i++) {
            this.entries.push('');
        }
    }

    destringify(data) {
        this.id = data.id;
        this.idName = data.idName;
        this.name = data.name;
        this.entries = data.entries;
    }

    addEntry(entry = '') {
        this.entries.push(entry);
    }

    updateElements() {
        let oldies = this.entryElements;
        this.entryElements = [];
        let children = document.getElementById(this.id).children;

        for (let i = 0; i < this.entries.length; i++) {
            if (i < oldies.length) {
                children.item(i + 1).firstChild.setAttribute('class', oldies[i].getAttribute('class'));
            }
            this.entryElements.push(children.item(i + 1).firstChild);

        }
    }

    deleteEntry(index) {
        this.entries.splice(index, 1);
    }

    reducedForm() {
        // return only stuff relevant for saving
        return {
            id: this.id,
            idName: this.idName,
            name: this.name,
            entries: this.entries
        }
    }
}