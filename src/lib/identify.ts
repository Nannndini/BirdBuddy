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
  const prompt = `Identify this bird species. Return JSON only:\n   {\n     "commonName": "string",\n     "scientificName": "string",\n     "confidence": 0.95,\n     "habitat": "string",\n     "range": "string",\n     "diet": "string",\n     "behavior": "string",\n     "funFact": "string"\n   }`;

  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_ANTHROPIC_API_KEY in .env.local");
    }

    const base64Image = await fileToBase64(file);
    const mediaType = file.type || "image/jpeg";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64Image
                }
              },
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Claude API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    const responseText = data.content[0].text;
    
    // Parse JSON from markdown code block if present
    const jsonStr = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.95;

    const mappedTop = matchSpecies(parsed.commonName, parsed.scientificName);
    
    let topSpecies: Species;
    
    if (mappedTop) {
      topSpecies = mappedTop;
    } else {
      topSpecies = {
        id: parsed.commonName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        commonName: parsed.commonName,
        scientificName: parsed.scientificName,
        behavior: parsed.behavior || parsed.funFact || "Unknown",
        diet: parsed.diet || "Unknown",
        habitat: parsed.habitat || "Unknown",
        range: parsed.range || "Unknown",
        song: [],
        migration: "Unknown",
        rarity: "uncommon"
      };
    }

    const alternatives = SPECIES.filter(s => s.id !== topSpecies.id).slice(0, 2).map((s, i) => ({
      s,
      confidence: confidence * (0.6 - i * 0.1)
    }));

    return { 
      top: topSpecies, 
      confidence, 
      alternatives, 
      aiLog: { prompt, response: `Claude API identified: ${topSpecies.commonName} (${topSpecies.scientificName})` } 
    };
  } catch (e: any) {
    console.error("identifyBird error:", e);
    const fallback = offlineFallback(file);
    return {
      ...fallback,
      aiLog: {
        prompt,
        response: `Claude API failed: ${String(e?.message ?? e)}. Using offline fallback.`
      }
    };
  }
}
