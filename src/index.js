// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

// Render your app
root.render(<App />);

// Register the service worker for offline & installability
serviceWorkerRegistration.register();

// (Optional) measure performance in your app
// Pass a function to log results (for example: reportWebVitals(console.log))
reportWebVitals();
