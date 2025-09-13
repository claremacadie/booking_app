export default class SchedulesForm {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  #init() {
    this.$form = document.createElement('form');
    this.$submitButton = document.createElement('button');

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    let dl = document.createElement('dl');
    this.#createDlListItem(dl, 'email', 'email');
    this.#createDlListItem(dl, 'name', 'text');

    this.$form.append(dl, this.$submitButton);
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$form.action = this.app.url + '/staff_members';
    this.$form.method = 'POST';

    this.$form.classList.add ('form');
    this.app.$schedulesFormDiv.append(this.$form);
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
  Fetch list of staff with ids (app)

  Create main form: (SchedulesForm)
    <button id="btnAdd">Add more schedules</button>
    <form method="post" action="/api/schedules">
      <div id="schedules"></div>
      <input id="btnSubmit" type="submit">
    </form>

  Create schedule form: (SchedulesForm)
    <fieldset id="schedule_1">
      <legend>Schedule 1</legend>

      <div>
        <label for="staff_1">Staff Name:</label>
        <select id="staff_1" name="staff_1"><option value="1">Fae Kassulke V</option><option value="2">Aaron Nitzsche</option><option value="3">Gia Rice</option><option value="4">Esperanza Doyle</option><option value="5">Lacey Kautzer I</option></select>
      </div>

      <div>
        <label for="date_1">Date:</label>
        <input type="text" id="date_1" name="date_1" placeholder="mm-dd-yy">
      </div>

      <div>
        <label for="time_1">Time:</label>
        <input type="text" id="time_1" name="time_1" placeholder="hh:mm">
      </div>

    </fieldset>

  Listener for addMoreSchedules: (appController)
    Add new fieldset to schedulesForm (SchedulesForm)

  Listener for submit schedules: (appController)
    Extract data
    Validate for empty fields "Please check your inputs, with an alert"
    Format data
    Send data  "Schedules added"
    Reset individual schedules forms, do not delete any
*/