

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialStep?: "signup" | "signin";
  onAuthChange?: (isLoggedIn: boolean) => void;
}

const AuthModal = ({
  open,
  onOpenChange,
  initialStep = "signin",
  onAuthChange,
}: AuthModalProps) => {
  const [authStep, setAuthStep] = useState<"signup" | "signin" | "otp">(initialStep);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    otp: "",
    referral: "",
  });
  const [signinMethod, setSigninMethod] = useState<"email" | "mobile">("email");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Pre-fill referral from URL: ?ref=ABC123
  useEffect(() => {
    if (open && authStep === "signup") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) {
        setFormData((prev) => ({ ...prev, referral: ref.toUpperCase() }));
      }
    }
  }, [open, authStep]);

  // Reset form & step when modal opens
  useEffect(() => {
    if (open) {
      setAuthStep(initialStep);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        otp: "",
        referral: formData.referral || "", // keep pre-filled ref
      });
    }
  }, [open, initialStep]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ──────────────────────────────────────────────────────────────
  // SIGNUP
  // ──────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    const { name, email, mobile, password, referral } = formData;

    if (!name || !email || !mobile || !password || !referral) {
      toast({
        title: "Error",
        description: "All fields are required, including Referral Code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("POST /api/user/signup →", { name, email, mobile, password, referral });

      const response = await api.post(
        "/api/user/signup",
        { name, email, mobile, password, referral },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup success:", response.data);

      if (response.data.success) {
        toast({
          title: "OTP Sent",
          description: `OTP: ${response.data.otp} (sent to email & mobile)`,
        });
        setAuthStep("otp");
      }
    } catch (err: any) {
      console.error("Signup error:", err.response?.data);

      let message = "Failed to sign up.";
      const status = err.response?.status;
      const backendMsg = err.response?.data?.message;

      if (status === 400) {
        message = backendMsg || "Invalid data or referral code.";
      } else if (status === 409) {
        message = "User already exists.";
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // OTP VERIFY
  // ──────────────────────────────────────────────────────────────
  const handleOTPVerification = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/user/otp/verify",
        { email: formData.email, otp: formData.otp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Account verified!",
        });

        localStorage.setItem("userAuth", "true");
        localStorage.setItem(
          "userData",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            referralCode: response.data.referralCode,
          })
        );

        let token = response.data.token;
        if (!token) {
          // Fallback: Attempt automatic login if no token is returned
          const loginResponse = await api.post(
            "/api/user/login",
            { identifier: formData.email, password: formData.password },
            { headers: { "Content-Type": "application/json" } }
          );
          if (loginResponse.data.success) {
            token = loginResponse.data.token;
          } else {
            throw new Error("Automatic login failed after OTP verification.");
          }
        }

        localStorage.setItem("userToken", token);

        onAuthChange?.(true); // Notify parent of successful login
        onOpenChange(false);
        setAuthStep("signin");
        setFormData({ name: "", email: "", mobile: "", password: "", otp: "", referral: "" });
      }
    } catch (err: any) {
      let message = "Invalid or expired OTP.";
      if (err.response?.status === 400) {
        message = err.response.data?.message || "OTP invalid.";
      } else if (err.response?.status === 404) {
        message = "User not found.";
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      onAuthChange?.(false); // Notify parent of failed login
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // RESEND OTP
  // ──────────────────────────────────────────────────────────────
  const handleResendOTP = async () => {
    if (!formData.email) {
      toast({ title: "Error", description: "Email required", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/user/otp",
        { email: formData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast({
          title: "OTP Resent",
          description: `New OTP: ${response.data.otp}`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // SIGN IN
  // ──────────────────────────────────────────────────────────────
  const handleSignin = async () => {
    const identifier = signinMethod === "email" ? formData.email : formData.mobile;
    if (!identifier || !formData.password) {
      toast({
        title: "Error",
        description: "Email/Mobile and password required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/user/login",
        { identifier, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast({ title: "Success", description: "Logged in!" });

        localStorage.setItem("userAuth", "true");
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            name: response.data.user?.name || "",
            email: response.data.user?.email || "",
            mobile: response.data.user?.mobile || "",
          })
        );

        onAuthChange?.(true); // Notify parent of successful login
        onOpenChange(false);
        setFormData({ name: "", email: "", mobile: "", password: "", otp: "", referral: "" });
      }
    } catch (err: any) {
      let message = "Invalid credentials.";
      const status = err.response?.status;

      if (status === 400) {
        message = "Invalid email/mobile or password.";
      } else if (status === 403) {
        message = "Please verify your email and mobile first.";
      }

      toast({
        title: "Error",
        description: err.response?.data?.message || message,
        variant: "destructive",
      });
      onAuthChange?.(false); // Notify parent of failed login
    } finally {
      setIsLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // RENDER FORMS
  // ──────────────────────────────────────────────────────────────
  const renderSignupForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="John Doe"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="you@example.com"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          value={formData.mobile}
          onChange={(e) => handleInputChange("mobile", e.target.value)}
          placeholder="9876543210"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="referral">
          Referral Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="referral"
          value={formData.referral}
          onChange={(e) => handleInputChange("referral", e.target.value)}
          placeholder="e.g. refxyz12 or REFXYZ12"
          disabled={isLoading}
          className="font-mono text-sm tracking-wider"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Case insensitive. Enter exactly as shared.
        </p>
      </div>
      <Button onClick={handleSignup} className="w-full" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={() => setAuthStep("signin")}
          className="text-primary hover:underline"
          disabled={isLoading}
        >
          Sign In
        </button>
      </p>
    </div>
  );

  const renderOTPForm = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Enter the 6-digit OTP sent to your email and mobile
      </p>
      <Input
        value={formData.otp}
        onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        maxLength={6}
        className="text-center text-2xl tracking-widest font-mono"
        disabled={isLoading}
      />
      <Button onClick={handleOTPVerification} className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      <div className="flex justify-center gap-4 text-sm">
        <button onClick={handleResendOTP} className="text-primary hover:underline" disabled={isLoading}>
          Resend OTP
        </button>
        <button onClick={() => setAuthStep("signup")} className="text-primary hover:underline" disabled={isLoading}>
          Back
        </button>
      </div>
    </div>
  );

  const renderSigninForm = () => (
    <div className="space-y-4">
      <Tabs value={signinMethod} onValueChange={(v) => setSigninMethod(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" disabled={isLoading}>Email</TabsTrigger>
          <TabsTrigger value="mobile" disabled={isLoading}>Mobile</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </TabsContent>
        <TabsContent value="mobile">
          <Label htmlFor="signin-mobile">Mobile</Label>
          <Input
            id="signin-mobile"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            placeholder="9876543210"
            disabled={isLoading}
          />
        </TabsContent>
      </Tabs>

      <div>
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>

      <Button onClick={handleSignin} className="w-full" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <button
          onClick={() => setAuthStep("signup")}
          className="text-primary hover:underline"
          disabled={isLoading}
        >
          Sign Up
        </button>
      </p>
    </div>
  );

  const getTitle = () => {
    switch (authStep) {
      case "signup": return "Create Account";
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