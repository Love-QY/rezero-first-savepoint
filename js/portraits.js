import { CHARACTERS } from "./characters.js";

const PALETTES = {
  emilia: {
    skin: "#f3d4c4", skinShade: "#e0b7a8", hair: "#ece6f6", hairShade: "#cfc4e8",
    eye: "#9b7bff", outfit: "#f4f1fb", outfit2: "#d9d0f0", accent: "#b9a3ff", lip: "#c97f8f",
  },
  felt: {
    skin: "#f0c9a8", skinShade: "#d9a98a", hair: "#f2c75c", hairShade: "#d9a83f",
    eye: "#d94f5c", outfit: "#3a2a2a", outfit2: "#24191c", accent: "#d94b4b", lip: "#b85a5a",
  },
  rom: {
    skin: "#d9b08c", skinShade: "#bf9270", hair: "#7d6a56", hairShade: "#5e4e3f",
    eye: "#6b5a48", outfit: "#4a3b2f", outfit2: "#2e241d", accent: "#8a6a4a", lip: "#8a5a4a",
  },
  elsa: {
    skin: "#e8c4b4", skinShade: "#cfa292", hair: "#1d1820", hairShade: "#0d0b10",
    eye: "#c73b5a", outfit: "#241b26", outfit2: "#120d14", accent: "#8f2f4a", lip: "#a84a5e",
  },
};

function defs(id, p) {
  return [
    "<defs>",
    "<radialGradient id=\"halo_" + id + "\" cx=\"50%\" cy=\"38%\" r=\"62%\">",
    "<stop offset=\"0%\" stop-color=\"" + p.accent + "\" stop-opacity=\"0.34\"/>",
    "<stop offset=\"100%\" stop-color=\"" + p.accent + "\" stop-opacity=\"0\"/>",
    "</radialGradient>",
    "<linearGradient id=\"cloak_" + id + "\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">",
    "<stop offset=\"0%\" stop-color=\"" + p.outfit + "\"/>",
    "<stop offset=\"100%\" stop-color=\"" + p.outfit2 + "\"/>",
    "</linearGradient>",
    "<linearGradient id=\"hair_" + id + "\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">",
    "<stop offset=\"0%\" stop-color=\"" + p.hair + "\"/>",
    "<stop offset=\"100%\" stop-color=\"" + p.hairShade + "\"/>",
    "</linearGradient>",
    "</defs>",
  ].join("");
}

function base(id, p) {
  return [
    "<ellipse cx=\"110\" cy=\"288\" rx=\"84\" ry=\"11\" fill=\"rgba(0,0,0,0.38)\"/>",
    "<circle cx=\"110\" cy=\"126\" r=\"104\" fill=\"url(#halo_" + id + ")\"/>",
    "<path d=\"M24 300 C32 222 62 194 110 194 C158 194 188 222 196 300 Z\" fill=\"url(#cloak_" + id + ")\" stroke=\"rgba(0,0,0,0.24)\" stroke-width=\"2\"/>",
  ].join("");
}

function neck(p) {
  return [
    "<path d=\"M96 160 L124 160 L126 190 Q110 200 94 190 Z\" fill=\"" + p.skinShade + "\"/>",
    "<path d=\"M98 164 L122 164 L124 184 Q110 192 96 184 Z\" fill=\"" + p.skin + "\"/>",
  ].join("");
}

function face(p) {
  return [
    "<ellipse cx=\"110\" cy=\"118\" rx=\"45\" ry=\"55\" fill=\"" + p.skin + "\" stroke=\"rgba(80,40,40,0.16)\" stroke-width=\"1.2\"/>",
    "<path d=\"M64 116 Q53 107 57 94 Q70 97 75 110 Z\" fill=\"" + p.skin + "\"/>",
    "<path d=\"M156 116 Q167 107 163 94 Q150 97 145 110 Z\" fill=\"" + p.skin + "\"/>",
  ].join("");
}

function eyes(p, opts) {
  const left = opts && opts.left === false ? "" : [
    "<ellipse cx=\"87\" cy=\"118\" rx=\"10\" ry=\"13\" fill=\"#fffaf5\"/>",
    "<circle cx=\"87\" cy=\"119\" r=\"6.5\" fill=\"" + p.eye + "\"/>",
    "<circle cx=\"87\" cy=\"119\" r=\"3\" fill=\"#1b1520\"/>",
    "<circle cx=\"89\" cy=\"115\" r=\"2.2\" fill=\"#ffffff\" opacity=\"0.9\"/>",
    "<path d=\"M76 102 Q87 97 98 102\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"2\" stroke-linecap=\"round\"/>",
  ].join("");
  return left + [
    "<ellipse cx=\"133\" cy=\"118\" rx=\"10\" ry=\"13\" fill=\"#fffaf5\"/>",
    "<circle cx=\"133\" cy=\"119\" r=\"6.5\" fill=\"" + p.eye + "\"/>",
    "<circle cx=\"133\" cy=\"119\" r=\"3\" fill=\"#1b1520\"/>",
    "<circle cx=\"135\" cy=\"115\" r=\"2.2\" fill=\"#ffffff\" opacity=\"0.9\"/>",
    "<path d=\"M122 102 Q133 97 144 102\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"2\" stroke-linecap=\"round\"/>",
    "<path d=\"M104 136 Q110 140 116 136\" fill=\"none\" stroke=\"" + p.skinShade + "\" stroke-width=\"1.4\" stroke-linecap=\"round\" opacity=\"0.7\"/>",
  ].join("");
}

function mouth(p, type) {
  const d = type === "smirk"
    ? "M100 148 Q111 158 123 146"
    : type === "soft"
      ? "M102 148 Q110 154 118 148"
      : "M103 149 Q110 152 117 149";
  return "<path d=\"" + d + "\" fill=\"none\" stroke=\"" + p.lip + "\" stroke-width=\"2.1\" stroke-linecap=\"round\"/>";
}

function blush(p, strong) {
  const o = strong ? "0.24" : "0.16";
  return [
    "<ellipse cx=\"76\" cy=\"136\" rx=\"10\" ry=\"4\" fill=\"#d98a8a\" opacity=\"" + o + "\"/>",
    "<ellipse cx=\"144\" cy=\"136\" rx=\"10\" ry=\"4\" fill=\"#d98a8a\" opacity=\"" + o + "\"/>",
  ].join("");
}

function emiliaHair(p) {
  return [
    "<path d=\"M58 132 C46 58 76 24 110 24 C144 24 174 58 162 132 L178 244 C158 222 150 198 150 166 L70 166 C70 198 62 222 42 244 Z\" fill=\"url(#hair_emilia)\" stroke=\"rgba(80,60,100,0.18)\" stroke-width=\"1.4\"/>",
    "<path d=\"M64 94 C70 50 90 34 110 34 C130 34 150 50 156 94 C146 82 136 76 126 88 C120 68 110 60 100 74 C90 62 76 70 64 94 Z\" fill=\"" + p.hair + "\"/>",
    "<path d=\"M62 104 C64 138 68 164 78 184 L66 188 C56 160 54 130 62 104 Z\" fill=\"" + p.hairShade + "\" opacity=\"0.7\"/>",
    "<path d=\"M158 104 C156 138 152 164 142 184 L154 188 C164 160 166 130 158 104 Z\" fill=\"" + p.hairShade + "\" opacity=\"0.7\"/>",
  ].join("");
}

function feltHair(p) {
  return [
    "<path d=\"M62 122 C54 60 78 32 110 32 C142 32 166 60 158 122 L164 170 C150 158 146 142 144 126 L76 126 C74 142 70 158 56 170 Z\" fill=\"url(#hair_felt)\" stroke=\"rgba(90,60,20,0.2)\" stroke-width=\"1.4\"/>",
    "<path d=\"M62 94 L74 62 L84 84 L94 54 L106 82 L118 52 L130 84 L142 60 L154 96 C142 84 132 80 122 90 C112 72 100 74 92 92 C82 80 72 82 62 94 Z\" fill=\"" + p.hair + "\"/>",
    "<path d=\"M56 168 Q60 196 78 210 L70 220 Q52 198 48 170 Z\" fill=\"" + p.hairShade + "\" opacity=\"0.7\"/>",
  ].join("");
}

function romHead(p) {
  return [
    "<path d=\"M64 128 C64 78 84 52 110 52 C136 52 156 78 156 128 C156 168 136 194 110 194 C84 194 64 168 64 128 Z\" fill=\"" + p.skin + "\" stroke=\"rgba(80,45,30,0.2)\" stroke-width=\"1.5\"/>",
    "<path d=\"M70 96 Q88 80 110 80 Q132 80 150 96\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"4\" stroke-linecap=\"round\" opacity=\"0.55\"/>",
    "<path d=\"M70 132 C70 190 90 214 110 214 C130 214 150 190 150 132 C140 160 126 170 110 170 C94 170 80 160 70 132 Z\" fill=\"" + p.hair + "\" opacity=\"0.95\"/>",
    "<path d=\"M84 146 Q110 158 136 146\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"4\" stroke-linecap=\"round\"/>",
    "<path d=\"M78 116 Q88 110 98 116\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"3\" stroke-linecap=\"round\"/>",
    "<path d=\"M122 116 Q132 110 142 116\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"3\" stroke-linecap=\"round\"/>",
    "<path d=\"M148 104 L158 96\" stroke=\"" + p.hairShade + "\" stroke-width=\"2\" stroke-linecap=\"round\" opacity=\"0.7\"/>",
  ].join("");
}

function elsahair(p) {
  return [
    "<path d=\"M54 132 C46 54 76 24 110 24 C144 24 174 54 166 132 L182 252 C160 228 152 202 152 170 L68 170 C68 202 60 228 38 252 Z\" fill=\"url(#hair_elsa)\" stroke=\"rgba(0,0,0,0.35)\" stroke-width=\"1.4\"/>",
    "<path d=\"M60 96 C66 48 90 30 110 30 C132 30 154 48 160 96 C150 82 138 76 126 86 C118 60 102 62 94 86 C84 72 70 78 60 96 Z\" fill=\"" + p.hair + "\"/>",
    "<path d=\"M64 92 C68 122 76 146 88 166 L70 172 C60 144 58 116 64 92 Z\" fill=\"" + p.hairShade + "\" opacity=\"0.9\"/>",
    "<path d=\"M156 100 C154 134 150 158 142 178 L156 182 C166 154 166 124 156 100 Z\" fill=\"" + p.hairShade + "\" opacity=\"0.85\"/>",
  ].join("");
}

export function portraitSvg(id) {
  const c = CHARACTERS[id];
  const p = PALETTES[id];
  if (!c || !p) return "";
  const parts = [];
  parts.push("<svg viewBox=\"0 0 220 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"" + c.name + "\">");
  parts.push(defs(id, p));
  parts.push(base(id, p));
  parts.push(neck(p));
  if (id === "emilia") {
    parts.push(emiliaHair(p));
    parts.push(face(p));
    parts.push(eyes(p));
    parts.push(blush(p, true));
    parts.push(mouth(p, "soft"));
    parts.push("<path d=\"M70 200 Q110 222 150 200 L160 220 Q110 246 60 220 Z\" fill=\"" + p.outfit2 + "\" opacity=\"0.9\"/>");
    parts.push("<circle cx=\"154\" cy=\"78\" r=\"5\" fill=\"#f7e6f2\"/>");
    parts.push("<circle cx=\"162\" cy=\"84\" r=\"4.2\" fill=\"#e9c7df\"/>");
    parts.push("<circle cx=\"148\" cy=\"86\" r=\"4.2\" fill=\"#e9c7df\"/>");
    parts.push("<circle cx=\"156\" cy=\"90\" r=\"3.6\" fill=\"#f2d6ea\"/>");
  } else if (id === "felt") {
    parts.push(feltHair(p));
    parts.push(face(p));
    parts.push(eyes(p));
    parts.push(blush(p, false));
    parts.push(mouth(p, "smirk"));
    parts.push("<path d=\"M62 196 Q110 176 158 196 L166 224 Q110 246 54 224 Z\" fill=\"" + p.accent + "\" opacity=\"0.55\"/>");
    parts.push("<circle cx=\"160\" cy=\"140\" r=\"2.2\" fill=\"#f5d76e\"/>");
  } else if (id === "rom") {
    parts.push(romHead(p));
    parts.push("<ellipse cx=\"87\" cy=\"120\" rx=\"7\" ry=\"9\" fill=\"#fffaf5\"/>");
    parts.push("<circle cx=\"87\" cy=\"121\" r=\"4\" fill=\"" + p.eye + "\"/>");
    parts.push("<circle cx=\"87\" cy=\"121\" r=\"1.8\" fill=\"#1b1520\"/>");
    parts.push("<ellipse cx=\"133\" cy=\"120\" rx=\"7\" ry=\"9\" fill=\"#fffaf5\"/>");
    parts.push("<circle cx=\"133\" cy=\"121\" r=\"4\" fill=\"" + p.eye + "\"/>");
    parts.push("<circle cx=\"133\" cy=\"121\" r=\"1.8\" fill=\"#1b1520\"/>");
    parts.push("<path d=\"M74 108 Q87 102 100 108\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"3\" stroke-linecap=\"round\"/>");
    parts.push("<path d=\"M120 108 Q133 102 146 108\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"3\" stroke-linecap=\"round\"/>");
    parts.push("<path d=\"M138 96 L150 88\" stroke=\"" + p.skinShade + "\" stroke-width=\"2\" stroke-linecap=\"round\" opacity=\"0.6\"/>");
  } else if (id === "elsa") {
    parts.push(elsahair(p));
    parts.push(face(p));
    parts.push(eyes(p, { left: false }));
    parts.push(mouth(p, "soft"));
    parts.push("<path d=\"M70 196 Q110 216 150 196 L160 228 Q110 250 60 228 Z\" fill=\"" + p.accent + "\" opacity=\"0.5\"/>");
    parts.push("<circle cx=\"141\" cy=\"140\" r=\"1.8\" fill=\"#3a2028\"/>");
    parts.push("<path d=\"M78 104 Q88 100 96 106\" fill=\"none\" stroke=\"" + p.hairShade + "\" stroke-width=\"2\" stroke-linecap=\"round\" opacity=\"0.6\"/>");
  }
  parts.push("</svg>");
  return parts.join("");
}
