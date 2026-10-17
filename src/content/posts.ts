import type { Post } from '../types'

export const seedPosts: Post[] = [
  {
    slug: 'learning-path',
    title: '从数学竞赛到算法工程：我的学习路径',
    summary:
      '结合数学与算法竞赛经历，分享从数理基础到人工智能算法工程师的成长思考。',
    content:
      '# 从数学竞赛到算法工程\n\n## 起点：数理基础\n\n数学竞赛的经历为我打下了严谨的逻辑与抽象思维能力。\n\n## 进阶：数据结构与算法\n\n- 掌握常用数据结构\n- 理解算法复杂度\n\n## 展望\n\n持续深耕机器学习与深度学习方向。',
    date: '2026-10-01',
    tags: ['算法', '机器学习', '成长'],
    readingTime: 5,
    draft: false,
  },
]
