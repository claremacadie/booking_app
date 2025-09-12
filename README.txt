Frontend Application
- Run front-end
  From the root of the project, run:
    python3 -m http.server 8080


- Open http://127.0.0.1:8080 in your browser.
  ⚠️ Don’t open index.html via Finder — ES modules won’t load with file://.


- Backend
  App expects a backend at: localhost:3000, files are in booking_node
  CORS has been enabled for booking_node

  Make sure your server is running and reachable at that URL, 
  probably by going to a node folder and running npm install, then npm start.

- Notes
  Turn Live Server off in VS Code (status bar should show Go Live).
  If you see a CORS error, allow origin http://127.0.0.1:8080 on your backend.