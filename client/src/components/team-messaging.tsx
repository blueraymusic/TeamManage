import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageCircle, Send, Users, Clock } from "lucide-react";

export default function TeamMessaging() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [messageContent, setMessageContent] = useState("");

  const { data: teamMembers = [], isLoading: membersLoading } = useQuery({
    queryKey: ["/api/organization/members"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages", selectedMember],
    enabled: !!selectedMember,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { recipientId: number; content: string }) => {
      return await apiRequest("/api/messages", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been delivered to the team member.",
      });
      setMessageContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedMember] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedMember || !messageContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a team member and enter a message.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      recipientId: parseInt(selectedMember),
      content: messageContent.trim(),
    });
  };

  const officers = Array.isArray(teamMembers) 
    ? teamMembers.filter((member: any) => member.role === "officer")
    : [];

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50 pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            Send Message to Team Member
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Team Member
            </label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a team member to message" />
              </SelectTrigger>
              <SelectContent>
                {officers.map((member: any) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {member.firstName && member.lastName 
                          ? `${member.firstName} ${member.lastName}`
                          : member.email
                        }
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Message
            </label>
            <Textarea
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !selectedMember || !messageContent.trim()}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </CardContent>
      </Card>

      {selectedMember && (
        <Card className="border border-gray-200">
          <CardHeader className="bg-gray-50 pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <MessageCircle className="h-4 w-4 text-green-600" />
              Message History
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
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {messages.map((message: any) => (
                  <div 
                    key={message.id} 
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">
                        Admin Message
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{message.content}</p>
                    {!message.isRead && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Unread
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messages yet</p>
                <p className="text-sm">Send your first message to this team member</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}