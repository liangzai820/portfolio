import { readStorage, writeStorage } from './storage'
import { seedPosts } from '../content/posts'
import type { Post } from '../types'

const KEY = 'posts'

export function listPosts(): Post[] {
  return readStorage<Post[]>(KEY, seedPosts)
}

export function getPost(slug: string): Post | undefined {
  return listPosts().find((p) => p.slug === slug)
}

// 新增或更新（按 slug 判重）
export function savePost(post: Post): Post {
  const list = listPosts()
  const idx = list.findIndex((p) => p.slug === post.slug)
  if (idx >= 0) {
    list[idx] = post
  } else {
    list.push(post)
  }
  writeStorage(KEY, list)
  return post
}

export function deletePost(slug: string): void {
  writeStorage(
    KEY,
    listPosts().filter((p) => p.slug !== slug),
  )
}
