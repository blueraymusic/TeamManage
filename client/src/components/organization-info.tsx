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
  );
}