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
    let anchor = document.createElement('a');
    anchor.textContent = this.date;
    anchor.classList.add('booking-date');
    this.$li.append(anchor);
  }
}
