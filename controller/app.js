import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';

// Import view classes
import Schedule from '../model/schedule.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.schedules = null;
    this.staff = null;
    this.#init();
  }
  
  async #init() {
    this.appController = new AppController(this);
    this.DBAPI = new DBAPI(this.url);

    // Set default view
    // this.appController.displaySchedules();
    // this.appController.displayStaffForm();
    // this.appController.displaySchedulesForm();
    // this.appController.displayBookingForm();
    this.appController.displayBookingsList();
  }
  
  // ---------- public API ----------  
  async loadSchedules() {
    this.appController.userMsg('Loading schedules...');
    try {
      let response = await this.DBAPI.fetchSchedules();
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.appController.userMsg('Schedules finished loading.');
      let jsonData = await response.json();

      this.schedules = [];

      jsonData.forEach(obj => {
        this.schedules.push(new Schedule(obj));
      });
    } catch(error) {
      this.appController.errorMsg(`Schedules error: ${error.message}`);
    } finally {
      this.appController.clearUserMsg();
      if (this.schedules) {
        this.appController.userMsg("Using cached schedule data.")
      } else {
        this.appController.userMsg(" Schedules did not load, please refresh the page.");
      }
    }
  }

  async fetchStaff() {
    this.appController.userMsg('Loading staff...');
    try {
      let response = await this.DBAPI.fetchStaff();
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.appController.userMsg('Staff finished loading.');
      let jsonData = await response.json();
      this.staff = {};
      jsonData.forEach(obj => this.staff[obj.id] = { 
        'name': obj.name, 
        'email': obj.email,
      });
    } catch(error) {
      this.appController.errorMsg(`Staff error: ${error.message}`);
    } finally {
      this.appController.clearUserMsg();
      if (this.staff) {
        this.appController.userMsg("Using cached staff data.")
      } else {
        this.appController.userMsg("Staff did not load, please refresh the page.");
      }
    }
  }

  getStaffNameById(id) {
    if (!this.staff) return;
    return this.staff[id].name;
  }
}
