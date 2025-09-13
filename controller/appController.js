import ValidationError from '../utils/validationError.js';
import HttpError from '../utils/httpError.js';
import debounce from '../utils/debounce.js';

import ScheduleList from '../view/scheduleList.js';
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
    this.app.$schedulesBtn.addEventListener('click', this.#handleSchedulesBtn.bind(this));
    this.app.$staffFormBtn.addEventListener('click', this.#handleStaffFormBtn.bind(this));
  }

  // ---------- Public API ----------
  // --- Schedules ---
  displaySchedules() {
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    
    this.app.$pageHeading.textContent = "Schedule List";
    this.app.$schedulesDiv.classList.remove('hidden');
    this.app.$staffFormDiv.classList.add('hidden');
    
    this.app.userMsg('Loading schedules...');
    this.app.loadSchedules();
  }

  listSchedules() {
    if (this.app.schedules.length === 0) {
      this.app.userMsg("There are currently no schedules are available for booking.")
    } else {
      new ScheduleList(this.app);
    }
  }

  // ---------- Private handlers ----------
  #handleSchedulesBtn(event) {
    event.preventDefault();
    this.displaySchedules();
  }
  
  #handleStaffFormBtn(event) {
    event.preventDefault();
    console.log('hi');
  }

  async #handleStaffFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    this.app.clearUserMsg();
    this.app.clearErrorMsg();

    let data = this.#formatData(this.#extractData(form));
    try {
      let response = await this.app.DBAPI.createNewStaff(form, data);

      switch (response.status) {
        case 400:
          throw new Error('Staff cannot be created. Check your inputs.');
        case 201:
          let responseJson = await response.json();
          this.app.userMsg(`Successfully created staff with id: ${responseJson.id}`);
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.app.errorMsg(error.message);
    }
  }

  // ---------- helpers ----------
  // --- Schedules ---
  

  // --- Staff Form ---
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
