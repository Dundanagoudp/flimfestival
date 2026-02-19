"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { FormEvent, useEffect, useState } from "react"
import { loginUser } from "@/services/authService"
import { getMyProfile } from "@/services/userServices"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/custom-toast"
import { useAuth } from "@/context/auth-context"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/api/v1"
const captchaUrl = `${apiBaseUrl}/captcha/generate`

const LOCK_DURATION_MS = 5 * 60 * 1000
const LOCK_STORAGE_KEY = "loginLockUntil"
const LOCK_MESSAGE =
  "Too many failed login attempts. This IP is locked for 5 minutes. Try again later."

function getStoredLockUntil(): number | null {
  if (typeof window === "undefined") return null
  const stored = sessionStorage.getItem(LOCK_STORAGE_KEY)
  if (!stored) return null
  const ts = parseInt(stored, 10)
  return Number.isFinite(ts) && ts > Date.now() ? ts : null
}

/** Detect backend rate-limit message (429 or 200 + success: false with rate-limit text) */
function isRateLimitMessage(msg: string): boolean {
  if (!msg || typeof msg !== "string") return false
  return /too many login attempts/i.test(msg) || /too many requests/i.test(msg) || /rate limit/i.test(msg)
}

/**
 * Parse lock duration from 429 response headers.
 * Returns lockUntil (ms timestamp) or null to use fallback.
 */
function getLockUntilFromHeaders(headers: Record<string, string> | undefined): number | null {
  if (!headers || typeof headers !== "object") return null
  const get = (key: string) => {
    const lower = key.toLowerCase()
    const value = headers[lower] ?? headers[key]
    return typeof value === "string" ? value.trim() : ""
  }
  // RateLimit-Reset: Unix timestamp in seconds
  const reset = get("ratelimit-reset")
  if (reset) {
    const sec = parseInt(reset, 10)
    if (Number.isFinite(sec)) {
      const ms = sec <= 1e10 ? sec * 1000 : sec
      return ms > Date.now() ? ms : null
    }
  }
  // Retry-After: seconds until retry
  const retryAfter = get("retry-after")
  if (retryAfter) {
    const sec = parseInt(retryAfter, 10)
    if (Number.isFinite(sec) && sec > 0) return Date.now() + sec * 1000
  }
  return null
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [altchaKey, setAltchaKey] = useState(Date.now())
  const [captchaError, setCaptchaError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [lockUntil, setLockUntil] = useState<number | null>(null)
  const [loginError, setLoginError] = useState("")
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null)
  const router = useRouter()
  const { showToast } = useToast()
  const { login } = useAuth()

  // Hydrate lock from sessionStorage on mount
  useEffect(() => {
    const stored = getStoredLockUntil()
    if (stored) setLockUntil(stored)
  }, [])

  // Countdown timer when locked
  useEffect(() => {
    if (lockUntil == null || lockUntil <= Date.now()) {
      if (lockUntil != null) {
        setLockUntil(null)
        setCountdownSeconds(null)
        sessionStorage.removeItem(LOCK_STORAGE_KEY)
        setLoginError("")
      }
      return
    }
    const tick = () => {
      const now = Date.now()
      if (lockUntil <= now) {
        setLockUntil(null)
        setCountdownSeconds(null)
        sessionStorage.removeItem(LOCK_STORAGE_KEY)
        setLoginError("")
        return
      }
      setCountdownSeconds(Math.ceil((lockUntil - now) / 1000))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [lockUntil])

  // Load ALTCHA on mount. The widget fetches the challenge from captchaUrl (GET /captcha/generate).
  useEffect(() => {
    if (typeof window === "undefined") return
    setMounted(true)
    Promise.all([
      import("altcha/external"),
      import("altcha/altcha.css"),
    ]).catch(console.error)
  }, [])

  // Prevent inspect / devtools on login page (right-click and common shortcuts).
  useEffect(() => {
    if (typeof document === "undefined") return
    const preventContextMenu = (e: MouseEvent) => e.preventDefault()
    const preventDevToolsKeys = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault()
        return
      }
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
        e.preventDefault()
        return
      }
      if (e.ctrlKey && e.key === "U") {
        e.preventDefault()
        return
      }
      if (e.metaKey && e.altKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
        e.preventDefault()
        return
      }
    }
    document.addEventListener("contextmenu", preventContextMenu)
    document.addEventListener("keydown", preventDevToolsKeys)
    return () => {
      document.removeEventListener("contextmenu", preventContextMenu)
      document.removeEventListener("keydown", preventDevToolsKeys)
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    setCaptchaError("")
    setLoginError("")

    if (lockUntil != null && lockUntil > Date.now()) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")

    if (!email || !password) {
      showToast("Please enter email and password", "warning")
      return
    }

    const widget = form.querySelector("altcha-widget") as HTMLElement & { value?: string }
    const hiddenInput = form.querySelector('input[name="altcha"]') as HTMLInputElement | null
    const altchaPayload = hiddenInput?.value?.trim() || widget?.value?.trim()

    if (!widget) {
      setCaptchaError("CAPTCHA widget not loaded")
      return
    }
    if (!altchaPayload) {
      setCaptchaError("Please complete the CAPTCHA")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await loginUser({ email, password, altchaPayload })

      if (!res.success) {
        const msg = res.message || "Login failed"
        if (isRateLimitMessage(msg)) {
          const until = Date.now() + LOCK_DURATION_MS
          setLoginError(msg)
          setLockUntil(until)
          try {
            sessionStorage.setItem(LOCK_STORAGE_KEY, String(until))
          } catch {
            /* ignore */
          }
          showToast(msg, "error")
          setAltchaKey(Date.now())
          return
        }
        showToast(msg, "error")
        setAltchaKey(Date.now())
        return
      }

      const profileResponse = await getMyProfile()
      if (!profileResponse.success || !profileResponse.data) {
        showToast("Login succeeded but could not load your profile. Please refresh.", "error")
        setAltchaKey(Date.now())
        return
      }

      setLockUntil(null)
      setLoginError("")
      sessionStorage.removeItem(LOCK_STORAGE_KEY)
      login(profileResponse.data)
      showToast(res.message || "Login successful", "success")
      router.replace("/admin/dashboard")
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: { message?: string }
          status?: number
          headers?: Record<string, string>
        }
        message?: string
      }
      const status = err?.response?.status
      const apiMessage = err?.response?.data?.message || err?.message || "Login failed"

      if (status === 429) {
        const lockMessage = err?.response?.data?.message || LOCK_MESSAGE
        const headerUntil = getLockUntilFromHeaders(err?.response?.headers)
        const until = headerUntil ?? Date.now() + LOCK_DURATION_MS
        setLockUntil(until)
        setLoginError(lockMessage)
        try {
          sessionStorage.setItem(LOCK_STORAGE_KEY, String(until))
        } catch {
          /* ignore */
        }
        showToast(lockMessage, "error")
      } else if (status === 401) {
        const msg = "Incorrect email or password"
        setLoginError(msg)
        showToast(msg, "error")
      } else {
        setLoginError(apiMessage)
        showToast(apiMessage, "error")
      }
      setAltchaKey(Date.now())
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLocked = lockUntil != null && lockUntil > Date.now()
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md mx-auto shadow-lg border border-border bg-card/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground font-montserrat">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-sm font-montserrat">
                  Login in to your account to continue
                </p>
              </div>

              {isLocked && (
                <div
                  className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400 font-montserrat"
                  data-testid="login-lock-message"
                >
                  <p>{loginError || LOCK_MESSAGE}</p>
                  {countdownSeconds != null && countdownSeconds > 0 && (
                    <p className="mt-2 font-medium">
                      Try again in {Math.floor(countdownSeconds / 60)}:
                      {String(countdownSeconds % 60).padStart(2, "0")}
                    </p>
                  )}
                </div>
              )}

              {loginError && !isLocked && (
                <p className="text-sm text-red-500 font-montserrat" data-testid="login-error">
                  {loginError}
                </p>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground font-montserrat">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    name="email"
                    autoComplete="off"
                    disabled={isLocked}
                    className="h-12 border-input focus:border-ring focus:ring-ring/20 transition-colors font-montserrat"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground font-montserrat">
                    Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password"
                      required 
                      name="password" 
                      autoComplete="off"
                      disabled={isLocked}
                      className="h-12 border-input focus:border-ring focus:ring-ring/20 transition-colors font-montserrat pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* ALTCHA CAPTCHA - uses GET /captcha/generate via challengeurl */}
                <div className="space-y-2">
                  {mounted &&
                    React.createElement("altcha-widget" as "div", {
                      key: altchaKey,
                      challengeurl: captchaUrl,
                      workerurl: "/altcha-worker.js",
                    })}
                  {captchaError && (
                    <p className="text-sm text-red-500 font-montserrat">{captchaError}</p>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-montserrat" 
                disabled={isSubmitting || isLocked}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
