import { useState } from "react";
import { Search, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const mockConversations = [
  { id: 1, username: "@john_doe", lastMessage: "Hey, thanks for reaching out!", time: "2m", unread: true },
  { id: 2, username: "@jane_smith", lastMessage: "I'd love to learn more...", time: "15m", unread: true },
  { id: 3, username: "@mike_wilson", lastMessage: "Sounds interesting!", time: "1h", unread: false },
  { id: 4, username: "@sarah_connor", lastMessage: "Can you send details?", time: "3h", unread: false },
];

const mockMessages = [
  { id: 1, sender: "me", text: "Hey! I noticed you're interested in fitness content. Would love to connect!", time: "10:30" },
  { id: 2, sender: "them", text: "Hey, thanks for reaching out! Yes, I'm always looking for new opportunities.", time: "10:32" },
  { id: 3, sender: "me", text: "That's great to hear! We have an exciting collaboration opportunity...", time: "10:35" },
];

export default function Inbox() {
  const [selected, setSelected] = useState(1);
  const [filter, setFilter] = useState("all");

  return (
    <div className="animate-fade-in h-screen flex flex-col">
      <PageHeader title="Inbox" />

      <div className="flex-1 flex overflow-hidden mx-8 mb-8 rounded-2xl bg-card shadow-soft">
        {/* List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 space-y-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 h-9" />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter("unread")}
              >
                Unread
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mockConversations
              .filter((c) => filter === "all" || c.unread)
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    "w-full p-4 text-left border-b border-border transition-colors",
                    selected === c.id ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{c.username}</span>
                    <span className="text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground truncate flex-1">{c.lastMessage}</p>
                    {c.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border">
            <span className="font-medium">{mockConversations.find((c) => c.id === selected)?.username}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockMessages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2.5",
                  m.sender === "me"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary rounded-bl-md"
                )}
              >
                <p className="text-sm">{m.text}</p>
                <p className={cn("text-[10px] mt-1", m.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  {m.time}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea placeholder="Type a message..." rows={1} className="resize-none min-h-[40px]" />
              <Button size="icon" className="h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
