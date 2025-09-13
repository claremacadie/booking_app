import HttpError from '../utils/httpError.js';
import TimeoutError from '../utils/timeoutError.js';

export default class DBAPI {
  constructor(url) {
    this.url = url;
  }

  // ---------- public API ----------
  fetchAllSchedules() {
    return this.#requestWithTimeout(3000, '/schedules');
  }

  createNewStaff(form, data) {
    console.log(form.method, form.action);
    return this.#requestWithTimeout(5000, form.action, {
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
      setTimeout(() => reject(new TimeoutError('It is taking longer than usual, please try again later.')), ms);
    });
  }

  // ---------- private API ----------
  async #requestWithTimeout(delay, path, requestInitObj = {}, expectJson = true) {
    const res = await Promise.race([
      fetch(path, requestInitObj),
      this.timeoutPromise(delay),
    ]);

    if (!res.ok) {
      let text = '';
      try { text = await res.text(); } catch {}
      throw new HttpError(res.status, res.statusText, text);
    }

    if (!expectJson) return true;

    if (res.status === 204) return null;
    try { return await res.json(); } catch { return null; }
  }
}
