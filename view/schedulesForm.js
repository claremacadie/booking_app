export default class SchedulesForm {
  constructor(app) {
    this.app = app;
    this.#init();
  }

  async #init() {
    this.$form = document.createElement('form');
    this.$submitButton = document.createElement('button');

    await this.app.fetchStaff();

    this.#createHTML();
    this.#configureHTML();
  }

  // ---------- private API ----------
  #createHTML() {
    

    this.$form.append();
  }

  #configureHTML() {
    this.$submitButton.textContent = 'Submit';
    this.$submitButton.type = 'submit';

    this.$form.action = this.app.url + '/schedules';
    this.$form.method = 'POST';

    this.$form.classList.add('form');
    this.app.$schedulesFormDiv.append(this.$form);
  }

  // ---------- helpers ----------
  #createScheduleForm(id) {
    
  }

  #getStaffNameById(id) {
    return this.app.staff[1].name;
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
  instance attribute of schedule number, resets everytime form is renewed

  Create main form: (SchedulesForm)
    <button id="btnAdd">Add more schedules</button>
    <form method="post" action="/api/schedules">
      <div id="schedules"></div>
      <button id="btnSubmit" type="submit">Submit</button>
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
*/