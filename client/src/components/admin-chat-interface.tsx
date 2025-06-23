import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, User, ArrowLeft, Paperclip, Download, FileText, AlertCircle, AlertTriangle, Zap } from "lucide-react";
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
  urgency: string;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string>("normal");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    mutationFn: async (messageData: { content: string; recipientId: number; urgency?: string }) => {
      return await apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      setNewMessage("");
      setSelectedUrgency("normal");
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewMessage(`📎 ${file.name}`);
    }
  };

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case "low":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: MessageCircle,
          label: "Low Priority"
        };
      case "high":
        return {
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          icon: AlertCircle,
          label: "High Priority"
        };
      case "urgent":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: AlertTriangle,
          label: "Urgent"
        };
      default:
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          icon: MessageCircle,
          label: "Normal"
        };
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedMemberId) return;

    let messageContent = newMessage;
    
    if (selectedFile) {
      messageContent = `📎 Document: ${selectedFile.name}`;
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    sendMessageMutation.mutate({
      content: messageContent,
      recipientId: selectedMemberId,
      urgency: selectedUrgency,
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
                    const isDocument = message.content.includes('📎');
                    const urgencyConfig = getUrgencyConfig(message.urgency || "normal");
                    const UrgencyIcon = urgencyConfig.icon;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl shadow-lg transition-all hover:shadow-xl ${
                            isCurrentUser
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                              : `bg-white border-2 ${urgencyConfig.borderColor} text-gray-900 rounded-bl-md`
                          }`}
                        >
                          {/* Urgency Indicator */}
                          {!isCurrentUser && message.urgency !== "normal" && (
                            <div className={`px-4 pt-3 pb-1 flex items-center gap-2 ${urgencyConfig.bgColor} rounded-t-2xl rounded-bl-md`}>
                              <UrgencyIcon className={`h-4 w-4 ${urgencyConfig.color}`} />
                              <span className={`text-xs font-medium ${urgencyConfig.color}`}>
                                {urgencyConfig.label}
                              </span>
                            </div>
                          )}
                          {isDocument ? (
                            <div className={`p-4 ${isCurrentUser ? "bg-blue-400/20" : "bg-gray-50"} rounded-t-2xl ${isCurrentUser ? "rounded-br-md" : "rounded-bl-md"}`}>
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isCurrentUser ? "bg-white/20" : "bg-blue-100"}`}>
                                  <FileText className={`h-4 w-4 ${isCurrentUser ? "text-white" : "text-blue-600"}`} />
                                </div>
                                <div>
                                  <div className={`font-medium text-sm ${isCurrentUser ? "text-white" : "text-gray-900"}`}>
                                    {message.content.replace('📎 Document: ', '')}
                                  </div>
                                  <div className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                                    Document attachment
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`ml-auto h-8 w-8 p-0 ${isCurrentUser ? "text-white hover:bg-white/20" : "text-gray-600 hover:bg-gray-100"}`}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4">
                              <div className="break-words leading-relaxed">{message.content}</div>
                            </div>
                          )}
                          <div className={`px-4 pb-3 text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {isCurrentUser && (
                              <span className="ml-2 opacity-75">Sent</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gradient-to-r from-slate-50 to-gray-50">
                {/* Urgency Selector */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Priority:</span>
                  <div className="flex gap-1">
                    {["low", "normal", "high", "urgent"].map((urgency) => {
                      const config = getUrgencyConfig(urgency);
                      const Icon = config.icon;
                      return (
                        <Button
                          key={urgency}
                          variant={selectedUrgency === urgency ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedUrgency(urgency)}
                          className={`h-8 px-3 text-xs ${
                            selectedUrgency === urgency 
                              ? `${config.color} bg-white border-2 ${config.borderColor} shadow-md` 
                              : "text-gray-600 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {selectedFile && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800 font-medium">{selectedFile.name}</span>
                      <span className="text-xs text-blue-600">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setNewMessage("");
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
                    >
                      ×
                    </Button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      disabled={sendMessageMutation.isPending}
                      className="pr-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                      >
                        <Paperclip className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={(!newMessage.trim() && !selectedFile) || sendMessageMutation.isPending}
                    className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="h-5 w-5" />
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