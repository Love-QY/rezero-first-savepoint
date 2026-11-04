import { GameEngine } from "./engine.js";
import { UI } from "./ui.js";

let ui;
const engine = new GameEngine({
  render: function(payload) {
    if (ui) ui.render(payload);
  },
  ending: function(ending, state) {
    if (ui) ui.showEnding(ending, state);
  },
});

try {
  ui = new UI(engine);
  window.__demo = { engine: engine, ui: ui };
  window.__startDemo = function() { ui.startNew(); };
  if (window.__pendingStart) {
    window.__pendingStart = false;
    ui.startNew();
  }
} catch (err) {
  if (window.__showBootError) window.__showBootError(err && err.stack ? err.stack : String(err));
  throw err;
}

const params = new URLSearchParams(window.location.search);
if (params.get("play") === "1") {
  ui.startNew();
}
if (params.get("dev") === "1") {
  setTimeout(function() { ui.toggleDev(); }, 300);
}