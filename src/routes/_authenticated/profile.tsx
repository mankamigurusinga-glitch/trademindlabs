import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, History, Send, Settings as SettingsIcon, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, ListSkeleton, Panel } from "@/components/app/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/use-app-data";
import { useAnalysisHistory, useSubscription } from "@/hooks/use-backend-data";
import { syncProfileToBackend } from "@/lib/trademind-account.functions";

const title = "Profile — TradeMind AI";
const description =
  "Your TradeMind AI account: identity, Telegram delivery, active plan and recent AI analysis history.";

export const Route = createFileRoute("/_authenticated/profile")({
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
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: subscription } = useSubscription();
  const { data: history, isLoading: historyLoading } = useAnalysisHistory(undefined, 10);

  const [fullName, setFullName] = React.useState("");
  const [telegram, setTelegram] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setTelegram(profile.telegram_username ?? "");
    setAvatar(profile.avatar_url ?? "");
  }, [profile]);

  async function save() {
    const cleanName = fullName.trim().slice(0, 80);
    const cleanTelegram = telegram.trim().replace(/^@/, "").slice(0, 40);
    const cleanAvatar = avatar.trim().slice(0, 500);
    setSaving(true);
    try {
      await updateProfile.mutateAsync({
        full_name: cleanName || null,
        telegram_username: cleanTelegram || null,
        avatar_url: cleanAvatar || null,
      });
      await syncProfileToBackend({
        data: {
          fullName: cleanName || undefined,
          telegramUsername: cleanTelegram || undefined,
          ...(/^https?:\/\//.test(cleanAvatar) ? { avatarUrl: cleanAvatar } : {}),
        },
      }).catch(() => null);
      toast.success("Profile saved");
    } catch {
      toast.error("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const initials = (profile?.full_name || user?.email || "TM")
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <AppShell title="Profile" subtitle="Your account, plan and AI activity">
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel title="Account" icon={User}>
          {isLoading ? (
            <ListSkeleton rows={3} />
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--gradient-brand)] font-display text-lg font-semibold text-background">
                  {avatar ? (
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials || "TM"
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold">
                    {profile?.full_name || "Add your name"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="p-name">Full name</Label>
                  <Input
                    id="p-name"
                    value={fullName}
                    maxLength={80}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Moreno"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-telegram">Telegram username</Label>
                  <Input
                    id="p-telegram"
                    value={telegram}
                    maxLength={40}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="alextrades"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="p-avatar">Avatar URL</Label>
                  <Input
                    id="p-avatar"
                    value={avatar}
                    maxLength={500}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save profile"}
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" /> All settings
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel title="Plan" icon={CreditCard}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-xl font-semibold">
                  {subscription?.subscription.plan ?? "Free"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {subscription?.subscription.analysesUsed ?? 0} analyses used
                  {subscription?.subscription.analysesLimit
                    ? ` of ${subscription.subscription.analysesLimit}`
                    : ""}
                </p>
              </div>
              <Button asChild size="sm" variant="secondary">
                <Link to="/subscription">Manage</Link>
              </Button>
            </div>
          </Panel>

          <Panel title="Telegram delivery" icon={Send}>
            <p className="text-sm text-muted-foreground">
              {telegram
                ? `Alerts can be delivered to @${telegram} once you enable Telegram notifications.`
                : "Add a Telegram username to receive alert delivery."}
            </p>
          </Panel>
        </div>
      </div>

      <Panel title="Recent AI analyses" icon={History} className="mt-5">
        {historyLoading ? (
          <ListSkeleton rows={4} />
        ) : history && history.items.length > 0 ? (
          <ul className="divide-y divide-border/50">
            {history.items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="font-display text-sm font-semibold">{item.symbol}</span>
                <Badge variant="secondary">{item.exchange}</Badge>
                <span className="text-xs text-muted-foreground">{item.trend}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Score <span className="font-semibold text-foreground">{item.score}</span>
                </span>
                <span className="w-full text-xs text-muted-foreground sm:w-auto">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={History}
            title="No analyses yet"
            body={
              history?.backendError ??
              "Run an AI analysis and your history will appear here."
            }
            action={
              <Button asChild size="sm" className="mt-1">
                <Link to="/analysis">Run analysis</Link>
              </Button>
            }
          />
        )}
      </Panel>
    </AppShell>
  );
}
