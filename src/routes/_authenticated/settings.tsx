import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Settings as SettingsIcon, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/app/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSettings, useUpdateProfile, useUpdateSettings } from "@/hooks/use-app-data";

const title = "Settings — TradeMind AI";
const description =
  "Manage your TradeMind AI profile, avatar, theme, Telegram username, notifications, security and preferences.";

export const Route = createFileRoute("/_authenticated/settings")({
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
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profile } = useProfile();
  const { data: settings } = useSettings();
  const updateProfile = useUpdateProfile();
  const updateSettings = useUpdateSettings();

  const [fullName, setFullName] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [telegram, setTelegram] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setAvatar(profile.avatar_url ?? "");
      setTelegram(profile.telegram_username ?? "");
    }
  }, [profile]);

  async function saveProfile() {
    await updateProfile.mutateAsync({
      full_name: fullName.trim().slice(0, 80) || null,
      avatar_url: avatar.trim().slice(0, 500) || null,
      telegram_username: telegram.trim().replace(/^@/, "").slice(0, 40) || null,
    });
    toast.success("Profile saved");
  }

  async function changePassword() {
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setPassword("");
    }
  }

  return (
    <AppShell title="Settings" subtitle="Profile, notifications, security and preferences">
      <Panel title="Profile" icon={User}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              value={fullName}
              maxLength={80}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatar}
              maxLength={500}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram username</Label>
            <Input
              id="telegram"
              value={telegram}
              maxLength={40}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@trader"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={saveProfile} disabled={updateProfile.isPending}>
          Save profile
        </Button>
      </Panel>

      <Panel title="Preferences" icon={SettingsIcon}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={settings?.theme ?? "dark"}
              onValueChange={(v) => updateSettings.mutate({ theme: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default exchange</Label>
            <Select
              value={settings?.default_exchange ?? "Binance"}
              onValueChange={(v) => updateSettings.mutate({ default_exchange: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Binance", "Bybit", "OKX"].map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {(
            [
              ["email_notifications", "Email notifications"],
              ["push_notifications", "Push notifications"],
              ["telegram_notifications", "Telegram notifications"],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-secondary/25 px-4 py-3"
            >
              <Label htmlFor={key}>{label}</Label>
              <Switch
                id={key}
                checked={!!settings?.[key]}
                onCheckedChange={(v) => updateSettings.mutate({ [key]: v })}
              />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Security" icon={Shield}>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <Button variant="outline" onClick={changePassword}>
            Update password
          </Button>
        </div>
      </Panel>

      <Panel title="Exchange API keys" icon={KeyRound}>
        <p className="text-sm text-muted-foreground">
          Read-only exchange API connections for Binance, Bybit and OKX are coming soon. Today the
          platform runs on sample market data only.
        </p>
        <Button className="mt-4" variant="outline" disabled>
          Connect exchange (coming soon)
        </Button>
      </Panel>
    </AppShell>
  );
}
