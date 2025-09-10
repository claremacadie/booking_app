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
    // this.viewForm = this.app.viewForm;
    // this.$form = this.viewForm.$form;
    // this.$updateButton = this.viewForm.$updateButton;
    // this.$cancelButton = this.viewForm.$cancelButton;

    // this.viewList = this.app.viewList;
    // this.$addButton = this.viewList.$addButton;
    // this.$searchInput = this.viewList.$searchInput;
    // this.$viewListDiv = this.viewList.$listDiv;

    // this.DBAPI = this.app.DBAPI;

    // this.handleSearch = debounce(this.handleSearch.bind(this));
    // this.handleTagSelect = debounce(this.handleTagSelect.bind(this));
  } 

  #bind() {
    // this.$form.addEventListener('submit', this.#handleFormSubmit.bind(this));
    // this.$cancelButton.addEventListener('click', this.#handleCancelButton.bind(this));
    // this.$updateButton.addEventListener('click', this.#handleUpdate.bind(this));

    // this.$addButton.addEventListener('click', this.#handleAdd.bind(this));
    // this.$searchInput.addEventListener('input', this.handleSearch);

    // this.$viewListDiv.addEventListener('click', this.#handleviewListClick.bind(this));
  }

  // ---------- Public handlers ----------
  handleSearch(event) {
    event.preventDefault();
    this.viewList.updateSearchTextCriteria();
    this.viewList.reloadList();
  }

  // ---------- Private handlers ----------
  // -- viewList --
  #handleviewListClick(event) {
    let target = event.target;

    if (target.nodeName === 'BUTTON') {
      event.preventDefault();
      let dataId = target.dataset.id;
      if (target.classList.contains('edit')) this.app.displayEditForm(dataId);
      if (target.classList.contains('delete')) this.#deleteData(dataId);
    }
  }

  #handleAdd(event) {
    event.preventDefault();
    this.app.displayForm();
  }
  
  // -- ContactForm --
  async #handleFormSubmit(event) {
    event.preventDefault();

    try {
      this.app.displayUserMessage("Validating inputs...");
      let data = this.#extractData(new FormData(this.$form));
      this.#validateInputs(data);  
      this.app.displayUserMessage("Adding...");
      let dataToSend = this.#formatDataToSend(data);
      let response = await this.DBAPI.postData(dataToSend);
      this.viewForm.$form.reset();
      this.app.displayUserMessage(`New data added: ${response}`);
      await this.app.resetViewListDisplay();
    } catch(error) {
      this.app.handleError(error);
    } finally {
      this.app.clearUserMessage();
    }
  }

  async #handleUpdate(event) {
    event.preventDefault();
    let target = event.target;
    let dataId = target.dataset.id;
    let data = this.#extractData(new FormData(this.$form));
    try {
      this.app.displayUserMessage("Validating inputs...");
      this.#validateInputs(data);  
      this.app.displayUserMessage("Updating...");
      let dataToSend = this.#formatDataToSend(data);
      let response = await this.DBAPI.updateData(dataToSend, dataId);
      this.viewForm.$form.reset();
      this.app.displayUserMessage(`Updated: ${response.full_name}`);
      await this.app.resetViewListDisplay();
    } catch(error) {
      this.app.handleError(error);
    } finally {
      this.app.clearUserMessage();
    }
  }
  
  async #handleCancelButton(event) {
    event.preventDefault();
    this.viewForm.$form.reset();
    await this.app.resetViewListDisplay();
  }

  // ---------- helpers ----------
  // -- ViewList --
  async #deleteData(id) {
    if (!confirm(`Are you sure you want to delete: ${contactFullName}`)) return;
    try {
      this.app.displayUserMessage("Deleting...");
      await this.DBAPI.deleteContact(id);
      this.app.displayUserMessage(`${id} has been deleted.`);
      await this.app.resetViewListDisplay();
    } catch(error) {
      if (error instanceof HttpError) {
        this.app.displayErrorMessage(`Delete failed for id = ${id} (${error.status}): ${error.message}`);
      } else {
        console.error(error);
        this.app.handleError(error, `Delete failed for id = ${id}.`);
      }
    } finally {
      this.app.clearUserMessage();
    }
  }

  // -- ViewForm --
  #extractData(formData) {
    let data = Object.fromEntries(formData.entries());

    for (let key in data) {
      data[key] = data[key].trim();
    }
    
    return data;
  }

  #validateInputs(data) {
    let invalidEntries = [];

    // const nameRgx = /^(?=.{2,50}$)[A-Za-z][A-Za-z .'-]*[A-Za-z]$/;
    // const emailRgx = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;
    // const phoneRgx = /^(?=(?:.*\d){7,15}$)[+()\-.\s\d]+$/;
    // const tagRgx = /^[A-Za-z]+$/;

    // if (!data.full_name.match(nameRgx)) invalidEntries.push('Full name');
    // if (data.email && !data.email.match(emailRgx)) invalidEntries.push('Email');
    // if (data.phone_number && !data.phone_number.match(phoneRgx)) invalidEntries.push('Telephone number');
    // if (data.tags.length !== 0 && !data.tags.every(tag => tag.match(tagRgx))) invalidEntries.push('Tag names');

    if (invalidEntries.length !== 0) {
      throw new ValidationError(`These fields have invalid values: ${invalidEntries.join(', ')}`, invalidEntries);
    }
  }

  #formatDataToSend(data) {
    return JSON.stringify(data);
  }
}
