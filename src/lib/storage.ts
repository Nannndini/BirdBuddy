import { supabase } from './supabase'

export interface CollectionItem {
  id?: string
  species_id: string
  common_name: string
  scientific_name: string
  photo_url?: string
  note?: string
  location_label?: string
  added_at: number
}

export async function loadCollection(): Promise<CollectionItem[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('added_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function upsertCollection(item: CollectionItem) {
  const { error } = await supabase
    .from('collections')
    .upsert({
      species_id: item.species_id,
      common_name: item.common_name,
      scientific_name: item.scientific_name,
      photo_url: item.photo_url,
      note: item.note,
      location_label: item.location_label,
      added_at: item.added_at || Date.now()
    })
  if (error) console.error('Supabase error:', error)
}

export async function removeFromCollection(speciesId: string) {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('species_id', speciesId)
  if (error) console.error('Supabase error:', error)
}