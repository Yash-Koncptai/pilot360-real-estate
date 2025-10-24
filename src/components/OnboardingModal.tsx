

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Slider } from "@/components/ui/slider";
// import {
//   CheckCircle,
//   ArrowRight,
//   Target,
//   DollarSign,
//   MapPin,
//   Home,
// } from "lucide-react";
// import {
//   purposeOptions,
//   landTypeOptions,
//   locationOptions,
// } from "@/data/landProperties";
// import axios from "axios";

// interface OnboardingModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onComplete: (preferences: UserPreferences) => void;
// }

// export interface UserPreferences {
//   purpose: string;
//   budgetRange: [number, number];
//   landTypes: string[];
//   locations: string[];
// }

// export default function OnboardingModal({
//   isOpen,
//   onClose,
//   onComplete,
// }: OnboardingModalProps) {
//   const [step, setStep] = useState(1);
//   const [preferences, setPreferences] = useState<UserPreferences>({
//     purpose: "",
//     budgetRange: [2000000, 10000000], // 20L to 1Cr default
//     landTypes: [],
//     locations: [],
//   });

//   const updatePreference = (key: keyof UserPreferences, value: any) => {
//     setPreferences((prev) => ({ ...prev, [key]: value }));
//   };

//   const toggleArrayItem = (key: "landTypes" | "locations", item: string) => {
//     setPreferences((prev) => ({
//       ...prev,
//       [key]: prev[key].includes(item)
//         ? prev[key].filter((i) => i !== item)
//         : [...prev[key], item],
//     }));
//   };

//   const handleComplete = async () => {
//     const token = localStorage.getItem("userToken");
//     if (!token) {
//       onClose();
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5050/api/user/preferences",
//         {
//           primary_purpose: preferences.purpose,
//           budget_min: preferences.budgetRange[0],
//           budget_max: preferences.budgetRange[1],
//           land_interests: preferences.landTypes.join(", "), // Join array into comma-separated string
//           preferred_location: preferences.locations[0] || "", // Use first location
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.data.success) {
//         onComplete(preferences);
//         onClose();
//       }
//     } catch (err: any) {
//       if (err.response?.status === 400) {
//         alert(
//           "Missing required fields. Please ensure all preferences are set."
//         );
//       } else {
//         alert("Failed to save preferences. Please try again.");
//       }
//     }
//   };

//   const formatCurrency = (value: number) => {
//     if (value >= 10000000) {
//       return `₹${(value / 10000000).toFixed(1)}Cr`;
//     }
//     return `₹${(value / 100000).toFixed(0)}L`;
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-center">
//             Let's Find Your Perfect Land Investment
//           </DialogTitle>
//           <div className="flex justify-center mt-4">
//             <div className="flex gap-2">
//               {[1, 2, 3, 4].map((i) => (
//                 <div
//                   key={i}
//                   className={`w-3 h-3 rounded-full ${
//                     i <= step ? "bg-primary" : "bg-muted"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="mt-6">
//           {step === 1 && (
//             <div className="space-y-6">
//               <div className="text-center">
//                 <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
//                 <h3 className="text-xl font-semibold mb-2">
//                   What's your primary purpose?
//                 </h3>
//                 <p className="text-muted-foreground">
//                   This helps us recommend the right type of land for you
//                 </p>
//               </div>

//               <div className="grid gap-4">
//                 {purposeOptions.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => updatePreference("purpose", option.id)}
//                     className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
//                       preferences.purpose === option.id
//                         ? "border-primary bg-primary/5"
//                         : "border-border"
//                     }`}
//                   >
//                     <div className="font-semibold mb-1">{option.label}</div>
//                     <div className="text-sm text-muted-foreground">
//                       {option.description}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-6">
//               <div className="text-center">
//                 <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
//                 <h3 className="text-xl font-semibold mb-2">
//                   What's your investment budget?
//                 </h3>
//                 <p className="text-muted-foreground">
//                   Set your comfortable investment range
//                 </p>
//               </div>

//               <div className="space-y-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-primary mb-2">
//                     {formatCurrency(preferences.budgetRange[0])} -{" "}
//                     {formatCurrency(preferences.budgetRange[1])}
//                   </div>
//                 </div>

//                 <div className="px-4">
//                   <Slider
//                     value={preferences.budgetRange}
//                     onValueChange={(value) =>
//                       updatePreference("budgetRange", value)
//                     }
//                     min={1000000} // 10L
//                     max={50000000} // 5Cr
//                     step={500000} // 5L
//                     className="w-full"
//                   />
//                   <div className="flex justify-between text-sm text-muted-foreground mt-2">
//                     <span>₹10L</span>
//                     <span>₹5Cr</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-6">
//               <div className="text-center">
//                 <Home className="w-12 h-12 mx-auto mb-4 text-primary" />
//                 <h3 className="text-xl font-semibold mb-2">
//                   What type of land interests you?
//                 </h3>
//                 <p className="text-muted-foreground">
//                   Select all that apply - we'll show you the best options
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 {landTypeOptions.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => toggleArrayItem("landTypes", option.id)}
//                     className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
//                       preferences.landTypes.includes(option.id)
//                         ? "border-primary bg-primary/5"
//                         : "border-border"
//                     }`}
//                   >
//                     <div className="font-semibold mb-1">{option.label}</div>
//                     <div className="text-sm text-muted-foreground">
//                       {option.description}
//                     </div>
//                     {preferences.landTypes.includes(option.id) && (
//                       <CheckCircle className="w-5 h-5 text-primary mt-2" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {step === 4 && (
//             <div className="space-y-6">
//               <div className="text-center">
//                 <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
//                 <h3 className="text-xl font-semibold mb-2">
//                   Preferred locations?
//                 </h3>
//                 <p className="text-muted-foreground">
//                   Choose areas you're interested in exploring
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 {locationOptions.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => toggleArrayItem("locations", option.id)}
//                     className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
//                       preferences.locations.includes(option.id)
//                         ? "border-primary bg-primary/5"
//                         : "border-border"
//                     }`}
//                   >
//                     <div className="font-semibold mb-1">{option.label}</div>
//                     <div className="text-sm text-muted-foreground">
//                       {option.description}
//                     </div>
//                     {preferences.locations.includes(option.id) && (
//                       <CheckCircle className="w-5 h-5 text-primary mt-2" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="flex justify-between mt-8">
//             {step > 1 && (
//               <Button variant="outline" onClick={() => setStep(step - 1)}>
//                 Previous
//               </Button>
//             )}

//             <div className="ml-auto">
//               {step < 4 ? (
//                 <Button
//                   onClick={() => setStep(step + 1)}
//                   disabled={
//                     (step === 1 && !preferences.purpose) ||
//                     (step === 3 && preferences.landTypes.length === 0) ||
//                     (step === 4 && preferences.locations.length === 0)
//                   }
//                 >
//                   Next <ArrowRight className="w-4 h-4 ml-2" />
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleComplete}
//                   disabled={preferences.locations.length === 0}
//                   className="bg-gradient-to-r from-primary to-primary-dark"
//                 >
//                   Get My Recommendations
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  ArrowRight,
  Target,
  DollarSign,
  MapPin,
  Home,
} from "lucide-react";
import {
  purposeOptions,
  landTypeOptions,
  locationOptions,
} from "@/data/landProperties";
import api from "@/utils/api";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  purpose: string;
  budgetRange: [number, number];
  landTypes: string[];
  locations: string[];
}

export default function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    purpose: "",
    budgetRange: [2000000, 10000000], // 20L to 1Cr default
    landTypes: [],
    locations: [],
  });

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: "landTypes" | "locations", item: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((i) => i !== item)
        : [...prev[key], item],
    }));
  };

  const handleComplete = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save preferences.",
        variant: "destructive",
      });
      onClose();
      return;
    }

    if (!preferences.purpose || preferences.landTypes.length === 0 || preferences.locations.length === 0) {
      toast({
        title: "Incomplete Preferences",
        description: "Please select a purpose, at least one land type, and one location.",
        variant: "destructive",
      });
      return;
    }

    if (preferences.budgetRange[0] >= preferences.budgetRange[1]) {
      toast({
        title: "Invalid Budget Range",
        description: "Minimum budget must be less than maximum budget.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Saving preferences to: /api/user/preferences", {
        primary_purpose: preferences.purpose,
        budget_min: preferences.budgetRange[0],
        budget_max: preferences.budgetRange[1],
        land_interests: preferences.landTypes.join(", "),
        preferred_location: preferences.locations[0] || "",
      });
      const response = await api.post(
        "/api/user/preferences",
        {
          primary_purpose: preferences.purpose,
          budget_min: preferences.budgetRange[0],
          budget_max: preferences.budgetRange[1],
          land_interests: preferences.landTypes.join(", "),
          preferred_location: preferences.locations[0] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Preferences API response:", response.data);

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Preferences saved successfully!",
        });
        onComplete(preferences);
        onClose();
      }
    } catch (err: any) {
      console.error("Preferences error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url,
        baseURL: api.defaults.baseURL,
      });
      let errorMsg = "Failed to save preferences. Please try again.";
      if (err.response?.status === 400) {
        errorMsg = err.response.data.message.includes("budget")
          ? "Invalid budget range."
          : "Missing required fields.";
      } else if (err.response?.status === 401) {
        errorMsg = "Unauthorized: Please log in again.";
        localStorage.removeItem("userToken");
        localStorage.removeItem("userAuth");
        localStorage.removeItem("userData");
      } else if (err.response?.status === 404) {
        errorMsg = "Preferences endpoint not found at /api/user/preferences.";
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

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(value / 100000).toFixed(0)}L`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Let's Find Your Perfect Land Investment
          </DialogTitle>
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  What's your primary purpose?
                </h3>
                <p className="text-muted-foreground">
                  This helps us recommend the right type of land for you
                </p>
              </div>

              <div className="grid gap-4">
                {purposeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updatePreference("purpose", option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                      preferences.purpose === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  What's your investment budget?
                </h3>
                <p className="text-muted-foreground">
                  Set your comfortable investment range
                </p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {formatCurrency(preferences.budgetRange[0])} -{" "}
                    {formatCurrency(preferences.budgetRange[1])}
                  </div>
                </div>

                <div className="px-4">
                  <Slider
                    value={preferences.budgetRange}
                    onValueChange={(value) =>
                      updatePreference("budgetRange", value)
                    }
                    min={1000000} // 10L
                    max={50000000} // 5Cr
                    step={500000} // 5L
                    className="w-full"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹10L</span>
                    <span>₹5Cr</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Home className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  What type of land interests you?
                </h3>
                <p className="text-muted-foreground">
                  Select all that apply - we'll show you the best options
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {landTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleArrayItem("landTypes", option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                      preferences.landTypes.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                    {preferences.landTypes.includes(option.id) && (
                      <CheckCircle className="w-5 h-5 text-primary mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">
                  Preferred locations?
                </h3>
                <p className="text-muted-foreground">
                  Choose areas you're interested in exploring
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {locationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleArrayItem("locations", option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                      preferences.locations.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                    {preferences.locations.includes(option.id) && (
                      <CheckCircle className="w-5 h-5 text-primary mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isLoading}>
                Previous
              </Button>
            )}

            <div className="ml-auto">
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    isLoading ||
                    (step === 1 && !preferences.purpose) ||
                    (step === 3 && preferences.landTypes.length === 0) ||
                    (step === 4 && preferences.locations.length === 0)
                  }
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading || preferences.locations.length === 0}
                  className="bg-gradient-to-r from-primary to-primary-dark"
                >
                  {isLoading ? "Saving..." : "Get My Recommendations"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}