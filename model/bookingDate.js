export default class BookingDate {
  constructor(date) {
    this.date = date;

    this.#init();
  }

  #init() {
    this.$li = document.createElement('li');
    this.#configureHTML();
  }

  // ---------- private API ----------
  #configureHTML() {
    this.$li.textContent = this.date;
    this.$li.classList.add('booking-date');
  }
}
