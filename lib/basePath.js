export const basePath = process.env.NODE_ENV === "production" ? "/Web-Portfolio-2026" : "";

export function withBasePath(path) {
  return `${basePath}${path}`;
}
