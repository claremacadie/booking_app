export default class SchedulesForm {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  async #init() {
    this.$form = document.createElement('form');
    this.$addSchedulesBtn = document.createElement('button');
    this.$schedulesDiv = document.createElement('div');
    this.$submitBtn = document.createElement('button');

    await this.app.fetchStaff();
    this.#createStaffOptions();
    this.scheduleNum = 0;

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    this.#createScheduleFieldset();
    this.$form.append(this.$addSchedulesBtn, this.$schedulesDiv, this.$submitBtn);
  }

  #configureHTML() {
    this.$addSchedulesBtn.textContent = 'Add more schedules';
    this.$addSchedulesBtn.type = 'submit';
    this.$addSchedulesBtn.id = 'btnSubmit';

    this.$submitBtn.textContent = 'Submit';
    this.$submitBtn.type = 'submit';
    this.$submitBtn.id = 'btnSubmit';

    this.$form.action = this.app.url + '/schedules';
    this.$form.method = 'POST';

    this.$form.classList.add('form');
    this.app.$schedulesFormDiv.append(this.$form);
  }

  // ---------- helpers ----------
  #createScheduleFieldset() {
    this.scheduleNum += 1;
    let id = this.scheduleNum;
    console.log(id)

    let fieldset = document.createElement('fieldset');
    let legend = document.createElement('legend');
    legend.textContent = `Schedule ${id}`;

    let staffDiv = this.#createStaffDiv(id);
    let dateDiv = this.#createDateDiv(id);
    let timeDiv = this.#createTimeDiv(id);

    fieldset.append(legend, staffDiv, dateDiv, timeDiv);
    this.$schedulesDiv.append(fieldset);
  }

  #createStaffDiv(id) {
    let staffDiv = document.createElement('div');

    let staffLabel = document.createElement('label');
    staffLabel.setAttribute('for', `staff_${id}`);
    staffLabel.textContent = 'Staff Name:';

    let staffSelect = document.createElement('select');
    staffSelect.setAttribute('id', `staff_${id}`);
    staffSelect.setAttribute('name', `staff_${id}`);
    this.staffOptions.forEach(option => staffSelect.append(option));

    staffDiv.append(staffLabel, staffSelect);
    return staffDiv;
  }

  #createDateDiv(id) {
    let dateDiv = document.createElement('div');

    let dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', `date_${id}`);
    dateLabel.textContent = 'Date:';

    let dateInput = document.createElement('input');
    dateInput.setAttribute('id', `date_${id}`);
    dateInput.setAttribute('name', `date_${id}`);
    dateInput.setAttribute('type', 'text');
    dateInput.setAttribute('placeholder', 'mm-dd-yy');

    dateDiv.append(dateLabel, dateInput);
    return dateDiv;
  }

  #createTimeDiv(id) {
    let timeDiv = document.createElement('div');

    let timeLabel = document.createElement('label');
    timeLabel.setAttribute('for', `time_${id}`);
    timeLabel.textContent = 'Time:';

    let timeInput = document.createElement('input');
    timeInput.setAttribute('id', `time_${id}`);
    timeInput.setAttribute('name', `time_${id}`);
    timeInput.setAttribute('type', 'text');
    timeInput.setAttribute('placeholder', 'hh:mm');

    timeDiv.append(timeLabel, timeInput);
    return timeDiv;
  }

  #createStaffOptions() {
    this.staffOptions = [];
    Object.keys(this.app.staff).forEach(id => {
      let option = this.#createOption(id, this.app.staff[id].name);
      this.staffOptions.push(option);
    });
  }

  #createOption(staffId, staffName) {
    let option = document.createElement('option');
    option.value = staffId;
    option.textContent = staffName;
    return option;
  }

  #getStaffNameById(id) {
    return this.app.staff[id].name;
  }
}

/*
Behaviour:
  - Screen initialises with a single "Schedule 1" form
  - When more schedules are added, Schedule 2 form, etc.
  - Only one submit button

  - Submitting with empty fields, if any fields in any form are empty: 
    - Please check your inputs, with an alert
  - Success: 
    - Schedules added, with an alert
    - Existing forms reset, no forms deleted

To do:
  Listener for addMoreSchedules: (appController)
    Add new fieldset to schedulesForm (SchedulesForm)

  Listener for submit schedules: (appController)
    Extract data
    Validate for empty fields "Please check your inputs, with an alert"
    Format data
    Send data  "Schedules added" 
      - POST, /schedules
      - {
          "schedules": [
              {
                  "staff_id": 1,
                  "date": "10-10-10",
                  "time": "12:12"
              }
          ]
        }

    Reset individual schedules forms, do not delete any

    Every time the Add schedules button is clicked:
      - reload staff and staffOptions

    When adding schedule fieldsets, use same staffOptions (even if db updated with new staff)
*/