import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';

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
    this.$userMessage = document.getElementById("user-message");
    this.$errorMessage = document.getElementById("error-message");

    this.DBAPI = new DBAPI(this.url);
    this.staffForm = new StaffForm(this);
    this.appController = new AppController(this);
    
    try {
      // this.userMsg('Loading schedules');
      // this.allSchedules = await this.#fetchAllSchedules();
      // this.#displayAllSchedules();

      this.displayStaffFormMode();

      // this.#periodicDataFetch(); 
    } catch(error) {
      this.clearUserMsg();
      this.handleError(error, 'Could not load schedules.');
    }
  }
  
  // ---------- public API ----------
  displayAllSchedulesMode() {
    this.clearUserMsg();
    this.clearErrorMsg();
    this.$pageHeading.textContent = "Schedule List";
    this.$allSchedulesDiv.classList.remove('hidden');
    this.$addStaffDiv.classList.add('hidden');
  }
  
  displayStaffFormMode() {
    this.clearUserMsg();
    this.clearErrorMsg();
    this.$pageHeading.textContent = "Add Staff";
    this.$allSchedulesDiv.classList.add('hidden');
    this.$staffFormDiv.classList.remove('hidden');
  }

  userMsg(msg) {
    this.$userMessage.textContent = msg;
  }

  errorMsg(msg) {
    this.$errorMessage.textContent = msg;
  }

  clearUserMsg() {
    this.$userMessage.textContent = '';
  }
  
  clearErrorMsg() {
    this.$errorMessage.textContent = '';
  }

  // ---------- private API ----------
  // --- Schedules ---
  #displayAllSchedules() {
    this.displayAllSchedulesMode();
    let schedulesTally = this.allSchedules.length;

    if (schedulesTally === 0) {
      this.userMsg('There are currently no schedules available for booking.');
    } else {
      this.userMsg(`Schedules loaded successfully. There are ${this.allSchedules.length} schedules.`);
      this.scheduleList = new ScheduleList(this);
    }
  }

  async #fetchAllSchedules() {
    let schedules = [];

    let schedulesDataArr = await this.DBAPI.fetchAllSchedules();
    schedulesDataArr.forEach (dataObj => {
      let scheduleObj = new Schedule(dataObj);
      schedules.push(scheduleObj)
    });

    return schedules;
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
  switch on response.status explicitly, like in the assignment’s solution, to handle 201 and 400 separately and parse JSON only when it’s a successful response. Otherwise, your approach matches the assignment’s goals well.

  object to store divs
  Buttons, with eventListeners in header to switch between different views:
    - displayAllSchedulesMode
    - displayStaffFormMode
  Change default mode to be displayed for each part of the assignment

Fudges:
  App.handleError:
    - this.displayErrorMessage(error.message.split(' — ')[1]);
  
*/
