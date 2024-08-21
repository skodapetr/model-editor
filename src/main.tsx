import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./application/application";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Application />
  </StrictMode>,
);
