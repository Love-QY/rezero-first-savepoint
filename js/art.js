export const ART = {
  backgrounds: {
    plaza: "assets/bg/plaza.jpg",
    slums: "assets/bg/slums.jpg",
    loot: "assets/bg/loot.jpg",
    black: "",
  },
  portraits: {
    emilia: "assets/portraits/emilia.png",
    felt: "assets/portraits/felt.png",
    rom: "assets/portraits/rom.png",
    elsa: "assets/portraits/elsa.png",
  },
  cg: {
    first_death: "assets/cg/first_death.jpg",
    checkpoint: "assets/cg/checkpoint.jpg",
    title: "assets/cg/title.jpg",
  },
};

export function hasBackground(name) {
  return !!(ART.backgrounds && ART.backgrounds[name]);
}

export function hasPortrait(id) {
  return !!(ART.portraits && ART.portraits[id]);
}
