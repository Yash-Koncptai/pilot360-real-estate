import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [authStep, setAuthStep] = useState<"signup" | "signin" | "otp">("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    otp: ""
  });
  const [signinMethod, setSigninMethod] = useState<"email" | "mobile">("email");
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = () => {
    if (!formData.name || !formData.email || !formData.mobile) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Mock OTP sending
    toast({
      title: "OTP Sent",
      description: "OTP sent to your email and mobile number"
    });
    setAuthStep("otp");
  };

  const handleOTPVerification = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }
    
    // Mock successful signup
    toast({
      title: "Success",
      description: "Account created successfully!"
    });
    localStorage.setItem("userAuth", "true");
    localStorage.setItem("userData", JSON.stringify({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile
    }));
    onOpenChange(false);
    setAuthStep("signin");
    setFormData({ name: "", email: "", mobile: "", password: "", otp: "" });
  };

  const handleSignin = () => {
    const identifier = signinMethod === "email" ? formData.email : formData.mobile;
    
    if (!identifier || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Mock signin validation
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const isValidUser = signinMethod === "email" 
        ? userData.email === formData.email 
        : userData.mobile === formData.mobile;
      
      if (isValidUser) {
        toast({
          title: "Success",
          description: "Signed in successfully!"
        });
        localStorage.setItem("userAuth", "true");
        onOpenChange(false);
        setFormData({ name: "", email: "", mobile: "", password: "", otp: "" });
        return;
      }
    }
    
    toast({
      title: "Error",
      description: "Invalid credentials",
      variant: "destructive"
    });
  };

  const renderSignupForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          value={formData.mobile}
          onChange={(e) => handleInputChange("mobile", e.target.value)}
          placeholder="Enter your mobile number"
        />
      </div>
      <Button onClick={handleSignup} className="w-full">
        Send OTP
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={() => setAuthStep("signin")}
          className="text-primary hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );

  const renderOTPForm = () => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Enter the 6-digit OTP sent to your email and mobile number
        </p>
        <Input
          value={formData.otp}
          onChange={(e) => handleInputChange("otp", e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
      </div>
      <Button onClick={handleOTPVerification} className="w-full">
        Verify OTP
      </Button>
      <div className="text-center">
        <button
          onClick={() => setAuthStep("signup")}
          className="text-sm text-primary hover:underline"
        >
          Back to Signup
        </button>
      </div>
    </div>
  );

  const renderSigninForm = () => (
    <div className="space-y-4">
      <Tabs value={signinMethod} onValueChange={(value) => setSigninMethod(value as "email" | "mobile")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>
        <TabsContent value="email" className="space-y-4">
          <div>
            <Label htmlFor="signin-email">Email</Label>
            <Input
              id="signin-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </TabsContent>
        <TabsContent value="mobile" className="space-y-4">
          <div>
            <Label htmlFor="signin-mobile">Mobile Number</Label>
            <Input
              id="signin-mobile"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder="Enter your mobile number"
            />
          </div>
        </TabsContent>
      </Tabs>
      <div>
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Enter your password"
        />
      </div>
      <Button onClick={handleSignin} className="w-full">
        Sign In
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button
          onClick={() => setAuthStep("signup")}
          className="text-primary hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );

  const getTitle = () => {
    switch (authStep) {
      case "signup": return "Sign Up";
      case "otp": return "Verify OTP";
      case "signin": return "Sign In";
      default: return "Authentication";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        {authStep === "signup" && renderSignupForm()}
        {authStep === "otp" && renderOTPForm()}
        {authStep === "signin" && renderSigninForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;