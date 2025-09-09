export default class Model {
  constructor(obj) {
    this.id = obj.id;

    this.#init();
    this.#render();
  }

  #init() {
    // create elements

    this.$buttonsDiv = document.createElement('div');
    this.#createButtons();
  }

  // ---------- public API ----------
  matchId(id) {
    return this.id === id;
  }

  // ---------- private API ----------
  #render() {
    // set textContent of elements
  }

  // ---------- helpers ----------
  #createButtons() {
    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit');
    editButton.dataset.contactId = this.id;
    editButton.type = 'button';

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.dataset.contactId = this.id;
    deleteButton.type = 'button';

    this.$buttonsDiv.append(editButton, deleteButton);
  }
}
