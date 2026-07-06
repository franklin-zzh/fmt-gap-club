/**
 * 返回 OSS 上的图片完整 URL
 * @param {string} filename - 图片文件名，如 '0GAP_club.png'
 * @returns {string} 完整的 OSS URL，配置缺失时返回空字符串
 *
 * 用法：
 *   <img src={ossUrl('0GAP_club.png')} alt="" />
 */
export function ossUrl(filename) {
  const base = import.meta.env.VITE_APP_OSS_BASE_URL;

  if (!base) {
    if (import.meta.env.DEV) {
      console.warn('[ossUrl] VITE_APP_OSS_BASE_URL 未配置，图片将无法加载');
    }
    return '';
  }

  if (!filename) {
    return '';
  }

  // 移除 base 末尾的斜杠（如有），避免双斜杠
  const normalizedBase = base.replace(/\/+$/, '');
  return `${normalizedBase}/frontend/src/assets/images/${filename}`;
}
