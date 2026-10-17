import { readStorage, writeStorage } from './storage'
import { seedProjects } from '../content/projects'
import type { Project } from '../types'

const KEY = 'projects'

export function listProjects(): Project[] {
  return readStorage<Project[]>(KEY, seedProjects)
}

export function getProject(slug: string): Project | undefined {
  return listProjects().find((p) => p.slug === slug)
}

// 新增或更新（按 slug 判重）
export function saveProject(project: Project): Project {
  const list = listProjects()
  const idx = list.findIndex((p) => p.slug === project.slug)
  if (idx >= 0) {
    list[idx] = project
  } else {
    list.push(project)
  }
  writeStorage(KEY, list)
  return project
}

export function deleteProject(slug: string): void {
  writeStorage(
    KEY,
    listProjects().filter((p) => p.slug !== slug),
  )
}
