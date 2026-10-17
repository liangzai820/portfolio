// 全站统一数据类型定义（前台与后台共用）

export interface Education {
  school: string
  major: string
  degree: string
  note?: string
  period: string
}

export interface Award {
  title: string
  level: string
  date: string
}

export interface Experience {
  organization: string
  role: string
  period: string
  description?: string
}

export interface Profile {
  name: string
  title: string
  slogan: string
  email: string
  location: string
  tags: string[]
  education: Education[]
  courses: string[]
  awards: Award[]
  experiences: Experience[]
}

export type SkillLevel = '熟练' | '掌握' | '了解'

export interface SkillItem {
  name: string
  level: SkillLevel
  description?: string
}

export interface SkillGroup {
  category: string
  items: SkillItem[]
}

export interface Project {
  slug: string
  name: string
  summary: string
  description: string
  techStack: string[]
  role: string
  highlights: string[]
  demoUrl?: string
  sourceUrl?: string
  featured: boolean
  date: string
}

export interface Post {
  slug: string
  title: string
  summary: string
  content: string
  date: string
  tags: string[]
  readingTime: number
  draft: boolean
}

export interface Settings {
  siteTitle: string
  siteDescription: string
  adminUsername: string
  adminPasswordHash: string
}
