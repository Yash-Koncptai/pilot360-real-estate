// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/hooks/use-toast";
// import OnboardingModal, { UserPreferences } from "@/components/OnboardingModal";
// import LandPropertyCard from "@/components/LandPropertyCard";
// import { LandProperty } from "@/data/landProperties";
// import {
//   Brain,
//   MapPin,
//   Search,
//   Target,
//   DollarSign,
//   BarChart3,
//   HeartHandshake,
//   AlertTriangle,
//   Shield,
//   Clock,
// } from "lucide-react";
// import Seo from "@/components/Seo";
// import api from "@/utils/api";

// export default function Index() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
//   const [showUnlockedView, setShowUnlockedView] = useState(false);
//   const [properties, setProperties] = useState<LandProperty[]>([]);
//   const [suggestedProperties, setSuggestedProperties] = useState<LandProperty[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // const handleOnboardingComplete = async (preferences: UserPreferences) => {
//   //   setUserPreferences(preferences);
//   //   setShowUnlockedView(true);
//   //   await Promise.all([fetchRecommendations(preferences), fetchSuggestions()]);
//   // };
//   const handleOnboardingComplete = async (preferences: UserPreferences) => {
//   setUserPreferences(preferences);
//   setShowUnlockedView(true);
//   setShowOnboarding(false);

//   // Fetch fresh recommendations with new preferences
//   await Promise.all([fetchRecommendations(preferences), fetchSuggestions()]);
// };

//   const fetchRecommendations = async (preferences?: UserPreferences) => {
//     const token = localStorage.getItem("userToken");
//     if (!token) {
//       setError("Please sign in to view recommendations.");
//       toast({
//         title: "Authentication Required",
//         description: "Please sign in to view personalized recommendations.",
//         variant: "destructive",
//       });
//       navigate("/"); // Prompt re-login
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       console.log("Fetching recommendations from: /api/user/recommendations", { token });
//       const response = await api.get("/api/user/recommendations", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("Recommendations API response:", response.data);

//       if (response.data.success) {
//         setProperties(response.data.properties);
//       } else {
//         setError(response.data.message || "Failed to fetch recommendations");
//         toast({
//           title: "Error",
//           description: response.data.message || "Failed to fetch recommendations",
//           variant: "destructive",
//         });
//         if (response.data.message.includes("preferences")) {
//           setShowOnboarding(true);
//         }
//       }
//     } catch (err: any) {
//       console.error("Recommendations error details:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url,
//         baseURL: api.defaults.baseURL,
//       });
//       let errorMsg = "Failed to fetch recommendations. Please try again.";
//       if (err.response?.status === 401 || (err.response?.status === 403 && err.response?.data?.message.includes("token"))) {
//         errorMsg = "Session expired or invalid token. Please log in again.";
//         navigate("/"); // Redirect to home for re-login
//       } else if (err.response?.status === 403) {
//         errorMsg = "Please set your preferences first.";
//         setShowOnboarding(true);
//       } else if (err.response?.status === 404) {
//         errorMsg = "Recommendations endpoint not found at /api/user/recommendations.";
//       } else if (err.response?.data?.message.includes("user_id")) {
//         errorMsg = "Authentication error: Please log in again or contact support.";
//         navigate("/"); // Redirect for re-login
//       }
//       setError(errorMsg);
//       toast({
//         title: "Error",
//         description: err.response?.data?.message || errorMsg,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserPreferences = async () => {
//   const token = localStorage.getItem("userToken");
//   if (!token) return;

//   try {
//     const response = await api.get("/api/user/preferences", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.data.success && response.data.preferences) {
//       const prefs: UserPreferences = {
//         purpose: response.data.preferences.primary_purpose,
//         budgetRange: [
//           response.data.preferences.budget_min,
//           response.data.preferences.budget_max,
//         ],
//         landTypes: response.data.preferences.land_interests
//           ?.split(", ")
//           .filter(Boolean) || [],
//         locations: response.data.preferences.preferred_location
//           ? [response.data.preferences.preferred_location]
//           : [],
//       };

//       setUserPreferences(prefs);
//       setShowUnlockedView(true);
//       return prefs;
//     }
//   } catch (err: any) {
//     console.log("No saved preferences or error fetching:", err.response?.data);
//     // Don't show error toast here — it's normal for new users
//   }
// };

//   const fetchSuggestions = async () => {
//     const token = localStorage.getItem("userToken");
//     if (!token) {
//       // Don't set error for suggestions to avoid duplicate error messages
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log("Fetching suggestions from: /api/user/suggestions", { token });
//       const response = await api.get("/api/user/suggestions", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       console.log("Suggestions API response:", response.data);

//       if (response.data.success) {
//         setSuggestedProperties(response.data.properties);
//       } else {
//         toast({
//           title: "Warning",
//           description: response.data.message || "No suggested properties available.",
//           variant: "default",
//         });
//       }
//     } catch (err: any) {
//       console.error("Suggestions error details:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url,
//         baseURL: api.defaults.baseURL,
//       });
//       let errorMsg = "Failed to fetch suggestions. Please try again.";
//       if (err.response?.status === 401 || (err.response?.status === 403 && err.response?.data?.message.includes("token"))) {
//         errorMsg = "Session expired or invalid token. Please log in again.";
//         navigate("/"); // Redirect to home for re-login
//       } else if (err.response?.status === 404) {
//         errorMsg = "Suggestions endpoint not found at /api/user/suggestions.";
//       }
//       toast({
//         title: "Error",
//         description: err.response?.data?.message || errorMsg,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   const token = localStorage.getItem("userToken");
//   //   if (token && !userPreferences) {
//   //     fetchRecommendations();
//   //     fetchSuggestions();
//   //   }
//   // }, [userPreferences]);
//   useEffect(() => {
//   const token = localStorage.getItem("userToken");

//   if (!token) {
//     setShowUnlockedView(false);
//     return;
//   }

//   const loadUserData = async () => {
//     setLoading(true);
//     // Step 1: Try to load saved preferences
//     const savedPrefs = await fetchUserPreferences();

//     // Step 2: If no saved preferences → show onboarding
//     if (!savedPrefs) {
//       setShowOnboarding(true);
//     } else {
//       // Step 3: Fetch recommendations using saved preferences
//       await Promise.all([
//         fetchRecommendations(savedPrefs),
//         fetchSuggestions(),
//       ]);
//     }
//     setLoading(false);
//   };

//   loadUserData();
// }, []); // Run only once on mount

//   return (
//     <>
//       <Seo
//         title="Smart Land Investments for High Earners | Premium Land Portal"
//         description="Curated land opportunities with AI-driven insights for high-salaried professionals. Agricultural, commercial, and farmhouse plots with guaranteed ROI."
//         canonicalPath="/"
//       />

//       <section className="relative py-20 bg-gradient-to-br from-black via-black/90 to-primary/20 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200')] bg-cover bg-center opacity-30"></div>
//         <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>

//         <div className="container mx-auto px-4 relative z-10">
//           <div className="text-center mb-12">
//             <div className="flex justify-center gap-2 mb-6">
//               <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
//                 <Brain className="w-3 h-3 mr-1" />
//                 AI-Powered Insights
//               </Badge>
//               <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
//                 <Target className="w-3 h-3 mr-1" />
//                 Curated for High Earners
//               </Badge>
//             </div>

//             <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
//               Smart Land Investments
//               <br />
//               for High Earners
//             </h1>

//             <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
//               Curated land opportunities with AI-driven insights, growth
//               forecasts, and personalized recommendations for premium investors.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button
//                 size="lg"
//                 onClick={() => setShowOnboarding(true)}
//                 className="bg-gradient-to-r from-primary to-primary/80 text-black font-semibold hover:scale-105 transition-transform"
//                 disabled={loading}
//               >
//                 <Search className="w-4 h-4 mr-2" />
//                 Set Preferences
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 onClick={() => navigate("/map")}
//                 className="border-white/30 text-black hover:bg-white/10 hover:scale-105 transition-transform"
//                 disabled={loading}
//               >
//                 <MapPin className="w-4 h-4 mr-2" />
//                 View AI Map
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {error && (
//         <section className="py-4 bg-red-50">
//           <div className="container mx-auto px-4 text-center">
//             <div className="flex items-center justify-center gap-2 text-red-600">
//               <AlertTriangle className="w-5 h-5" />
//               <p>{error}</p>
//             </div>
//           </div>
//         </section>
//       )}

//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Why Choose Our Platform?
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Premium features designed specifically for high-earning
//               professionals seeking smart land investments.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Target className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">
//                   Curated Investment Options
//                 </CardTitle>
//                 <CardDescription>
//                   Choose from Agricultural, Non-Agricultural, Country Homes,
//                   Farmhouses, and Industrial Land.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
//                 <CardDescription>
//                   Get heatmaps, growth forecasts, and personalized suggestions
//                   backed by data analytics.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">
//                   Price & Demand Heatmaps
//                 </CardTitle>
//                 <CardDescription>
//                   Visualize which locations are growing fastest with real-time
//                   market data visualization.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">One-Stop Solution</CardTitle>
//                 <CardDescription>
//                   Finance assistance, documentation help, and post-purchase
//                   property management support.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Why Land Investments Beat Traditional Options?
//             </h2>
//             <p className="text-xl text-muted-foreground">
//               Compare the advantages of land investment vs flats and commercial
//               properties
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="hover:shadow-xl transition-all ring-2 ring-primary scale-105">
//               <CardHeader className="text-center">
//                 <div className="text-4xl mb-4">🏞️</div>
//                 <CardTitle className="text-primary">Land Investment</CardTitle>
//                 <Badge className="mt-2">Recommended</Badge>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     APPRECIATION
//                   </div>
//                   <div className="font-bold text-lg">15-25% annually</div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     MAINTENANCE
//                   </div>
//                   <div>Minimal</div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     FLEXIBILITY
//                   </div>
//                   <div>High - Multiple uses</div>
//                 </div>
//                 <Separator />
//                 <div className="space-y-2">
//                   <div className="font-semibold text-sm text-green-600">
//                     PROS:
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     High appreciation
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Flexible use
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Lower maintenance
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>Tax
//                     benefits
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="font-semibold text-sm text-red-600">
//                     CONS:
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Longer liquidity
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Market research needed
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="hover:shadow-xl transition-all">
//               <CardHeader className="text-center">
//                 <div className="text-4xl mb-4">🏢</div>
//                 <CardTitle>Residential Flats</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     APPRECIATION
//                   </div>
//                   <div className="font-bold text-lg">8-12% annually</div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     MAINTENANCE
//                   </div>
//                   <div>High (Society charges)</div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     FLEXIBILITY
//                   </div>
//                   <div>Low - Fixed use</div>
//                 </div>
//                 <Separator />
//                 <div className="space-y-2">
//                   <div className="font-semibold text-sm text-green-600">
//                     PROS:
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Ready to use
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Rental income
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Quick liquidity
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="font-semibold text-sm text-red-600">
//                     CONS:
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Society charges
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Depreciation
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Limited appreciation
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             <Card className="hover:shadow-xl transition-all">
//               <CardHeader className="text-center">
//                 <div className="text-4xl mb-4">🏬</div>
//                 <CardTitle>Commercial Properties</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     APPRECIATION
//                   </div>
//                   <div className="font-bold text-lg">10-15% annually</div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     MAINTENANCE
//                   </div>
//                   <div>Medium</div>
//                 </div>
//                 <div>
//                   <div className="font-semibold text-sm text-muted-foreground">
//                     FLEXIBILITY
//                   </div>
//                   <div>Medium</div>
//                 </div>
//                 <Separator />
//                 <div className="space-y-2">
//                   <div className="font-semibold text-sm text-green-600">
//                     PROS:
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Higher rental yields
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     Business use
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="font-semibold text-sm text-red-600">
//                     CONS:
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>High
//                     entry cost
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Market dependent
//                   </div>
//                   <div className="text-sm flex items-center gap-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     Complex regulations
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 bg-background">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               We Stay With You
//             </h2>
//             <p className="text-xl text-muted-foreground">
//               End-to-end support for your land investment journey
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <DollarSign className="w-16 h-16 text-primary mx-auto mb-4" />
//                 <CardTitle>Finance Assistance</CardTitle>
//                 <CardDescription className="text-base">
//                   Pre-approved loan options with competitive rates. Our
//                   financial partners ensure smooth funding for your investment.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
//                 <CardTitle>Documentation Help</CardTitle>
//                 <CardDescription className="text-base">
//                   Complete paperwork assistance, legal verification, and
//                   compliance support for hassle-free transactions.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
//                 <CardTitle>Post-Purchase Management</CardTitle>
//                 <CardDescription className="text-base">
//                   Property maintenance, development guidance, and ongoing
//                   support while your investment grows.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Property Suggestions Section */}
//       <section className="py-16 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Property Suggestions
//             </h2>
//             <p className="text-xl text-muted-foreground">
//               {showUnlockedView
//                 ? "Handpicked properties recommended by our experts"
//                 : "Discover top properties curated by our team"}
//             </p>
//             {!showUnlockedView && (
//               <Button
//                 size="lg"
//                 onClick={() => setShowOnboarding(true)}
//                 className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
//                 disabled={loading}
//               >
//                 <Search className="w-4 h-4 mr-2" />
//                 Personalize Your Experience
//               </Button>
//             )}
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//               <p className="mt-2 text-muted-foreground">Loading suggestions...</p>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {suggestedProperties.length > 0 ? (
//                 suggestedProperties.slice(0, 3).map((property) => (
//                   <LandPropertyCard
//                     key={property.id}
//                     property={{
//                       ...property,
//                       isLocked: !showUnlockedView,
//                       images: property.images.map(
//                         (img: string) =>
//                           img.startsWith("http")
//                             ? img
//                             : `${api.defaults.baseURL}/${img}`
//                       ),
//                       features: property.features || [],
//                       aiInsights: {
//                         matchScore: property.matchPercentage || 0,
//                         growthPotential: property.aiInsights?.growthPotential || "Medium",
//                         expectedROI: property.aiInsights?.expectedROI || "10-12% annually",
//                         riskLevel: property.aiInsights?.riskLevel || "Low",
//                         demandIndicators: {
//                           viewsThisWeek: property.views || 0,
//                           nearbyDevelopments:
//                             property.aiInsights?.demandIndicators?.nearbyDevelopments || [],
//                         },
//                       },
//                     }}
//                     showFullDetails={showUnlockedView}
//                   />
//                 ))
//               ) : (
//                 <div className="col-span-full text-center text-muted-foreground">
//                   {showUnlockedView
//                     ? "No properties suggested by admins yet."
//                     : "Sign in and set your preferences to unlock personalized suggestions."}
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="text-center mt-8">
//             <Button
//               size="lg"
//               onClick={() => navigate("/map")}
//               className="hover:scale-105 transition-transform"
//               disabled={loading}
//             >
//               Explore More Properties
//             </Button>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Premium Land Opportunities
//             </h2>
//             <p className="text-xl text-muted-foreground">
//               {showUnlockedView
//                 ? "Your personalized recommendations based on your preferences"
//                 : "Sample listings - set preferences to unlock full details"}
//             </p>
//             {!showUnlockedView && (
//               <Button
//                 size="lg"
//                 onClick={() => setShowOnboarding(true)}
//                 className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
//                 disabled={loading}
//               >
//                 <Search className="w-4 h-4 mr-2" />
//                 Set Preferences
//               </Button>
//             )}
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//               <p className="mt-2 text-muted-foreground">Loading recommendations...</p>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {(showUnlockedView ? properties : []).map((property) => (
//                 <LandPropertyCard
//                   key={property.id}
//                   property={{
//                     ...property,
//                     isLocked: !showUnlockedView,
//                     images: property.images.map(
//                       (img: string) =>
//                         img.startsWith("http")
//                           ? img
//                           : `${api.defaults.baseURL}/${img}`
//                     ),
//                     features: property.features || [],
//                     aiInsights: {
//                       matchScore: property.matchPercentage || 0,
//                       growthPotential: property.aiInsights?.growthPotential || "Medium",
//                       expectedROI: property.aiInsights?.expectedROI || "10-12% annually",
//                       riskLevel: property.aiInsights?.riskLevel || "Low",
//                       demandIndicators: {
//                         viewsThisWeek: property.views || 0,
//                         nearbyDevelopments:
//                           property.aiInsights?.demandIndicators?.nearbyDevelopments || [],
//                       },
//                     },
//                   }}
//                   showFullDetails={showUnlockedView}
//                 />
//               ))}
//               {!showUnlockedView && (
//                 <div className="col-span-full text-center text-muted-foreground">
//                   Set your preferences to see personalized recommendations here.
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="text-center mt-8">
//             {showUnlockedView ? (
//               <Button
//                 size="lg"
//                 onClick={() => navigate("/map")}
//                 className="hover:scale-105 transition-transform"
//                 disabled={loading}
//               >
//                 Explore All Properties on Map
//               </Button>
//             ) : (
//               <Button
//                 size="lg"
//                 onClick={() => setShowOnboarding(true)}
//                 className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
//                 disabled={loading}
//               >
//                 Unlock All Details
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       <OnboardingModal
//         isOpen={showOnboarding}
//         onClose={() => setShowOnboarding(false)}
//         onComplete={handleOnboardingComplete}
//       />
//     </>
//   );
// }

// src/pages/Index.tsx
// src/pages/Index.tsx
// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import OnboardingModal, { UserPreferences } from "@/components/OnboardingModal";
import LandPropertyCard from "@/components/LandPropertyCard";
import UserPreferencesBanner from "@/components/UserPreferencesBanner"; // ← NEW
import { LandProperty } from "@/data/landProperties";
import {
  Brain,
  MapPin,
  Search,
  Target,
  DollarSign,
  BarChart3,
  HeartHandshake,
  AlertTriangle,
  Shield,
  Clock,
  Edit2,
} from "lucide-react";
import Seo from "@/components/Seo";
import api from "@/utils/api";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [showUnlockedView, setShowUnlockedView] = useState(false);
  const [properties, setProperties] = useState<LandProperty[]>([]);
  const [suggestedProperties, setSuggestedProperties] = useState<LandProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FETCH SAVED PREFERENCES FROM BACKEND (Correct API)
  const fetchUserPreferences = async (): Promise<UserPreferences | null> => {
    const token = localStorage.getItem("userToken");
    if (!token) return null;

    try {
      const response = await api.get("/api/user/preferences/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.preference) {
        const pref = response.data.preference;

        const preferences: UserPreferences = {
          purpose: pref.primary_purpose || "Investment",
          budgetRange: [pref.budget_min || 2000000, pref.budget_max || 10000000],
          landTypes: Array.isArray(pref.land_interests) ? pref.land_interests : [],
          locations: pref.preferred_location ? [pref.preferred_location] : [],
        };

        setUserPreferences(preferences);
        setShowUnlockedView(true);
        return preferences;
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log("No saved preferences yet — first-time user");
      } else {
        console.error("Error fetching preferences:", err);
      }
    }
    return null;
  };

  const fetchRecommendations = async (preferences?: UserPreferences) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Please sign in to view recommendations.");
      toast({
        title: "Authentication Required",
        description: "Please sign in to view personalized recommendations.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/user/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProperties(response.data.properties || []);
      } else {
        setError(response.data.message || "Failed to fetch recommendations");
        if (response.data.message?.includes("preferences")) {
          setShowOnboarding(true);
        }
      }
    } catch (err: any) {
      let errorMsg = "Failed to fetch recommendations.";
      if (err.response?.status === 403) {
        setShowOnboarding(true);
      } else if (err.response?.status === 401) {
        errorMsg = "Session expired. Please log in again.";
        navigate("/");
      }
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    setLoading(true);
    try {
      const response = await api.get("/api/user/suggestions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuggestedProperties(response.data.properties || []);
      }
    } catch (err: any) {
      console.log("Suggestions failed (optional)", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setShowUnlockedView(true);
    setShowOnboarding(false);

    await Promise.all([
      fetchRecommendations(preferences),
      fetchSuggestions(),
    ]);
  };

  // Load everything on mount — once and forever
  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setShowUnlockedView(false);
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      const savedPrefs = await fetchUserPreferences();

      if (savedPrefs) {
        await Promise.all([
          fetchRecommendations(savedPrefs),
          fetchSuggestions(),
        ]);
      } else {
        setShowOnboarding(true);
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  return (
    <>
      <Seo
        title="Smart Land Investments for High Earners | Premium Land Portal"
        description="Curated land opportunities with AI-driven insights for high-salaried professionals. Agricultural, commercial, and farmhouse plots with guaranteed ROI."
        canonicalPath="/"
      />

      {/* HERO - UNCHANGED */}
      <section className="relative py-20 bg-gradient-to-br from-black via-black/90 to-primary/20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-2 mb-6">
              <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered Insights
              </Badge>
              <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                <Target className="w-3 h-3 mr-1" />
                Curated for High Earners
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              Smart Land Investments
              <br />
              for High Earners
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Curated land opportunities with AI-driven insights, growth
              forecasts, and personalized recommendations for premium investors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {showUnlockedView ? (
                <Button
                  size="lg"
                  onClick={() => setShowOnboarding(true)}
                  className="bg-gradient-to-r from-primary to-primary/80 text-black font-semibold hover:scale-105 transition-transform"
                  disabled={loading}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Update Preferences
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setShowOnboarding(true)}
                  className="bg-gradient-to-r from-primary to-primary/80 text-black font-semibold hover:scale-105 transition-transform"
                  disabled={loading}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Set Preferences
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/map")}
                className="border-white/30 text-black hover:bg-white/10 hover:scale-105 transition-transform"
                disabled={loading}
              >
                <MapPin className="w-4 h-4 mr-2" />
                View AI Map
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* USER PREFERENCES BANNER - NEW & BEAUTIFUL */}
      {showUnlockedView && userPreferences && (
        <section className="py-10 bg-gradient-to-r from-primary/5 via-background to-background border-b">
          <div className="container mx-auto px-4">
            <UserPreferencesBanner
              preferences={userPreferences}
              onEdit={() => setShowOnboarding(true)}
            />
          </div>
        </section>
      )}

      {error && (
        <section className="py-4 bg-red-50">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* ALL YOUR ORIGINAL SECTIONS - 100% UNCHANGED */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Premium features designed specifically for high-earning
              professionals seeking smart land investments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">
                  Curated Investment Options
                </CardTitle>
                <CardDescription>
                  Choose from Agricultural, Non-Agricultural, Country Homes,
                  Farmhouses, and Industrial Land.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
                <CardDescription>
                  Get heatmaps, growth forecasts, and personalized suggestions
                  backed by data analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">
                  Price & Demand Heatmaps
                </CardTitle>
                <CardDescription>
                  Visualize which locations are growing fastest with real-time
                  market data visualization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">One-Stop Solution</CardTitle>
                <CardDescription>
                  Finance assistance, documentation help, and post-purchase
                  property management support.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Land Investments Beat... - UNCHANGED */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Land Investments Beat Traditional Options?
            </h2>
            <p className="text-xl text-muted-foreground">
              Compare the advantages of land investment vs flats and commercial
              properties
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all ring-2 ring-primary scale-105">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">Land</div>
                <CardTitle className="text-primary">Land Investment</CardTitle>
                <Badge className="mt-2">Recommended</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    APPRECIATION
                  </div>
                  <div className="font-bold text-lg">15-25% annually</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    MAINTENANCE
                  </div>
                  <div>Minimal</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    FLEXIBILITY
                  </div>
                  <div>High - Multiple uses</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-green-600">
                    PROS:
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    High appreciation
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Flexible use
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Lower maintenance
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Tax benefits
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-red-600">
                    CONS:
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Longer liquidity
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Market research needed
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">Building</div>
                <CardTitle>Residential Flats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    APPRECIATION
                  </div>
                  <div className="font-bold text-lg">8-12% annually</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    MAINTENANCE
                  </div>
                  <div>High (Society charges)</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    FLEXIBILITY
                  </div>
                  <div>Low - Fixed use</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-green-600">
                    PROS:
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Ready to use
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Rental income
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Quick liquidity
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-red-600">
                    CONS:
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Society charges
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Depreciation
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Limited appreciation
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">Store</div>
                <CardTitle>Commercial Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    APPRECIATION
                  </div>
                  <div className="font-bold text-lg">10-15% annually</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    MAINTENANCE
                  </div>
                  <div>Medium</div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-muted-foreground">
                    FLEXIBILITY
                  </div>
                  <div>Medium</div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-green-600">
                    PROS:
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Higher rental yields
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Business use
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-red-600">
                    CONS:
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    High entry cost
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Market dependent
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Complex regulations
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We Stay With You
            </h2>
            <p className="text-xl text-muted-foreground">
              End-to-end support for your land investment journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <DollarSign className="w-16 h-16 text-primary mx-auto mb-4" />
                <CardTitle>Finance Assistance</CardTitle>
                <CardDescription className="text-base">
                  Pre-approved loan options with competitive rates. Our
                  financial partners ensure smooth funding for your investment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                <CardTitle>Documentation Help</CardTitle>
                <CardDescription className="text-base">
                  Complete paperwork assistance, legal verification, and
                  compliance support for hassle-free transactions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
                <CardTitle>Post-Purchase Management</CardTitle>
                <CardDescription className="text-base">
                  Property maintenance, development guidance, and ongoing
                  support while your investment grows.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Property Suggestions - UNCHANGED */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Property Suggestions
            </h2>
            <p className="text-xl text-muted-foreground">
              {showUnlockedView
                ? "Handpicked properties recommended by our experts"
                : "Discover top properties curated by our team"}
            </p>
            {!showUnlockedView && (
              <Button
                size="lg"
                onClick={() => setShowOnboarding(true)}
                className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                Personalize Your Experience
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading suggestions...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {suggestedProperties.length > 0 ? (
                suggestedProperties.slice(0, 3).map((property) => (
                  <LandPropertyCard
                    key={property.id}
                    property={{
                      ...property,
                      isLocked: !showUnlockedView,
                      images: property.images.map(
                        (img: string) =>
                          img.startsWith("http")
                            ? img
                            : `${api.defaults.baseURL}/${img}`
                      ),
                      features: property.features || [],
                      aiInsights: {
                        matchScore: property.matchPercentage || 0,
                        growthPotential: property.aiInsights?.growthPotential || "Medium",
                        expectedROI: property.aiInsights?.expectedROI || "10-12% annually",
                        riskLevel: property.aiInsights?.riskLevel || "Low",
                        demandIndicators: {
                          viewsThisWeek: property.views || 0,
                          nearbyDevelopments:
                            property.aiInsights?.demandIndicators?.nearbyDevelopments || [],
                        },
                      },
                    }}
                    showFullDetails={showUnlockedView}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground">
                  {showUnlockedView
                    ? "No properties suggested by admins yet."
                    : "Sign in and set your preferences to unlock personalized suggestions."}
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/map")}
              className="hover:scale-105 transition-transform"
              disabled={loading}
            >
              Explore More Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Land Opportunities - UNCHANGED */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Land Opportunities
            </h2>
            <p className="text-xl text-muted-foreground">
              {showUnlockedView
                ? "Your personalized recommendations based on your preferences"
                : "Sample listings - set preferences to unlock full details"}
            </p>
            {!showUnlockedView && (
              <Button
                size="lg"
                onClick={() => setShowOnboarding(true)}
                className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
                disabled={loading}
              >
                <Search className="w-4 h-4 mr-2" />
                Set Preferences
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading recommendations...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(showUnlockedView ? properties : []).map((property) => (
                <LandPropertyCard
                  key={property.id}
                  property={{
                    ...property,
                    isLocked: !showUnlockedView,
                    images: property.images.map(
                      (img: string) =>
                        img.startsWith("http")
                          ? img
                          : `${api.defaults.baseURL}/${img}`
                    ),
                    features: property.features || [],
                    aiInsights: {
                      matchScore: property.matchPercentage || 0,
                      growthPotential: property.aiInsights?.growthPotential || "Medium",
                      expectedROI: property.aiInsights?.expectedROI || "10-12% annually",
                      riskLevel: property.aiInsights?.riskLevel || "Low",
                      demandIndicators: {
                        viewsThisWeek: property.views || 0,
                        nearbyDevelopments:
                          property.aiInsights?.demandIndicators?.nearbyDevelopments || [],
                      },
                    },
                  }}
                  showFullDetails={showUnlockedView}
                />
              ))}
              {!showUnlockedView && (
                <div className="col-span-full text-center text-muted-foreground">
                  Set your preferences to see personalized recommendations here.
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            {showUnlockedView ? (
              <Button
                size="lg"
                onClick={() => navigate("/map")}
                className="hover:scale-105 transition-transform"
                disabled={loading}
              >
                Explore All Properties on Map
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setShowOnboarding(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
                disabled={loading}
              >
                Unlock All Details
              </Button>
            )}
          </div>
        </div>
      </section>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
}