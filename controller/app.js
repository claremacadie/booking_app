import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';
import ValidationError from '../utils/validationError.js';
import TimeoutError from '../utils/timeoutError.js';
import HttpError from '../utils/httpError.js';

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
      this.clearUserMessage();
      this.handleError(error, 'Could not load schedules.');
    }
  }
  
  // ---------- public API ----------
  displayAllSchedulesMode() {
    this.clearUserMessage();
    this.clearErrorMessage();
    this.$pageHeading.textContent = "Schedule List";
    this.$allSchedulesDiv.classList.remove('hidden');
    this.$addStaffDiv.classList.add('hidden');
  }
  
  displayStaffFormMode() {
    this.clearUserMessage();
    this.clearErrorMessage();
    this.$pageHeading.textContent = "Add Staff";
    this.$allSchedulesDiv.classList.add('hidden');
    this.$staffFormDiv.classList.remove('hidden');
  }

  userMsg(msg) {
    this.$userMessage.textContent = msg;
  }

  displayErrorMessage(msg) {
    this.$errorMessage.textContent = msg;
  }

  clearUserMessage() {
    this.$userMessage.textContent = '';
  }
  
  clearErrorMessage() {
    this.$errorMessage.textContent = '';
  }

  handleError(error, msg='Something went wrong.') {
    if (error instanceof ValidationError) {
      this.displayErrorMessage(error.message);
    } else if (error instanceof HttpError) {
      console.log(`Request failed (${error.status}): ${error.message}`);
      this.displayErrorMessage(error.message.split(' — ')[1]);
      return;
    } else if (error?.name === 'AbortError') {
      this.userMsg('Request aborted.');
    } else if (error instanceof TimeoutError) {
      this.displayErrorMessage(`${msg} Request timed out.`);
    } else {
      console.error(error);
      this.displayErrorMessage(msg);
    }
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
  object to store divs
  Buttons, with eventListeners in header to switch between different views:
    - displayAllSchedulesMode
    - displayStaffFormMode
  Change default mode to be displayed for each part of the assignment

Fudges:
  App.handleError:
    - this.displayErrorMessage(error.message.split(' — ')[1]);
  
*/
