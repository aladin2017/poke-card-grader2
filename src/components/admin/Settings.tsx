import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Image } from "lucide-react";

export function Settings() {
  const { toast } = useToast();
  const [headerLogo, setHeaderLogo] = useState<string>("");
  const [footerLogo, setFooterLogo] = useState<string>("");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>, position: 'header' | 'footer') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (position === 'header') {
          setHeaderLogo(base64String);
          localStorage.setItem('headerLogo', base64String);
        } else {
          setFooterLogo(base64String);
          localStorage.setItem('footerLogo', base64String);
        }
        toast({
          title: "Logo uploaded successfully",
          description: `The ${position} logo has been updated.`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Header Logo (Top Left)</label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e, 'header')}
              />
              {headerLogo && (
                <img src={headerLogo} alt="Header Logo" className="w-12 h-12 object-contain" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Footer Logo (Bottom Right)</label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e, 'footer')}
              />
              {footerLogo && (
                <img src={footerLogo} alt="Footer Logo" className="w-12 h-12 object-contain" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}