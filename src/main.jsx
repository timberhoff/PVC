import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router> {/* ✅ The only <Router> should be here */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>
);
