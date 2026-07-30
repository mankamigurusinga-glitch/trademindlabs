import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const title = "Sign in — TradeMind AI";
const description =
  "Sign in or create your TradeMind AI account to access AI crypto futures analysis, alerts, journal and watchlist.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "That email and password combination doesn't match.";
  if (m.includes("already registered")) return "An account with this email already exists.";
  if (m.includes("email not confirmed")) return "Please confirm your email before signing in.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return message;
}

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [session, loading, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-ambient, none)" }}
      />
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-brand)]">
            <Activity className="h-5 w-5 text-background" strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">TradeMind AI</span>
        </Link>

        <div className="glass-card glass-sheen rounded-3xl p-6 sm:p-8">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <RegisterForm />
            </TabsContent>
            <TabsContent value="forgot" className="mt-6">
              <ForgotForm />
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          TradeMind AI provides education and analysis, not financial advice.
        </p>
      </div>
    </div>
  );
}

function GoogleButton() {
  const [busy, setBusy] = React.useState(false);

  async function signInWithGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    window.location.href = "/dashboard";
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={busy}
        onClick={signInWithGoogle}
      >
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Continue with Google
      </Button>
      <div className="my-5 flex items-center gap-3 text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
    </>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password") })
      .safeParse({ email, password });
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password,
    });
    setBusy(false);
    if (err) return setError(friendly(err.message));
    toast.success("Welcome back");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <GoogleButton />
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}

function RegisterForm() {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = z
      .object({
        fullName: z.string().trim().min(2, "Enter your name").max(80),
        email: emailSchema,
        password: passwordSchema,
      })
      .safeParse({ fullName, email, password });
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setBusy(true);
    const { error: err } = await supabase.auth.signUp({
      email: parsed.data.email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setBusy(false);
    if (err) return setError(friendly(err.message));
    setSent(true);
    toast.success("Account created — check your inbox to verify your email.");
  }

  if (sent) {
    return (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Verify your email</p>
        <p>
          We sent a confirmation link to <span className="text-foreground">{email}</span>. Open it
          to activate your account, then sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <GoogleButton />
      <div className="space-y-2">
        <Label htmlFor="reg-name">Full name</Label>
        <Input
          id="reg-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Alex Morgan"
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <Input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
}

function ForgotForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err) return setError(friendly(err.message));
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your email and we'll send a secure link to set a new password.
      </p>
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {sent && (
        <p className="text-sm text-primary">
          If an account exists for that email, a reset link is on its way.
        </p>
      )}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send reset link
      </Button>
    </form>
  );
}
