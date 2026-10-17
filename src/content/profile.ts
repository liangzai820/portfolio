import type { Profile } from '../types'

export const seedProfile: Profile = {
  name: '梁宏宇',
  title: '人工智能算法工程师',
  slogan: '主攻人工智能算法方向，具备扎实的编程与数理基础。',
  email: 'your-email@example.com',
  location: '中国 · 大连',
  tags: [
    '人工智能',
    '机器学习',
    '深度学习',
    '算法',
    'Java',
    'Python',
    '数据结构',
    'MATLAB',
  ],
  education: [
    {
      school: '大连海事大学',
      major: '计算机科学与技术',
      degree: '本科',
      note: '211 院校',
      period: '2023 – 2027',
    },
  ],
  courses: [
    'Java 语言程序设计',
    '数据结构',
    '模拟电子技术',
    '计算方法及 MATLAB 应用',
    'C 语言程序设计',
    '微机原理与汇编原理',
    '编译原理',
    '操作系统',
  ],
  awards: [
    { title: '全球校园人工智能算法精英大赛', level: '国家级三等奖', date: '' },
    { title: '第三十一届大连市数学竞赛', level: '三等奖', date: '' },
  ],
  experiences: [
    { organization: '双翼行大学生公益团队', role: '主席团成员', period: '' },
    { organization: '信息学院团委', role: '学生副书记', period: '' },
    { organization: '图书馆管理会讲解团', role: '主席', period: '' },
    { organization: '计科 2023-1 班', role: '班长', period: '' },
    { organization: '暑期支教', role: '副队长', period: '' },
    { organization: '「华夏典藏」项目', role: '负责人', period: '' },
  ],
}
