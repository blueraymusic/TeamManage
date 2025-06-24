import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Users, Building2, Calendar, Mail, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function OrganizationInfo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: organization = {}, isLoading } = useQuery({
    queryKey: ["/api/organization"],
  });

  const { data: teamMembers = [], isLoading: membersLoading } = useQuery({
    queryKey: ["/api/organization/members"],
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      await apiRequest("DELETE", `/api/organization/members/${memberId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/organization/members"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t("success"),
        description: t("organizationCodeCopied"),
      });
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t("organizationInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50 pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Building2 className="h-4 w-4 text-red-600" />
            Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</div>
              <div className="text-sm font-semibold text-gray-900">
                {(organization as any)?.name || "Loading..."}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Invitation Code</div>
              <div className="flex items-center space-x-2">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded border text-gray-800">
                  {(organization as any)?.code || "Loading..."}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard((organization as any)?.code || "")}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {(organization as any)?.createdAt 
                    ? new Date((organization as any).createdAt).toLocaleDateString()
                    : "Today"
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardHeader className="bg-gray-50 pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-4 w-4 text-blue-600" />
            Team Members ({Array.isArray(teamMembers) ? teamMembers.length : 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {membersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : Array.isArray(teamMembers) && teamMembers.length > 0 ? (
            <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
              {teamMembers.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.firstName && member.lastName 
                          ? `${member.firstName} ${member.lastName}`
                          : member.email
                        }
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                    {member.role === 'officer' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              Remove Team Member
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove <strong>{member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : member.email}</strong> from your organization? 
                              <br /><br />
                              <span className="text-red-600 font-medium">This action will permanently delete their account and cannot be undone.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeMemberMutation.mutate(member.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={removeMemberMutation.isPending}
                            >
                              {removeMemberMutation.isPending ? "Removing..." : "Remove Member"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No team members found</p>
              <p className="text-sm">Invite team members using the invitation code above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}