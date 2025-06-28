import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface FloatingMessageNotificationProps {
  onDismiss?: () => void;
  onNavigateToMessages?: () => void;
  activeTab?: string; // Track which tab is currently active
  userRole?: string; // Track user role to determine correct tab
}

export default function FloatingMessageNotification({ 
  onDismiss, 
  onNavigateToMessages,
  activeTab,
  userRole 
}: FloatingMessageNotificationProps) {
  // Use our own auth hook to get user role
  const { user } = useAuth();
  const currentUserRole = user?.role || userRole;
  
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const lastMessageCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  // Get unread message count
  const { data: unreadMessages } = useQuery({
    queryKey: ["/api/messages/unread"],
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  // Mark all messages as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => apiRequest("/api/messages/mark-all-read", "POST", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const currentCount = (unreadMessages as { count: number } | undefined)?.count || 0;

  // Debug logging for userRole and tab state
  console.log("🔥 FloatingNotification - UserRole:", userRole, "CurrentUserRole:", currentUserRole, "ActiveTab:", `"${activeTab}"`, "Count:", currentCount);
  
  // IMMEDIATE VISIBILITY CHECK - Hide notification if viewing messages
  const shouldHideNotification = activeTab === "messages";
  
  console.log("🔥 FloatingNotification - HIDE CHECK - Should Hide:", shouldHideNotification, "ActiveTab exact match:", activeTab === "messages", "ActiveTab value:", `"${activeTab}"`);

  // Automatically mark messages as read when user is viewing messages tab
  useEffect(() => {
    // If user is viewing messages tab, hide the notification immediately
    const isViewingMessages = activeTab === "messages";
    
    console.log("FloatingNotification DEBUG - ActiveTab:", activeTab, "IsViewing:", isViewingMessages, "Count:", currentCount, "IsVisible:", isVisible, "IsDismissed:", isDismissed);
    
    if (isViewingMessages) {
      console.log("FloatingNotification - User is viewing messages, hiding notification and marking as read");
      setIsVisible(false);
      setIsDismissed(true);
      
      // Immediately mark messages as read when viewing messages tab
      if (currentCount > 0) {
        console.log("FloatingNotification - Immediately marking", currentCount, "messages as read");
        markAllAsReadMutation.mutate();
      }
    }
  }, [activeTab, currentCount]);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Show notification when new messages arrive (and not manually dismissed)
    if (currentCount > lastMessageCountRef.current && currentCount > 0 && !isDismissed) {
      setIsVisible(true);
      
      // Auto-hide after 6 seconds
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    }
    
    // Hide notification immediately when all messages are read
    if (currentCount === 0) {
      setIsVisible(false);
      setIsDismissed(false); // Reset dismiss state when no unread messages
    }
    
    lastMessageCountRef.current = currentCount;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentCount, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onDismiss?.();
  };

  const handleNavigate = () => {
    console.log("FloatingNotification - Navigate clicked, userRole:", userRole);
    setIsVisible(false);
    setIsDismissed(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Both admin and officer navigate to messages tab
    console.log("FloatingNotification - Navigation: calling onNavigateToMessages to go to messages tab");
    onNavigateToMessages?.();
  };

  // Don't show if no unread messages, manually dismissed, no userRole, OR viewing messages tab
  if (!isVisible || currentCount === 0 || (isDismissed && currentCount <= lastMessageCountRef.current) || !userRole || shouldHideNotification) {
    console.log("FloatingNotification - HIDING NOTIFICATION - Visible:", isVisible, "Count:", currentCount, "Dismissed:", isDismissed, "UserRole:", userRole, "ShouldHide:", shouldHideNotification);
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideInRight">
      <Card className="bg-white border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Animated Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-notificationPulse">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Notification Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  New Message{currentCount > 1 ? 's' : ''}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                You have {currentCount} unread message{currentCount > 1 ? 's' : ''} waiting for you.
              </p>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleNavigate}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                >
                  View Messages
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-xs px-3 py-1 h-7"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-shimmer"
              style={{ width: '100%' }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}