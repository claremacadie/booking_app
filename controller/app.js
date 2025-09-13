import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';
import TimeoutError from '../utils/timeoutError.js';

// Import view classes
import Schedule from '../model/schedule.js';
import StaffForm from '../view/staffForm.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.#init();
  }
  
  async #init() {
    this.$pageHeading = document.getElementById("page-heading");
    this.$schedulesDiv = document.getElementById("schedules");
    this.$staffFormDiv = document.getElementById("staff-form");
    this.$userMsg = document.getElementById("user-message");
    this.$errorMsg = document.getElementById("error-message");
    this.$schedulesBtn = document.getElementById("schedules-btn");
    this.$staffFormBtn = document.getElementById("staff-form-btn");

    this.DBAPI = new DBAPI(this.url);
    this.staffForm = new StaffForm(this);
    this.appController = new AppController(this);
  }
  
  // ---------- public API ----------  
  userMsg(msg) {
    this.$userMsg.textContent = msg;
  }

  errorMsg(msg) {
    this.$errorMsg.textContent = msg;
  }

  clearUserMsg() {
    this.$userMsg.textContent = '';
  }
  
  clearErrorMsg() {
    this.$errorMsg.textContent = '';
  }

  // --- Schedules ---
  async loadSchedules() {
    try {
      let response = await this.DBAPI.fetchSchedules();
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.userMsg('Schedules finished loading.');
      let jsonData = await response.json();

      this.schedules = [];

      jsonData.forEach(obj => {
        this.schedules.push(new Schedule(obj));
      });
      this.appController.listSchedules();
    } catch(error) {
      this.clearUserMsg();
      this.errorMsg(error.message);
    } finally {
      this.userMsg(`${this.$userMsg.textContent} The request has completed.`)
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

/*
To do:
  object to store divs
  Buttons, with eventListeners in header to switch between different views:
    - displayAllSchedulesMode
    - displayStaffFormMode
  Change default mode to be displayed for each part of the assignment

Fudges:
  
*/
