/**
 * Sanitization utilities for user-generated content: HTML, URLs, file uploads, and plain text.
 * Uses DOMPurify for HTML (browser); safe fallback on server.
 */

import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "span",
  "div",
];
const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class", "id"];

const FORBIDDEN_URI_PREFIXES = ["javascript:", "data:", "vbscript:", "file:"];

function stripTagsFallback(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function getSanitizeConfig() {
  return {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["target"],
    ALLOW_DATA_ATTR: false,
  } as DOMPurify.Config;
}

/**
 * Sanitize HTML with a strict allowlist. Safe for rendering user-generated rich text.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== "string") return "";
  if (typeof window === "undefined") {
    return stripTagsFallback(dirty);
  }
  return DOMPurify.sanitize(dirty, getSanitizeConfig() as Parameters<typeof DOMPurify.sanitize>[1]);
}

/**
 * Strip all HTML tags and return plain text. Keeps text content.
 */
export function stripHtml(html: string): string {
  if (typeof html !== "string") return "";
  if (typeof window === "undefined") {
    return stripTagsFallback(html);
  }
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
}

/**
 * Strip HTML and trim. Use for descriptions and excerpts shown as plain text.
 */
export function sanitizeTextContent(content: string): string {
  if (typeof content !== "string") return "";
  return stripHtml(content).trim();
}

const IMAGE_EXTENSIONS = new Set(
  ["jpg", "jpeg", "png", "gif", "webp", "svg"].map((e) => e.toLowerCase())
);

/**
 * Validate file type, size, and (for images) extension.
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeInMB: number
): { valid: true } | { valid: false; error: string } {
  const allowedSet = new Set(allowedTypes.map((t) => t.toLowerCase()));
  const maxBytes = maxSizeInMB * 1024 * 1024;

  if (!allowedSet.has(file.type.toLowerCase())) {
    return { valid: false, error: `File type not allowed. Allowed: ${allowedTypes.join(", ")}` };
  }

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeInMB} MB`,
    };
  }

  const isImage = file.type.toLowerCase().startsWith("image/");
  if (isImage) {
    const name = file.name || "";
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (ext && !IMAGE_EXTENSIONS.has(ext)) {
      return {
        valid: false,
        error: `Image extension not allowed. Allowed: jpg, jpeg, png, gif, webp, svg`,
      };
    }
  }

  return { valid: true };
}

/**
 * Return a safe URL for href or redirects. Rejects javascript:, data:, vbscript:, file:.
 * Allows http://, https://, and relative paths.
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  for (const prefix of FORBIDDEN_URI_PREFIXES) {
    if (lower.startsWith(prefix)) return "";
  }

  if (/^\s*https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\s*\/\//.test(trimmed)) return ""; // protocol-relative can be abused
  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return trimmed;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return ""; // other protocols
  if (/^[#.]|^[a-z]/i.test(trimmed)) return "/" + trimmed;
  return trimmed;
}
