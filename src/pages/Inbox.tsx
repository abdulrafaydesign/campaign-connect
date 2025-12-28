import { useState } from "react";
import { Search, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const mockConversations = [
  {
    id: 1,
    username: "@john_doe",
    lastMessage: "Hey, thanks for reaching out!",
    time: "2m ago",
    unread: true,
    campaign: "Product Launch",
  },
  {
    id: 2,
    username: "@jane_smith",
    lastMessage: "I'd love to learn more about...",
    time: "15m ago",
    unread: true,
    campaign: "Product Launch",
  },
  {
    id: 3,
    username: "@mike_wilson",
    lastMessage: "Sounds interesting!",
    time: "1h ago",
    unread: false,
    campaign: "Influencer Collab",
  },
  {
    id: 4,
    username: "@sarah_connor",
    lastMessage: "Can you send me more details?",
    time: "3h ago",
    unread: false,
    campaign: "Product Launch",
  },
];

const mockMessages = [
  { id: 1, sender: "me", text: "Hey! I noticed you're interested in fitness content. Would love to connect!", time: "10:30 AM" },
  { id: 2, sender: "them", text: "Hey, thanks for reaching out! Yes, I'm always looking for new opportunities.", time: "10:32 AM" },
  { id: 3, sender: "me", text: "That's great to hear! We have an exciting collaboration opportunity...", time: "10:35 AM" },
];

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageFilter, setMessageFilter] = useState("all");

  return (
    <div className="animate-fade-in h-screen flex flex-col">
      <PageHeader title="Inbox" description="Manage your conversations" />

      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 space-y-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>

            <div className="flex gap-2">
              <Button
                variant={messageFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setMessageFilter("all")}
              >
                All
              </Button>
              <Button
                variant={messageFilter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setMessageFilter("unread")}
              >
                Unread
              </Button>
            </div>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="product-launch">Product Launch</SelectItem>
                <SelectItem value="influencer">Influencer Collab</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="brand">@brand_official</SelectItem>
                <SelectItem value="marketing">@marketing_team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mockConversations
              .filter((c) => messageFilter === "all" || c.unread)
              .map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={cn(
                    "w-full p-4 text-left border-b border-border hover:bg-accent/50 transition-colors",
                    selectedConversation === conversation.id && "bg-accent"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{conversation.username}</span>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{conversation.campaign}</span>
                    {conversation.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border bg-card">
                <h3 className="font-semibold">
                  {mockConversations.find((c) => c.id === selectedConversation)?.username}
                </h3>
                <p className="text-sm text-muted-foreground">Product Launch Campaign</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      message.sender === "me"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {message.time}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Textarea placeholder="Type a message..." rows={2} className="resize-none" />
                  <Button size="icon" className="h-auto">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
