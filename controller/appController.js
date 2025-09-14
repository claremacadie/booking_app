import ScheduleList from '../view/scheduleList.js';

export default class AppController {
  constructor(app) {
    this.app = app;
    this.#init();
    this.#bind();
  }

  #init() {
    this.$staffForm = this.app.staffForm.$form;
    // Set default view
    this.#displaySchedulesForm();
  } 

  #bind() {
    this.$staffForm.addEventListener('submit', this.#handleStaffFormSubmit.bind(this));
    this.app.$schedulesBtn.addEventListener('click', this.#handleSchedulesBtn.bind(this));
    this.app.$staffFormBtn.addEventListener('click', this.#handleStaffFormBtn.bind(this));
    this.app.$schedulesFormBtn.addEventListener('click', this.#handleSchedulesFormBtn.bind(this));
    this.app.schedulesForm.$addSchedulesBtn.addEventListener('click', this.#handleAddSchedulesBtn.bind(this))
  }

  // ---------- Private API ----------
  // --- Schedules ---
  async #displaySchedules() {
    this.app.$schedulesDiv.innerHTML = '';
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    
    this.app.$pageHeading.textContent = "Schedule List";
    this.app.$schedulesDiv.classList.remove('hidden');
    this.app.$staffFormDiv.classList.add('hidden');
    this.app.$schedulesFormDiv.classList.add('hidden');
    
    this.app.userMsg('Loading schedules...');
    await this.app.loadSchedules();
    
    if (this.app.schedules) this.#listSchedules();
  }

  // --- Staff Form ---
  #displayStaffForm() {
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    this.app.$pageHeading.textContent = "Add Staff";
    this.app.$schedulesDiv.classList.add('hidden');
    this.app.$staffFormDiv.classList.remove('hidden');
    this.app.$schedulesFormDiv.classList.add('hidden');
  }
  
  // --- Schedules Form ---
  #displaySchedulesForm() {
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    this.app.$pageHeading.textContent = "Add Schedules";
    this.app.$schedulesDiv.classList.add('hidden');
    this.app.$staffFormDiv.classList.add('hidden');
    this.app.$schedulesFormDiv.classList.remove('hidden');
  }

  // ---------- Private handlers ----------
  #handleSchedulesBtn(event) {
    event.preventDefault();
    this.#displaySchedules();
  }
  
  #handleStaffFormBtn(event) {
    event.preventDefault();
    this.#displayStaffForm();
  }
  
  #handleSchedulesFormBtn(event) {
    event.preventDefault();
    this.#displaySchedulesForm();
  }

  async #handleStaffFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    this.app.clearUserMsg();
    this.app.clearErrorMsg();

    let data = this.#formatData(this.#extractData(form));
    this.#sendStaffData(form, data);
  }

  #handleAddSchedulesBtn(event) {
    event.preventDefault();
    this.app.schedulesForm.addScheduleFieldset();
  }

  // ---------- helpers ----------
  // --- Schedules ---
  #listSchedules() {
    if (this.app.schedules.length === 0) {
      this.app.userMsg("There are currently no schedules available for booking.")
    } else {
      new ScheduleList(this.app);
    }
  }
  
  // --- Staff Form ---
  #extractData(formElement) {
    let formData = new FormData(formElement);
    let data = Object.fromEntries(formData.entries());
    for (let key in data) {data[key] = data[key].trim()};
    return data;
  }

  #formatData(data) {
    return JSON.stringify(data);
  }

  async #sendStaffData(form, data) {
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
}
