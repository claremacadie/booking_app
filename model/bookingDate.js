export default class BookingDate {
  constructor(date) {
    this.date = date;

    this.#init();
  }

  #init() {
    this.$li = document.createElement('li');
    this.#createHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    this.$li.textContent = this.date;
  }
}
