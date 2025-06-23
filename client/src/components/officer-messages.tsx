import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Clock, User, CheckCircle, Send } from "lucide-react";

export default function OfficerMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyMessage, setReplyMessage] = useState("");

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  // Get organization members to find admin
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["/api/organization/members"],
  });

  // Find admin user
  const admin = Array.isArray(teamMembers) 
    ? teamMembers.find((member: any) => member.role === "admin")
    : null;

  // Get messages between officer and admin
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages", admin?.id],
    enabled: !!admin?.id,
  });

  // Get unread message count
  const { data: unreadCount } = useQuery({
    queryKey: ["/api/messages/unread/count"],
  });

  // Send reply message mutation
  const sendReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/messages", {
        recipientId: admin?.id,
        content: content.trim(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your reply has been sent to the admin.",
      });
      setReplyMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", admin?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread/count"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return await apiRequest("PATCH", `/api/messages/${messageId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", admin?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread/count"] });
    },
  });

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    sendReplyMutation.mutate(replyMessage);
  };

  const handleMarkAsRead = (messageId: number) => {
    markAsReadMutation.mutate(messageId);
  };

  if (!admin) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No admin found to receive messages from</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50 pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              Chat with Admin
            </div>
            {unreadCount?.count > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount.count} unread
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messagesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(messages) && messages.length > 0 ? (
              messages.map((message: any) => (
                <div key={message.id} className="space-y-2">
                  {/* Message from Admin */}
                  {message.senderId === admin?.id ? (
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">Admin</span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
                          <p className="text-gray-700 text-sm">{message.content}</p>
                        </div>
                        {!message.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(message.id)}
                            disabled={markAsReadMutation.isPending}
                            className="text-xs mt-1 h-6 p-1"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Message from Officer (current user) */
                    <div className="flex items-start space-x-2 justify-end">
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end space-x-2 mb-1">
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                          <span className="text-sm font-medium text-gray-900">You</span>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-xs ml-auto">
                          <p className="text-gray-700 text-sm">{message.content}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation with your admin</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Type your message to admin..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendReply}
                disabled={sendReplyMutation.isPending || !replyMessage.trim()}
                className="px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}