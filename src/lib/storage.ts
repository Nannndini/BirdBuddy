import { supabase } from './supabase'

export type CollectionItem = {
  id: string
  addedAt: number
  note?: string
  photoDataUrl?: string
  locationLabel?: string
  commonName?: string
  scientificName?: string
}

const KEY = 'birdbuddy.collection.v1'

export function loadCollection(): CollectionItem[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function saveCollection(items: CollectionItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function upsertCollection(item: CollectionItem) {
  const items = loadCollection()
  const idx = items.findIndex(x => x.id === item.id)
  if (idx >= 0) items[idx] = item
  else items.unshift(item)
  saveCollection(items)
  // Sync to Supabase in background
  supabase.from('collections').upsert({
    id: item.id,
    added_at: item.addedAt,
    note: item.note,
    photo_data_url: item.photoDataUrl,
    location_label: item.locationLabel
  }).then()
}

export function removeFromCollection(id: string) {
  saveCollection(loadCollection().filter(x => x.id !== id))
  // Sync to Supabase in background
  supabase.from('collections').delete().eq('id', id).then()
}