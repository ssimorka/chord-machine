import type { Pattern } from '@/types'

const KEY = 'chord-machine:patterns:v1'

export function loadPatterns(): Pattern[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Pattern[]
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export function savePatterns(list: Pattern[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
}

export function addPattern(p: Omit<Pattern, 'id' | 'createdAt'>): Pattern {
  const list = loadPatterns()
  const entry: Pattern = {
    ...p,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,
    createdAt: Date.now(),
  }
  list.unshift(entry)
  savePatterns(list.slice(0, 30))
  return entry
}

export function removePattern(id: string) {
  savePatterns(loadPatterns().filter(p => p.id !== id))
}
