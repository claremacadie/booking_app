import ValidationError from '../utils/validationError.js';
import HttpError from '../utils/httpError.js';
import debounce from '../utils/debounce.js';

export default class AppController {
  constructor(app) {
    this.app = app;
    this.#init();
    this.#bind();
  }

  #init() {
    
  } 

  #bind() {
    
  }

  // ---------- Public handlers ----------

  // ---------- Private handlers ----------
  
  // ---------- helpers ----------
  #extractData(formData) {
    let data = Object.fromEntries(formData.entries());

    for (let key in data) {
      data[key] = data[key].trim();
    }
    
    return data;
  }

  #formatDataToSend(data) {
    return JSON.stringify(data);
  }
}
