export default class ViewList {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  #init() {
    this.$ul = document.createElement('ul');
    this.#createHTML();
  }

  // ---------- public API ----------

  // ---------- private API ----------
  #createHTML() {
    this.app.allSchedules.forEach(schedule => {
      this.$ul.append(schedule.$li);
    });
  }

  // ---------- helpers ----------
   
}
