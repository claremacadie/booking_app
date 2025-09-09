export default class ViewForm {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  #init() {
    this.$form = document.createElement('form');
    this.$submitButton = document.createElement('button');
    this.$updateButton = document.createElement('button');
    this.$cancelButton = document.createElement('button');

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- public API ----------
  

  // ---------- private API ----------
  #createHTML() {
    // call helpers to create HTML to put in $form

    this.$form.append(
      // anything created
      this.$submitButton,
      this.$updateButton,
      this.$cancelButton
    );
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$updateButton.textContent = 'Update Contact';
    this.$updateButton.type = 'button';
    this.$updateButton.classList.add('hidden');

    this.$cancelButton.textContent = 'Cancel';
    this.$cancelButton.type = 'button';

    this.$form.action = this.app.url;
    this.$form.method = 'POST';
  }

  // ---------- helpers ----------
  // create HTML to put in $form
}
