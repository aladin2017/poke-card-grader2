import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    companyName: "",
    currency: "eur",
    emailNotifications: false,
    gradingScale: "1-10",
    queueCapacity: "50"
  });

  const handleSaveSettings = () => {
    // Here you would typically save to a backend
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input 
              placeholder="Your Company Name" 
              value={settings.companyName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                companyName: e.target.value
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Select 
              value={settings.currency}
              onValueChange={(value) => setSettings(prev => ({
                ...prev,
                currency: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                emailNotifications: checked
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grading Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Grading Scale</Label>
            <Select 
              value={settings.gradingScale}
              onValueChange={(value) => setSettings(prev => ({
                ...prev,
                gradingScale: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 Scale</SelectItem>
                <SelectItem value="letter">Letter Grade (A-F)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Queue Capacity</Label>
            <Input 
              type="number" 
              placeholder="50"
              value={settings.queueCapacity}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                queueCapacity: e.target.value
              }))}
            />
          </div>
          <div className="pt-4">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}