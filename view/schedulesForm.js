export default class SchedulesForm {
  constructor(appController) {
    this.appController = appController;
    this.app = appController.app;
    this.#init();
  }

  async #init() {
    this.$form = document.createElement('form');
    this.$addSchedulesBtn = document.createElement('button');
    this.$schedulesDiv = document.createElement('div');
    this.$submitBtn = document.createElement('button');

    await this.app.fetchStaff();
    if (!this.app.staff) {
      this.appController.userMsg("Staff did not load, please refresh the page.")
      return;
    }
    this.scheduleNum = 0;

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- public API ----------
  addScheduleFieldset() {
    this.#createScheduleFieldset();
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
    this.appController.$schedulesFormDiv.append(this.$form);
  }

  // ---------- helpers ----------
  #createScheduleFieldset() {
    this.scheduleNum += 1;
    let id = this.scheduleNum;

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

    let options = this.#createStaffOptions();
    options.forEach(option => staffSelect.append(option));

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
    let staffOptions = [];
    Object.keys(this.app.staff).forEach(id => {
      let option = this.#createOption(id, this.app.staff[id].name);
      staffOptions.push(option);
    });
    return staffOptions;
  }

  #createOption(staffId, staffName) {
    let option = document.createElement('option');
    option.value = staffId;
    option.textContent = staffName;
    return option;
  }
}
