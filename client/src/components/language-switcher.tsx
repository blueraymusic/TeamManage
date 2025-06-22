import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLanguage, getCurrentLanguage } from "@/lib/i18n";
import { Globe, ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCurrentLang(lang);
    // Force re-render of the entire app
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Globe className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {currentLang === "en" ? "EN" : "FR"}
          </span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={currentLang === "en" ? "bg-blue-50 text-blue-600" : ""}
        >
          <span className="mr-2">🇺🇸</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("fr")}
          className={currentLang === "fr" ? "bg-blue-50 text-blue-600" : ""}
        >
          <span className="mr-2">🇫🇷</span>
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
