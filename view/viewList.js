export default class ViewList {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  #init() {
    this.$ul = document.createElement('ul');
    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- public API ----------

  // ---------- private API ----------
  #createHTML() {
    this.app.allSchedules.forEach(schedule => {
      this.$ul.append(schedule.$li);
    });
  }

  #configureHTML() {
    this.$ul.classList.add('schedule-list')
  }

  // ---------- helpers ----------
   
}
