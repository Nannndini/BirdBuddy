export type CollectionItem = {
  id: string;            // species id
  addedAt: number;
  note?: string;
  photoDataUrl?: string;
  locationLabel?: string;
};

const KEY = "birdbuddy.collection.v1";

export function loadCollection(): CollectionItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCollection(items: CollectionItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function upsertCollection(item: CollectionItem) {
  const items = loadCollection();
  const idx = items.findIndex((x) => x.id === item.id);
  if (idx >= 0) items[idx] = item;
  else items.unshift(item);
  saveCollection(items);
}

export function removeFromCollection(id: string) {
  saveCollection(loadCollection().filter((x) => x.id !== id));
}
