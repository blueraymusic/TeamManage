import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Clock, User, CheckCircle } from "lucide-react";

export default function OfficerMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user to find admin in organization
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

  // Get messages from admin
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages", admin?.id],
    enabled: !!admin?.id,
  });

  // Get unread message count
  const { data: unreadCount } = useQuery({
    queryKey: ["/api/messages/unread/count"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return await apiRequest(`/api/messages/${messageId}/read`, "PATCH", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", admin?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread/count"] });
    },
  });

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
    <Card className="border border-gray-200">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="flex items-center justify-between text-gray-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            Messages from Admin
          </div>
          {unreadCount?.count > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount.count} unread
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
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
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message: any) => (
              <div 
                key={message.id} 
                className={`p-4 rounded-lg border ${
                  message.isRead 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {admin.firstName && admin.lastName 
                          ? `${admin.firstName} ${admin.lastName}`
                          : admin.email
                        }
                      </span>
                      <Badge variant="default" className="ml-2 text-xs">
                        Admin
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                    {!message.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={markAsReadMutation.isPending}
                        className="text-xs h-6"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <p className="text-gray-700">{message.content}</p>
                </div>
                
                <div className="mt-2 flex justify-end">
                  {message.isRead ? (
                    <Badge variant="secondary" className="text-xs">
                      Read
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Unread
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No messages yet</p>
            <p className="text-sm">Your admin hasn't sent you any messages</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}