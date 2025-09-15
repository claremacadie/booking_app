export default class BookingForm {
  constructor(appController) {
    this.appController = appController;
    this.app = appController.app;
    this.#init();
  }

  async #init() {
    this.$bookingForm = document.createElement('form');
    this.$submitButton = document.createElement('button');
    
    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    let dl = document.createElement('dl');
    this.#createDlListItem(dl, 'email', 'email');
    this.#createScheduleSelect(dl);

    this.$bookingForm.append(dl, this.$submitButton);
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$bookingForm.action = this.app.url + '/bookings';
    this.$bookingForm.method = 'POST';

    this.$bookingForm.classList.add ('form');
    this.appController.$bookingFormDiv.append(this.$bookingForm);
  }

  // ---------- helpers ----------
  #createDlListItem(dl, field, inputType) {
    let dt = document.createElement('dt');
    let label = document.createElement('label');
    label.setAttribute('for', field);
    label.textContent = field[0].toUpperCase() + field.slice(1);
    dt.append(label);

    let dd = document.createElement('dd');
    let input = document.createElement('input');
    input.setAttribute('type', inputType);
    input.setAttribute('id', field);
    input.setAttribute('name', field);
    dd.append(input);

    dl.append(dt, dd);
  }

  #createScheduleSelect(dl) {
    let dt = document.createElement('dt');
    let label = document.createElement('label');
    label.setAttribute('for', 'schedule');
    label.textContent = 'Please select one schedule:';
    dt.append(label);

    let dd = document.createElement('dd');
    let select = document.createElement('select');
    select.setAttribute('id', 'schedule');
    select.setAttribute('name', 'schedule');
    let options = this.#createScheduleOptions();
    options.forEach(option => select.append(option));
    dd.append(select);

    dl.append(dt, dd);
  }

  #createScheduleOptions() {
    let scheduleOptions = [];
    this.app.schedules.forEach(schedule => {
      if (!schedule.studentEmail) return;
      let staffName = this.app.getStaffNameById(schedule.staffId);
      let scheduleDescriptionArr = [staffName, schedule.date, schedule.time]
      let option = this.#createOption(schedule.id, scheduleDescriptionArr.join(' | '));
      scheduleOptions.push(option);
    });
    return scheduleOptions;
  }

  #createOption(scheduleId, scheduleDescription) {
    let option = document.createElement('option');
    option.value = scheduleId;
    option.textContent = scheduleDescription;
    return option;
  }
}
