import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SuprematismScene } from "./screens/SuprematismScene";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <SuprematismScene />
  </StrictMode>,
);
