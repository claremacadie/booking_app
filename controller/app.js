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
    this.$userMessage = document.getElementById("user-message");
    this.$errorMessage = document.getElementById("error-message");

    this.DBAPI = new DBAPI(this.url);
    this.staffForm = new StaffForm(this);
    this.appController = new AppController(this);
    
    this.displayAllSchedulesMode();
    // this.displayStaffFormMode();
    
  }
  
  // ---------- public API ----------
  async displayAllSchedulesMode() {
    this.clearUserMsg();
    this.clearErrorMsg();
    this.$pageHeading.textContent = "Schedule List";
    this.$allSchedulesDiv.classList.remove('hidden');
    this.$staffFormDiv.classList.add('hidden');

    this.userMsg('Loading schedules...');

    // Gets a response object or a timeout error
    let response = await this.DBAPI.fetchAllSchedules();

    if (typeof(response) === TimeoutError) {
      this.errorMsg("Request took too long, please try again.");
      return;
    }

    if (response.status === 200) {
      this.userMsg('Schedules finished loading.');
      let jsonData = await response.json();
      this.#displaySchedules(jsonData);
      return;
    }

    this.errorMsg("Something went wrong, please refresh the page.");

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
  #displaySchedules(jsonData) {
    this.allSchedules = [];

    jsonData.forEach(obj => {
      this.allSchedules.push(new Schedule(obj));
    });

    new ScheduleList(this);
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
  Check original allSchedules functionality works

  object to store divs
  Buttons, with eventListeners in header to switch between different views:
    - displayAllSchedulesMode
    - displayStaffFormMode
  Change default mode to be displayed for each part of the assignment

Fudges:
  
*/
