/**
 * Markdown内容加载器
 * 用于从content目录加载Markdown文件
 */

// 缓存已加载的内容
const contentCache = new Map();

/**
 * 获取Markdown内容
 * @param {string} path - 不带扩展名的文件路径
 * @returns {Promise<string>} Markdown内容
 */
export async function fetchMarkdownContent(path) {
  // 如果已缓存，直接返回
  if (contentCache.has(path)) {
    return contentCache.get(path);
  }

  try {
    const response = await fetch(`/content/${path}.md`);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${path}.md: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.text();
    
    // 缓存内容
    contentCache.set(path, content);
    
    return content;
  } catch (error) {
    console.error(`Error loading markdown content for ${path}:`, error);
    throw error;
  }
}

/**
 * 清除内容缓存
 * @param {string} [path] - 可选，指定要清除的路径，不提供则清除所有缓存
 */
export function clearContentCache(path) {
  if (path) {
    contentCache.delete(path);
  } else {
    contentCache.clear();
  }
}