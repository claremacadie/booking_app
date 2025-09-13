export default class ScheduleList {
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
    this.app.schedules.forEach(schedule => {
      this.$ul.append(schedule.$li);
    });
  }

  #configureHTML() {
    this.$ul.classList.add('schedule-list');
    console.log(this.app);
    this.app.$schedulesDiv.append(this.$ul);
  }

  // ---------- helpers ----------
   
}
