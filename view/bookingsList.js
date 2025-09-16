export default class BookingsList {
  constructor(appController) {
    this.appController = appController;
    this.app = appController.app;
    this.#init();
  }

  #init() {
    this.$ul = document.createElement('ul');
    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    this.app.bookingsDates.forEach(bookingDate => {
      this.$ul.append(bookingDate.$li);
    });
  }

  #configureHTML() {
    this.$ul.classList.add('bookings-list');
  }   
}
