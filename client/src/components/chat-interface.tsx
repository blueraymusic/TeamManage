import { useState, useEffect, useRef } from "react";
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
    console.log('targetRecipientId:', targetRecipientId);
    if (!newMessage.trim() && !selectedFile) {
      console.log('Nothing to send - no message and no file');
      return;
    }

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
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('recipientId', targetRecipientId!.toString());
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
      sendMessageMutation.mutate({
        content: newMessage,
        recipientId: targetRecipientId!,
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
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl shadow-sm ${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-br-sm"
                          : `bg-white border-2 ${urgencyConfig.borderColor} text-gray-900 rounded-bl-sm`
                      }`}
                    >
                      {/* Urgency Indicator for received messages */}
                      {!isCurrentUser && message.urgency !== "normal" && (
                        <div className={`px-3 pt-2 pb-1 flex items-center gap-2 ${urgencyConfig.bgColor} rounded-t-xl rounded-bl-sm`}>
                          <UrgencyIcon className={`h-3 w-3 ${urgencyConfig.color}`} />
                          <span className={`text-xs font-medium ${urgencyConfig.color}`}>
                            {urgencyConfig.label}
                          </span>
                        </div>
                      )}
                      
                      <div className="p-3">
                        {!isCurrentUser && (
                          <div className="text-xs font-medium opacity-75 mb-1">
                            {senderName} ({senderRole})
                          </div>
                        )}
                        <div className="break-words leading-relaxed">{message.content}</div>
                        
                        {/* File Attachment Display */}
                        {message.fileUrl && (
                          <div className={`mt-3 p-2 rounded-lg border ${
                            isCurrentUser 
                              ? "bg-blue-400 border-blue-300" 
                              : "bg-gray-50 border-gray-200"
                          }`}>
                            <div className="flex items-center gap-2">
                              {message.fileType?.startsWith('image/') ? (
                                <Image className={`h-4 w-4 ${isCurrentUser ? "text-blue-100" : "text-gray-600"}`} />
                              ) : (
                                <File className={`h-4 w-4 ${isCurrentUser ? "text-blue-100" : "text-gray-600"}`} />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate ${
                                  isCurrentUser ? "text-blue-100" : "text-gray-800"
                                }`}>
                                  {message.fileName}
                                </div>
                                {message.fileSize && (
                                  <div className={`text-xs ${
                                    isCurrentUser ? "text-blue-200" : "text-gray-500"
                                  }`}>
                                    {(message.fileSize / 1024).toFixed(1)} KB
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  console.log('Download button clicked for file:', message.fileUrl);
                                  console.log('Message details:', {
                                    id: message.id,
                                    senderId: message.senderId,
                                    recipientId: message.recipientId,
                                    fileName: message.fileName
                                  });
                                  window.open(message.fileUrl, '_blank');
                                }}
                                className={`h-8 w-8 p-0 ${
                                  isCurrentUser 
                                    ? "text-blue-100 hover:bg-blue-600" 
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                <File className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className={`text-xs mt-2 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
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
          {/* File Upload Preview */}
          {selectedFile && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedFile.type.startsWith('image/') ? (
                  <Image className="h-4 w-4 text-blue-600" />
                ) : (
                  <File className="h-4 w-4 text-blue-600" />
                )}
                <span className="text-sm text-blue-800 font-medium">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-blue-600">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* File Upload Status */}
          {selectedFile && (
            <div className="mb-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={handleRemoveFile}
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:bg-green-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={selectedFile ? "Add a message (optional)..." : "Type your message..."}
                disabled={sendMessageMutation.isPending || isUploading}
                className="flex-1 rounded-full border-gray-300 focus:border-blue-500"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log('Paperclip attach button clicked');
                  fileInputRef.current?.click();
                }}
                disabled={sendMessageMutation.isPending || isUploading}
                className="w-12 h-10 border-2 border-blue-500 bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 hover:border-blue-600 shadow-sm"
                title="Click to attach file"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={(!newMessage.trim() && !selectedFile) || sendMessageMutation.isPending || isUploading}
              className="rounded-full w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600"
            >
              {isUploading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}