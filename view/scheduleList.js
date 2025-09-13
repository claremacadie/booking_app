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

  // ---------- private API ----------
  #createHTML() {
    this.app.schedules.forEach(schedule => {
      this.$ul.append(schedule.$li);
    });
  }

  #configureHTML() {
    this.$ul.classList.add('schedule-list');
    this.app.$schedulesDiv.append(this.$ul);
  }   
}
