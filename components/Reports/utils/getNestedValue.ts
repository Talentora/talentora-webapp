export function getNestedValue(obj: any, path: string | undefined | null): any {
  if (!path || typeof path !== 'string') return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
} 