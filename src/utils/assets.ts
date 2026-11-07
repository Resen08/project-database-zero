// Utility to resolve asset paths reliably across localhost, root domains, and GitHub Pages subpaths

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
