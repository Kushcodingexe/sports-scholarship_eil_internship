import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Import and run the backend connection test
import testBackendConnection from './test-backend-connection.js';
// Add the StatusHistoryDashboard to the imports
import StatusHistoryDashboard from './pages/StatusHistoryDashboard';

// Run backend connection test
testBackendConnection().catch(err => console.error('Connection test error:', err));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
