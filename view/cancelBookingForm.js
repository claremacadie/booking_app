export default class CancelBookingForm {
  constructor(appController) {
    this.appController = appController;
    this.app = appController.app;
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
    let label = document.createElement('label');
    label.textContent = 'Please provide booking id: ';
    label.setAttribute('for', 'booking_id');
    let input = document.createElement('input');
    input.setAttribute('id', 'booking_id');
    input.setAttribute('name', 'booking_id');
    input.setAttribute('type', 'text');

    this.$form.append(label, input, this.$submitButton);
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$form.action = this.app.url + '/bookings';
    this.$form.method = 'PUT';

    this.$form.classList.add ('form');
  }
}
