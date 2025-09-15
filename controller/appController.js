import ScheduleList from '../view/scheduleList.js';
import SchedulesForm from '../view/schedulesForm.js';
import StaffForm from '../view/staffForm.js';
import BookingForm from '../view/bookingForm.js';

export default class AppController {
  constructor(app) {
    this.app = app;
    this.staffForm = null;
    this.schedulesForm = null;
    this.bookingForm = null;
    this.#init();
    this.#bind();
  }

  async #init() {
    this.$pageHeading = document.getElementById("page-heading");
    this.$schedulesDiv = document.getElementById("schedules");
    this.$staffFormDiv = document.getElementById("staff-form");
    this.$schedulesFormDiv = document.getElementById("schedules-form");
    this.$bookingFormDiv = document.getElementById("booking-form");

    this.$userMsg = document.getElementById("user-message");
    this.$errorMsg = document.getElementById("error-message");

    this.$schedulesBtn = document.getElementById("schedules-btn");
    this.$staffFormBtn = document.getElementById("staff-form-btn");
    this.$schedulesFormBtn = document.getElementById("schedules-form-btn");
    this.$bookingFormBtn = document.getElementById("booking-btn");
  } 

  #bind() {
    this.$schedulesBtn.addEventListener('click', this.#handleSchedulesBtn.bind(this));
    this.$staffFormBtn.addEventListener('click', this.#handleStaffFormBtn.bind(this));
    this.$schedulesFormBtn.addEventListener('click', this.#handleSchedulesFormBtn.bind(this));
    this.$bookingFormBtn.addEventListener('click', this.#handleBookingFormBtn.bind(this));
  }

  // ---------- Public API ----------
  userMsg(msg) {
    this.$userMsg.textContent = this.$userMsg.textContent + ' ' + msg;
  }

  errorMsg(msg) {
    this.$errorMsg.textContent = this.$errorMsg.textContent + ' ' + msg;
  }

  clearUserMsg() {
    this.$userMsg.textContent = '';
  }
  
  clearErrorMsg() {
    this.$errorMsg.textContent = '';
  }

  async displaySchedules() {
    this.$schedulesDiv.innerHTML = '';
    // this.app.clearUserMsg();
    // this.app.clearErrorMsg();
    
    this.$pageHeading.textContent = "Schedule List";
    this.$schedulesDiv.classList.remove('hidden');
    this.$staffFormDiv.classList.add('hidden');
    this.$schedulesFormDiv.classList.add('hidden');
    this.$bookingFormDiv.classList.add('hidden');
    
    await this.app.loadSchedules();
    if (this.app.schedules) this.#listSchedules();
  }
  
  displayStaffForm() {
    // this.app.clearUserMsg();
    // this.app.clearErrorMsg();
    this.$pageHeading.textContent = "Add Staff";
    this.$schedulesDiv.classList.add('hidden');
    this.$staffFormDiv.classList.remove('hidden');
    this.$schedulesFormDiv.classList.add('hidden');
    this.$bookingFormDiv.classList.add('hidden');

    if (!this.staffForm) {
      this.staffForm = new StaffForm(this);
      this.staffForm.$form.addEventListener('submit', this.#handleStaffFormSubmit.bind(this));
    }
  }
  
  displaySchedulesForm() {
    // this.app.clearUserMsg();
    // this.app.clearErrorMsg();
    this.$pageHeading.textContent = "Add Schedules";
    this.$schedulesDiv.classList.add('hidden');
    this.$staffFormDiv.classList.add('hidden');
    this.$schedulesFormDiv.classList.remove('hidden');
    this.$bookingFormDiv.classList.add('hidden');

    if (!this.schedulesForm) {
      this.schedulesForm = new SchedulesForm(this);
      this.schedulesForm.$addSchedulesBtn.addEventListener('click', this.#handleAddSchedulesBtn.bind(this));
      this.schedulesForm.$form.addEventListener('submit', this.#handleScheduleFormSubmit.bind(this));
    } else {
      this.app.fetchStaff();
    }
  }
  
  async displayBookingForm() {
    // this.app.clearUserMsg();
    // this.app.clearErrorMsg();
    
    this.$pageHeading.textContent = "Book a Schedule";
    this.$schedulesDiv.classList.add('hidden');
    this.$staffFormDiv.classList.add('hidden');
    this.$schedulesFormDiv.classList.add('hidden');
    this.$bookingFormDiv.classList.remove('hidden');
    
    await this.app.loadSchedules();
    await this.app.fetchStaff();

    if (!this.bookingForm && this.app.schedules && this.app.staff) {
      this.bookingForm = new BookingForm(this);
      // event listeners
    }
  }

  // ---------- Private handlers ----------
  #handleSchedulesBtn(event) {
    event.preventDefault();
    this.clearUserMsg();
    this.clearErrorMsg();
    this.displaySchedules();
  }
  
  #handleStaffFormBtn(event) {
    event.preventDefault();
    this.clearUserMsg();
    this.clearErrorMsg();
    this.displayStaffForm();
  }
  
  #handleSchedulesFormBtn(event) {
    event.preventDefault();
    this.clearUserMsg();
    this.clearErrorMsg();
    this.displaySchedulesForm();
  }
  
  #handleBookingFormBtn(event) {
    event.preventDefault();
    this.clearUserMsg();
    this.clearErrorMsg();
    this.displayBookingForm();
  }

  async #handleStaffFormSubmit(event) {
    event.preventDefault();
    this.clearUserMsg();
    this.clearErrorMsg();
    let form = event.target;

    let data = this.#formatData(this.#extractData(form));
    this.#sendStaffData(form, data);
  }

  #handleAddSchedulesBtn(event) {
    event.preventDefault();
    this.clearUserMsg();
    this.clearErrorMsg();
    this.schedulesForm.addScheduleFieldset();
  }

  #handleScheduleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    this.clearUserMsg();
    this.clearErrorMsg();

    let data = this.#formatSchedulesData(this.#extractData(form));
    this.#sendScheduleData(form, data);
  }

  // ---------- helpers ----------
  // --- Schedules ---
  #listSchedules() {
    if (this.app.schedules.length === 0) {
      this.userMsg("There are currently no schedules available for booking.")
    } else {
      new ScheduleList(this);
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

  #formatSchedulesData(data) {
    let schedulesObj = {};
    
    Object.keys(data).forEach(key => {
      let [field, num] = key.split('_');
      if (field === 'staff') {
        schedulesObj[key] = {};
        schedulesObj[key]['staff_id'] = data[key];
      } else {
        schedulesObj[`staff_${num}`][field] = data[key];
      }
    });

    let schedulesArr = Object.values(schedulesObj);
    return JSON.stringify({"schedules": schedulesArr});
  }

  async #sendStaffData(form, data) {
    try {
      let response = await this.app.DBAPI.createNewStaff(form, data);

      switch (response.status) {
        case 400:
          throw new Error('Staff cannot be created. Check your inputs.');
        case 201:
          let responseJson = await response.json();
          this.userMsg(`Successfully created staff with id: ${responseJson.id}`);
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.errorMsg(error.message);
    }
  }

  async #sendScheduleData(form, data) {
    try {
      let response = await this.app.DBAPI.addSchedules(form, data);

      switch (response.status) {
        case 400:
          throw new Error('Please check your inputs.');
        case 201:
          this.userMsg('Schedules added.');
          form.reset();
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.errorMsg(error.message);
    }
  }
}
