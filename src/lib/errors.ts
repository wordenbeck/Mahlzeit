/**
 * Structured error handling for Web Share Target flow
 */

export type ErrorCode =
  | 'ERR_INSTAGRAM_BLOCKED'
  | 'ERR_INSTAGRAM_PRIVATE'
  | 'ERR_CAPTION_EMPTY'
  | 'ERR_GROQ_TIMEOUT'
  | 'ERR_GROQ_RATELIMIT'
  | 'ERR_GROQ_SERVER_ERROR'
  | 'ERR_GROQ_FAILED'
  | 'ERR_IMAGE_SEARCH_FAILED'
  | 'ERR_NETWORK'
  | 'ERR_PARSE_FAILED'
  | 'ERR_UNKNOWN';

export interface AppError {
  code: ErrorCode;
  message: string; // User-friendly message
  details?: string; // Technical details for console
  action?: 'RETRY' | 'MANUAL_EDIT' | 'SKIP' | 'NONE';
}

export function getErrorInfo(code: ErrorCode, context?: string): AppError {
  const errorMap: Record<ErrorCode, { message: string; action: AppError['action']; icon: string }> = {
    ERR_INSTAGRAM_BLOCKED: {
      message: '📱 Instagram ist blockiert oder nicht erreichbar. Möglicherweise ein Netzwerkproblem.',
      action: 'RETRY',
      icon: '🚫',
    },
    ERR_INSTAGRAM_PRIVATE: {
      message: '🔒 Der Reel ist privat oder wurde gelöscht. Versuche einen anderen Link.',
      action: 'NONE',
      icon: '🔒',
    },
    ERR_CAPTION_EMPTY: {
      message: '📝 Der Reel hat keine aussagekräftige Caption. Bitte manuell eingeben.',
      action: 'MANUAL_EDIT',
      icon: '📝',
    },
    ERR_GROQ_TIMEOUT: {
      message: '⏱️ KI-Analyse dauert zu lange. Versuche es erneut oder bearbeite manuell.',
      action: 'RETRY',
      icon: '⏱️',
    },
    ERR_GROQ_RATELIMIT: {
      message: '📊 Rate-Limit erreicht. Bitte warte kurz und versuche es erneut.',
      action: 'RETRY',
      icon: '📊',
    },
    ERR_GROQ_SERVER_ERROR: {
      message: '🔧 Groq-Server antwortet nicht. Bitte versuche es in einer Minute erneut.',
      action: 'RETRY',
      icon: '🔧',
    },
    ERR_GROQ_FAILED: {
      message: '🤖 KI-Analyse fehlgeschlagen. Verwende vereinfachten Parser.',
      action: 'MANUAL_EDIT',
      icon: '🤖',
    },
    ERR_IMAGE_SEARCH_FAILED: {
      message: '🖼️ Bildsuche fehlgeschlagen. Du kannst ein Bild später hinzufügen.',
      action: 'SKIP',
      icon: '🖼️',
    },
    ERR_NETWORK: {
      message: '🌐 Netzwerkfehler. Überprüfe deine Internetverbindung.',
      action: 'RETRY',
      icon: '🌐',
    },
    ERR_PARSE_FAILED: {
      message: '❌ Daten konnten nicht geparst werden. Bitte manuell eingeben.',
      action: 'MANUAL_EDIT',
      icon: '❌',
    },
    ERR_UNKNOWN: {
      message: '❓ Ein unbekannter Fehler ist aufgetreten. Bitte versuche es erneut.',
      action: 'RETRY',
      icon: '❓',
    },
  };

  const info = errorMap[code];
  return {
    code,
    message: info.message,
    action: info.action,
    details: context,
  };
}

export function formatErrorDisplay(error: AppError): {
  icon: string;
  title: string;
  message: string;
  buttons: Array<{ label: string; action: AppError['action'] }>;
} {
  const actionLabels: Record<Exclude<AppError['action'], undefined | 'NONE'>, string> = {
    RETRY: '🔄 Nochmal versuchen',
    MANUAL_EDIT: '✏️ Manuell bearbeiten',
    SKIP: '➡️ Überspringen',
  };

  const icons: Record<ErrorCode, string> = {
    ERR_INSTAGRAM_BLOCKED: '📱',
    ERR_INSTAGRAM_PRIVATE: '🔒',
    ERR_CAPTION_EMPTY: '📝',
    ERR_GROQ_TIMEOUT: '⏱️',
    ERR_GROQ_RATELIMIT: '📊',
    ERR_GROQ_SERVER_ERROR: '🔧',
    ERR_GROQ_FAILED: '🤖',
    ERR_IMAGE_SEARCH_FAILED: '🖼️',
    ERR_NETWORK: '🌐',
    ERR_PARSE_FAILED: '❌',
    ERR_UNKNOWN: '❓',
  };

  const buttons: Array<{ label: string; action: AppError['action'] }> = [];
  if (error.action && error.action !== 'NONE') {
    buttons.push({
      label: actionLabels[error.action],
      action: error.action,
    });
  }

  return {
    icon: icons[error.code],
    title: error.code,
    message: error.message,
    buttons,
  };
}
