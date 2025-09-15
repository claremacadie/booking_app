import ScheduleList from '../view/scheduleList.js';
import SchedulesForm from '../view/schedulesForm.js';
import StaffForm from '../view/staffForm.js';
import BookingForm from '../view/bookingForm.js';
import StudentForm from '../view/studentForm.js';

export default class AppController {
  constructor(app) {
    this.app = app;
    this.staffForm = null;
    this.schedulesForm = null;
    this.bookingForm = null;
    this.studentForm = null;
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
    let newMsg = document.createElement('p');
    newMsg.textContent = msg;
    this.$userMsg.append(newMsg);
  }

  errorMsg(msg) {
    let newMsg = document.createElement('p');
    newMsg.textContent = msg;
    this.$errorMsg.append(newMsg);
  }

  clearUserMsg() {
    this.$userMsg.innerHTML = '';
  }
  
  clearErrorMsg() {
    this.$errorMsg.innerHTML = '';
  }

  async displaySchedules() {
    this.$schedulesDiv.innerHTML = '';
    this.clearUserMsg();
    this.clearErrorMsg();
    
    this.$pageHeading.textContent = "Schedule List";
    this.$schedulesDiv.classList.remove('hidden');
    this.$staffFormDiv.classList.add('hidden');
    this.$schedulesFormDiv.classList.add('hidden');
    this.$bookingFormDiv.classList.add('hidden');
    
    await this.app.loadSchedules();
    if (this.app.schedules) this.#listSchedules();
  }
  
  displayStaffForm() {
    this.clearUserMsg();
    this.clearErrorMsg();
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
    this.clearUserMsg();
    this.clearErrorMsg();
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
    this.clearUserMsg();
    this.clearErrorMsg();
    
    this.$pageHeading.textContent = "Book a Schedule";
    this.$schedulesDiv.classList.add('hidden');
    this.$staffFormDiv.classList.add('hidden');
    this.$schedulesFormDiv.classList.add('hidden');
    this.$bookingFormDiv.classList.remove('hidden');
    
    await this.app.loadSchedules();
    await this.app.fetchStaff();

    if (!this.bookingForm && this.app.schedules && this.app.staff) {
      this.bookingForm = new BookingForm(this);
      this.bookingForm.$form.addEventListener('submit', this.#handleBookingFormSubmit.bind(this))
    }
  }

  // ---------- Private handlers ----------
  #handleSchedulesBtn(event) {
    event.preventDefault();
    this.displaySchedules();
  }
  
  #handleStaffFormBtn(event) {
    event.preventDefault();
    this.displayStaffForm();
  }
  
  #handleSchedulesFormBtn(event) {
    event.preventDefault();
    this.displaySchedulesForm();
  }
  
  #handleBookingFormBtn(event) {
    event.preventDefault();
    this.displayBookingForm();
  }

  async #handleStaffFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    let data = this.#formatData(this.#extractData(form));
    this.#sendStaffData(form, data);
  }

  #handleBookingFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    let data = this.#formatData(this.#extractData(form));
    this.#sendBooking(form, data);
  }

  #handleAddSchedulesBtn(event) {
    event.preventDefault();
    this.schedulesForm.addScheduleFieldset();
  }

  #handleScheduleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    let data = this.#formatSchedulesData(this.#extractData(form));
    this.#sendScheduleData(form, data);
  }

  #handleStudentFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    let data = this.#formatData(this.#extractData(form));
    this.#sendStudentData(form, data);
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

  // --- Schedules Form ---
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

  // --- Booking Form ---
  async #sendBooking(form, data) {
    try {
      let response = await this.app.DBAPI.addBooking(form, data);
      let msg = await response.text();
      
      switch (response.status) {
        case 404:
          throw new Error(msg);
        case 204:
          alert('Booked!');
          this.#resetBookingForm();
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.clearUserMsg();
      this.errorMsg(error.message);
      if (error.message.match('booking_sequence')) {
        let bookingSequence = error.message.split(':')[1].trim();
        this.#displayStudentForm(bookingSequence);
      }
    }
  }

  #displayStudentForm(bookingSequence) {
    this.studentForm = new StudentForm(this, bookingSequence);
    this.studentForm.$form.addEventListener('submit', this.#handleStudentFormSubmit.bind(this));
    this.$bookingFormDiv.append(this.studentForm.$form);
  }

  async #sendStudentData(form, data) {
    try {
      let response = await this.app.DBAPI.addStudent(form, data);
      let msg = await response.text();
      
      switch (response.status) {
        case 404:
          throw new Error(msg);
        case 201:
          this.userMsg(msg);
          alert('Booked!')
          this.studentForm.$form.remove();
          this.app.studentForm = null;
          this.#resetBookingForm();
          break;
        default:
          throw new Error(msg);
      }
    } catch(error) {
      console.log(error);
      this.errorMsg(error.message);
    }
  }

  #resetBookingForm() {
    this.bookingForm.$form.remove();
    this.$bookingFormDiv.innerHTML = '';
    this.bookingForm = null;
    this.app.schedules = null;
    this.displayBookingForm();
  }
}
