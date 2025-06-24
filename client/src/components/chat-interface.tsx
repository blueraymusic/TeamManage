import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageCircle, AlertCircle, AlertTriangle, Paperclip, File, Image, X } from "lucide-react";
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
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  senderName?: string;
  senderRole?: string;
}

interface ChatInterfaceProps {
  recipientId?: number;
  recipientName?: string;
}

export default function ChatInterface({ recipientId, recipientName }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} ready to send`,
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== SEND MESSAGE DEBUG ===');
    console.log('selectedFile:', selectedFile);
    console.log('newMessage:', newMessage.trim());
    
    let targetRecipientId = recipientId;
    console.log('targetRecipientId:', targetRecipientId);
    
    if (!newMessage.trim() && !selectedFile) {
      console.log('Nothing to send - no message and no file');
      return;
    }

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

    if (selectedFile) {
      // Handle file upload
      console.log('=== FILE UPLOAD PATH ===');
      console.log('File details:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });
      setIsUploading(true);
      try {
        if (!targetRecipientId) {
          toast({
            title: "Error",
            description: "No recipient selected",
            variant: "destructive",
          });
          return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('recipientId', targetRecipientId.toString());
        formData.append('content', newMessage.trim() || `📎 Document: ${selectedFile.name}`);

        console.log('Sending to /api/messages/upload...');
        const response = await apiRequest('POST', '/api/messages/upload', formData);
        console.log('✅ File upload successful:', response);
        
        setNewMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
        
        toast({
          title: "Success",
          description: "File sent successfully",
        });
      } catch (error) {
        console.error('File upload error:', error);
        toast({
          title: "Error", 
          description: "Failed to send file",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    } else {
      // Handle text message
      if (!targetRecipientId) {
        toast({
          title: "Error",
          description: "No recipient selected",
          variant: "destructive",
        });
        return;
      }

      sendMessageMutation.mutate({
        content: newMessage,
        recipientId: targetRecipientId,
      });
    }
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
                const urgencyConfig = getUrgencyConfig(message.urgency || "normal");
                const UrgencyIcon = urgencyConfig.icon;
                
                // Mark message as read when it appears in view for the recipient
                React.useEffect(() => {
                  if (!message.isRead && message.recipientId === user?.id) {
                    const markAsRead = () => {
                      apiRequest('PATCH', `/api/messages/${message.id}/read`, {})
                        .then(() => {
                          queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
                          queryClient.invalidateQueries({ queryKey: ["/api/messages/unread"] });
                        })
                        .catch(console.error);
                    };
                    
                    // Mark as read after a short delay (user has "seen" it)
                    const timer = setTimeout(markAsRead, 1000);
                    return () => clearTimeout(timer);
                  }
                }, [message.id, message.isRead, message.recipientId, user?.id]);
                
                return (
                  <MessageComponent 
                    key={message.id}
                    message={message}
                    isCurrentUser={isCurrentUser}
                    senderName={senderName}
                    senderRole={senderRole}
                    urgencyConfig={urgencyConfig}
                    UrgencyIcon={urgencyConfig.icon}
                    user={user}
                    onMarkAsRead={() => {
                      if (!message.isRead && message.recipientId === user?.id) {
                        apiRequest('PATCH', `/api/messages/${message.id}/read`, {})
                          .then(() => {
                            queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
                            queryClient.invalidateQueries({ queryKey: ["/api/messages/unread"] });
                          })
                          .catch(console.error);
                      }
                    }}
                  />
                );
              })
          )}
        </div>

        {/* Message Form */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="resize-none"
                />
              </div>
              
              {/* File Upload Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 px-3"
                disabled={isUploading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button type="submit" size="sm" disabled={isUploading || (!newMessage.trim() && !selectedFile)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="*"
            />

            {/* Selected file preview */}
            {selectedFile && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

// Separate component for individual messages to handle useEffect properly
function MessageComponent({ 
  message, 
  isCurrentUser, 
  senderName, 
  senderRole, 
  urgencyConfig, 
  UrgencyIcon,
  user,
  onMarkAsRead 
}: {
  message: Message;
  isCurrentUser: boolean;
  senderName: string;
  senderRole: string;
  urgencyConfig: any;
  UrgencyIcon: any;
  user: any;
  onMarkAsRead: () => void;
}) {
  // Mark message as read when it appears in view for the recipient
  useEffect(() => {
    if (!message.isRead && message.recipientId === user?.id) {
      const timer = setTimeout(() => {
        onMarkAsRead();
      }, 1500); // Mark as read after 1.5 seconds of being visible
      
      return () => clearTimeout(timer);
    }
  }, [message.id, message.isRead, message.recipientId, user?.id, onMarkAsRead]);

  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3 ${
        !message.isRead && message.recipientId === user?.id ? 'relative' : ''
      }`}
    >
      {/* Unread indicator for received messages */}
      {!message.isRead && message.recipientId === user?.id && (
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse z-10"></div>
      )}
      
      <div
        className={`max-w-[75%] rounded-xl shadow-sm ${
          isCurrentUser
            ? "bg-blue-500 text-white rounded-br-sm"
            : `bg-white border-2 ${urgencyConfig.borderColor} text-gray-900 rounded-bl-sm ${
                !message.isRead && message.recipientId === user?.id ? 'ring-2 ring-red-200' : ''
              }`
        }`}
      >
        {/* Urgency Indicator for received messages */}
        {!isCurrentUser && message.urgency !== "normal" && (
          <div className={`px-3 pt-2 pb-1 flex items-center gap-2 ${urgencyConfig.bgColor} rounded-t-xl rounded-bl-sm`}>
            <UrgencyIcon className="h-3 w-3" />
            <span className="text-xs font-medium uppercase tracking-wide">{message.urgency}</span>
          </div>
        )}
        
        {/* Message Content */}
        <div className="px-4 py-3">
          {/* Sender Info */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium ${isCurrentUser ? "text-blue-100" : "text-gray-600"}`}>
              {senderName}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isCurrentUser 
                ? "bg-blue-400 text-blue-100" 
                : senderRole === "admin" 
                  ? "bg-purple-100 text-purple-800" 
                  : "bg-blue-100 text-blue-800"
            }`}>
              {senderRole}
            </span>
          </div>
          
          {/* File attachment or regular message */}
          {message.fileUrl ? (
            <div className="space-y-2">
              <div className={`text-sm ${isCurrentUser ? "text-white" : "text-gray-900"}`}>
                {message.content}
              </div>
              <div className={`flex items-center gap-2 p-2 rounded border ${
                isCurrentUser ? "bg-blue-400 border-blue-300" : "bg-gray-50 border-gray-200"
              }`}>
                <File className={`h-4 w-4 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`} />
                <a 
                  href={message.fileUrl} 
                  download={message.fileName}
                  className={`text-sm hover:underline ${
                    isCurrentUser ? "text-blue-100" : "text-blue-600"
                  }`}
                  onClick={(e) => {
                    console.log('File download clicked:', message.fileUrl);
                    console.log('File name:', message.fileName);
                  }}
                >
                  {message.fileName}
                </a>
                {message.fileSize && (
                  <span className={`text-xs ${isCurrentUser ? "text-blue-200" : "text-gray-500"}`}>
                    ({(message.fileSize / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className={`text-sm ${isCurrentUser ? "text-white" : "text-gray-900"}`}>
              {message.content}
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${isCurrentUser ? "text-blue-200" : "text-gray-500"}`}>
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
