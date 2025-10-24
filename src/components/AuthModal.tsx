
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";

// interface AuthModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
//   const [authStep, setAuthStep] = useState<"signup" | "signin" | "otp">(
//     "signin"
//   );
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     otp: "",
//   });
//   const [signinMethod, setSigninMethod] = useState<"email" | "mobile">("email");
//   const { toast } = useToast();

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSignup = async () => {
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.mobile ||
//       !formData.password
//     ) {
//       toast({
//         title: "Error",
//         description: "Please fill all fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5050/api/user/signup",
//         {
//           name: formData.name,
//           email: formData.email,
//           mobile: formData.mobile,
//           password: formData.password,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       if (response.data.success) {
//         toast({
//           title: "OTP Sent",
//           description: `OTP sent to your email and mobile number: ${response.data.otp}`,
//         });
//         setAuthStep("otp");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to sign up";
//       toast({
//         title: "Error",
//         description: errorMsg,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleOTPVerification = async () => {
//     if (!formData.otp || formData.otp.length !== 6) {
//       toast({
//         title: "Error",
//         description: "Please enter valid 6-digit OTP",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5050/api/user/otp/verify",
//         {
//           email: formData.email,
//           otp: formData.otp,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       if (response.data.success) {
//         toast({
//           title: "Success",
//           description: "Account created successfully!",
//         });
//         localStorage.setItem("userAuth", "true");
//         localStorage.setItem(
//           "userData",
//           JSON.stringify({
//             name: formData.name,
//             email: formData.email,
//             mobile: formData.mobile,
//           })
//         );
//         onOpenChange(false);
//         setAuthStep("signin");
//         setFormData({ name: "", email: "", mobile: "", password: "", otp: "" });
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Invalid or expired OTP";
//       toast({
//         title: "Error",
//         description: errorMsg,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5050/api/user/otp",
//         {
//           email: formData.email,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       if (response.data.success) {
//         toast({
//           title: "OTP Resent",
//           description: `New OTP sent: ${response.data.otp}`,
//         });
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Failed to resend OTP";
//       toast({
//         title: "Error",
//         description: errorMsg,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleSignin = async () => {
//     const identifier =
//       signinMethod === "email" ? formData.email : formData.mobile;

//     if (!identifier || !formData.password) {
//       toast({
//         title: "Error",
//         description: "Please fill all fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5050/api/user/login",
//         {
//           identifier,
//           password: formData.password,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       if (response.data.success) {
//         toast({
//           title: "Success",
//           description: "Signed in successfully!",
//         });
//         localStorage.setItem("userAuth", "true");
//         localStorage.setItem("userToken", response.data.token); // Store JWT token
//         localStorage.setItem(
//           "userData",
//           JSON.stringify({
//             name: formData.name || "",
//             email: formData.email || "",
//             mobile: formData.mobile || "",
//           })
//         );
//         onOpenChange(false);
//         setFormData({ name: "", email: "", mobile: "", password: "", otp: "" });
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Invalid credentials";
//       toast({
//         title: "Error",
//         description: errorMsg,
//         variant: "destructive",
//       });
//     }
//   };

//   const renderSignupForm = () => (
//     <div className="space-y-4">
//       <div>
//         <Label htmlFor="name">Full Name</Label>
//         <Input
//           id="name"
//           value={formData.name}
//           onChange={(e) => handleInputChange("name", e.target.value)}
//           placeholder="Enter your full name"
//         />
//       </div>
//       <div>
//         <Label htmlFor="email">Email</Label>
//         <Input
//           id="email"
//           type="email"
//           value={formData.email}
//           onChange={(e) => handleInputChange("email", e.target.value)}
//           placeholder="Enter your email"
//         />
//       </div>
//       <div>
//         <Label htmlFor="mobile">Mobile Number</Label>
//         <Input
//           id="mobile"
//           value={formData.mobile}
//           onChange={(e) => handleInputChange("mobile", e.target.value)}
//           placeholder="Enter your mobile number"
//         />
//       </div>
//       <div>
//         <Label htmlFor="password">Password</Label>
//         <Input
//           id="password"
//           type="password"
//           value={formData.password}
//           onChange={(e) => handleInputChange("password", e.target.value)}
//           placeholder="Enter your password"
//         />
//       </div>
//       <Button onClick={handleSignup} className="w-full">
//         Send OTP
//       </Button>
//       <p className="text-center text-sm text-muted-foreground">
//         Already have an account?{" "}
//         <button
//           onClick={() => setAuthStep("signin")}
//           className="text-primary hover:underline"
//         >
//           Sign In
//         </button>
//       </p>
//     </div>
//   );

//   const renderOTPForm = () => (
//     <div className="space-y-4">
//       <div className="text-center">
//         <p className="text-sm text-muted-foreground mb-4">
//           Enter the 6-digit OTP sent to your email and mobile number
//         </p>
//         <Input
//           value={formData.otp}
//           onChange={(e) => handleInputChange("otp", e.target.value)}
//           placeholder="Enter OTP"
//           maxLength={6}
//           className="text-center text-lg tracking-widest"
//         />
//       </div>
//       <Button onClick={handleOTPVerification} className="w-full">
//         Verify OTP
//       </Button>
//       <div className="text-center">
//         <button
//           onClick={handleResendOTP}
//           className="text-sm text-primary hover:underline"
//         >
//           Resend OTP
//         </button>
//       </div>
//       <div className="text-center">
//         <button
//           onClick={() => setAuthStep("signup")}
//           className="text-sm text-primary hover:underline"
//         >
//           Back to Signup
//         </button>
//       </div>
//     </div>
//   );

//   const renderSigninForm = () => (
//     <div className="space-y-4">
//       <Tabs
//         value={signinMethod}
//         onValueChange={(value) => setSigninMethod(value as "email" | "mobile")}
//       >
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="email">Email</TabsTrigger>
//           <TabsTrigger value="mobile">Mobile</TabsTrigger>
//         </TabsList>
//         <TabsContent value="email" className="space-y-4">
//           <div>
//             <Label htmlFor="signin-email">Email</Label>
//             <Input
//               id="signin-email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleInputChange("email", e.target.value)}
//               placeholder="Enter your email"
//             />
//           </div>
//         </TabsContent>
//         <TabsContent value="mobile" className="space-y-4">
//           <div>
//             <Label htmlFor="signin-mobile">Mobile Number</Label>
//             <Input
//               id="signin-mobile"
//               value={formData.mobile}
//               onChange={(e) => handleInputChange("mobile", e.target.value)}
//               placeholder="Enter your mobile number"
//             />
//           </div>
//         </TabsContent>
//       </Tabs>
//       <div>
//         <Label htmlFor="signin-password">Password</Label>
//         <Input
//           id="signin-password"
//           type="password"
//           value={formData.password}
//           onChange={(e) => handleInputChange("password", e.target.value)}
//           placeholder="Enter your password"
//         />
//       </div>
//       <Button onClick={handleSignin} className="w-full">
//         Sign In
//       </Button>
//       <p className="text-center text-sm text-muted-foreground">
//         Don't have an account?{" "}
//         <button
//           onClick={() => setAuthStep("signup")}
//           className="text-primary hover:underline"
//         >
//           Sign Up
//         </button>
//       </p>
//     </div>
//   );

//   const getTitle = () => {
//     switch (authStep) {
//       case "signup":
//         return "Sign Up";
//       case "otp":
//         return "Verify OTP";
//       case "signin":
//         return "Sign In";
//       default:
//         return "Authentication";
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>{getTitle()}</DialogTitle>
//         </DialogHeader>
//         {authStep === "signup" && renderSignupForm()}
//         {authStep === "otp" && renderOTPForm()}
//         {authStep === "signin" && renderSigninForm()}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AuthModal;
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

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
    otp: "",
  });
  const [signinMethod, setSigninMethod] = useState<"email" | "mobile">("email");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending signup request to: /api/user/signup", {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });
      const response = await api.post("/api/user/signup", {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Signup API response:", response.data);

      if (response.data.success) {
        toast({
          title: "OTP Sent",
          description: "OTP sent to your email and mobile number.",
        });
        setAuthStep("otp");
      }
    } catch (err: any) {
      console.error("Signup error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: api.defaults.baseURL,
      });
      let errorMsg = "Failed to sign up.";
      if (err.response?.status === 400) {
        errorMsg = "Missing required fields.";
      } else if (err.response?.status === 409) {
        errorMsg = "User already exists.";
      } else if (err.response?.status === 404) {
        errorMsg = "Signup endpoint not found at /api/user/signup. Please verify the backend endpoint.";
      }
      toast({
        title: "Error",
        description: err.response?.data?.message || errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending OTP verification request to: /api/user/otp/verify", {
        email: formData.email,
        otp: formData.otp,
      });
      const response = await api.post("/api/user/otp/verify", {
        email: formData.email,
        otp: formData.otp,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("OTP verification API response:", response.data);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        localStorage.setItem("userAuth", "true");
        localStorage.setItem(
          "userData",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
          })
        );
        onOpenChange(false);
        setAuthStep("signin");
        setFormData({ name: "", email: "", mobile: "", password: "", otp: "" });
      }
    } catch (err: any) {
      console.error("OTP verification error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: api.defaults.baseURL,
      });
      let errorMsg = "Invalid or expired OTP.";
      if (err.response?.status === 400) {
        errorMsg = "OTP expired or invalid.";
      } else if (err.response?.status === 404) {
        errorMsg = "User not found or endpoint not found at /api/user/otp/verify.";
      }
      toast({
        title: "Error",
        description: err.response?.data?.message || errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Email is required to resend OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending resend OTP request to: /api/user/otp", {
        email: formData.email,
      });
      const response = await api.post("/api/user/otp", {
        email: formData.email,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Resend OTP API response:", response.data);

      if (response.data.success) {
        toast({
          title: "OTP Resent",
          description: "New OTP sent to your email and mobile number.",
        });
      }
    } catch (err: any) {
      console.error("Resend OTP error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: api.defaults.baseURL,
      });
      let errorMsg = "Failed to resend OTP.";
      if (err.response?.status === 404) {
        errorMsg = "User not found or endpoint not found at /api/user/otp.";
      }
      toast({
        title: "Error",
        description: err.response?.data?.message || errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignin = async () => {
    const identifier = signinMethod === "email" ? formData.email : formData.mobile;

    if (!identifier || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending signin request to: /api/user/login", {
        identifier,
        password: formData.password,
      });
      const response = await api.post("/api/user/login", {
        identifier,
        password: formData.password,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Signin API response:", response.data);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
        localStorage.setItem("userAuth", "true");
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            name: response.data.user?.name || formData.name || "",
            email: response.data.user?.email || formData.email || "",
            mobile: response.data.user?.mobile || formData.mobile || "",
          })
        );
        onOpenChange(false);
        setFormData({ name: "", email: "", mobile: "", password: "", otp: "" });
      }
    } catch (err: any) {
      console.error("Signin error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: api.defaults.baseURL,
      });
      let errorMsg = "Invalid credentials.";
      if (err.response?.status === 400) {
        errorMsg = "Missing required fields or invalid credentials.";
      } else if (err.response?.status === 403) {
        errorMsg = "Email and mobile number not verified.";
      } else if (err.response?.status === 404) {
        errorMsg = "Login endpoint not found at /api/user/login. Please verify the backend endpoint.";
      }
      toast({
        title: "Error",
        description: err.response?.data?.message || errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          placeholder="Enter your email"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          value={formData.mobile}
          onChange={(e) => handleInputChange("mobile", e.target.value)}
          placeholder="Enter your mobile number"
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
          placeholder="Enter your password"
          disabled={isLoading}
        />
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
          disabled={isLoading}
        />
      </div>
      <Button onClick={handleOTPVerification} className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      <div className="text-center">
        <button
          onClick={handleResendOTP}
          className="text-sm text-primary hover:underline"
          disabled={isLoading}
        >
          Resend OTP
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={() => setAuthStep("signup")}
          className="text-sm text-primary hover:underline"
          disabled={isLoading}
        >
          Back to Signup
        </button>
      </div>
    </div>
  );

  const renderSigninForm = () => (
    <div className="space-y-4">
      <Tabs
        value={signinMethod}
        onValueChange={(value) => setSigninMethod(value as "email" | "mobile")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" disabled={isLoading}>Email</TabsTrigger>
          <TabsTrigger value="mobile" disabled={isLoading}>Mobile</TabsTrigger>
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
              disabled={isLoading}
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
              disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      <Button onClick={handleSignin} className="w-full" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
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
      case "signup":
        return "Sign Up";
      case "otp":
        return "Verify OTP";
      case "signin":
        return "Sign In";
      default:
        return "Authentication";
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