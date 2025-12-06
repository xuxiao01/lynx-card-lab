import type { BaseResponse } from '../types/common'

/**
 * 获取 API 基础 URL
 * 
 * Lynx 真机环境说明：
 * - window、window.location 都不可用
 * - 必须使用完整的 http://IP:PORT 格式
 * - 不能使用 localhost，必须使用真实 IP
 */
function getBaseURL(): string {
  // 检测是否在 Lynx 环境中
  const isLynx = typeof __MAIN_THREAD__ !== 'undefined'
  
  if (isLynx) {
    // Lynx 环境：使用完整 URL（真机和开发环境都需要）
    // 优先使用环境变量，否则使用默认 IP
    const apiHost = import.meta.env.VITE_API_HOST || 'http://192.168.0.102:4000'
    
    console.log('[HTTP] Lynx 环境检测:')
    console.log('  - API Host:', apiHost)
    console.log('  - 环境:', import.meta.env.DEV ? '开发' : '生产')
    
    return apiHost
  } else {
    // 浏览器环境：使用相对路径，通过代理访问
    console.log('[HTTP] 浏览器环境，使用代理')
    return ''
  }
}

// 在每次请求时动态获取 baseURL，而不是在模块加载时固定
// 这样可以确保在真机环境中也能正确获取

/**
 * HTTP 请求配置
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, any>
}

/**
 * 封装的 fetch 请求
 */
async function request<T = any>(
  url: string,
  config: RequestConfig = {},
): Promise<BaseResponse<T>> {
  const { params, ...fetchConfig } = config

  // 动态获取 baseURL（每次请求时获取，确保真机环境正确）
  const baseURL = getBaseURL()
  
  // 构建完整 URL
  let fullURL = baseURL + url
  
  // 调试日志
  console.log('[HTTP] 请求信息:')
  console.log('  - baseURL:', baseURL)
  console.log('  - path:', url)
  console.log('  - fullURL:', fullURL)

  // 处理查询参数
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      fullURL += `?${queryString}`
    }
  }

  try {
    const response = await fetch(fullURL, {
      ...fetchConfig,
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const text = await response.text()
    
    if (!text || text.trim() === '') {
      throw new Error('响应内容为空')
    }

    const data = JSON.parse(text)

    // 检查业务状态码
    if (data.code !== 200) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    console.error('HTTP 请求失败:', error)
    throw error
  }
}

/**
 * GET 请求
 */
export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig,
): Promise<BaseResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'GET',
    params,
  })
}

/**
 * POST 请求
 */
export function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<BaseResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * PUT 请求
 */
export function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<BaseResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * DELETE 请求
 */
export function del<T = any>(
  url: string,
  config?: RequestConfig,
): Promise<BaseResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'DELETE',
  })
}

export default {
  get,
  post,
  put,
  delete: del,
}

