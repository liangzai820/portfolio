import { readStorage, writeStorage } from './storage'
import { seedSettings } from '../content/settings'
import type { Settings } from '../types'

const KEY = 'settings'

export function getSettings(): Settings {
  return readStorage<Settings>(KEY, seedSettings)
}

export function updateSettings(settings: Settings): Settings {
  writeStorage(KEY, settings)
  return settings
}
