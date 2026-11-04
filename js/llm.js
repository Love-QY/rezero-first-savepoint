import { CONFIG } from "./config.js";

function withTimeout(ms) {
  const controller = new AbortController();
  const timer = setTimeout(function() { controller.abort(); }, ms);
  return { signal: controller.signal, clear: function() { clearTimeout(timer); } };
}

export async function listModels() {
  const t = withTimeout(2500);
  try {
    const res = await fetch(CONFIG.ollama.baseUrl + "/api/tags", { signal: t.signal });
    if (!res.ok) throw new Error("Ollama HTTP " + res.status);
    const data = await res.json();
    return (data.models || []).map(function(m) { return m.name; });
  } finally {
    t.clear();
  }
}

export async function isAvailable() {
  try {
    const models = await listModels();
    return models.length > 0;
  } catch (err) {
    return false;
  }
}

export async function chat(options) {
  const model = options.model || CONFIG.ollama.model;
  const messages = options.messages || [];
  const onToken = options.onToken || function() {};
  const signal = options.signal;
  const res = await fetch(CONFIG.ollama.baseUrl + "/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: signal,
    body: JSON.stringify({
      model: model,
      messages: messages,
      stream: true,
      options: {
        temperature: CONFIG.ollama.temperature,
        num_ctx: CONFIG.ollama.numCtx,
        num_predict: CONFIG.ollama.numPredict,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Ollama HTTP " + res.status + ": " + text.slice(0, 200));
  }
  if (!res.body) throw new Error("Ollama 没有返回流式 body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buffer += decoder.decode(chunk.value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (let i = 0; i < lines.length; i += 1) {
      const raw = lines[i].trim();
      if (!raw) continue;
      let data;
      try { data = JSON.parse(raw); } catch (err) { continue; }
      const piece = data.message && data.message.content ? data.message.content : "";
      if (piece) {
        full += piece;
        onToken(piece);
      }
      if (data.done) return full;
    }
  }
  return full;
}

export function ollamaSetupText() {
  return [
    "未检测到本地 Ollama。",
    "",
    "1. 安装 Ollama：https://ollama.com/download",
    "2. 拉取小模型：ollama pull qwen3:4b",
    "3. 允许浏览器跨域：设置环境变量 OLLAMA_ORIGINS=*，然后重启 ollama serve",
    "4. 本演示默认地址：http://127.0.0.1:11434",
    "",
    "当前机器 8GB 内存，建议 4B 模型；7B 会很慢。",
  ].join("\n");
}
