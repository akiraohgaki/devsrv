/**
 * MIME Types.
 */
const mimeTypes: Record<string, string> = {
  // Text
  'txt': 'text/plain',
  'htm': 'text/html',
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'ts': 'text/plain',
  // Font
  'eot': 'application/vnd.ms-fontobject',
  'ttf': 'font/ttf',
  'otf': 'font/otf',
  'woff': 'font/woff',
  'woff2': 'font/woff2',
  // Image
  'svg': 'image/svg+xml',
  'ico': 'image/vnd.microsoft.icon',
  'gif': 'image/gif',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'jfif': 'image/jpeg',
  'pjpeg': 'image/jpeg',
  'pjp': 'image/jpeg',
  'png': 'image/png',
  'apng': 'image/apng',
  'webp': 'image/webp',
  'avif': 'image/avif',
  // Audio and Video
  'wav': 'audio/wav',
  'flac': 'audio/flac',
  'mp3': 'audio/mpeg',
  'mp4': 'video/mp4',
  'm4a': 'audio/mp4',
  'm4v': 'video/mp4',
  'ogg': 'application/ogg',
  'oga': 'audio/ogg',
  'ogv': 'video/ogg',
  'weba': 'audio/webm',
  'webm': 'video/webm',
  'av1': 'video/av1',
  // Application data format
  'bin': 'application/octet-stream',
  'json': 'application/json',
  'yml': 'application/yaml',
  'yaml': 'application/yaml',
  'xml': 'application/xml',
  'wasm': 'application/wasm',
};

export default mimeTypes;
