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

  updateData(data, id) {
    return this.#requestWithTimeout(5000, `${this.path}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
  }

  deleteData(id) {
    return this.#requestWithTimeout(5000, `${this.path}/${id}`, { method: 'DELETE' }, false);
  }
  
  timeoutPromise(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new TimeoutError()), ms);
    });
  }

  // ---------- private API ----------

  async #requestWithTimeout(delay, path, requestInitObj = {}) {
    return await Promise.race([
      fetch(path, requestInitObj),
      this.timeoutPromise(delay),
    ]);
  }
}
