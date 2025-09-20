export default class ScheduleList {
  constructor(appController) {
    this.appController = appController;
    this.app = appController.app;
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
  }   
}
