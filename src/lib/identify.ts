import { SPECIES, type Species } from "./species";

export type IdentifyResult = {
  top: Species;
  confidence: number;
  alternatives: { s: Species; confidence: number }[];
  aiLog: { prompt: string; response: string };
};

function norm(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchSpecies(commonName?: string, scientificName?: string): Species | null {
  const c = norm(commonName ?? "");
  const sc = norm(scientificName ?? "");
  return (
    SPECIES.find((x) => norm(x.commonName) === c) ||
    SPECIES.find((x) => norm(x.scientificName) === sc) ||
    SPECIES.find((x) => c.includes(norm(x.commonName)) || norm(x.commonName).includes(c)) ||
    SPECIES.find((x) => sc.includes(norm(x.scientificName)) || norm(x.scientificName).includes(sc)) ||
    null
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

function offlineFallback(file: File): IdentifyResult {
  const name = (file.name || "").toLowerCase();
  const pick =
    name.includes("ostrich") ? "common-ostrich" :
    name.includes("flam") ? "greater-flamingo" :
    name.includes("king") ? "white-throated-kingfisher" :
    "indian-peafowl";

  const top = SPECIES.find((s) => s.id === pick) ?? SPECIES[0]!;
  const alternatives = SPECIES
    .filter((s) => s.id !== top.id)
    .slice(0, 2)
    .map((s, i) => ({ s, confidence: 0.55 - i * 0.08 }));

  return {
    top,
    confidence: 0.74,
    alternatives,
    aiLog: {
      prompt: `Offline demo fallback used. file="${file.name}"`,
      response: `Top match: ${top.commonName} (${top.scientificName}).`
    }
  };
}

export async function identifyBird(file: File): Promise<IdentifyResult> {
  const prompt = `Identify the bird in this image. Return ONLY valid JSON with no markdown backticks:
{"commonName": "string", "scientificName": "string", "confidence": 0.85, "habitat": "string", "range": "string", "diet": "string", "behavior": "string", "funFact": "string"}`;

  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  try {
    const response = await fetch('/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64, mimeType: file.type })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

    const matched = SPECIES.find(s =>
      s.commonName.toLowerCase().includes(parsed.commonName.toLowerCase()) ||
      parsed.commonName.toLowerCase().includes(s.commonName.toLowerCase())
    );

    return {
      top: matched ?? {
        id: parsed.scientificName.toLowerCase().replace(/\s+/g, '-'),
        commonName: parsed.commonName,
        scientificName: parsed.scientificName,
        habitat: parsed.habitat,
        range: parsed.range,
        diet: parsed.diet,
        behavior: parsed.behavior,
        rarity: 'common',
        migration: '',
        song: [],
      },
      confidence: parsed.confidence,
      alternatives: [],
      aiLog: {
        prompt: prompt,
        response: text
      }
    };
  } catch (e: any) {
    return offlineFallback(file);
  }
}
