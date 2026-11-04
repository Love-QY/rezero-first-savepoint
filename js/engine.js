import { STORY } from "./story.js";

function resolve(value, state) {
  return typeof value === "function" ? value(state) : value;
}

export class GameEngine {
  constructor(callbacks) {
    this.cb = callbacks || {};
    this.state = null;
    this.node = null;
    this.lineIndex = 0;
  }

  newGame() {
    this.state = {
      nodeId: null,
      turn: 1,
      trust: 0,
      deathCount: 0,
      flags: {},
      memory: [],
      history: [],
      checkpoint: null,
    };
    this.goto(STORY.start);
  }

  goto(id) {
    const node = STORY.nodes[id];
    if (!node) {
      console.error("Unknown node", id);
      return;
    }
    this.node = node;
    this.state.nodeId = id;
    this.state.turn += 1;
    this.lineIndex = 0;
    if (typeof node.onEnter === "function") {
      node.onEnter(this.state, this);
    }
    this.emit();
  }

  visibleLines() {
    const lines = this.node && this.node.lines ? this.node.lines : [];
    return lines.filter(function(line) {
      return typeof line.if !== "function" || line.if(this.state);
    }, this);
  }

  visibleChoices() {
    const choices = this.node && this.node.choices ? this.node.choices : [];
    return choices.filter(function(choice) {
      return typeof choice.if !== "function" || choice.if(this.state);
    }, this);
  }

  currentLine() {
    const lines = this.visibleLines();
    if (!lines.length) return null;
    return lines[Math.min(this.lineIndex, lines.length - 1)];
  }

  isLastLine() {
    const lines = this.visibleLines();
    return !lines.length || this.lineIndex >= lines.length - 1;
  }

  emit() {
    const lines = this.visibleLines();
    const line = lines.length ? lines[Math.min(this.lineIndex, lines.length - 1)] : null;
    const atEnd = this.isLastLine();
    const choices = atEnd ? this.visibleChoices() : [];
    if (typeof this.cb.render === "function") {
      this.cb.render({
        node: this.node,
        line: line,
        lineIndex: this.lineIndex,
        lineCount: lines.length,
        atEnd: atEnd,
        choices: choices,
        state: this.state,
      });
    }
  }

  advance() {
    if (!this.node) return;
    const lines = this.visibleLines();
    if (this.lineIndex < lines.length - 1) {
      this.lineIndex += 1;
      this.emit();
      return;
    }
    if (this.visibleChoices().length) {
      this.emit();
      return;
    }
    if (this.node.ending) {
      if (typeof this.cb.ending === "function") {
        this.cb.ending(this.node.ending, this.state);
      }
      return;
    }
    if (this.node.next) {
      this.goto(resolve(this.node.next, this.state));
    }
  }

  choose(index) {
    const choices = this.visibleChoices();
    const choice = choices[index];
    if (!choice) return;
    this.state.history.push({
      nodeId: this.state.nodeId,
      choice: choice.text,
      turn: this.state.turn,
    });
    if (choice.effects) this.applyEffects(choice.effects);
    if (choice.next) this.goto(choice.next);
  }

  applyEffects(effects) {
    if (!effects) return;
    if (typeof effects.trust === "number") {
      this.state.trust += effects.trust;
    }
    if (effects.flags) {
      Object.keys(effects.flags).forEach(function(key) {
        this.state.flags[key] = effects.flags[key];
      }, this);
    }
    if (effects.memory && effects.memory.length) {
      effects.memory.forEach(function(item) {
        this.state.memory.push(Object.assign({ turn: this.state.turn }, item));
      }, this);
    }
  }

  recordMemory(owner, fact, source, pinned) {
    this.state.memory.push({
      owner: owner,
      fact: fact,
      source: source || "witnessed",
      turn: this.state.turn,
      pinned: !!pinned,
    });
    this.emit();
  }

  snapshot() {
    return {
      runtime: {
        nodeId: this.state.nodeId,
        chapter: this.node ? this.node.chapter : "",
        line: this.lineIndex,
        lines: this.visibleLines().length,
        turn: this.state.turn,
      },
      director: {
        present: this.node && this.node.cast ? this.node.cast : [],
        background: this.node ? this.node.bg : "",
        caption: this.node ? this.node.caption : "",
      },
      player: {
        trust: this.state.trust,
        deathCount: this.state.deathCount,
        flags: this.state.flags,
        checkpoint: this.state.checkpoint,
      },
      memory: this.state.memory,
      history: this.state.history.slice(-8),
    };
  }

  serialize() {
    return {
      version: 1,
      nodeId: this.state.nodeId,
      lineIndex: this.lineIndex,
      state: this.state,
      savedAt: new Date().toISOString(),
    };
  }

  load(payload) {
    if (!payload || !payload.state || !payload.nodeId) return false;
    const node = STORY.nodes[payload.nodeId];
    if (!node) return false;
    this.state = payload.state;
    this.node = node;
    this.lineIndex = payload.lineIndex || 0;
    this.emit();
    return true;
  }
}

export { STORY };
