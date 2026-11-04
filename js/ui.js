import { CONFIG } from "./config.js";
import { CHARACTERS, getCharacter } from "./characters.js";
import { portraitSvg } from "./portraits.js";
import { isAvailable, listModels, chat, ollamaSetupText } from "./llm.js";
import { STORY } from "./engine.js";
import { ART, hasBackground, hasPortrait } from "./art.js";

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export class UI {
  constructor(engine) {
    this.engine = engine;
    this.typing = false;
    this.typeTimer = null;
    this.autoTimer = null;
    this.skipTimer = null;
    this.fullText = "";
    this.charIndex = 0;
    this.auto = false;
    this.skip = false;
    this.currentCastKey = "";
    this.lastLineKey = "";
    this.backlog = [];
    this.settings = this.loadSettings();
    this.chatBusy = false;
    this.chatHistory = [];
    this.bind();
    this.applyTitleArt();
  }

  applyTitleArt() {
    const path = ART.cg ? ART.cg.title : "";
    if (!path) return;
    const bg = document.querySelector(".title-bg");
    if (!bg) return;
    const img = document.createElement("img");
    img.onload = function() {
      bg.classList.add("has-image");
      bg.style.backgroundImage = "linear-gradient(90deg, rgba(8,7,13,0.92) 0%, rgba(8,7,13,0.55) 44%, rgba(8,7,13,0.25) 100%), url(\"" + path + "\")";
      bg.style.backgroundSize = "cover";
      bg.style.backgroundPosition = "center";
    };
    img.onerror = function() {};
    img.src = path;
  }

  $(id) { return document.getElementById(id); }

  bind() {
    const self = this;
    this.$("btn-start").addEventListener("click", function() {
      if (self.$("title").classList.contains("hidden")) return;
      self.startNew();
    });
    this.$("btn-continue").addEventListener("click", function() { self.continueGame(); });
    this.$("btn-about").addEventListener("click", function() { self.openAbout(); });

    this.$("dialogue").addEventListener("click", function() { self.onAdvanceInput(); });
    this.$("stage").addEventListener("click", function(event) {
      if (event.target.closest && event.target.closest("#dialogue")) return;
      if (event.target.closest && event.target.closest(".choices")) return;
      if (event.target.closest && event.target.closest(".ending")) return;
      self.onAdvanceInput();
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === " " || event.key === "Enter") {
        if (!self.$("modal").classList.contains("hidden")) return;
        if (!self.$("title").classList.contains("hidden")) {
          event.preventDefault();
          self.startNew();
          return;
        }
        if (!self.$("game").classList.contains("hidden")) {
          event.preventDefault();
          self.onAdvanceInput();
        }
      }
      if (event.key === "d" || event.key === "D") {
        if (!self.$("game").classList.contains("hidden")) self.toggleDev();
      }
      if (event.key === "Escape") {
        self.closeModal();
        self.$("dev-panel").classList.add("hidden");
      }
    });

    this.$("btn-auto").addEventListener("click", function() { self.toggleAuto(); });
    this.$("btn-skip").addEventListener("click", function() { self.toggleSkip(); });
    this.$("btn-log").addEventListener("click", function() { self.openLog(); });
    this.$("btn-save").addEventListener("click", function() { self.saveGame(); });
    this.$("btn-load").addEventListener("click", function() { self.continueGame(); });
    this.$("btn-settings").addEventListener("click", function() { self.openSettings(); });
    this.$("btn-menu").addEventListener("click", function() { self.showTitle(); });
    this.$("btn-dev").addEventListener("click", function() { self.toggleDev(); });
    this.$("btn-dev-close").addEventListener("click", function() { self.$("dev-panel").classList.add("hidden"); });
    this.$("btn-ai").addEventListener("click", function() { self.openAI(); });
    this.$("modal-close").addEventListener("click", function() { self.closeModal(); });
    this.$("modal").addEventListener("click", function(event) {
      if (event.target === self.$("modal")) self.closeModal();
    });

    const tabs = this.$("dev-panel").querySelectorAll(".dev-tab");
    tabs.forEach(function(tab) {
      tab.addEventListener("click", function() {
        tabs.forEach(function(t) { t.classList.remove("active"); });
        tab.classList.add("active");
        self.renderDev(tab.getAttribute("data-tab"));
      });
    });

    const hasSave = !!localStorage.getItem(CONFIG.saveKey);
    this.$("btn-continue").disabled = !hasSave;
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem(CONFIG.settingsKey);
      if (raw) return Object.assign({ speed: CONFIG.textSpeed, autoDelay: CONFIG.autoDelay }, JSON.parse(raw));
    } catch (err) {}
    return { speed: CONFIG.textSpeed, autoDelay: CONFIG.autoDelay };
  }

  saveSettings() {
    localStorage.setItem(CONFIG.settingsKey, JSON.stringify(this.settings));
  }

  showTitle() {
    this.clearTimers();
    this.applyTitleArt();
    this.$("game").classList.add("hidden");
    this.$("title").classList.remove("hidden");
    this.$("btn-continue").disabled = !localStorage.getItem(CONFIG.saveKey);
  }

  startNew() {
    this.clearTimers();
    this.backlog = [];
    this.lastLineKey = "";
    this.$("title").classList.add("hidden");
    this.$("game").classList.remove("hidden");
    this.$("ending").classList.add("hidden");
    this.engine.newGame();
  }

  continueGame() {
    const raw = localStorage.getItem(CONFIG.saveKey);
    if (!raw) {
      this.toast("没有可读取的存档");
      return;
    }
    try {
      const payload = JSON.parse(raw);
      this.clearTimers();
      this.backlog = [];
      this.lastLineKey = "";
      this.$("title").classList.add("hidden");
      this.$("game").classList.remove("hidden");
      this.$("ending").classList.add("hidden");
      if (!this.engine.load(payload)) this.toast("存档版本不兼容");
    } catch (err) {
      this.toast("存档损坏");
    }
  }

  clearTimers() {
    if (this.typeTimer) { clearInterval(this.typeTimer); this.typeTimer = null; }
    if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; }
    if (this.skipTimer) { clearTimeout(this.skipTimer); this.skipTimer = null; }
    this.typing = false;
  }

  onAdvanceInput() {
    if (this.typing) {
      this.finishTyping();
      return;
    }
    if (!this.$("choices").classList.contains("hidden")) return;
    this.engine.advance();
  }

  render(payload) {
    const node = payload.node;
    if (!node) return;
    this.current = payload;
    this.$("chapter-label").textContent = node.chapter || "";
    this.$("loop-label").textContent = "第 " + (this.engine.state.deathCount + 1) + " 周目";
    const cp = this.engine.state.checkpoint;
    this.$("checkpoint-label").textContent = cp && cp.fixed ? "存档点：" + cp.label : "存档点：未固定";
    this.$("scene-caption").textContent = node.caption || "";
    this.setBackground(node.bg);
    this.setCG(node);
    this.renderPortraits(node.cast || [], payload.line ? payload.line.speaker : "");

    this.$("choices").classList.add("hidden");
    this.$("choices").innerHTML = "";
    this.$("ending").classList.add("hidden");
    this.$("dialogue").classList.remove("hidden");

    if (!payload.line) {
      this.$("speaker").textContent = "";
      this.$("text").textContent = "";
      return;
    }
    this.renderLine(payload.line);
    if (payload.atEnd && payload.choices && payload.choices.length) {
      this.renderChoices(payload.choices);
    }
    this.autoSave();
  }

  setBackground(name) {
    const bg = this.$("bg");
    bg.className = "bg bg-" + (name || "black");
    if (hasBackground(name)) {
      const path = ART.backgrounds[name];
      bg.dataset.bg = name;
      const img = document.createElement("img");
      img.onload = function() {
        if (bg.dataset.bg !== name) return;
        bg.classList.add("has-image");
        bg.style.backgroundImage = "url(\"" + path + "\")";
        bg.style.backgroundSize = "cover";
        bg.style.backgroundPosition = "center";
      };
      img.onerror = function() {
        if (bg.dataset.bg !== name) return;
        bg.classList.remove("has-image");
        bg.style.backgroundImage = "";
      };
      img.src = path;
    } else {
      bg.dataset.bg = name;
      bg.classList.remove("has-image");
      bg.style.backgroundImage = "";
    }
  }

  renderPortraits(cast, activeId) {
    const root = this.$("portraits");
    const hide = !!(this.current && this.current.node && this.current.node.cgHideCast);
    root.classList.toggle("hidden", hide);
    const key = cast.join("|");
    if (key !== this.currentCastKey) {
      this.currentCastKey = key;
      root.innerHTML = "";
      const positions = this.positionsFor(cast.length);
      cast.forEach(function(id, index) {
        const el = document.createElement("div");
        el.className = "portrait";
        el.setAttribute("data-char", id);
        el.style.left = positions[index] + "%";
        if (cast.length >= 4) el.style.width = "22%";
        if (hasPortrait(id)) {
          el.innerHTML = "<img class=\"portrait-img\" src=\"" + ART.portraits[id] + "\" alt=\"" + esc(getCharacter(id).name) + "\" />";
          const img = el.querySelector("img");
          if (img) img.onerror = function() { el.innerHTML = portraitSvg(id); };
        } else {
          el.innerHTML = portraitSvg(id);
        }
        root.appendChild(el);
      });
    }
    const nodes = root.querySelectorAll(".portrait");
    const hasActive = !!activeId && cast.indexOf(activeId) !== -1;
    nodes.forEach(function(el) {
      const id = el.getAttribute("data-char");
      el.classList.toggle("active", !hasActive || id === activeId);
      el.classList.toggle("focus", hasActive && id === activeId);
    });
  }

  setCG(node) {
    const el = this.$("cg");
    if (!node || !node.cg) {
      el.className = "cg hidden";
      el.innerHTML = "";
      return;
    }
    const path = ART.cg ? ART.cg[node.cg] : "";
    el.className = "cg cg-" + node.cg;
    if (path) {
      el.innerHTML = "<img src=\"" + path + "\" alt=\"\" />";
      const img = el.querySelector("img");
      if (img) img.onerror = function() { el.innerHTML = ""; };
    } else {
      el.innerHTML = "";
    }
    el.classList.remove("hidden");
  }

  positionsFor(count) {
    if (count <= 1) return [37];
    if (count === 2) return [12, 58];
    if (count === 3) return [4, 36, 68];
    return [1, 25, 49, 73];
  }

  renderLine(line) {
    const char = getCharacter(line.speaker);
    this.$("speaker").textContent = char.name || "";
    const text = typeof line.text === "function" ? line.text(this.engine.state) : line.text;
    this.fullText = String(text || "");
    this.charIndex = 0;
    this.$("text").textContent = "";
    this.$("advance").classList.remove("hidden");
    this.typing = true;
    if (this.skip) {
      this.finishTyping();
      this.scheduleSkip();
      return;
    }
    const self = this;
    const delay = Math.max(0, Number(this.settings.speed) || 26);
    this.typeTimer = setInterval(function() {
      self.charIndex += 1;
      self.$("text").textContent = self.fullText.slice(0, self.charIndex);
      if (self.charIndex >= self.fullText.length) {
        self.finishTyping();
      }
    }, delay);
    this.pushBacklog(line, this.fullText);
  }

  finishTyping() {
    if (this.typeTimer) { clearInterval(this.typeTimer); this.typeTimer = null; }
    this.typing = false;
    this.$("text").textContent = this.fullText;
    this.scheduleAuto();
  }

  pushBacklog(line, text) {
    const key = this.engine.state.nodeId + ":" + this.engine.lineIndex;
    if (key === this.lastLineKey) return;
    this.lastLineKey = key;
    const char = getCharacter(line.speaker);
    this.backlog.push({ name: char.name || "", text: text });
    if (this.backlog.length > 200) this.backlog.shift();
  }

  scheduleAuto() {
    if (this.skip || !this.auto) return;
    const self = this;
    if (this.autoTimer) clearTimeout(this.autoTimer);
    const delay = Number(this.settings.autoDelay) || 1450;
    this.autoTimer = setTimeout(function() {
      if (!self.$("choices").classList.contains("hidden")) return;
      self.engine.advance();
    }, delay);
  }

  scheduleSkip() {
    const self = this;
    if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; }
    if (this.skipTimer) clearTimeout(this.skipTimer);
    this.skipTimer = setTimeout(function() {
      if (!self.$("choices").classList.contains("hidden")) return;
      self.engine.advance();
    }, 120);
  }

  toggleAuto() {
    this.auto = !this.auto;
    this.skip = false;
    this.$("btn-auto").classList.toggle("active", this.auto);
    this.$("btn-skip").classList.remove("active");
    this.toast(this.auto ? "自动播放：开" : "自动播放：关");
    if (this.auto) {
      if (this.typing) this.finishTyping();
      this.scheduleAuto();
    }
  }

  toggleSkip() {
    this.skip = !this.skip;
    this.auto = false;
    this.$("btn-skip").classList.toggle("active", this.skip);
    this.$("btn-auto").classList.remove("active");
    this.toast(this.skip ? "跳过：开" : "跳过：关");
    if (this.skip) {
      if (this.typing) this.finishTyping();
      this.scheduleSkip();
    }
  }

  renderChoices(choices) {
    const root = this.$("choices");
    root.innerHTML = "";
    this.$("advance").classList.add("hidden");
    const self = this;
    choices.forEach(function(choice, index) {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.addEventListener("click", function(event) {
        event.stopPropagation();
        self.skip = false;
        self.auto = false;
        self.$("btn-skip").classList.remove("active");
        self.$("btn-auto").classList.remove("active");
        self.engine.choose(index);
      });
      root.appendChild(btn);
    });
    root.classList.remove("hidden");
  }

  showEnding(ending, state) {
    const stats = [
      { label: "信任", value: state.trust },
      { label: "死亡", value: state.deathCount },
      { label: "记忆", value: state.memory.length },
    ];
    let html = "";
    html += "<p class=\"ending-kicker\">" + esc(ending.kicker) + "</p>";
    html += "<h2 class=\"ending-title\">" + esc(ending.title) + "</h2>";
    html += "<p class=\"ending-text\">" + esc(ending.text) + "</p>";
    html += "<div class=\"ending-stats\">";
    stats.forEach(function(s) {
      html += "<div class=\"ending-stat\"><b>" + esc(s.value) + "</b><span>" + esc(s.label) + "</span></div>";
    });
    html += "</div>";
    html += "<div class=\"title-actions\">";
    html += "<button id=\"ending-restart\" class=\"btn primary\">" + esc(ending.restart || "重新开始") + "</button>";
    html += "<button id=\"ending-title\" class=\"btn ghost\">回到标题</button>";
    html += "</div>";
    const root = this.$("ending");
    root.innerHTML = "<div class=\"ending-card\">" + html + "</div>";
    root.classList.remove("hidden");
    const self = this;
    this.$("ending-restart").addEventListener("click", function() { self.startNew(); });
    this.$("ending-title").addEventListener("click", function() { self.showTitle(); });
  }

  autoSave() {
    try {
      localStorage.setItem(CONFIG.saveKey, JSON.stringify(this.engine.serialize()));
    } catch (err) {}
  }

  saveGame() {
    this.autoSave();
    this.toast("已保存");
  }

  openLog() {
    let html = "<div class=\"chat-log\" style=\"height:52vh\">";
    if (!this.backlog.length) html += "<p class=\"chat-line sys\">还没有记录。</p>";
    this.backlog.slice(-80).forEach(function(item) {
      html += "<p class=\"chat-line\"><b>" + esc(item.name || "旁白") + "</b><br>" + esc(item.text) + "</p>";
    });
    html += "</div>";
    this.openModal("对话记录", html);
  }

  openSettings() {
    const self = this;
    let html = "";
    html += "<div class=\"field\"><label>文字速度（毫秒/字，越小越快）</label>";
    html += "<input id=\"set-speed\" type=\"range\" min=\"6\" max=\"70\" value=\"" + this.settings.speed + "\" /></div>";
    html += "<div class=\"field\"><label>自动播放间隔（毫秒）</label>";
    html += "<input id=\"set-auto\" type=\"range\" min=\"600\" max=\"4000\" value=\"" + this.settings.autoDelay + "\" /></div>";
    html += "<p>本地 AI 模型：" + esc(CONFIG.ollama.model) + " @ " + esc(CONFIG.ollama.baseUrl) + "</p>";
    this.openModal("设置", html);
    this.$("set-speed").addEventListener("input", function(event) {
      self.settings.speed = Number(event.target.value);
      self.saveSettings();
    });
    this.$("set-auto").addEventListener("input", function(event) {
      self.settings.autoDelay = Number(event.target.value);
      self.saveSettings();
    });
  }

  openAbout() {
    const html = [
      "<p><b>这是什么？</b></p>",
      "<p>一个 15–20 分钟的 Re:0 第一存档点压缩演示：导演决定场景与在场角色，角色只看到自己该看到的信息，checkpoint 在结尾把时间拉回苹果摊。</p>",
      "<p><b>这是完整游戏吗？</b></p>",
      "<p>不是。它是多智能体叙事架构的垂直切片：脚本模式保证可玩，AI 模式预留给本地 Ollama。</p>",
      "<p><b>版权说明</b></p>",
      "<p>角色与世界观版权归原作者及 KADOKAWA 所有。本演示不包含官方素材，仅用于技术原型与私人研究，非商业用途。</p>",
      "<p><b>全年龄向</b></p>",
      "<p>演示包含死亡与时间回溯意象，但没有血腥描写。</p>",
    ].join("");
    this.openModal("关于本演示", html);
  }

  openModal(title, html) {
    this.$("modal-title").textContent = title;
    this.$("modal-body").innerHTML = html;
    this.$("modal").classList.remove("hidden");
  }

  closeModal() {
    this.$("modal").classList.add("hidden");
  }

  toggleDev() {
    const panel = this.$("dev-panel");
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) {
      const active = panel.querySelector(".dev-tab.active");
      this.renderDev(active ? active.getAttribute("data-tab") : "state");
    }
  }

  renderDev(tab) {
    const snap = this.engine.snapshot();
    let data = snap;
    if (tab === "agents") {
      data = {
        director: snap.director,
        agents: (snap.director.present || []).map(function(id) {
          const c = getCharacter(id);
          return { id: id, name: c.name, role: c.role, persona: c.persona };
        }),
      };
    } else if (tab === "checkpoint") {
      data = {
        spec: STORY.checkpoint,
        runtime: snap.player.checkpoint,
        note: "示例：第一存档点固定为 bad_end_first_loop；后续周目才解锁 save_emilia / save_felt。",
      };
    } else if (tab === "memory") {
      data = snap.memory;
    }
    this.$("dev-json").textContent = JSON.stringify(data, null, 2);
  }

  openAI() {
    const cast = this.current && this.current.node ? this.current.node.cast : [];
    if (!cast.length) {
      this.toast("当前场景没有可对话角色");
      return;
    }
    const self = this;
    const options = cast.map(function(id) {
      const c = getCharacter(id);
      return "<option value=\"" + esc(id) + "\">" + esc(c.name) + "</option>";
    }).join("");
    let html = "";
    html += "<p>连接本地 Ollama，与在场角色自由对话。不会改变主线脚本，只用于测试角色语气与拒绝能力。</p>";
    html += "<div class=\"field\"><label>角色</label><select id=\"ai-char\">" + options + "</select></div>";
    html += "<div id=\"ai-status\" class=\"chat-line sys\">检测本地模型…</div>";
    html += "<div id=\"ai-log\" class=\"chat-log\"></div>";
    html += "<div class=\"field\"><textarea id=\"ai-input\" placeholder=\"对她说点什么。比如：告诉我徽章在哪里。\"></textarea></div>";
    html += "<div class=\"title-actions\"><button id=\"ai-send\" class=\"btn primary\">发送</button><button id=\"ai-check\" class=\"btn ghost\">重新检测</button></div>";
    this.openModal("AI 自由对话 · 本地模型", html);
    this.bindAI(cast);
    this.checkAI();
  }

  bindAI(cast) {
    const self = this;
    this.chatHistory = [];
    this.$("ai-send").addEventListener("click", function() { self.sendAI(); });
    this.$("ai-check").addEventListener("click", function() { self.checkAI(); });
    this.$("ai-input").addEventListener("keydown", function(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        self.sendAI();
      }
    });
    this.$("ai-char").addEventListener("change", function() { self.chatHistory = []; self.$("ai-log").innerHTML = ""; });
  }

  async checkAI() {
    const status = this.$("ai-status");
    if (!status) return;
    status.textContent = "检测本地模型…";
    try {
      const models = await listModels();
      if (!models.length) {
        status.textContent = "Ollama 已连接，但没有模型。先运行：ollama pull qwen3:4b";
        return;
      }
      status.textContent = "Ollama 已连接。可用模型：" + models.slice(0, 6).join(", ");
      if (models.indexOf(CONFIG.ollama.model) === -1) {
        status.textContent += "（默认 " + CONFIG.ollama.model + " 不在列表，可在 config.js 改）";
      }
    } catch (err) {
      status.textContent = "未连接 Ollama。";
      status.textContent += " 需要本机运行 ollama serve，并设置 OLLAMA_ORIGINS=*。";
    }
  }

  async sendAI() {
    if (this.chatBusy) return;
    const input = this.$("ai-input");
    const text = input.value.trim();
    if (!text) return;
    const charId = this.$("ai-char").value;
    const char = getCharacter(charId);
    const log = this.$("ai-log");
    log.innerHTML += "<p class=\"chat-line user\"><b>你</b><br>" + esc(text) + "</p>";
    input.value = "";
    this.chatBusy = true;
    this.$("ai-send").disabled = true;
    const replyId = "ai-reply-" + Date.now();
    log.innerHTML += "<p class=\"chat-line\" id=\"" + replyId + "\"><b>" + esc(char.name) + "</b><br></p>";
    log.scrollTop = log.scrollHeight;
    const replyEl = document.getElementById(replyId);
    const self = this;
    const system = [
      char.persona,
      "你是视觉小说中的角色，正在和玩家角色菜月昴对话。",
      "当前场景：" + (this.current && this.current.node ? this.current.node.caption : "王都") + "。",
      "只以角色身份说话，2–4 句，不要替玩家行动，不要描述玩家心理。",
      "全年龄向：不描写血腥、性内容；可以拒绝、离开、转移话题。",
    ].join("\n");
    const messages = [{ role: "system", content: system }].concat(this.chatHistory.slice(-8)).concat([{ role: "user", content: text }]);
    let full = "";
    try {
      full = await chat({
        messages: messages,
        onToken: function(piece) {
          full += piece;
          replyEl.innerHTML = "<b>" + esc(char.name) + "</b><br>" + esc(full);
          log.scrollTop = log.scrollHeight;
        },
      });
      if (!full) replyEl.innerHTML = "<b>" + esc(char.name) + "</b><br><span class=\"sys\">（没有返回内容）</span>";
      this.chatHistory.push({ role: "user", content: text });
      this.chatHistory.push({ role: "assistant", content: full });
      this.engine.recordMemory(charId, "与昴自由对话：" + text.slice(0, 40), "witnessed", false);
    } catch (err) {
      replyEl.innerHTML = "<b>" + esc(char.name) + "</b><br><span class=\"sys\">连接失败。检查 Ollama 是否运行、OLLAMA_ORIGINS 是否设置。</span>";
      this.openModal("本地模型连接失败", "<pre style=\"white-space:pre-wrap;color:#cfc7ba;\">" + esc(ollamaSetupText()) + "</pre>");
    } finally {
      this.chatBusy = false;
      this.$("ai-send").disabled = false;
    }
  }

  toast(message) {
    const el = this.$("toast");
    el.textContent = message;
    el.classList.remove("hidden");
    if (this.toastTimer) clearTimeout(this.toastTimer);
    const self = this;
    this.toastTimer = setTimeout(function() { el.classList.add("hidden"); }, 1800);
  }
}