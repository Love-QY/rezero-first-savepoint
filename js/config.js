export const CONFIG = {
  title: "Re:0 — 起始的存档点",
  version: "0.1.0-demo",
  saveKey: "rezero-demo-save-v1",
  settingsKey: "rezero-demo-settings-v1",
  textSpeed: 26,
  autoDelay: 1450,
  ollama: {
    baseUrl: "http://127.0.0.1:11434",
    model: "qwen3:4b",
    numCtx: 4096,
    numPredict: 180,
    temperature: 0.85,
  },
};
