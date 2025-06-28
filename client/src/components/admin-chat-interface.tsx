import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MessageCircle, User, ArrowLeft, Paperclip, Download, FileText, AlertCircle, AlertTriangle, Zap, File, X, Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showMembersList, setShowMembersList] = useState(true);
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
      console.log("Admin sending message data:", messageData);
      const response = await apiRequest("POST", "/api/messages", messageData);
      const result = await response.json();
      console.log("Admin message response:", result);
      return result;
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
  const selectedRecipient = officers.find(o => o.id === selectedMemberId);
  const isUploading = sendMessageMutation.isPending;

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

  const getMemberName = (member: Member) => {
    return member ? `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email : '';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin handleSendMessage called");
    console.log("selectedMemberId:", selectedMemberId);
    console.log("newMessage:", newMessage.trim());
    console.log("selectedFile:", selectedFile);
    
    if (!selectedMemberId || (!newMessage.trim() && !selectedFile)) return;

    if (selectedFile) {
      // Handle file upload via the upload endpoint
      console.log("Sending file message via upload endpoint");
      const formData = new FormData();
      formData.append('recipientId', selectedMemberId.toString());
      formData.append('content', newMessage || `📎 Document: ${selectedFile.name}`);
      formData.append('file', selectedFile);

      try {
        const response = await apiRequest("POST", "/api/messages/upload", formData);
        const result = await response.json();
        console.log("File upload result:", result);
        
        setNewMessage("");
        setSelectedFile(null);
        setSelectedUrgency("normal");
        if (fileInputRef.current) fileInputRef.current.value = '';
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
        
        toast({
          title: "Success",
          description: "File sent successfully",
        });
      } catch (error: any) {
        console.error("File upload error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to send file",
          variant: "destructive",
        });
      }
    } else {
      // Handle text message
      console.log("Sending text message");
      sendMessageMutation.mutate({
        content: newMessage,
        recipientId: selectedMemberId,
        urgency: selectedUrgency,
      });
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setNewMessage("");
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewMessage(`📎 Document: ${file.name}`);
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
    <div className="h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar - Team Members */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                <h2 className="font-semibold">Team Chat</h2>
              </div>
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {officers.length} members
              </Badge>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto">
            {officers.length === 0 ? (
              <div className="p-6 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No team members yet</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {officers
                  .filter(officer => {
                    if (!searchTerm) return true;
                    const memberName = getMemberName(officer).toLowerCase();
                    const email = officer.email.toLowerCase();
                    const search = searchTerm.toLowerCase();
                    return memberName.includes(search) || email.includes(search);
                  })
                  .map(officer => {
                    const unreadCount = getUnreadCount(officer.id);
                    const isSelected = selectedMemberId === officer.id;
                    
                    return (
                      <button
                        key={officer.id}
                        onClick={() => setSelectedMemberId(officer.id)}
                        className={`w-full p-3 text-left hover:bg-blue-50 transition-all duration-200 rounded-lg ${
                          isSelected ? "bg-blue-100 border-l-4 border-l-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                            isSelected ? "bg-blue-500" : "bg-gray-400"
                          }`}>
                            {getMemberName(officer).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-gray-900 truncate">
                                {getMemberName(officer)}
                              </span>
                              {unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs min-w-[20px] h-5">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">Officer</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedMemberId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                    {getMemberName(officers.find(o => o.id === selectedMemberId)!).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{getMemberName(officers.find(o => o.id === selectedMemberId)!)}</h3>
                    <p className="text-blue-100 text-sm">Officer</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {selectedMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No messages yet</p>
                      <p className="text-gray-400 text-sm">Start a conversation</p>
                    </div>
                  ) : (
                    selectedMessages.map(message => {
                      const isCurrentUser = message.senderId === user?.id;
                      const urgencyConfig = getUrgencyConfig(message.urgency || "normal");
                      const UrgencyIcon = urgencyConfig.icon;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              isCurrentUser
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border'
                            }`}
                          >
                            {message.urgency !== 'normal' && (
                              <div className={`flex items-center gap-1 mb-2 text-xs ${
                                isCurrentUser ? 'text-blue-100' : urgencyConfig.color
                              }`}>
                                <UrgencyIcon className="w-3 h-3" />
                                <span>{urgencyConfig.label}</span>
                              </div>
                            )}
                            
                            <p className="text-sm">{message.content}</p>
                            
                            <div className={`text-xs mt-2 ${
                              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Priority:</label>
                    <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                      />
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 px-3"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    
                    <Button type="submit" size="sm" disabled={!newMessage.trim() && !selectedFile}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{selectedFile.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Team Member</h3>
                <p className="text-gray-500">Choose a member to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
