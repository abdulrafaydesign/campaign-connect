import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2, LogOut, Webhook, TestTube } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCampaignSettings, useUpdateCampaignSettings } from "@/hooks/useCampaignSettings";

const timezones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo", "Asia/Karachi"];

export default function Settings() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Webhook settings
  const { data: settings, isLoading: settingsLoading } = useCampaignSettings();
  const updateSettings = useUpdateCampaignSettings();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [autoRetry, setAutoRetry] = useState(true);
  const [maxRetries, setMaxRetries] = useState(3);

  useEffect(() => {
    if (settings) {
      setWebhookUrl(settings.webhook_url || "");
      setWebhookSecret(settings.webhook_secret || "");
      setAutoRetry(settings.auto_retry);
      setMaxRetries(settings.max_retries);
    }
  }, [settings]);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password updated" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ title: error.message || "Error updating password", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSaveWebhook = async () => {
    await updateSettings.mutateAsync({
      webhook_url: webhookUrl || null,
      webhook_secret: webhookSecret || null,
      auto_retry: autoRetry,
      max_retries: maxRetries,
    });
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({ title: "Enter a webhook URL first", variant: "destructive" });
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookSecret && { "X-Webhook-Secret": webhookSecret }),
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          target_username: "test_user",
          message_content: "This is a test message",
          campaign_name: "Test Campaign",
          timestamp: new Date().toISOString(),
        }),
      });

      toast({ 
        title: "Test request sent", 
        description: "Check your webhook endpoint for the test payload" 
      });
    } catch (error) {
      toast({ 
        title: "Test failed", 
        description: "Could not reach the webhook URL",
        variant: "destructive" 
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" />

      <div className="px-8 pb-8 max-w-lg">
        <div className="space-y-6">
          {/* Account */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-sm font-medium mb-4">Account</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Signed in</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-sm font-medium mb-4">Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">New Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirm</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button size="sm" onClick={handleUpdatePassword} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </div>
          </div>

          {/* Webhook Integration */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Webhook className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium">Webhook Integration</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Configure a webhook URL to send Instagram DMs. Your endpoint will receive POST requests with target username and message content.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Webhook URL</Label>
                <Input 
                  placeholder="https://your-service.com/send-dm"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Secret (optional)</Label>
                <Input 
                  type="password"
                  placeholder="Webhook authentication secret"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Auto-retry failed messages</Label>
                  <p className="text-xs text-muted-foreground">Retry up to {maxRetries} times</p>
                </div>
                <Switch checked={autoRetry} onCheckedChange={setAutoRetry} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveWebhook} disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleTestWebhook} disabled={isTesting}>
                  {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <TestTube className="mr-2 h-4 w-4" />
                  Test
                </Button>
              </div>
            </div>
          </div>

          {/* Payload Format Info */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-sm font-medium mb-4">Webhook Payload Format</h2>
            <pre className="text-xs bg-secondary p-4 rounded-lg overflow-auto">
{`{
  "target_username": "john_doe",
  "message_content": "Hey John!",
  "campaign_name": "My Campaign",
  "message_id": "uuid-here"
}`}
            </pre>
            <p className="text-xs text-muted-foreground mt-3">
              Your endpoint should return 2xx status for success. Failed requests will be retried if auto-retry is enabled.
            </p>
          </div>

          {/* Email */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-sm font-medium mb-4">Email</h2>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <span className="text-sm flex-1 text-success">Email confirmed</span>
            </div>
          </div>

          {/* Danger */}
          <div className="rounded-2xl border border-destructive/20 p-6">
            <h2 className="text-sm font-medium text-destructive mb-2">Danger Zone</h2>
            <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all data.</p>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
