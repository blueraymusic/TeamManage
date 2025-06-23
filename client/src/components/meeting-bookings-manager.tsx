import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  Clock,
  Mail,
  Phone,
  Building2,
  Users,
  MessageSquare,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle
} from "lucide-react";

interface MeetingBooking {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string;
  organizationType?: string;
  teamSize?: string;
  meetingPurpose?: string;
  preferredTime?: string;
  message?: string;
  status: string;
  requestId: string;
  createdAt: string;
  updatedAt: string;
}

export default function MeetingBookingsManager() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewingBooking, setViewingBooking] = useState<MeetingBooking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery<MeetingBooking[]>({
    queryKey: ['/api/admin/meeting-bookings', selectedStatus === 'all' ? undefined : selectedStatus],
    queryFn: async () => {
      const params = selectedStatus !== 'all' ? `?status=${selectedStatus}` : '';
      const response = await fetch(`/api/admin/meeting-bookings${params}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: number; status: string }) => {
      const response = await fetch(`/api/admin/meeting-bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/meeting-bookings'] });
      toast({
        title: "Status Updated",
        description: "Meeting booking status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'contacted':
        return <Phone className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleViewBooking = (booking: MeetingBooking) => {
    setViewingBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleStatusUpdate = (bookingId: number, status: string) => {
    updateStatusMutation.mutate({ bookingId, status });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Bookings</h2>
          <p className="text-gray-600">Manage demo requests and sales inquiries</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(['pending', 'contacted', 'scheduled', 'completed', 'cancelled'] as const).map((status) => {
          const count = bookings.filter((b) => b.status === status).length;
          return (
            <Card key={status} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meeting bookings found</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all' 
                  ? "No demo requests have been submitted yet."
                  : `No bookings with status "${selectedStatus}" found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.firstName} {booking.lastName}
                      </h3>
                      <Badge className={`${getStatusColor(booking.status)} flex items-center space-x-1`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{booking.company}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{booking.email}</span>
                      </div>
                      
                      {booking.phone && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{booking.phone}</span>
                        </div>
                      )}
                      
                      {booking.teamSize && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{booking.teamSize}</span>
                        </div>
                      )}
                      
                      {booking.preferredTime && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm capitalize">{booking.preferredTime}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CalendarDays className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {booking.meetingPurpose && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Purpose: </span>
                        <span className="text-sm text-gray-600 capitalize">{booking.meetingPurpose.replace('-', ' ')}</span>
                      </div>
                    )}
                    
                    {booking.message && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600 line-clamp-2">{booking.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBooking(booking)}
                      className="whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {booking.status === 'pending' && (
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'contacted')}
                          disabled={updateStatusMutation.isPending}
                          className="whitespace-nowrap"
                        >
                          Mark Contacted
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'scheduled')}
                          disabled={updateStatusMutation.isPending}
                          className="whitespace-nowrap"
                        >
                          Mark Scheduled
                        </Button>
                      </div>
                    )}
                    
                    {booking.status === 'contacted' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, 'scheduled')}
                        disabled={updateStatusMutation.isPending}
                        className="whitespace-nowrap"
                      >
                        Mark Scheduled
                      </Button>
                    )}
                    
                    {booking.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        disabled={updateStatusMutation.isPending}
                        className="whitespace-nowrap"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Meeting Booking Details
            </DialogTitle>
            <DialogDescription>
              Complete information for booking request #{viewingBooking?.requestId}
            </DialogDescription>
          </DialogHeader>
          
          {viewingBooking && (
            <div className="space-y-6 mt-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{viewingBooking.firstName} {viewingBooking.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{viewingBooking.email}</p>
                  </div>
                  {viewingBooking.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{viewingBooking.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Organization Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <p className="text-gray-900">{viewingBooking.company}</p>
                  </div>
                  {viewingBooking.organizationType && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Organization Type</label>
                      <p className="text-gray-900 capitalize">{viewingBooking.organizationType.replace('-', ' ')}</p>
                    </div>
                  )}
                  {viewingBooking.teamSize && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Team Size</label>
                      <p className="text-gray-900">{viewingBooking.teamSize}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meeting Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Meeting Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingBooking.meetingPurpose && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Purpose</label>
                      <p className="text-gray-900 capitalize">{viewingBooking.meetingPurpose.replace('-', ' ')}</p>
                    </div>
                  )}
                  {viewingBooking.preferredTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred Time</label>
                      <p className="text-gray-900 capitalize">{viewingBooking.preferredTime}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Message */}
              {viewingBooking.message && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{viewingBooking.message}</p>
                  </div>
                </div>
              )}

              {/* Status and Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Status</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className={`${getStatusColor(viewingBooking.status)} flex items-center space-x-1`}>
                    {getStatusIcon(viewingBooking.status)}
                    <span className="capitalize">{viewingBooking.status}</span>
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <label className="font-medium">Request ID</label>
                    <p>{viewingBooking.requestId}</p>
                  </div>
                  <div>
                    <label className="font-medium">Submitted</label>
                    <p>{new Date(viewingBooking.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <a
                  href={`mailto:${viewingBooking.email}?subject=Re: Demo Request - ${viewingBooking.company}&body=Hi ${viewingBooking.firstName},%0D%0A%0D%0AThank you for your interest in ADEL. I'd be happy to schedule a demo for ${viewingBooking.company}.%0D%0A%0D%0ABest regards`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}