import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WeatherProvider } from "./context/WeatherContext.tsx";

createRoot(document.getElementById("root")!).render(
  <WeatherProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </WeatherProvider>
);
