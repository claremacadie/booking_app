import ScheduleList from '../view/scheduleList.js';
import SchedulesForm from '../view/schedulesForm.js';
import StaffForm from '../view/staffForm.js';
import BookingForm from '../view/bookingForm.js';
import StudentForm from '../view/studentForm.js';
import BookingsList from '../view/bookingsList.js';
import CancelBookingForm from '../view/cancelBookingForm.js';
import DeleteScheduleForm from '../view/deleteScheduleForm.js';

export default class AppController {
  constructor(app) {
    this.app = app;
    this.schedulesList = null;
    this.staffForm = null;
    this.schedulesForm = null;
    this.bookingForm = null;
    this.studentForm = null;
    this.bookingsList = null;
    this.cancelBookingForm = null;
    this.deleteScheduleForm = null;
    this.#init();
    this.#bind();
  }

  async #init() {
    this.$pageHeading = document.getElementById("page-heading");
    this.$schedulesDiv = document.getElementById("schedules");
    this.$staffFormDiv = document.getElementById("staff-form");
    this.$schedulesFormDiv = document.getElementById("schedules-form");
    this.$bookingFormDiv = document.getElementById("booking-form");
    this.$bookingsListDiv = document.getElementById("bookings-list");
    this.$cancelBookingFormDiv = document.getElementById("cancel-booking-form");
    this.$deleteScheduleFormDiv = document.getElementById("delete-schedule-form");

    this.divs = [
      this.$schedulesDiv, this.$staffFormDiv, 
      this.$schedulesFormDiv, this.$bookingFormDiv, 
      this.$bookingsListDiv, this.$cancelBookingFormDiv,
      this.$deleteScheduleFormDiv,
    ];

    this.$userMsg = document.getElementById("user-message");
    this.$errorMsg = document.getElementById("error-message");

    this.$schedulesBtn = document.getElementById("schedules-btn");
    this.$staffFormBtn = document.getElementById("staff-form-btn");
    this.$schedulesFormBtn = document.getElementById("schedules-form-btn");
    this.$bookingFormBtn = document.getElementById("booking-btn");
    this.$bookingsListBtn = document.getElementById("bookings-list-btn");
    this.$cancelBookingFormBtn = document.getElementById("cancel-booking-form-btn");
    this.$deleteScheduleFormBtn = document.getElementById("delete-schedule-form-btn");
  } 

  #bind() {
    this.$schedulesBtn.addEventListener('click', this.#handleSchedulesBtn.bind(this));
    this.$staffFormBtn.addEventListener('click', this.#handleStaffFormBtn.bind(this));
    this.$schedulesFormBtn.addEventListener('click', this.#handleSchedulesFormBtn.bind(this));
    this.$bookingFormBtn.addEventListener('click', this.#handleBookingFormBtn.bind(this));
    this.$bookingsListBtn.addEventListener('click', this.#handleBookingsListBtn.bind(this));
    this.$cancelBookingFormBtn.addEventListener('click', this.#handleCancelBookingFormBtn.bind(this));
    this.$deleteScheduleFormBtn.addEventListener('click', this.#handleDeleteScheduleFormBtn.bind(this));
  }

  // ---------- Public API ----------
  // --- Messages ---
  userMsg(msg) {
    let newMsg = document.createElement('p');
    newMsg.textContent = msg;
    this.$userMsg.append(newMsg);
  }

  errorMsg(msg) {
    let newMsg = document.createElement('p');
    newMsg.textContent = msg;
    this.$errorMsg.append(newMsg);
  }

  clearUserMsg() {
    this.$userMsg.innerHTML = '';
  }
  
  clearErrorMsg() {
    this.$errorMsg.innerHTML = '';
  }

  // --- Div Displays ---
  async displaySchedules() {
    this.$schedulesDiv.innerHTML = '';
    this.clearUserMsg();
    this.clearErrorMsg();
    
    this.$pageHeading.textContent = "Schedule List";
    this.#divToDisplay(this.$schedulesDiv);
    
    await this.app.loadSchedules();
    if (this.app.schedules) this.#listSchedules();
  }
  
  displayStaffForm() {
    this.clearUserMsg();
    this.clearErrorMsg();
    this.$pageHeading.textContent = "Add Staff";
    this.#divToDisplay(this.$staffFormDiv);

    if (!this.staffForm) {
      this.staffForm = new StaffForm(this);
      this.staffForm.$form.addEventListener('submit', this.#handleStaffFormSubmit.bind(this));
    }
  }
  
  async displaySchedulesForm() {
    this.clearUserMsg();
    this.clearErrorMsg();
    this.$pageHeading.textContent = "Add Schedules";
    this.#divToDisplay(this.$schedulesFormDiv);

    await this.app.loadStaff();

    if (!this.schedulesForm && this.app.staff) {
      this.schedulesForm = new SchedulesForm(this);
      this.schedulesForm.$addSchedulesBtn.addEventListener('click', this.#handleAddSchedulesBtn.bind(this));
      this.schedulesForm.$form.addEventListener('submit', this.#handleScheduleFormSubmit.bind(this));
    }
  }
  
  async displayBookingForm() {
    this.clearUserMsg();
    this.clearErrorMsg();
    
    this.$pageHeading.textContent = "Book A Schedule";
    this.#divToDisplay(this.$bookingFormDiv);
    
    await this.app.loadSchedules();
    await this.app.loadStaff();

    if (!this.bookingForm && this.app.schedules && this.app.staff) {
      this.bookingForm = new BookingForm(this);
      this.$bookingFormDiv.append(this.bookingForm.$form);
      this.bookingForm.$form.addEventListener('submit', this.#handleBookingFormSubmit.bind(this))
    }
  }

  async displayBookingsList() {
    this.clearUserMsg();
    this.clearErrorMsg();

    this.$pageHeading.textContent = "Bookings";
    this.#divToDisplay(this.$bookingsListDiv);

    await this.app.loadBookingsDates();
    if (this.app.bookingsDates) this.#listBookingsDates();
  }

  displayCancelBookingForm() {
    this.clearUserMsg();
    this.clearErrorMsg();

    this.$pageHeading.textContent = "Cancel Booking";
    this.#divToDisplay(this.$cancelBookingFormDiv);

    if (!this.cancelBookingForm) {
      this.cancelBookingForm= new CancelBookingForm(this);
      this.$cancelBookingFormDiv.append(this.cancelBookingForm.$form);
      this.cancelBookingForm.$form.addEventListener('submit', this.#handleCancelBookingFormSubmit.bind(this));
    } 
  }

  displayDeleteScheduleForm() {
    this.clearUserMsg();
    this.clearErrorMsg();

    this.$pageHeading.textContent = "Delete Schedule";
    this.#divToDisplay(this.$deleteScheduleFormDiv);

    if (!this.deleteScheduleForm) {
      this.deleteScheduleForm= new DeleteScheduleForm(this);
      this.$deleteScheduleFormDiv.append(this.deleteScheduleForm.$form);
      this.deleteScheduleForm.$form.addEventListener('submit', this.#handledeleteScheduleFormSubmit.bind(this));
    } 
  }

  // ---------- Private handlers ----------
  // --- Navigation Button handlers ---
  #handleSchedulesBtn(event) {
    event.preventDefault();
    this.displaySchedules();
  }
  
  #handleStaffFormBtn(event) {
    event.preventDefault();
    this.displayStaffForm();
  }
  
  #handleSchedulesFormBtn(event) {
    event.preventDefault();
    this.displaySchedulesForm();
  }
  
  #handleBookingFormBtn(event) {
    event.preventDefault();
    this.displayBookingForm();
  }

  #handleBookingsListBtn(event) {
    event.preventDefault();
    this.displayBookingsList();
  }
  
  #handleCancelBookingFormBtn(event) {
    event.preventDefault();
    this.displayCancelBookingForm();    
  }

  #handleDeleteScheduleFormBtn(event) {
    event.preventDefault();
    this.displayDeleteScheduleForm();    
  }

  // --- Form Button handlers ---
  async #handleStaffFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    let data = this.#stringifyData(this.#extractData(form));
    this.#sendStaffData(form, data);
  }

  #handleBookingFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    let formData = this.#extractData(form);
    let data = this.#stringifyData(formData);
    this.#sendBooking(form, data, formData.student_email);
  }

  #handleAddSchedulesBtn(event) {
    event.preventDefault();
    this.schedulesForm.addScheduleFieldset();
  }

  #handleScheduleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    let data = this.#formatSchedulesData(this.#extractData(form));
    this.#sendScheduleData(form, data);
  }

  #handleStudentFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    let data = this.#stringifyData(this.#extractData(form));
    this.#sendStudentData(form, data);
  }

  #handleBookingDateClick(event) {
    event.preventDefault();
    let target = event.target
    if (!target.classList.contains('booking-date')) return;
    this.#displyBookingsForDate(target);
  }

  #handleCancelBookingFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    this.clearUserMsg();
    this.clearErrorMsg();

    let data = this.#extractData(form);
    this.#cancelBooking(form, data.booking_id);
  }

  #handledeleteScheduleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;

    this.clearUserMsg();
    this.clearErrorMsg();

    let data = this.#extractData(form);
    this.#deleteSchedule(form, data.schedule_id);
  }

  // ---------- Helpers ----------
  #divToDisplay(displayDiv) {
    this.divs.forEach(div => {
      if (div === displayDiv) {
        div.classList.remove('hidden');
      } else {
        div.classList.add('hidden');
      }
    })
  }

  #extractData(formElement) {
    let formData = new FormData(formElement);
    let data = Object.fromEntries(formData.entries());
    for (let key in data) {data[key] = data[key].trim()};
    return data;
  }

  #stringifyData(data) {
    return JSON.stringify(data);
  }

  // --- Schedules ---
  #listSchedules() {
    if (this.app.schedules.length === 0) {
      this.userMsg("There are currently no schedules available for booking.")
    } else {
      this.schedulesList = new ScheduleList(this);
      this.$schedulesDiv.append(this.schedulesList.$ul);
    }
  }
  
  // --- Staff Form ---
  async #sendStaffData(form, data) {
    try {
      let response = await this.app.DBAPI.createNewStaff(form, data);

      switch (response.status) {
        case 400:
          let msg = await response.text();
          throw new Error(msg);
        case 201:
          let responseJson = await response.json();
          this.userMsg(`Successfully created staff with id: ${responseJson.id}`);
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.errorMsg(error.message);
    }
  }

  // --- Schedules Form ---
  #formatSchedulesData(data) {
    let schedulesObj = {};
    
    Object.keys(data).forEach(key => {
      let [field, num] = key.split('_');
      if (field === 'staff') {
        schedulesObj[key] = {};
        schedulesObj[key]['staff_id'] = data[key];
      } else {
        schedulesObj[`staff_${num}`][field] = data[key];
      }
    });

    let schedulesArr = Object.values(schedulesObj);
    return JSON.stringify({"schedules": schedulesArr});
  }  

  async #sendScheduleData(form, data) {
    try {
      let response = await this.app.DBAPI.addSchedules(form, data);
      let msg;
      switch (response.status) {
        case 400:
          msg = await response.text();
          throw new Error(msg);
          case 201:
          msg = await response.text();
          this.userMsg(msg);
          form.reset();
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.errorMsg(error.message);
    }
  }

  // --- Booking Form ---
  async #sendBooking(form, data, studentEmail) {
    try {
      let response = await this.app.DBAPI.addBooking(form, data);
      let msg = await response.text();
      
      switch (response.status) {
        case 404:
          throw new Error(msg);
        case 204:
          alert('Booked!');
          this.#resetBookingForm();
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.clearUserMsg();
      this.errorMsg(error.message);
      if (error.message.match('booking_sequence')) {
        let bookingSequence = error.message.split(':')[1].trim();
        this.#displayStudentForm(bookingSequence, studentEmail);
      }
    }
  }

  #displayStudentForm(bookingSequence, studentEmail) {
    this.studentForm = new StudentForm(this, bookingSequence, studentEmail);
    this.studentForm.$form.addEventListener('submit', this.#handleStudentFormSubmit.bind(this));
    this.$bookingFormDiv.append(this.studentForm.$form);
  }

  async #sendStudentData(form, data) {
    try {
      let response = await this.app.DBAPI.addStudent(form, data);
      let msg = await response.text();
      
      switch (response.status) {
        case 404:
          throw new Error(msg);
        case 201:
          this.userMsg(msg);
          alert('Booked!')
          this.studentForm.$form.remove();
          this.app.studentForm = null;
          this.#resetBookingForm();
          break;
        default:
          throw new Error(msg);
      }
    } catch(error) {
      console.log(error);
      this.errorMsg(error.message);
    }
  }

  #resetBookingForm() {
    this.bookingForm.$form.remove();
    this.$bookingFormDiv.innerHTML = '';
    this.bookingForm = null;
    this.app.schedules = null;
    this.displayBookingForm();
  }

  // --- Bookings ---
  #listBookingsDates() {
    if (this.app.bookingsDates.length === 0) {
      this.userMsg("There are currently no bookings.")
    } else {
      this.bookingsList = new BookingsList(this);
    }

    this.$bookingsListDiv.innerHTML = '';
    this.$bookingsListDiv.append(this.bookingsList.$ul);
    this.bookingsList.$ul.addEventListener('click', this.#handleBookingDateClick.bind(this));
  }

  async #displyBookingsForDate(target) {
    let date = target.textContent;
    await this.app.loadBookingsForDate(date);
    this.app.getBookingByDate(date).createBookingsHTML();
  }

  // --- Cancel Forms ---
  async #cancelBooking(form, booking_id) {
    console.log(booking_id)
    try {
      let response = await this.app.DBAPI.cancelBooking(form, booking_id);
      let msg = await response.text();
      
      switch (response.status) {
        case 204:
          this.userMsg(msg);
          alert('Booking Cancelled!')
          this.cancelBookingForm.$form.reset();
          break;
        default:
          throw new Error(msg);
      }
    } catch(error) {
      console.log(error);
      this.errorMsg(error.message);
    }
  }

  async #deleteSchedule(form, schedule_id) {
    try {
      let response = await this.app.DBAPI.deleteSchedule(form, schedule_id);
      let msg = await response.text();
      
      switch (response.status) {
        case 204:
          this.userMsg(msg);
          alert('Schedule deleted!')
          this.deleteScheduleForm.$form.reset();
          break;
        default:
          throw new Error(msg);
      }
    } catch(error) {
      console.log(error);
      this.errorMsg(error.message);
    }
  }
}
