import ScheduleList from '../view/scheduleList.js';

export default class AppController {
  constructor(app) {
    this.app = app;
    this.#init();
    this.#bind();
  }

  #init() {
    this.$staffForm = this.app.staffForm.$form;
    // Set default view
    this.#displayBookingForm();
  } 

  #bind() {
    this.$staffForm.addEventListener('submit', this.#handleStaffFormSubmit.bind(this));
    this.app.$schedulesBtn.addEventListener('click', this.#handleSchedulesBtn.bind(this));
    this.app.$staffFormBtn.addEventListener('click', this.#handleStaffFormBtn.bind(this));
    this.app.$schedulesFormBtn.addEventListener('click', this.#handleSchedulesFormBtn.bind(this));
    this.app.$bookingFormBtn.addEventListener('click', this.#handleBookingFormBtn.bind(this));
    this.app.schedulesForm.$addSchedulesBtn.addEventListener('click', this.#handleAddSchedulesBtn.bind(this))
    this.app.schedulesForm.$form.addEventListener('submit', this.#handleScheduleFormSubmit.bind(this))
  }

  // ---------- Private API ----------
  async #displaySchedules() {
    this.app.$schedulesDiv.innerHTML = '';
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    
    this.app.$pageHeading.textContent = "Schedule List";
    this.app.$schedulesDiv.classList.remove('hidden');
    this.app.$staffFormDiv.classList.add('hidden');
    this.app.$schedulesFormDiv.classList.add('hidden');
    this.app.$bookingFormDiv.classList.add('hidden');
    
    this.app.userMsg('Loading schedules...');
    await this.app.loadSchedules();
    
    if (this.app.schedules) this.#listSchedules();
  }
  
  #displayStaffForm() {
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    this.app.$pageHeading.textContent = "Add Staff";
    this.app.$schedulesDiv.classList.add('hidden');
    this.app.$staffFormDiv.classList.remove('hidden');
    this.app.$schedulesFormDiv.classList.add('hidden');
    this.app.$bookingFormDiv.classList.add('hidden');
  }
  
  #displaySchedulesForm() {
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    this.app.$pageHeading.textContent = "Add Schedules";
    this.app.$schedulesDiv.classList.add('hidden');
    this.app.$staffFormDiv.classList.add('hidden');
    this.app.$schedulesFormDiv.classList.remove('hidden');
    this.app.$bookingFormDiv.classList.add('hidden');
    this.app.fetchStaff();
  }
  
  
  async #displayBookingForm() {
    console.log('hi');
    this.app.clearUserMsg();
    this.app.clearErrorMsg();
    
    this.app.$pageHeading.textContent = "Book a Schedule";
    this.app.$schedulesDiv.classList.remove('hidden');
    this.app.$staffFormDiv.classList.add('hidden');
    this.app.$schedulesFormDiv.classList.add('hidden');
    this.app.$bookingFormDiv.classList.remove('hidden');
    
    this.app.userMsg('Loading schedules...');
    await this.app.loadSchedules();
  }

  // ---------- Private handlers ----------
  #handleSchedulesBtn(event) {
    event.preventDefault();
    this.#displaySchedules();
  }
  
  #handleStaffFormBtn(event) {
    event.preventDefault();
    this.#displayStaffForm();
  }
  
  #handleSchedulesFormBtn(event) {
    event.preventDefault();
    this.#displaySchedulesForm();
  }
  
  #handleBookingFormBtn(event) {
    event.preventDefault();
    this.#displayBookingForm();
  }

  async #handleStaffFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    this.app.clearUserMsg();
    this.app.clearErrorMsg();

    let data = this.#formatData(this.#extractData(form));
    this.#sendStaffData(form, data);
  }

  #handleAddSchedulesBtn(event) {
    event.preventDefault();
    this.app.schedulesForm.addScheduleFieldset();
  }

  #handleScheduleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    this.app.clearUserMsg();
    this.app.clearErrorMsg();

    let data = this.#formatSchedulesData(this.#extractData(form));
    this.#sendScheduleData(form, data);
  }

  // ---------- helpers ----------
  // --- Schedules ---
  #listSchedules() {
    if (this.app.schedules.length === 0) {
      this.app.userMsg("There are currently no schedules available for booking.")
    } else {
      new ScheduleList(this.app);
    }
  }
  
  // --- Staff Form ---
  #extractData(formElement) {
    let formData = new FormData(formElement);
    let data = Object.fromEntries(formData.entries());
    for (let key in data) {data[key] = data[key].trim()};
    return data;
  }

  #formatData(data) {
    return JSON.stringify(data);
  }

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

  async #sendStaffData(form, data) {
    try {
      let response = await this.app.DBAPI.createNewStaff(form, data);

      switch (response.status) {
        case 400:
          throw new Error('Staff cannot be created. Check your inputs.');
        case 201:
          let responseJson = await response.json();
          this.app.userMsg(`Successfully created staff with id: ${responseJson.id}`);
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.app.errorMsg(error.message);
    }
  }

  async #sendScheduleData(form, data) {
    try {
      let response = await this.app.DBAPI.addSchedules(form, data);

      switch (response.status) {
        case 400:
          throw new Error('Please check your inputs.');
        case 201:
          this.app.userMsg('Schedules added.');
          form.reset();
          break;
        default:
          throw new Error('Something went wrong.')
      }
    } catch(error) {
      this.app.errorMsg(error.message);
    }
  }
}

/*
Behaviour:
  When student doesn't exist, Student does not exist; booking sequence: 987845
  Bring up student details form, Successfully added student to the database. Booked.

To do: 
  Used existing schedule data if request for new data times out

  Event listener & handler for submitBooking
    extract, send (/bookings, (schedule) id and student_email), handle error messages
    To get from response:
      - Success Booked
      - Failure:
        - Student does not exist; booking sequence: 987845
        - Schedule is either booked or does not exist

  Event listener & handler for student signup
    extract, send (/students, email, name, booking_sequence), handle error messages
    To get from response:
      - Success Successfully added student to the database. Booked.
      - Must have a booking sequence.
      - Please check your inputs.


Nice to have:
  Remove hard-coded error messages that should be coming back from the database
  
  If click on navigation button, cancel any pending requests, otherwise you get messages about a different page.
*/