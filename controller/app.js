import DBAPI from '../services/DBAPI.js';
import AppController from './appController.js';
import ValidationError from '../utils/validationError.js';
import TimeoutError from '../utils/timeoutError.js';
import HttpError from '../utils/httpError.js';

// Import model classes
import Model from '../model/model.js';

// Import view classes
import ViewForm from '../view/viewForm.js';
import ViewList from '../view/viewList.js';

export default class App {
  constructor(url) {
    this.url = url;
    this.#init();
  }
  
  async #init() {
    this.$firstPageDiv = document.getElementById("first-page");
    this.$secondPageDiv = document.getElementById("second-page");
    this.$userMessage = document.getElementById("user-message");
    this.$errorMessage = document.getElementById("error-message");

    this.contactDBAPI = new DBAPI(this.url);
    this.appController = new AppController(this);

    try {
      // load data using this.DBAPI

      // create model and view instances
      this.model = new Model(this.url);
      this.viewForm = new ViewForm(this.url);
      this.viewList = new ViewList(this.url);
      
      this.#createHTML();
      this.#configureHTML();
      // this.#periodicDataFetch(); 
    } catch(error) {
        this.handleError(error, 'Could not load content.');
    } finally {
      this.clearUserMessage();
    }
  }
  
  // ---------- public API ----------
  displayUserMessage(msg) {
    this.$userMessage.textContent = msg;
  }

  displayErrorMessage(msg) {
    this.$errorMessage.textContent = msg;
  }

  clearUserMessage() {
    this.$userMessage.textContent = '';
  }
  
  clearErrorMessage() {
    this.$errorMessage.textContent = '';
  }

  handleError(error, msg='Something went wrong. Please try again.') {
    if (error instanceof ValidationError) {
      this.displayErrorMessage(error.message);
    } else if (error instanceof HttpError) {
      this.displayErrorMessage(`Request failed (${error.status}): ${error.message}`);
      return;
    } else if (error?.name === 'AbortError') {
      this.displayUserMessage('Request aborted.');
    } else if (err instanceof TimeoutError) {
      this.displayErrorMessage('Request timed out. Please try again.');
    } else {
      console.error(error);
      this.displayErrorMessage(msg);
    }
  }

  // -- Model --
  
  
  // -- ViewList --
 

  // -- ViewForm --
  

  // ---------- private API ----------

  #periodicDataFetch() {
    let ms = 60_000; 
    this.refreshing = false;
    this.intervalId = setInterval(async () => {
      if (this.refreshing) return;
      this.refreshing = true;
      try {
        // load data from DBAPI
      } finally {
        this.refreshing = false;
      }
    }, ms);
  }

  #createHTML() {
    // populate first-page and second-page divs
  }
  
  #configureHTML() {
    // add hidden class to pages you don't want to see
  }
}
