import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FloatingMessageNotificationProps {
  onDismiss?: () => void;
  onNavigateToMessages?: () => void;
}

export default function FloatingMessageNotification({ 
  onDismiss, 
  onNavigateToMessages 
}: FloatingMessageNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Get unread message count
  const { data: unreadMessages } = useQuery({
    queryKey: ["/api/messages/unread"],
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  const currentCount = (unreadMessages as { count: number } | undefined)?.count || 0;

  useEffect(() => {
    // Show notification when new messages arrive
    if (currentCount > lastMessageCount && currentCount > 0) {
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
    
    setLastMessageCount(currentCount);
  }, [currentCount, lastMessageCount]);

  useEffect(() => {
    // Hide notification when no unread messages
    if (currentCount === 0) {
      setIsVisible(false);
    }
  }, [currentCount]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleNavigate = () => {
    setIsVisible(false);
    onNavigateToMessages?.();
  };

  if (!isVisible || currentCount === 0) return null;

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