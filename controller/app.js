import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';
import TimeoutError from '../utils/timeoutError.js';

// Import model classes
import Schedule from '../model/schedule.js';

// Import view classes
import StaffForm from '../view/staffForm.js';
import ScheduleList from '../view/scheduleList.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.#init();
  }
  
  async #init() {
    this.$pageHeading = document.getElementById("page-heading");
    this.$allSchedulesDiv = document.getElementById("all-schedules");
    this.$staffFormDiv = document.getElementById("staff-form");
    this.$userMsg = document.getElementById("user-message");
    this.$errorMsg = document.getElementById("error-message");

    this.DBAPI = new DBAPI(this.url);
    this.staffForm = new StaffForm(this);
    this.appController = new AppController(this);
    
    this.displaySchedules();
    // this.displayStaffForm();
  }
  
  // ---------- public API ----------
  async displaySchedules() {
    this.clearUserMsg();
    this.clearErrorMsg();
    this.$pageHeading.textContent = "Schedule List";
    this.$allSchedulesDiv.classList.remove('hidden');
    this.$staffFormDiv.classList.add('hidden');

    this.userMsg('Loading schedules...');
    this.#loadSchedules();
  }
  
  displayStaffForm() {
    this.clearUserMsg();
    this.clearErrorMsg();
    this.$pageHeading.textContent = "Add Staff";
    this.$allSchedulesDiv.classList.add('hidden');
    this.$staffFormDiv.classList.remove('hidden');
  }

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

  // ---------- private API ----------
  // --- Schedules ---
  async #loadSchedules() {
    try {
      let response = await this.DBAPI.fetchAllSchedules();
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.userMsg('Schedules finished loading.');
      let jsonData = await response.json();
      this.#listSchedules(jsonData);
    } catch(error) {
      this.clearUserMsg();
      this.errorMsg(error.message);
    } finally {
      this.userMsg(`${this.$userMsg.textContent} The request has completed.`)
    }
  }

  #listSchedules(jsonData) {
    this.allSchedules = [];

    jsonData.forEach(obj => {
      this.allSchedules.push(new Schedule(obj));
    });

    if (this.allSchedules.length === 0) {
      this.userMsg("Currently, no schedules are available for booking.")
    } else {
      new ScheduleList(this);
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
