// 简单同步哈希（djb2），仅用于本 demo 演示，非生产级安全用途。
// 用于避免将登录密码以明文形式写入 localStorage。
export function hashPassword(input: string): string {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0
  }
  return `h${(h >>> 0).toString(16)}`
}
