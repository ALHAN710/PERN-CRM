import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StyledEngineProvider } from "@mui/material";
import "./index.css";
import { ContextProvider } from "./context/ContextAPI";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* Using to inject Mui style file first to using it with tailwindcss */}
    <StyledEngineProvider injectFirst>
      <ContextProvider>
        <App />
      </ContextProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
