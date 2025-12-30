import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Plus, Trash2, Upload, Loader2, Instagram } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCreateCampaign } from "@/hooks/useCampaigns";
import { useInstagramAccounts, useAddInstagramAccount } from "@/hooks/useInstagramAccounts";
import { useCreateTargets, useParseCSV } from "@/hooks/useTargets";
import { useToast } from "@/hooks/use-toast";

const steps = ["Settings", "Targets", "Sequences", "Accounts", "Done"];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [csvUsernames, setCsvUsernames] = useState<string[]>([]);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [newAccountUsername, setNewAccountUsername] = useState("");
  const [newAccountToken, setNewAccountToken] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    workingHoursStart: 8,
    workingHoursEnd: 22,
    messagesPerDay: [35, 45],
    targetListName: "",
    rawUsernames: "",
    variants: [{ id: 1, message: "" }],
    followUps: [] as { id: number; delay: number; message: string }[],
    selectedAccounts: [] as string[],
  });

  const createCampaign = useCreateCampaign();
  const createTargets = useCreateTargets();
  const { data: instagramAccounts, isLoading: accountsLoading } = useInstagramAccounts();
  const addAccount = useAddInstagramAccount();
  const parseCSV = useParseCSV();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const usernames = await parseCSV(file);
      setCsvUsernames(usernames);
      toast({ title: `Parsed ${usernames.length} usernames` });
    } catch {
      toast({ title: "Error parsing CSV", variant: "destructive" });
    }
  }, [parseCSV, toast]);

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!formData.name.trim()) {
        toast({ title: "Please enter a campaign name", variant: "destructive" });
        return;
      }
      
      setIsCreating(true);
      try {
        const campaign = await createCampaign.mutateAsync({
          name: formData.name,
          description: formData.description,
          working_hours_start: formData.workingHoursStart,
          working_hours_end: formData.workingHoursEnd,
          messages_per_day: formData.messagesPerDay[1],
        });
        setCampaignId(campaign.id);
        setCurrentStep(1);
      } catch {
        toast({ title: "Error creating campaign", variant: "destructive" });
      } finally {
        setIsCreating(false);
      }
      return;
    }

    if (currentStep === 1) {
      const usernames = csvUsernames.length > 0 
        ? csvUsernames 
        : formData.rawUsernames.split("\n").filter(Boolean);
      
      if (usernames.length > 0 && campaignId) {
        setIsCreating(true);
        try {
          await createTargets.mutateAsync({
            usernames,
            campaign_id: campaignId,
            list_name: formData.targetListName,
          });
          toast({ title: `Added ${usernames.length} targets` });
        } catch {
          toast({ title: "Error adding targets", variant: "destructive" });
        } finally {
          setIsCreating(false);
        }
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/campaigns");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const addVariant = () => {
    if (formData.variants.length < 5) {
      setFormData({
        ...formData,
        variants: [...formData.variants, { id: Date.now(), message: "" }],
      });
    }
  };

  const addFollowUp = () => {
    setFormData({
      ...formData,
      followUps: [...formData.followUps, { id: Date.now(), delay: 24, message: "" }],
    });
  };

  const removeFollowUp = (id: number) => {
    setFormData({
      ...formData,
      followUps: formData.followUps.filter((f) => f.id !== id),
    });
  };

  const toggleAccount = (accountId: string) => {
    setFormData({
      ...formData,
      selectedAccounts: formData.selectedAccounts.includes(accountId)
        ? formData.selectedAccounts.filter((id) => id !== accountId)
        : [...formData.selectedAccounts, accountId],
    });
  };

  const handleAddAccount = async () => {
    if (!newAccountUsername.trim()) {
      toast({ title: "Please enter a username", variant: "destructive" });
      return;
    }

    try {
      await addAccount.mutateAsync({
        username: newAccountUsername.replace(/^@/, ""),
        session_token: newAccountToken || undefined,
      });
      toast({ title: "Instagram account added" });
      setNewAccountUsername("");
      setNewAccountToken("");
      setAddAccountOpen(false);
    } catch {
      toast({ title: "Error adding account", variant: "destructive" });
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="New Campaign" />

      <div className="px-8 pb-8">
        {/* Stepper */}
        <div className="mb-8 flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                disabled={i > currentStep}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  i === currentStep
                    ? "bg-primary text-primary-foreground"
                    : i < currentStep
                    ? "bg-success/10 text-success cursor-pointer hover:bg-success/20"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {i < currentStep ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="w-4 text-center">{i + 1}</span>
                )}
                <span className="hidden sm:inline">{step}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn("w-8 h-px mx-1", i < currentStep ? "bg-success" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-card p-8 shadow-soft">
          {/* Step 0: Settings */}
          {currentStep === 0 && (
            <div className="space-y-6 max-w-xl animate-fade-in">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
                <Input
                  placeholder="Campaign name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
                <Textarea
                  placeholder="What's this campaign about?"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Working Hours</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                    {formData.workingHoursStart}:00
                  </span>
                  <Slider
                    value={[formData.workingHoursStart, formData.workingHoursEnd]}
                    onValueChange={([start, end]) =>
                      setFormData({ ...formData, workingHoursStart: start, workingHoursEnd: end })
                    }
                    min={0}
                    max={24}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                    {formData.workingHoursEnd}:00
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Messages per Day</Label>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                    {formData.messagesPerDay[0]}
                  </span>
                  <Slider
                    value={formData.messagesPerDay}
                    onValueChange={(value) => setFormData({ ...formData, messagesPerDay: value })}
                    min={1}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">
                    {formData.messagesPerDay[1]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Targets */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <Tabs defaultValue="csv" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="csv">CSV</TabsTrigger>
                  <TabsTrigger value="raw">RAW</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>

                <TabsContent value="csv" className="space-y-4 mt-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
                    <p className="mt-3 text-sm text-muted-foreground">
                      {csvUsernames.length > 0 
                        ? `${csvUsernames.length} usernames loaded` 
                        : "Drop CSV here or click to upload"}
                    </p>
                  </div>
                  {csvUsernames.length > 0 && (
                    <div className="max-h-48 overflow-auto rounded-lg border border-border p-4">
                      <div className="grid grid-cols-3 gap-2">
                        {csvUsernames.slice(0, 15).map((username, i) => (
                          <span key={i} className="text-xs font-mono bg-secondary px-2 py-1 rounded">
                            @{username}
                          </span>
                        ))}
                        {csvUsernames.length > 15 && (
                          <span className="text-xs text-muted-foreground">
                            +{csvUsernames.length - 15} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 max-w-sm">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">List Name</Label>
                    <Input
                      placeholder="My target list"
                      value={formData.targetListName}
                      onChange={(e) => setFormData({ ...formData, targetListName: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="space-y-4 mt-6 max-w-xl">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Usernames</Label>
                    <Textarea
                      placeholder="One username per line"
                      rows={8}
                      className="font-mono text-sm"
                      value={formData.rawUsernames}
                      onChange={(e) => setFormData({ ...formData, rawUsernames: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">List Name</Label>
                    <Input
                      placeholder="My target list"
                      value={formData.targetListName}
                      onChange={(e) => setFormData({ ...formData, targetListName: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="json" className="space-y-4 mt-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
                    <p className="mt-3 text-sm text-muted-foreground">Drop JSON file here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 2: Sequences */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">First Message</h3>
                <Button variant="outline" size="sm" onClick={addFollowUp}>
                  <Plus className="mr-2 h-3 w-3" />
                  Follow-up
                </Button>
              </div>

              <Tabs defaultValue="variant-1" className="w-full">
                <TabsList className="h-auto p-1 bg-secondary">
                  {formData.variants.map((_, i) => (
                    <TabsTrigger key={i} value={`variant-${i + 1}`} className="text-xs">
                      V{i + 1}
                    </TabsTrigger>
                  ))}
                  {formData.variants.length < 5 && (
                    <button
                      onClick={addVariant}
                      className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      +
                    </button>
                  )}
                </TabsList>

                {formData.variants.map((variant, i) => (
                  <TabsContent key={variant.id} value={`variant-${i + 1}`} className="mt-4">
                    <Textarea
                      placeholder="Write your message..."
                      rows={5}
                      value={variant.message}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[i].message = e.target.value;
                        setFormData({ ...formData, variants: newVariants });
                      }}
                    />
                  </TabsContent>
                ))}
              </Tabs>

              <div className="flex flex-wrap gap-2">
                {["{{firstName}}", "{{username}}", "{{name}}"].map((v) => (
                  <code key={v} className="px-2 py-1 bg-secondary rounded text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {v}
                  </code>
                ))}
              </div>

              {formData.followUps.map((followUp, i) => (
                <div key={followUp.id} className="rounded-xl border border-border p-4 space-y-4 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Follow-up {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFollowUp(followUp.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Delay (hrs)</Label>
                      <Input
                        type="number"
                        value={followUp.delay}
                        onChange={(e) => {
                          const newFollowUps = [...formData.followUps];
                          newFollowUps[i].delay = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, followUps: newFollowUps });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Message</Label>
                      <Textarea
                        rows={2}
                        value={followUp.message}
                        onChange={(e) => {
                          const newFollowUps = [...formData.followUps];
                          newFollowUps[i].message = e.target.value;
                          setFormData({ ...formData, followUps: newFollowUps });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Accounts */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in max-w-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Select accounts for this campaign</p>
                <Dialog open={addAccountOpen} onOpenChange={setAddAccountOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Instagram className="mr-2 h-4 w-4" />
                      Add Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect Instagram Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Username</Label>
                        <Input
                          placeholder="@yourusername"
                          value={newAccountUsername}
                          onChange={(e) => setNewAccountUsername(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                          Session Token (optional)
                        </Label>
                        <Input
                          type="password"
                          placeholder="Instagram session token"
                          value={newAccountToken}
                          onChange={(e) => setNewAccountToken(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          For automated messaging, you'll need a session token
                        </p>
                      </div>
                      <Button onClick={handleAddAccount} disabled={addAccount.isPending} className="w-full">
                        {addAccount.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {accountsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-16 bg-secondary/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : instagramAccounts?.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <Instagram className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No Instagram accounts connected</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setAddAccountOpen(true)}>
                    Connect Account
                  </Button>
                </div>
              ) : (
                instagramAccounts?.map((account) => (
                  <label
                    key={account.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors",
                      formData.selectedAccounts.includes(account.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={formData.selectedAccounts.includes(account.id)}
                        onCheckedChange={() => toggleAccount(account.id)}
                      />
                      <span className="font-medium font-mono">@{account.username}</span>
                    </div>
                    <span className={cn(
                      "text-xs uppercase tracking-wider",
                      account.status === "connected" ? "text-success" : "text-warning"
                    )}>
                      {account.status}
                    </span>
                  </label>
                ))
              )}
            </div>
          )}

          {/* Step 4: Done */}
          {currentStep === 4 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-success" />
              </div>
              <h2 className="text-xl font-semibold">All set!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your campaign is ready to launch.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length - 1 ? "Finish" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
