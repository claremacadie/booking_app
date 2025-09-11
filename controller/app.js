import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';
import ValidationError from '../utils/validationError.js';
import TimeoutError from '../utils/timeoutError.js';
import HttpError from '../utils/httpError.js';

// Import model classes
import Schedule from '../model/schedule.js';

// Import view classes
import ViewForm from '../view/viewForm.js';
import ScheduleList from '../view/scheduleList.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.#init();
  }
  
  async #init() {
    this.$pageHeading = document.getElementById("page-heading");
    this.$allSchedulesDiv = document.getElementById("all-schedules");
    this.$userMessage = document.getElementById("user-message");
    this.$errorMessage = document.getElementById("error-message");

    this.DBAPI = new DBAPI(this.url);
    this.appController = new AppController(this);
    
    try {
      this.displayUserMessage('Loading schedules');
      this.allSchedules = await this.#fetchAllSchedules();
      this.displayUserMessage(`Schedules loaded successfully. There are ${this.allSchedules.length} schedules.`);
      this.#displayAllSchedulesMode();
      this.scheduleList = new ScheduleList(this);
      this.#periodicDataFetch(); 
    } catch(error) {
      this.clearUserMessage();
      this.handleError(error, 'Could not load schedules.');
    }
  }
  
  // ---------- public API ----------
  displayUserMessage(msg) {
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
      this.displayErrorMessage(`Request failed (${error.status}): ${error.message}`);
      return;
    } else if (error?.name === 'AbortError') {
      this.displayUserMessage('Request aborted.');
    } else if (error instanceof TimeoutError) {
      this.displayErrorMessage(`${msg} Request timed out.`);
    } else {
      console.error(error);
      this.displayErrorMessage(msg);
    }
  }

  // ---------- private API ----------
  #displayAllSchedulesMode() {
    this.$pageHeading.textContent = "Schedule List";
    this.$allSchedulesDiv.classList.remove('hidden');
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

  Buttons in header to switch between different views
*/
