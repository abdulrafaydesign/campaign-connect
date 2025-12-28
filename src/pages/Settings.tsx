import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

const timezones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo", "Asia/Karachi"];

export default function Settings() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" />

      <div className="px-8 pb-8 max-w-lg">
        <div className="space-y-6">
          {/* Password */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-sm font-medium mb-4">Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirm</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button size="sm">Update</Button>
            </div>
          </div>

          {/* Timezone */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-sm font-medium mb-4">Timezone</h2>
            <div className="flex gap-3">
              <Select defaultValue="Asia/Karachi">
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm">Save</Button>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-sm font-medium mb-4">Email</h2>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
              <span className="text-sm flex-1">Email not confirmed</span>
              <Button variant="outline" size="sm">Confirm</Button>
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
