export default class BookingForm {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  async #init() {
    this.$form = document.createElement('form');
    this.$submitButton = document.createElement('button');

    // await this.app.loadSchedules();
    // console.log(this.app.schedules);
    // this.#createHTML();
    // this.#configureHTML();
  }

  // ---------- private API ----------
  async #createHTML() {
    let dl = document.createElement('dl');
    this.#createDlListItem(dl, 'email', 'email');
    this.#createScheduleInput(dl);

    this.$form.append(dl, this.$submitButton);
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$form.action = this.app.url + '/bookings';
    this.$form.method = 'POST';

    this.$form.classList.add ('form');
    this.app.$bookingFormDiv.append(this.$form);
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

  async #createScheduleInput(dl) {
  }
}
