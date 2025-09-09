export default class ViewList {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  #init() {
    this.searchCriteria = {'full_name': '', 'tags': []};

    this.$buttonDiv = document.createElement('div');
    this.$addButton = document.createElement('button');
    // create HTML for a list and any elements you want to be able to manipulate later

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- public API ----------
  resetSearch() {
    this.$searchInput.value = '';
    this.searchCriteria = {'full_name': '', 'tags': []};
  }

  // ---------- private API ----------
  #createHTML() {
    // create HTML for list
  }

  #configureHTML() {
    // set textContent of elements
  }

  // ---------- helpers ----------
    // to create or configure HTML
}
