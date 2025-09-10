"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useState } from "react"
import { loginUser } from "@/services/authService"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/custom-toast"
import { useAuth } from "@/context/auth-context"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()
  const { login } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")
    if (!email || !password) {
      showToast("Please enter email and password", "warning")
      return
    }
    try {
      setIsSubmitting(true)
      const res = await loginUser({ email, password })
      
      // Store token and user role in cookies
      Cookies.set("token", res.token, { sameSite: "lax" })
      if (res.data?.user?.role) {
        Cookies.set("userRole", res.data.user.role, { sameSite: "lax" })
        // Update auth context
        login(res.data.user.role)
      }
      
      showToast(res.message || "Login successful", "success")
      router.replace("/admin/dashboard")
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || error?.message || "Login failed"
      showToast(apiMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md mx-auto shadow-lg border border-border bg-card/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
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
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-montserrat" 
                disabled={isSubmitting}
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
