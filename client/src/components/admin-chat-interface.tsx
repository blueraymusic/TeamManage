import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, User, ArrowLeft } from "lucide-react";
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
}

interface Member {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminChatInterface() {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 3000,
  });

  const { data: organizationMembers = [] } = useQuery<Member[]>({
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
    onError: () => {
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
  }, [messages, selectedMemberId]);

  // Get officers only
  const officers = organizationMembers.filter(member => member.role === "officer");

  // Get messages for selected conversation
  const selectedMessages = selectedMemberId 
    ? messages.filter(msg => 
        (msg.senderId === user?.id && msg.recipientId === selectedMemberId) ||
        (msg.senderId === selectedMemberId && msg.recipientId === user?.id)
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  // Get unread count for each officer
  const getUnreadCount = (officerId: number) => {
    return messages.filter(msg => 
      msg.senderId === officerId && 
      msg.recipientId === user?.id && 
      !msg.isRead
    ).length;
  };

  // Get last message for each officer
  const getLastMessage = (officerId: number) => {
    const conversation = messages.filter(msg => 
      (msg.senderId === user?.id && msg.recipientId === officerId) ||
      (msg.senderId === officerId && msg.recipientId === user?.id)
    );
    return conversation.length > 0 
      ? conversation.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      : null;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMemberId) return;

    sendMessageMutation.mutate({
      content: newMessage,
      recipientId: selectedMemberId,
    });
  };

  const getMemberName = (member: Member) => {
    return `${member.firstName || ""} ${member.lastName || ""}`.trim() || member.email;
  };

  if (messagesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading conversations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-[600px] gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-y-auto">
          {officers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No officers in organization
            </div>
          ) : (
            <div className="space-y-1">
              {officers.map(officer => {
                const unreadCount = getUnreadCount(officer.id);
                const lastMessage = getLastMessage(officer.id);
                const isSelected = selectedMemberId === officer.id;
                
                return (
                  <button
                    key={officer.id}
                    onClick={() => setSelectedMemberId(officer.id)}
                    className={`w-full p-4 text-left hover:bg-gray-100 border-b transition-all duration-200 ${
                      isSelected 
                        ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm" 
                        : "hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          isSelected ? "bg-blue-500" : "bg-gray-400"
                        }`}>
                          {getMemberName(officer).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-900">
                            {getMemberName(officer)}
                          </span>
                          <div className="text-xs text-gray-500">Officer</div>
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs min-w-[20px] h-5">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    {lastMessage && (
                      <div className="text-xs text-gray-600 truncate pl-13">
                        {lastMessage.senderId === user?.id ? "You: " : ""}{lastMessage.content}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedMemberId ? (
          <>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMemberId(null)}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <MessageCircle className="h-5 w-5" />
                Chat with {getMemberName(officers.find(o => o.id === selectedMemberId)!)}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]">
                {selectedMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  selectedMessages.map(message => {
                    const isCurrentUser = message.senderId === user?.id;
                    
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
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}