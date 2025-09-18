import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';

// Import view classes
import Schedule from '../model/schedule.js';
import BookingDate from '../model/bookingDate.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.schedules = null;
    this.staff = null;
    this.bookingsDates = null;
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
      this.appController.clearUserMsg();
      if (this.staff) {
        this.appController.userMsg("Using cached staff data.")
      } else {
        this.appController.userMsg("Staff did not load, please refresh the page.");
      }
    }
  }

  async loadBookingsDates() {
    this.appController.userMsg('Loading bookings dates...');
    try {
      let response = await this.DBAPI.fetchBookingsDates();
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.appController.clearUserMsg();
      this.appController.userMsg('Bookings dates finished loading.');
      let jsonData = await response.json();
      
      this.bookingsDates = [];

      jsonData.forEach(date => {
        this.bookingsDates.push(new BookingDate(date));
      });
    } catch(error) {
      if (this.bookingsDates) {
        this.appController.userMsg("Using cached bookings dates data.")
      } else {
        this.appController.userMsg(" Bookings dates did not load, please refresh the page.");
      }
      this.appController.errorMsg(`Bookings Dates error: ${error.message}`);
    }
  }

  async loadBookingsForDate(date) {
    this.appController.userMsg(`Loading bookings for: ${date}`);
    try {
      let response = await this.DBAPI.fetchBookingsForDate(date);
      if (response.status !== 200) throw new Error("Something went wrong, please try again");
      this.appController.clearUserMsg();
      this.appController.userMsg(`Bookings for ${date} finished loading.`);
      let jsonData = await response.json();
      this.getBookingByDate(date).addBookings(jsonData);
    } catch(error) {
      if (this.bookingsDates[date]) {
        this.appController.userMsg(`Using cached data for bookings for ${date}.`)
      } else {
        this.appController.userMsg(`Bookings for ${date} did not load, please refresh the page.`);
      }
      this.appController.errorMsg(`Bookings for ${date} error: ${error.message}`);
    }
  }

  getStaffNameById(id) {
    if (!this.staff) return;
    return this.staff[id].name;
  }

  getBookingByDate(date) {
    if (!this.bookingsDates) return;
    return this.bookingsDates.find(booking => booking.date === date);
  }
}
