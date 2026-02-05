export const HOCUSPOCUS_DEBOUNCE_MS = 2000;
export const HOCUSPOCUS_MAX_DEBOUNCE_MS = 10000;

export const DOCUMENT_NAME_PREFIX = {
  WORKSPACE: 'workspace:',
} as const;

export const WEBSOCKET_PATHS = {
  COLLABORATION: '/collaboration',
} as const;

export const REDIS_KEY_PREFIX = {
  YJS_DOC: 'yjs:doc:',
} as const;

export const DEFAULT_WIDGET_LAYOUT = {
  X: 0,
  Y: 0,
  WIDTH: 300,
  HEIGHT: 300,
} as const;
