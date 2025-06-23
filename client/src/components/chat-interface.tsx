import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  organizationId: number;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
  senderRole?: string;
}

interface ChatInterfaceProps {
  recipientId?: number;
  recipientName?: string;
}

export default function ChatInterface({ recipientId, recipientName }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  const { data: organizationMembers = [] } = useQuery<any[]>({
    queryKey: ["/api/organization/members"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; recipientId: number }) => {
      return await apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      scrollToBottom();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    let targetRecipientId = recipientId;

    // If no specific recipient, determine based on user role
    if (!targetRecipientId) {
      if (user?.role === "officer") {
        // Officer sends to admin
        const admin = organizationMembers.find((member: any) => member.role === "admin");
        if (!admin) {
          toast({
            title: "Error",
            description: "Admin not found",
            variant: "destructive",
          });
          return;
        }
        targetRecipientId = admin.id;
      } else if (user?.role === "admin") {
        // Admin sends to the first officer they find in filtered messages, or first officer in org
        const recentOfficer = filteredMessages.find(msg => msg.senderId !== user.id);
        if (recentOfficer) {
          targetRecipientId = recentOfficer.senderId;
        } else {
          // Find first officer in organization
          const officer = organizationMembers.find((member: any) => member.role === "officer");
          if (officer) {
            targetRecipientId = officer.id;
          } else {
            toast({
              title: "Error",
              description: "No officers found to message",
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    sendMessageMutation.mutate({
      content: newMessage,
      recipientId: targetRecipientId!,
    });
  };

  // Get user name by ID
  const getUserName = (userId: number) => {
    const member = organizationMembers.find((m: any) => m.id === userId);
    return member ? `${member.firstName || ""} ${member.lastName || ""}`.trim() || member.email : `User #${userId}`;
  };

  // Get user role by ID
  const getUserRole = (userId: number) => {
    const member = organizationMembers.find((m: any) => m.id === userId);
    return member?.role || "user";
  };

  // Filter messages based on current context
  const filteredMessages = messages.filter((message: Message) => {
    if (!user) return false;
    
    if (recipientId) {
      // Show messages between current user and specific recipient
      return (
        (message.senderId === user.id && message.recipientId === recipientId) ||
        (message.senderId === recipientId && message.recipientId === user.id)
      );
    } else {
      // Show all messages involving current user
      return message.senderId === user.id || message.recipientId === user.id;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {recipientName ? `Chat with ${recipientName}` : "Messages"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Container - Limited to 4 messages with scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            filteredMessages
              .sort((a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .slice(-20) // Show last 20 messages for performance
              .map((message: Message) => {
                const isCurrentUser = message.senderId === user?.id;
                const senderName = getUserName(message.senderId);
                const senderRole = getUserRole(message.senderId);
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl p-3 shadow-sm ${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="text-xs font-medium opacity-75 mb-1">
                          {senderName} ({senderRole})
                        </div>
                      )}
                      <div className="break-words leading-relaxed">{message.content}</div>
                      <div className={`text-xs mt-2 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sendMessageMutation.isPending}
              className="flex-1 rounded-full border-gray-300 focus:border-blue-500"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="rounded-full w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}