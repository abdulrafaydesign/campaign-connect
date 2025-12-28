import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Karachi",
  "Australia/Sydney",
];

export default function Settings() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" description="Manage your account settings" />

      <div className="p-8 max-w-2xl">
        <div className="space-y-8">
          {/* Change Password */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <Button>Update Password</Button>
            </div>
          </div>

          {/* Timezone */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Timezone</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Select Timezone</Label>
                <Select defaultValue="Asia/Karachi">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button>Update</Button>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Email Confirmation</h2>
            <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium">Email is not confirmed</span>
              </div>
              <Button variant="outline" size="sm">
                Confirm
              </Button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="rounded-xl border border-destructive/30 bg-card p-6">
            <h2 className="text-lg font-semibold mb-2 text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
