import TimeoutError from '../utils/timeoutError.js';

export default class DBAPI {
  constructor(url) {
    this.url = url;
    this.timeout = null;
    this.reject = null;
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

  #debouncePromise(func, delay = 200) {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.reject) {
      this.reject(new Error('Aborted'));
      this.reject = null;
    }

    return new Promise((resolve, reject) => {
      this.reject = reject;
      this.timeout = setTimeout(async () => {
        try {
          resolve(await func());
        } catch (error) {
          reject(error);
        }
        this.timeout = null;
        this.reject = null;
      }, delay);
    });
  }

  // ---------- public API ----------
  fetchSchedules() {
    return this.#debouncePromise(() => this.#requestWithTimeout(3000, `${this.url}/schedules`));
  }

  fetchBookingsDates() {
    return this.#requestWithTimeout(3000, `${this.url}/bookings`);
  }

  fetchBookingsForDate(date) {
    return this.#requestWithTimeout(3000, `${this.url}/bookings/${date}`);
  }

  async createNewStaff(form, data) {
    return await fetch(form.action, {
      method: form.method,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
  }

  fetchStaff() {
    return this.#requestWithTimeout(3000, `${this.url}/staff_members`);
  }

  async addSchedules(form, data) {
    return await fetch(form.action, {
      method: form.method,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
  }

  async addBooking(form, data) {
    return await fetch(form.action, {
      method: form.method,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
  }

  async addStudent(form, data) {
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
