export default class StudentForm {
  constructor(appController, bookingSequence) {
    this.appController = appController;
    this.app = appController.app;
    this.bookingSequence = bookingSequence;
    this.#init();
  }

  #init() {
    this.$form = document.createElement('form');
    this.$submitButton = document.createElement('button');

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    let dl = document.createElement('dl');
    this.#createDlListItem(dl, 'email', 'email');
    this.#createDlListItem(dl, 'name', 'text');
    this.#createBookingInput(dl);

    this.$form.append(dl, this.$submitButton);
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$form.action = this.app.url + '/students';
    this.$form.method = 'POST';

    this.$form.classList.add ('form');
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

  #createBookingInput(dl) {
    let dt = document.createElement('dt');
    let label = document.createElement('label');
    label.setAttribute('for', 'booking-sequence');
    label.textContent = 'Booking Sequence:';
    dt.append(label);

    let dd = document.createElement('dd');
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'booking-sequence');
    input.setAttribute('name', 'booking-sequence');
    input.setAttribute('value', this.bookingSequence);
    dd.append(input);

    dl.append(dt, dd);
  }
}
