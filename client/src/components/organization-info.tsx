import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Users, Building2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";

export default function OrganizationInfo() {
  const { toast } = useToast();
  
  const { data: organization = {}, isLoading } = useQuery({
    queryKey: ["/api/organization"],
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
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Building2 className="h-5 w-5 text-red-600" />
          Organization Information
        </CardTitle>
        <CardDescription className="text-red-600">
          Manage your organization details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Organization Name
            </h4>
            <p className="text-xl font-bold text-gray-900">{(organization as any)?.name}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Created Date
            </h4>
            <p className="text-lg flex items-center gap-2 text-gray-700">
              <Calendar className="h-5 w-5 text-red-500" />
              {(organization as any)?.createdAt ? new Date((organization as any).createdAt).toLocaleDateString() : "22/06/2025"}
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 text-sm uppercase tracking-wide mb-3">
            Invitation Code
          </h4>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-xl px-4 py-2 bg-white border-red-300 text-red-700">
              {(organization as any)?.code}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard((organization as any)?.code)}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-sm text-red-600 mt-3 font-medium">
            Share this code with your team members to join
          </p>
        </div>
      </CardContent>
    </Card>
  );
}