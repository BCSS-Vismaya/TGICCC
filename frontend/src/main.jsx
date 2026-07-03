import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";


import "./styles/theme.css";
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/navbar.css";
import "./styles/dashboard.css";
import "./styles/cards.css";
import "./styles/tables.css";
import "leaflet/dist/leaflet.css";
import "./styles/frs.css";
import "./styles/anomalies.css";
import "./styles/assistant.css";
import "./styles/status.css";
import "./styles/notifications.css";
import "./styles/settings.css";
import "./styles/login.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);