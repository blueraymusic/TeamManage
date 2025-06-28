import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, MessageCircle, User, ArrowLeft, Paperclip, Download, FileText, AlertCircle, AlertTriangle, Zap, File, X, Search, CheckCircle, Upload } from "lucide-react";
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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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
  const isSendingMessage = sendMessageMutation.isPending;

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
    
    if (!selectedMemberId || (!newMessage.trim() && !selectedFile)) return;

    try {
      if (selectedFile) {
        // Start upload animation
        setIsUploading(true);
        setUploadProgress(0);
        setUploadSuccess(false);

        // Simulate progress animation
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Handle file upload
        const formData = new FormData();
        formData.append('recipientId', selectedMemberId.toString());
        formData.append('urgency', selectedUrgency);
        formData.append('file', selectedFile);
        
        // Add text content if provided, otherwise use file name
        const messageContent = newMessage.trim() || `Shared document: ${selectedFile.name}`;
        formData.append('content', messageContent);

        const response = await fetch('/api/messages/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        // Complete progress and show success animation
        setUploadProgress(100);
        setTimeout(() => {
          setUploadSuccess(true);
          
          // Success animation with checkmark
          setTimeout(() => {
            setIsUploading(false);
            setUploadSuccess(false);
            setUploadProgress(0);
            setNewMessage("");
            setSelectedFile(null);
            setSelectedUrgency("normal");
            if (fileInputRef.current) fileInputRef.current.value = '';
            
            queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
            queryClient.invalidateQueries({ queryKey: ["/api/messages/unread"] });
          }, 1000);
        }, 200);

        toast({
          title: "File shared successfully",
          description: `${selectedFile.name} has been sent`,
        });
      } else {
        // Handle text message
        sendMessageMutation.mutate({
          content: newMessage,
          recipientId: selectedMemberId,
          urgency: selectedUrgency,
        });
      }
    } catch (error: any) {
      console.error("Message send error:", error);
      setIsUploading(false);
      setUploadSuccess(false);
      setUploadProgress(0);
      
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
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
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      // Don't automatically set message content, let user add their own message
      if (!newMessage.trim()) {
        setNewMessage("");
      }
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
                              {unreadCount > 0 && selectedMemberId !== officer.id && (
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
                      const isFileMessage = message.content.includes('📎') || message.content.includes('Shared document:');
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md rounded-2xl shadow-sm ${
                              isCurrentUser
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border'
                            }`}
                          >
                            {message.urgency !== 'normal' && (
                              <div className={`flex items-center gap-1 mb-2 px-4 pt-3 text-xs ${
                                isCurrentUser ? 'text-blue-100' : urgencyConfig.color
                              }`}>
                                <UrgencyIcon className="w-3 h-3" />
                                <span>{urgencyConfig.label}</span>
                              </div>
                            )}
                            
                            {isFileMessage ? (
                              <div className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${
                                    isCurrentUser ? 'bg-blue-400' : 'bg-blue-100'
                                  }`}>
                                    <FileText className={`w-4 h-4 ${
                                      isCurrentUser ? 'text-white' : 'text-blue-600'
                                    }`} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">
                                      {message.fileName || message.content.replace(/^(📎|Shared document:)\s*/, '')}
                                    </div>
                                    <div className={`text-xs ${
                                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                      {message.fileSize ? 
                                        `${(message.fileSize / 1024 / 1024).toFixed(2)} MB` : 
                                        'Document attachment'
                                      }
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Use the fileUrl from the message if available, otherwise construct it
                                      let downloadUrl;
                                      if (message.fileUrl) {
                                        downloadUrl = message.fileUrl;
                                      } else {
                                        // Extract filename from message content and construct URL
                                        const filename = message.content.replace(/^(📎|Shared document:)\s*/, '');
                                        downloadUrl = `/api/files/${encodeURIComponent(filename)}`;
                                      }
                                      window.open(downloadUrl, '_blank');
                                    }}
                                    className={`p-2 ${
                                      isCurrentUser 
                                        ? 'text-white hover:bg-blue-400' 
                                        : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="px-4 py-3">
                                <p className="text-sm break-words">{message.content}</p>
                              </div>
                            )}
                            
                            <div className={`px-4 pb-3 text-xs ${
                              isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {isCurrentUser && (
                                <span className="ml-2">Sent</span>
                              )}
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
                    
                    <Button 
                      type="submit" 
                      size="sm" 
                      disabled={(!newMessage.trim() && !selectedFile) || isUploading}
                      className={`transition-all duration-200 ${
                        isUploading 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isUploading ? (
                        <Upload className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`relative transition-all duration-300 ${
                            uploadSuccess ? 'animate-scaleIn' : ''
                          }`}>
                            {uploadSuccess ? (
                              <CheckCircle className="h-4 w-4 text-green-600 animate-successPulse" />
                            ) : isUploading ? (
                              <Upload className="h-4 w-4 text-blue-600 animate-spin" />
                            ) : (
                              <FileText className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700">{selectedFile.name}</span>
                          {uploadSuccess && (
                            <span className="text-xs text-green-600 font-medium animate-fadeIn">
                              Uploaded!
                            </span>
                          )}
                        </div>
                        {!isUploading && !uploadSuccess && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFile(null)}
                            className="opacity-60 hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Animated Progress Bar */}
                      {(isUploading || uploadSuccess) && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ease-out ${
                              uploadSuccess 
                                ? 'bg-green-500 animate-pulse' 
                                : 'bg-blue-500'
                            }`}
                            style={{ 
                              width: `${uploadProgress}%`,
                              transition: 'width 0.3s ease-out'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Upload Status Text */}
                      {isUploading && !uploadSuccess && (
                        <div className="mt-2 text-xs text-blue-600 animate-pulse">
                          Uploading... {uploadProgress}%
                        </div>
                      )}
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
