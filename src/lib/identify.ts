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

function matchSpecies(commonName?: string, scientificName?: string) {
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

async function tryINat(file: File) {
  // iNat CV endpoints vary by deployment; try multiple.
  // All go through Vite proxy (/inat -> https://api.inaturalist.org)
  const endpoints = [
    "/inat/v1/computervision/score_image",
    "/inat/v2/computervision/score_image",
    "/inat/computervision/score_image"
  ];

  const form = new FormData();
  form.append("image", file);

  const errors: string[] = [];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, { method: "POST", body: form });
      if (!res.ok) {
        errors.push(`${endpoint}: HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const results: any[] = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];
      if (!results.length) {
        errors.push(`${endpoint}: no results`);
        continue;
      }
      return { endpoint, results };
    } catch (e: any) {
      errors.push(`${endpoint}: ${String(e?.message ?? e)}`);
    }
  }

  throw new Error(errors.join(" | "));
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
  const prompt = `Identify bird from image using iNaturalist CV. file="${file.name}"`;

  try {
    const { endpoint, results } = await tryINat(file);

    const topR = results[0];
    const altR = results.slice(1, 3);

    const topCommon = topR?.taxon?.preferred_common_name ?? topR?.taxon?.name;
    const topSci = topR?.taxon?.name;

    const scoreRaw =
      typeof topR?.combined_score === "number" ? topR.combined_score :
      typeof topR?.score === "number" ? topR.score :
      0.78;

    const confidence = Math.max(0.3, Math.min(0.98, scoreRaw));

    const mappedTop = matchSpecies(topCommon, topSci) ?? SPECIES[0]!;
    const alternatives = altR
      .map((r: any, i: number) => {
        const c = r?.taxon?.preferred_common_name ?? r?.taxon?.name;
        const s = r?.taxon?.name;
        const score =
          typeof r?.combined_score === "number" ? r.combined_score :
          typeof r?.score === "number" ? r.score :
          0.55 - i * 0.06;

        const mapped = matchSpecies(c, s);
        return mapped ? { s: mapped, confidence: Math.max(0.25, Math.min(0.92, score)) } : null;
      })
      .filter(Boolean) as { s: Species; confidence: number }[];

    const response = `iNat OK via ${endpoint} | Top: ${topCommon} (${topSci}) conf=${confidence.toFixed(
      2
    )} | mapped="${mappedTop.commonName}"`;

    return { top: mappedTop, confidence, alternatives, aiLog: { prompt, response } };
  } catch (e: any) {
    const fallback = offlineFallback(file);
    return {
      ...fallback,
      aiLog: {
        prompt,
        response: `iNat failed: ${String(e?.message ?? e)}. Using offline fallback.`
      }
    };
  }
}
