
export const PAGE_SIZE = 8;

const CLOUDINARY_MARKER = '/image/upload/';

export function isCloudinaryUrl(url) {
  return typeof url === 'string'
    && /^https?:\/\/res\.cloudinary\.com\//i.test(url)
    && url.includes(CLOUDINARY_MARKER);
}

function withTransform(url, transform) {
  const index = url.indexOf(CLOUDINARY_MARKER) + CLOUDINARY_MARKER.length;
  return `${url.slice(0, index)}${transform}/${url.slice(index)}`;
}

export function optimizeImageUrl(url, width = 400) {
  if (!isCloudinaryUrl(url)) return url;
  return withTransform(url, `f_auto,q_auto,w_${Math.round(width)}`);
}

export function placeholderImageUrl(url) {
  if (!isCloudinaryUrl(url)) return '';
  return withTransform(url, 'f_auto,q_10,w_30');
}

function safePage(page) {
  return Math.max(1, Math.floor(page) || 1);
}

export function getPagedItems(items, page = 1, size = PAGE_SIZE) {
  return items.slice(0, safePage(page) * size);
}

export function hasMorePages(total, page = 1, size = PAGE_SIZE) {
  return safePage(page) * size < total;
}
