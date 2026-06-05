"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Eye, EyeOff, LayoutDashboard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogin } from "@/features/tenants/hooks/authhooks";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { mutate: loginMutation, isPending } = useLogin();
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }

  loginMutation(
    { email, password },
    {
      onSuccess: (data) => {
        // optional: store token/user
        // login(data)
        login(data.user); 
        router.push("/dashboard");
      },
      onError: () => {
        setError("Invalid email or password");
      },
    }
  );
};

  const demoCredentials = [
    { role: "Admin", email: "admin@rentmanagement.com", password: "admin123" },
    {
      role: "Property Manager",
      email: "manager@rentmanagement.com",
      password: "manager123",
    },
    {
      role: "Tenant",
      email: "tenant@rentmanagement.com",
      password: "tenant123",
    },
  ];

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Rent Manager</h1>
          <p className="mt-2 text-muted-foreground">
            Professional property & expense management
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-lg md:p-8">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Sign In
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-border bg-background cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg px-4 py-2.5 font-semibold transition-all",
                isLoading
                  ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
              )}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">
                Demo Credentials
              </span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="space-y-2">
            {demoCredentials.map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                className="w-full rounded-lg border border-border bg-background p-3 text-left text-sm transition-all hover:bg-secondary"
              >
                <div className="font-medium text-foreground">{cred.role}</div>
                <div className="text-xs text-muted-foreground">
                  {cred.email}
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Click any demo credential above to auto-fill the form, then click
            Sign In.
          </p>
        </div>
      </div>
    </main>
  );
}

