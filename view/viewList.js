export default class ViewList {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  #init() {
    // this.searchCriteria = {'full_name': '', 'tags': []};
    this.$ul = document.createElement('ul');
    this.#createHTML();
  }

  // ---------- public API ----------
  // resetSearch() {
  //   this.$searchInput.value = '';
  //   this.searchCriteria = {'full_name': '', 'tags': []};
  // }

  // ---------- private API ----------
  #createHTML() {
    this.app.allSchedules.forEach(schedule => {
      this.$ul.append(schedule.$li);
    });
  }

  // ---------- helpers ----------
    // to create or configure HTML
}
