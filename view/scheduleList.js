export default class ScheduleList {
  constructor(schedules) {
    this.schedules = schedules;
    this.#init();
  }

  #init() {
    this.$ul = document.createElement('ul');
    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    this.schedules.forEach(schedule => {
      this.$ul.append(schedule.$li);
    });
  }

  #configureHTML() {
    this.$ul.classList.add('schedule-list');
  }   
}
