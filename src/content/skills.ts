import type { SkillGroup } from '../types'

export const seedSkills: SkillGroup[] = [
  {
    category: '编程语言',
    items: [
      { name: 'Java', level: '掌握' },
      { name: 'C', level: '掌握' },
      { name: 'Python', level: '掌握' },
    ],
  },
  {
    category: '数据与算法',
    items: [
      { name: '数据结构', level: '掌握' },
      { name: '机器学习', level: '掌握' },
      { name: '深度学习', level: '了解' },
    ],
  },
  {
    category: '工具与平台',
    items: [
      { name: 'MATLAB', level: '掌握' },
      { name: 'Git', level: '掌握' },
      { name: 'Linux', level: '了解' },
    ],
  },
  {
    category: '计算机基础',
    items: [
      { name: '操作系统', level: '掌握' },
      { name: '编译原理', level: '了解' },
      { name: '微机原理与汇编', level: '了解' },
    ],
  },
  {
    category: '综合能力',
    items: [
      { name: '团队管理', level: '熟练' },
      { name: '组织协调', level: '熟练' },
      { name: '公开表达', level: '熟练' },
    ],
  },
]
