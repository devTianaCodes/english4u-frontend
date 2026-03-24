import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";
import { AuthProvider } from "./features/auth/AuthProvider.jsx";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
