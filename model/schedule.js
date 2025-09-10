export default class Schedule {
  constructor(obj) {
    this.id = obj.id;
    this.staffId = obj.staff_id;
    this.date = obj.date;
    this.time = obj.time;
    this.studentEmail = obj.student_email;

    this.#init();
  }

  #init() {
    this.$li = document.createElement('li');
    this.#createHTML();
  }

  // ---------- public API ----------
  matchId(id) {
    return this.id === id;
  }

  // ---------- private API ----------
  #createHTML() {
    let idDt = document.createElement('dt');
    let idDd = document.createElement('dd');
    let staffIdDt = document.createElement('dt');
    let staffIdDd = document.createElement('dd');
    let dateDt = document.createElement('dt');
    let dateDd = document.createElement('dd');
    let timeDt = document.createElement('dt');
    let timeDd = document.createElement('dd');
    let studentEmailDt = document.createElement('dt');
    let studentEmailDd = document.createElement('dd');

    idDt.textContent = 'Schedule id';
    idDd.textContent = this.id;
    staffIdDt.textContent = 'Staff id';
    staffIdDd.textContent = this.staffId;
    dateDt.textContent = 'Date';
    dateDd.textContent = this.date;
    timeDt.textContent = 'Time';
    timeDd.textContent = this.time;
    studentEmailDt.textContent = 'Student Email';
    studentEmailDd.textContent = this.studentEmail;

    this.$li.append(
      idDt, idDd, 
      staffIdDt, staffIdDd, 
      dateDt, dateDd, 
      timeDt, timeDd, 
      studentEmailDt, studentEmailDd
    )
  }
}
