import type { BaseResponse } from '../types/common'

/**
 * 获取当前访问的主机地址（自动获取域名和端口）
 */
function getHostURL(): string {
  // 尝试从 window.location 获取（Lynx 环境可能支持）
  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname } = window.location
    // 返回协议 + 域名，例如 http://192.168.0.100
    return `${protocol}//${hostname}`
  }
  
  // 如果无法获取，使用环境变量配置
  return import.meta.env.VITE_DEV_HOST || 'http://192.168.0.100'
}

/**
 * 获取 API 基础 URL
 * 开发环境下，Lynx 可能需要完整的 URL
 */
function getBaseURL(): string {
  // 在开发环境中，如果是 Lynx 环境，使用完整 URL
  if (import.meta.env.DEV) {
    // 检测是否在 Lynx 环境中
    const isLynx = typeof __MAIN_THREAD__ !== 'undefined'
    
    if (isLynx) {
      // Lynx 环境：自动获取当前访问的域名 + 后端端口
      // 注意：Lynx 无法访问 localhost，需要使用真实 IP
      const host = getHostURL()
      const backendPort = import.meta.env.VITE_API_PORT || '4000'
      return `${host}:${backendPort}`
    } else {
      // 浏览器环境：使用相对路径，通过代理访问
      return ''
    }
  }
  
  // 生产环境：使用相对路径或配置的 API 地址
  return import.meta.env.VITE_API_BASE_URL || ''
}

const baseURL = getBaseURL()

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

  // 构建完整 URL
  let fullURL = baseURL + url

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

