import App from './controller/app.js';

function main() {
  let url = "http://localhost:3000/api"; // may need changing
  let app = new App(url);
}

document.addEventListener("DOMContentLoaded", main);
