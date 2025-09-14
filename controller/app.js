import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';

// Import view classes
import Schedule from '../model/schedule.js';
import StaffForm from '../view/staffForm.js';
import SchedulesForm from '../view/schedulesForm.js';
import BookingForm from '../view/bookingForm.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.schedules = null;
    this.staff = null;
    this.#init();
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

    this.DBAPI = new DBAPI(this.url);
    this.staffForm = new StaffForm(this);
    this.schedulesForm = new SchedulesForm(this);
    this.bookingForm = new BookingForm(this);
    this.appController = new AppController(this);
  }
  
  // ---------- public API ----------  
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

  // --- Schedules ---
  async loadSchedules() {
    this.userMsg('Loading schedules.');
    try {
      let response = await this.DBAPI.fetchSchedules();
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.userMsg('Schedules finished loading.');
      let jsonData = await response.json();

      this.schedules = [];

      jsonData.forEach(obj => {
        this.schedules.push(new Schedule(obj));
      });
    } catch(error) {
      if (this.schedules) {
        this.userMsg("Using cached schedule data.")
      } else {
        // this.clearUserMsg();
      }
      this.errorMsg(`Loading schedules: ${error.message}`);
    } finally {
      this.userMsg("The schedule request has completed.")
    }
  }

  // --- Staff ---
  async fetchStaff() {
    this.userMsg('Loading staff.');
    try {
      let response = await this.DBAPI.fetchStaff();
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.userMsg('Staff finished loading.');
      let jsonData = await response.json();
      this.staff = {};
      jsonData.forEach(obj => this.staff[obj.id] = { 
        'name': obj.name, 
        'email': obj.email,
      });
    } catch(error) {
      if (this.staff) {
        this.userMsg("Using cached staff data.")
      } else {
        // this.clearUserMsg();
      }
      this.errorMsg(`Loading staff: ${error.message}`);
    } finally {
      this.userMsg("The staff request has completed.")
    }
  }
    
  // ---------- private API ----------
  #periodicDataFetch() {
    let ms = 60_000; 
    this.refreshing = false;
    this.intervalId = setInterval(async () => {
      if (this.refreshing) return;
      this.refreshing = true;
      try {
        // load data from DBAPI
      } finally {
        this.refreshing = false;
      }
    }, ms);
  }
}
