export default class BookingDate {
  constructor(date) {
    this.date = date;
    this.bookings = [];

    this.#init();
  }

  #init() {
    this.$li = document.createElement('li');
    this.$ul = document.createElement('ul');
    this.#configureHTML();
  }

  // ---------- public API ----------
  addBookings(bookings) {
    this.bookings = bookings;
  }

  createBookingsHTML() {
    this.$ul.innerHTML = '';
    this.bookings.forEach(booking => {
      let li = document.createElement('li');
      li.textContent = booking.join(' | ');
      li.classList.add('booking');
      this.$ul.append(li);
    })
  }

  // ---------- private API ----------
  #configureHTML() {
    let anchor = document.createElement('a');
    anchor.textContent = this.date;
    anchor.classList.add('booking-date');
    this.$li.classList.add('booking-date');
    this.$li.append(anchor, this.$ul);
  }
}
