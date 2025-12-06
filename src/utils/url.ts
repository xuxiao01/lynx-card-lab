/**
 * URL 处理工具
 * 用于处理 Lynx 环境中的资源路径问题
 * 
 * Lynx 真机环境说明：
 * - window、window.location 都不可用
 * - 必须使用完整的 http://IP:PORT 格式
 */

/**
 * 获取前端服务器地址（用于静态资源）
 */
function getFrontendURL(): string {
  // 在 Lynx 真机中，window 不可用，直接使用配置
  // 优先使用环境变量，否则使用默认值
  const frontendURL = import.meta.env.VITE_FRONTEND_URL || 'http://192.168.0.102:3000'
  
  console.log('[URL] 前端服务器地址:', frontendURL)
  
  return frontendURL
}

/**
 * 处理图片 URL
 * 在 Lynx 环境中，将相对路径转换为完整 URL
 * 
 * @param url - 图片 URL（可能是相对路径或完整 URL）
 * @param fallbackUrl - 可选的降级图片（当 URL 无效时使用）
 * @returns 处理后的图片 URL
 * 
 * @example
 * // 完整 URL，直接返回
 * processImageUrl('http://example.com/image.png')
 * // → 'http://example.com/image.png'
 * 
 * // Lynx 环境中的静态资源路径
 * processImageUrl('/static/image/xxx.png')
 * // → 'http://192.168.0.100:3001/static/image/xxx.png'
 * 
 * // 浏览器环境中的静态资源路径
 * processImageUrl('/static/image/xxx.png')
 * // → '/static/image/xxx.png'
 */
export function processImageUrl(url: string, fallbackUrl?: string): string {
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 如果是后端返回的静态资源路径（如 /static/image/xxx.png）
  // 在 Lynx 环境中需要转换为完整 URL
  if (url.startsWith('/static/') || url.startsWith('/assets/')) {
    const isLynx = typeof __MAIN_THREAD__ !== 'undefined'
    if (isLynx) {
      // Lynx 环境：自动获取前端服务器的完整 URL
      const frontendURL = getFrontendURL()
      return `${frontendURL}${url}`
    }
    // 浏览器环境：保持相对路径
    return url
  }
  
  // 其他情况：如果提供了降级 URL，使用降级 URL
  if (fallbackUrl) {
    return fallbackUrl
  }
  
  // 否则返回原 URL
  return url
}

/**
 * 批量处理图片 URL
 * 
 * @param urls - 图片 URL 数组
 * @returns 处理后的图片 URL 数组
 */
export function processImageUrls(urls: string[]): string[] {
  return urls.map(url => processImageUrl(url))
}

/**
 * 处理对象中的图片 URL 字段
 * 
 * @param obj - 包含图片 URL 的对象
 * @param imageFields - 需要处理的图片字段名数组
 * @returns 处理后的对象
 * 
 * @example
 * const deal = {
 *   dealId: '1',
 *   dealImage: '/static/image/food.png',
 *   title: 'Food'
 * }
 * processObjectImageUrls(deal, ['dealImage'])
 * // → { dealId: '1', dealImage: 'http://192.168.0.100:3001/static/image/food.png', title: 'Food' }
 */
export function processObjectImageUrls<T extends Record<string, any>>(
  obj: T,
  imageFields: (keyof T)[],
): T {
  const processed = { ...obj }
  
  imageFields.forEach(field => {
    if (typeof processed[field] === 'string') {
      processed[field] = processImageUrl(processed[field] as string) as T[keyof T]
    }
  })
  
  return processed
}

