import ValidationError from '../utils/validationError.js';
import HttpError from '../utils/httpError.js';
import debounce from '../utils/debounce.js';

export default class AppController {
  constructor(app) {
    this.app = app;
    this.#init();
    this.#bind();
  }

  #init() {
    this.$staffForm = this.app.staffForm.$form;
  } 

  #bind() {
    this.$staffForm.addEventListener('submit', this.#handleStaffFormSubmit.bind(this));
  }

  // ---------- Public handlers ----------

  // ---------- Private handlers ----------
  async #handleStaffFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    this.app.clearUserMessage();
    this.app.clearErrorMessage();

    let data = this.#formatData(this.#extractData(form));
    try {
      let response = await this.app.DBAPI.createNewStaff(form, data);
      this.app.userMsg(`Successfully created staff with id: ${response.id}`);
    } catch(error) {
      this.app.handleError(error);
    }
  }
  // ---------- helpers ----------
  #extractData(formElement) {
    let formData = new FormData(formElement);
    let data = Object.fromEntries(formData.entries());

    for (let key in data) {
      data[key] = data[key].trim();
    }
    
    return data;
  }

  #formatData(data) {
    return JSON.stringify(data);
  }
}
