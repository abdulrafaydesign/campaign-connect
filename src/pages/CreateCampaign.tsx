import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Settings, Users, MessageSquare, Instagram, CheckCircle2, Plus, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Campaign Settings", icon: Settings },
  { id: 2, title: "Targets", icon: Users },
  { id: 3, title: "Sequences", icon: MessageSquare },
  { id: 4, title: "Instagram Accounts", icon: Instagram },
  { id: 5, title: "Done", icon: CheckCircle2 },
];

const mockAccounts = [
  { id: 1, username: "@brand_official", status: "active", selected: false },
  { id: 2, username: "@marketing_team", status: "active", selected: false },
  { id: 3, username: "@sales_dept", status: "paused", selected: false },
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
    selectedAccounts: [] as number[],
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/campaigns");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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

  const toggleAccount = (accountId: number) => {
    setFormData({
      ...formData,
      selectedAccounts: formData.selectedAccounts.includes(accountId)
        ? formData.selectedAccounts.filter((id) => id !== accountId)
        : [...formData.selectedAccounts, accountId],
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="New Campaign" description="Create a new Instagram DM campaign" />

      <div className="p-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      currentStep > step.id
                        ? "border-success bg-success text-success-foreground"
                        : currentStep === step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden md:block",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4",
                      currentStep > step.id ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-xl border border-border bg-card p-6">
          {/* Step 1: Campaign Settings */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="Enter campaign name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Working Hours</Label>
                  <p className="text-sm text-muted-foreground">Messages will be sent during these hours</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
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
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {formData.workingHoursEnd}:00
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Messages Per Day</Label>
                  <p className="text-sm text-muted-foreground">The number of messages sent by each Instagram account daily</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {formData.messagesPerDay[0]}
                  </span>
                  <Slider
                    value={formData.messagesPerDay}
                    onValueChange={(value) =>
                      setFormData({ ...formData, messagesPerDay: value })
                    }
                    min={1}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {formData.messagesPerDay[1]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Targets */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <Tabs defaultValue="csv">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="csv">CSV</TabsTrigger>
                  <TabsTrigger value="raw">RAW</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>

                <TabsContent value="csv" className="space-y-4 mt-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop your CSV file here, or click to browse
                    </p>
                    <Button variant="outline" className="mt-4">
                      Upload CSV
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listNameCsv">List Name</Label>
                    <Input id="listNameCsv" placeholder="Enter list name" />
                  </div>
                  <Button className="w-full">Create</Button>
                </TabsContent>

                <TabsContent value="raw" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="rawUsernames">Usernames</Label>
                    <Textarea
                      id="rawUsernames"
                      placeholder="One username per line"
                      rows={8}
                      value={formData.rawUsernames}
                      onChange={(e) => setFormData({ ...formData, rawUsernames: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listNameRaw">List Name</Label>
                    <Input
                      id="listNameRaw"
                      placeholder="Enter list name"
                      value={formData.targetListName}
                      onChange={(e) => setFormData({ ...formData, targetListName: e.target.value })}
                    />
                  </div>
                  <Button className="w-full">Create</Button>
                </TabsContent>

                <TabsContent value="json" className="space-y-4 mt-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Upload JSON file with username array
                    </p>
                    <Button variant="outline" className="mt-4">
                      Upload JSON
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listNameJson">List Name</Label>
                    <Input id="listNameJson" placeholder="Enter list name" />
                  </div>
                  <Button className="w-full">Create</Button>
                </TabsContent>
              </Tabs>

              {/* Preview Table */}
              <div className="rounded-lg border border-border">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <h3 className="font-medium">Preview</h3>
                </div>
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No usernames added yet
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Sequences */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">First Message</h3>
                  <Button variant="outline" onClick={addFollowUp}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Follow-up
                  </Button>
                </div>

                <Tabs defaultValue="variant-1">
                  <TabsList>
                    {formData.variants.map((variant, index) => (
                      <TabsTrigger key={variant.id} value={`variant-${index + 1}`}>
                        Variant {index + 1}
                      </TabsTrigger>
                    ))}
                    {formData.variants.length < 5 && (
                      <TabsTrigger value="add" onClick={addVariant}>
                        + Add
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {formData.variants.map((variant, index) => (
                    <TabsContent key={variant.id} value={`variant-${index + 1}`} className="space-y-4 mt-4">
                      <Textarea
                        placeholder="Enter your message..."
                        rows={6}
                        value={variant.message}
                        onChange={(e) => {
                          const newVariants = [...formData.variants];
                          newVariants[index].message = e.target.value;
                          setFormData({ ...formData, variants: newVariants });
                        }}
                      />
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-medium mb-2">Available variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {["{{firstName}}", "{{username}}", "{{name}}"].map((variable) => (
                      <code
                        key={variable}
                        className="px-2 py-1 bg-background rounded text-sm text-primary cursor-pointer hover:bg-primary/10"
                      >
                        {variable}
                      </code>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Click to copy. Variables will be replaced with actual user data.
                  </p>
                </div>
              </div>

              {/* Follow-ups */}
              {formData.followUps.map((followUp, index) => (
                <div key={followUp.id} className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Follow-up {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFollowUp(followUp.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Delay (hours)</Label>
                    <Input
                      type="number"
                      value={followUp.delay}
                      onChange={(e) => {
                        const newFollowUps = [...formData.followUps];
                        newFollowUps[index].delay = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, followUps: newFollowUps });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Enter follow-up message..."
                      rows={4}
                      value={followUp.message}
                      onChange={(e) => {
                        const newFollowUps = [...formData.followUps];
                        newFollowUps[index].message = e.target.value;
                        setFormData({ ...formData, followUps: newFollowUps });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Instagram Accounts */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Select the Instagram accounts to use for this campaign
              </p>

              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Select</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Username</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockAccounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={formData.selectedAccounts.includes(account.id)}
                            onCheckedChange={() => toggleAccount(account.id)}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{account.username}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              account.status === "active"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            )}
                          >
                            {account.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 5: Done */}
          {currentStep === 5 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Campaign Created!</h2>
              <p className="mt-2 text-muted-foreground">
                Your campaign has been successfully created and is ready to launch.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 5 ? "Go to Campaigns" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
