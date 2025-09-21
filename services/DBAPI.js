import TimeoutError from '../utils/timeoutError.js';

export default class DBAPI {
  constructor(url) {
    this.url = url;
  }

  // ---------- private API ----------
  async #requestWithTimeout(delay, path, requestInitObj = {}) {
    return await Promise.race([
      fetch(path, requestInitObj),
      this.#timeoutPromise(delay),
    ]);
  }
  
  #timeoutPromise(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new TimeoutError()), ms);
    });
  }

  // ---------- public API ----------
  fetchSchedules() {
    return this.#requestWithTimeout(3000, `${this.url}/schedules`);
  }

  fetchBookingsDates() {
    return this.#requestWithTimeout(3000, `${this.url}/bookings`);
  }

  fetchBookingsForDate(date) {
    return this.#requestWithTimeout(3000, `${this.url}/bookings/${date}`);
  }
  
  fetchStaff() {
    return this.#requestWithTimeout(3000, `${this.url}/staff_members`);
  }

  async sendData(form, data) {
    return await fetch(form.action, {
      method: form.method,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
  }

  async cancelBooking(form, booking_id) {
    return await fetch(form.action + `/${booking_id}`, {
      method: form.getAttribute('method'),
    });
  }

  async deleteSchedule(form, schedule_id) {
    return await fetch(form.action + `/${schedule_id}`, {
      method: form.getAttribute('method'),
    });
  }
}
