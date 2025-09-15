import TimeoutError from '../utils/timeoutError.js';

export default class DBAPI {
  constructor(url) {
    this.url = url;
  }

  // ---------- public API ----------
  async fetchSchedules() {
    return this.#requestWithTimeout(3000, `${this.url}/schedules`);
  }

  async createNewStaff(form, data) {
    return await fetch(form.action, {
      method: form.method,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
  }

  async fetchStaff() {
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
}
