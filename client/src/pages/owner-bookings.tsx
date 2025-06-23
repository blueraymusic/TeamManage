import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Search,
  Download,
  Mail,
  Phone,
  Building2,
  Users,
  Clock,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Target
} from "lucide-react";
import MeetingBookingsManager from "@/components/meeting-bookings-manager";
import AdelLogo from "@/components/adel-logo";

export default function OwnerBookings() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['/api/admin/meeting-bookings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/meeting-bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    }
  });

  const filteredBookings = bookings.filter((booking: any) =>
    booking.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: any) => b.status === 'pending').length,
    scheduled: bookings.filter((b: any) => b.status === 'scheduled').length,
    completed: bookings.filter((b: any) => b.status === 'completed').length,
    conversionRate: bookings.length > 0 ? ((bookings.filter((b: any) => b.status === 'completed').length / bookings.length) * 100).toFixed(1) : '0'
  };

  const exportBookings = () => {
    const csvContent = [
      ['Date', 'Name', 'Email', 'Company', 'Type', 'Team Size', 'Purpose', 'Status', 'Request ID'].join(','),
      ...filteredBookings.map((booking: any) => [
        new Date(booking.createdAt).toLocaleDateString(),
        `${booking.firstName} ${booking.lastName}`,
        booking.email,
        booking.company,
        booking.organizationType || '',
        booking.teamSize || '',
        booking.meetingPurpose || '',
        booking.status,
        booking.requestId
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adel-demo-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading your booking requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <AdelLogo size="sm" className="filter brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ADEL Platform Owner Dashboard</h1>
                <p className="text-gray-600">Manage your demo requests and prospect pipeline</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={exportBookings}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Requests</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Target className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Scheduled</p>
                  <p className="text-3xl font-bold">{stats.scheduled}</p>
                </div>
                <CalendarDays className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Conversion</p>
                  <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by company, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meeting Bookings Manager */}
        <MeetingBookingsManager />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions & Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Best Practices</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Respond to new requests within 24 hours</li>
                  <li>• Prepare customized demos based on organization type</li>
                  <li>• Follow up with next steps after each demo</li>
                  <li>• Track conversion metrics to improve your process</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Email Setup</h4>
                <p className="text-sm text-gray-600">
                  To receive automatic email notifications for new booking requests, 
                  configure your SENDGRID_API_KEY and OWNER_EMAIL environment variables.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-800 font-mono">
                    OWNER_EMAIL=your@email.com<br/>
                    SENDGRID_API_KEY=your_sendgrid_key
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}