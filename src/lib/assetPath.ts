/** Prefix public asset paths with Next.js `basePath` (needed on GitHub Pages). */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${base}${path}`;
}
