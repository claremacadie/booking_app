export default class StaffForm {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  #init() {
    this.$form = document.createElement('form');
    this.$submitButton = document.createElement('button');

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- public API ----------
  

  // ---------- private API ----------
  #createHTML() {
    let dl = document.createElement('dl');
    this.#createDlListItem(dl, 'email', 'email');
    this.#createDlListItem(dl, 'name', 'text');

    this.$form.append(dl, this.$submitButton);
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$form.action = this.app.url + '/staff_members';
    this.$form.method = 'POST';

    this.$form.classList.add ('staff-form');
    this.app.$staffFormDiv.append(this.$form);
  }

  // ---------- helpers ----------
  #createDlListItem(dl, field, inputType) {
    let dt = document.createElement('dt');
    let label = document.createElement('label');
    label.setAttribute('for', field);
    label.textContent = field[0].toUpperCase() + field.slice(1);
    dt.append(label);

    let dd = document.createElement('dd');
    let input = document.createElement('input');
    input.setAttribute('type', inputType);
    input.setAttribute('id', field);
    input.setAttribute('name', field);
    dd.append(input);

    dl.append(dt, dd);
  }
}
