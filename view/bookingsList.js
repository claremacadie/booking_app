export default class BookingsList {
  constructor(bookingsDates) {
    this.bookingsDates = bookingsDates;
    this.#init();
  }

  #init() {
    this.$ul = document.createElement('ul');
    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    this.bookingsDates.forEach(bookingDate => {
      this.$ul.append(bookingDate.$li);
    });
  }

  #configureHTML() {
    this.$ul.classList.add('bookings-list');
  }   
}
