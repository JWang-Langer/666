export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function excerpt(content: string, maxLen = 120): string {
  return content.length > maxLen ? content.slice(0, maxLen) + '...' : content;
}
