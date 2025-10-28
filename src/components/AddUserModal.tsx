import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: UserData) => void;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Broker" | "User";
  referralCode: string;
  referredBy: string;
  status: "Active" | "Inactive";
}

const generateReferralCode = () => {
  return 'REF' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

const AddUserModal = ({ open, onOpenChange, onSave }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User" as "Admin" | "Broker" | "User"
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newUser: UserData = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      referralCode: generateReferralCode(),
      referredBy: "-",
      status: "Active"
    };

    onSave(newUser);
    toast({
      title: "Success",
      description: "User added successfully"
    });
    
    setFormData({ name: "", email: "", role: "User" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter user name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">Regular User</SelectItem>
                <SelectItem value="Broker">Broker</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              A unique referral code will be auto-generated for this user
            </p>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Add User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;