export type Species = {
  id: string;
  commonName: string;
  scientificName: string;
  behavior: string;
  diet: string;
  habitat: string;
  range: string;
  song: { label: string; url: string }[];
  migration: string;
  rarity: "common" | "uncommon" | "rare";
};

export const SPECIES: Species[] = [
  {
    id: "common-ostrich",
    commonName: "Common Ostrich",
    scientificName: "Struthio camelus",
    behavior: "Fast-running ground bird; strong kicks for defense; lives in groups.",
    diet: "Seeds, grasses, shrubs, insects.",
    habitat: "Savannas, open grasslands, semi-arid plains.",
    range: "Sub‑Saharan Africa.",
    song: [{ label: "Boom / call (demo)", url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav" }],
    migration: "Mostly resident; local movements following food and water.",
    rarity: "uncommon"
  },
  {
    id: "indian-peafowl",
    commonName: "Indian Peafowl",
    scientificName: "Pavo cristatus",
    behavior: "Ground forager; males display iridescent trains in breeding season.",
    diet: "Seeds, insects, small reptiles, fruit.",
    habitat: "Open woodland edges, farms, scrub, near water.",
    range: "South Asia (especially India, Sri Lanka).",
    song: [{ label: "Call sample (demo)", url: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav" }],
    migration: "Mostly resident; local movements with water/food availability.",
    rarity: "uncommon"
  },
  {
    id: "white-throated-kingfisher",
    commonName: "White-throated Kingfisher",
    scientificName: "Halcyon smyrnensis",
    behavior: "Perches patiently; fast dives for prey; territorial calls.",
    diet: "Fish, insects, frogs, lizards, small birds.",
    habitat: "Wetlands, canals, urban ponds, paddy fields.",
    range: "South and Southeast Asia.",
    song: [{ label: "Call sample (demo)", url: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav" }],
    migration: "Mostly resident; disperses locally after breeding.",
    rarity: "common"
  },
  {
    id: "greater-flamingo",
    commonName: "Greater Flamingo",
    scientificName: "Phoenicopterus roseus",
    behavior: "Filter-feeds in shallow water; large flocks; synchronized movements.",
    diet: "Algae, small crustaceans, plankton.",
    habitat: "Salt pans, lagoons, estuaries, large lakes.",
    range: "Africa, Mediterranean, Middle East, South Asia.",
    song: [{ label: "Flock ambience (demo)", url: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav" }],
    migration: "Seasonal movements between wetlands; depends on water levels.",
    rarity: "rare"
  }
];
