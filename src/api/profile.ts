import { readStorage, writeStorage } from './storage'
import { seedProfile } from '../content/profile'
import type { Profile } from '../types'

const KEY = 'profile'

export function getProfile(): Profile {
  return readStorage<Profile>(KEY, seedProfile)
}

export function updateProfile(profile: Profile): Profile {
  writeStorage(KEY, profile)
  return profile
}
