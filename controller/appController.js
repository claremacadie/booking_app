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
  #handleStaffFormSubmit(event) {
    event.preventDefault();
    console.log('hi');
    // - Validate inputs - none empty
    //   - Error message: Staff cannot be created. Check your inputs.
    //   - Fetch request: path = '/staff_members', fields `name` and `email`
    //   - success = 201, {id: 14}
    //   - error = 4xx "Staff can not be created. Check your inputs."
    //   - Success message: Successfully created staff with id: 14
  }
  // ---------- helpers ----------
  #extractData(formData) {
    let data = Object.fromEntries(formData.entries());

    for (let key in data) {
      data[key] = data[key].trim();
    }
    
    return data;
  }

  #formatDataToSend(data) {
    return JSON.stringify(data);
  }
}
