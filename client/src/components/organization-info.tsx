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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {t("organizationInfo")}
        </CardTitle>
        <CardDescription>
          {t("manageYourOrganization")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("organizationName")}
          </h4>
          <p className="text-lg font-semibold">{(organization as any)?.name}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t("invitationCode")}
          </h4>
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <Badge variant="outline" className="font-mono text-lg px-3 py-1">
              {(organization as any)?.code}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard((organization as any)?.code)}
              className="ml-auto"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t("shareThisCodeWithTeam")}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t("createdDate")}
          </h4>
          <p className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {(organization as any)?.createdAt ? new Date((organization as any).createdAt).toLocaleDateString() : "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}