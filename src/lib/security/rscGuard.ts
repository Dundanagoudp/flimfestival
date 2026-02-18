/**
 * RSC / request safety: prototype pollution, dangerous keys, and RCE-style payload detection.
 * Use in API routes or server actions: checkRequestSecurity(headers, body), validateRequestBody(body), createSafeResponse(...).
 */

const DANGEROUS_KEYS = new Set(
  [
    "__proto__",
    "constructor",
    "prototype",
    "_response",
    "_prefix",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
  ].map((k) => k.toLowerCase())
);

const DANGEROUS_VALUE_PATTERNS = [
  /process\.mainModule\.require/,
  /child_process/,
  /require\s*\(/,
  /eval\s*\(/,
  /Function\s*\(/,
  /import\s*\(/,
  /global\./,
  /globalThis\./,
  /__dirname/,
  /__filename/,
  /process\.env/,
  /fs\.readFile/,
  /fs\.writeFile/,
  /\bspawn\b/,
  /\bexec\b/,
  /new\s+Function/,
  /\.call\s*\(/,
  /\.apply\s*\(/,
  /bind\s*\(/,
  /document\./,
  /window\./,
  /document\.cookie/,
  /localStorage/,
  /sessionStorage/,
];

const MAX_BODY_STRING_LENGTH = 1024 * 1024;
const DEFAULT_MAX_DEPTH = 10;

export function hasDangerousKey(key: string): boolean {
  if (typeof key !== "string") return false;
  return DANGEROUS_KEYS.has(key.toLowerCase());
}

export function hasDangerousValue(value: unknown): boolean {
  const s = String(value);
  return DANGEROUS_VALUE_PATTERNS.some((re) => re.test(s));
}

export interface ScanResult {
  isSafe: boolean;
  dangerousKeys: string[];
  dangerousValues: string[];
  reason?: string;
}

export function scanObjectForRscGadgets(
  obj: unknown,
  maxDepth: number = DEFAULT_MAX_DEPTH,
  currentDepth: number = 0
): ScanResult {
  const dangerousKeys: string[] = [];
  const dangerousValues: string[] = [];
  const seen = new WeakSet();

  function scan(value: unknown, depth: number): void {
    if (depth > maxDepth) {
      return;
    }

    if (value === null || typeof value !== "object") {
      if (hasDangerousValue(value)) {
        dangerousValues.push(String(value));
      }
      return;
    }

    if (seen.has(value as object)) return;
    seen.add(value as object);

    if (Array.isArray(value)) {
      for (const item of value) {
        scan(item, depth + 1);
      }
      return;
    }

    for (const [key, val] of Object.entries(value)) {
      if (hasDangerousKey(key)) {
        dangerousKeys.push(key);
      }
      if (hasDangerousValue(val)) {
        dangerousValues.push(String(val));
      }
      scan(val, depth + 1);
    }
  }

  scan(obj, currentDepth);

  const isSafe = dangerousKeys.length === 0 && dangerousValues.length === 0;
  return {
    isSafe,
    dangerousKeys,
    dangerousValues,
    reason: isSafe
      ? undefined
      : `Dangerous keys: ${dangerousKeys.join(", ")}; dangerous values: ${dangerousValues.length} found`,
  };
}

export interface ValidateBodyResult {
  isValid: boolean;
  error?: string;
  details?: { dangerousKeys: string[]; dangerousValues: string[] };
}

export function validateRequestBody(body: unknown): ValidateBodyResult {
  if (typeof body === "string") {
    if (body.length > MAX_BODY_STRING_LENGTH) {
      return { isValid: false, error: "Request body too large" };
    }
    try {
      body = JSON.parse(body) as unknown;
    } catch {
      return { isValid: false, error: "Invalid JSON" };
    }
  }

  if (body === null || body === undefined) {
    return { isValid: true };
  }

  if (typeof body !== "object") {
    return { isValid: true };
  }

  const scan = scanObjectForRscGadgets(body);
  if (!scan.isSafe) {
    return {
      isValid: false,
      error: "Request body contains disallowed content",
      details: {
        dangerousKeys: scan.dangerousKeys,
        dangerousValues: scan.dangerousValues,
      },
    };
  }
  return { isValid: true };
}

export function createSafeResponse(
  success: boolean,
  message?: string,
  data?: unknown
): { success: boolean; message?: string; data?: unknown } {
  const out: { success: boolean; message?: string; data?: unknown } = { success };
  if (message !== undefined) out.message = message;
  if (data !== undefined) {
    const scan = scanObjectForRscGadgets(data);
    if (scan.isSafe) {
      out.data = data;
    } else {
      if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
        console.warn("[createSafeResponse] Omitting data due to unsafe content:", scan.reason);
      }
    }
  }
  return out;
}

export function checkRequestSecurity(
  headers: Headers,
  body?: unknown
): null | { error: string; status: number } {
  const accept = headers.get("accept") ?? "";
  if (accept.includes("text/x-component")) {
    return { error: "Forbidden", status: 403 };
  }
  if (headers.has("next-action")) {
    return { error: "Forbidden", status: 403 };
  }
  if (body !== undefined) {
    const result = validateRequestBody(body);
    if (!result.isValid) {
      return { error: result.error ?? "Bad request", status: 400 };
    }
  }
  return null;
}
