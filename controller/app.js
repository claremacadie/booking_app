import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';
import ValidationError from '../utils/validationError.js';
import TimeoutError from '../utils/timeoutError.js';
import HttpError from '../utils/httpError.js';

// Import model classes
import Schedule from '../model/schedule.js';

// Import view classes
import ViewForm from '../view/viewForm.js';
import ViewList from '../view/viewList.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.#init();
  }
  
  async #init() {
    this.$allSchedulesDiv = document.getElementById("all-schedules");
    this.$userMessage = document.getElementById("user-message");
    this.$errorMessage = document.getElementById("error-message");

    this.DBAPI = new DBAPI(this.url);
    this.appController = new AppController(this);

    try {
      this.allSchedules = await this.#fetchAllSchedules();
      this.viewList = new ViewList(this);
      
      this.#createHTML();
      
      // this.#periodicDataFetch(); 
    } catch(error) {
        this.handleError(error, 'Could not load content.');
    } finally {
      this.clearUserMessage();
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

  handleError(error, msg='Something went wrong. Please try again.') {
    if (error instanceof ValidationError) {
      this.displayErrorMessage(error.message);
    } else if (error instanceof HttpError) {
      this.displayErrorMessage(`Request failed (${error.status}): ${error.message}`);
      return;
    } else if (error?.name === 'AbortError') {
      this.displayUserMessage('Request aborted.');
    } else if (error instanceof TimeoutError) {
      this.displayErrorMessage('Request timed out. Please try again.');
    } else {
      console.error(error);
      this.displayErrorMessage(msg);
    }
  }

  // -- Model --
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

  #createHTML() {
    this.$allSchedulesDiv.append(this.viewList.$ul);
  }
}

/*
To do:
  CSS for schedule list
  Messages to user, including:
    - how many schedules are display
    - Loading, loaded, etc.
  Delay of 7 seconds manufactured, user setTimeout to display something if more than 5 seconds - cancel retrieval and try again
  Title for schedule list

  Remove more from skeleton - it's too confusing with too much code

  Buttons in header to switch between different views
*/
