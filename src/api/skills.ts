import { readStorage, writeStorage } from './storage'
import { seedSkills } from '../content/skills'
import type { SkillGroup } from '../types'

const KEY = 'skills'

export function getSkills(): SkillGroup[] {
  return readStorage<SkillGroup[]>(KEY, seedSkills)
}

export function saveSkills(skills: SkillGroup[]): SkillGroup[] {
  writeStorage(KEY, skills)
  return skills
}
