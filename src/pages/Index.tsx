// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import OnboardingModal, { UserPreferences } from '@/components/OnboardingModal';
// import LandPropertyCard from '@/components/LandPropertyCard';
// import { landProperties, investmentComparison } from '@/data/landProperties';
// import { Brain, MapPin, TrendingUp, Users, Building, Search, Zap, Home, Star, Award, Shield, Clock, Target, DollarSign, BarChart3, HeartHandshake } from 'lucide-react';
// import Seo from '@/components/Seo';

// export default function Index() {
//   const navigate = useNavigate();
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
//   const [showUnlockedView, setShowUnlockedView] = useState(false);

//   const handleOnboardingComplete = (preferences: UserPreferences) => {
//     setUserPreferences(preferences);
//     setShowUnlockedView(true);
//   };

//   // Get sample properties for teaser display
//   const teaserProperties = landProperties.slice(0, 3);

//   // Get unlocked properties for demo
//   const unlockedProperties = landProperties.filter(p => !p.isLocked);

//   return (
//     <>
//       <Seo
//         title="Smart Land Investments for High Earners | Premium Land Portal"
//         description="Curated land opportunities with AI-driven insights for high-salaried professionals. Agricultural, commercial, and farmhouse plots with guaranteed ROI."
//         canonicalPath="/"
//       />

//       {/* Hero Section */}
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
//               Smart Land Investments<br />for High Earners
//             </h1>

//             <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
//               Curated land opportunities with AI-driven insights, growth forecasts, and personalized recommendations for premium investors.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button
//                 size="lg"
//                 onClick={() => setShowOnboarding(true)}
//                 className="bg-gradient-to-r from-primary to-primary/80 text-black font-semibold hover:scale-105 transition-transform"
//               >
//                 <Search className="w-4 h-4 mr-2" />
//                 Explore Opportunities
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 onClick={() => navigate('/map')}
//                 className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-transform"
//               >
//                 <MapPin className="w-4 h-4 mr-2" />
//                 View AI Map
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Premium features designed specifically for high-earning professionals seeking smart land investments.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Target className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">Curated Investment Options</CardTitle>
//                 <CardDescription>
//                   Choose from Agricultural, Non-Agricultural, Country Homes, Farmhouses, and Industrial Land.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
//                 <CardDescription>
//                   Get heatmaps, growth forecasts, and personalized suggestions backed by data analytics.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">Price & Demand Heatmaps</CardTitle>
//                 <CardDescription>
//                   Visualize which locations are growing fastest with real-time market data visualization.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-4" />
//                 <CardTitle className="text-lg">One-Stop Solution</CardTitle>
//                 <CardDescription>
//                   Finance assistance, documentation help, and post-purchase property management support.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Comparison Section - Why Land > Flats & Commercial */}
//       <section className="py-16 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Land Investments Beat Traditional Options?</h2>
//             <p className="text-xl text-muted-foreground">Compare the advantages of land investment vs flats and commercial properties</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {investmentComparison.map((option, index) => (
//               <Card key={index} className={`hover:shadow-xl transition-all ${index === 0 ? 'ring-2 ring-primary scale-105' : ''}`}>
//                 <CardHeader className="text-center">
//                   <div className="text-4xl mb-4">{option.icon}</div>
//                   <CardTitle className={index === 0 ? 'text-primary' : ''}>{option.type}</CardTitle>
//                   {index === 0 && <Badge className="mt-2">Recommended</Badge>}
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <div className="font-semibold text-sm text-muted-foreground">APPRECIATION</div>
//                     <div className="font-bold text-lg">{option.appreciation}</div>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-sm text-muted-foreground">MAINTENANCE</div>
//                     <div>{option.maintenance}</div>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-sm text-muted-foreground">FLEXIBILITY</div>
//                     <div>{option.flexibility}</div>
//                   </div>
//                   <Separator />
//                   <div className="space-y-2">
//                     <div className="font-semibold text-sm text-green-600">PROS:</div>
//                     {option.pros.map((pro, i) => (
//                       <div key={i} className="text-sm flex items-center gap-2">
//                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                         {pro}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="space-y-2">
//                     <div className="font-semibold text-sm text-red-600">CONS:</div>
//                     {option.cons.map((con, i) => (
//                       <div key={i} className="text-sm flex items-center gap-2">
//                         <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                         {con}
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Assurance Section */}
//       <section className="py-16 bg-background">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">We Stay With You</h2>
//             <p className="text-xl text-muted-foreground">End-to-end support for your land investment journey</p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <DollarSign className="w-16 h-16 text-primary mx-auto mb-4" />
//                 <CardTitle>Finance Assistance</CardTitle>
//                 <CardDescription className="text-base">
//                   Pre-approved loan options with competitive rates. Our financial partners ensure smooth funding for your investment.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
//                 <CardTitle>Documentation Help</CardTitle>
//                 <CardDescription className="text-base">
//                   Complete paperwork assistance, legal verification, and compliance support for hassle-free transactions.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover:shadow-xl transition-shadow">
//               <CardHeader className="text-center">
//                 <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
//                 <CardTitle>Post-Purchase Management</CardTitle>
//                 <CardDescription className="text-base">
//                   Property maintenance, development guidance, and ongoing support while your investment grows.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Sample Listings */}
//       <section className="py-16 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Land Opportunities</h2>
//             <p className="text-xl text-muted-foreground">
//               {showUnlockedView ? 'Your personalized recommendations based on your preferences' : 'Sample listings - complete onboarding to unlock full details'}
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {(showUnlockedView ? unlockedProperties : teaserProperties).map((property) => (
//               <LandPropertyCard
//                 key={property.id}
//                 property={property}
//                 showFullDetails={showUnlockedView}
//               />
//             ))}
//           </div>

//           <div className="text-center mt-8">
//             {!showUnlockedView ? (
//               <Button
//                 size="lg"
//                 onClick={() => setShowOnboarding(true)}
//                 className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
//               >
//                 Unlock All Details
//               </Button>
//             ) : (
//               <Button
//                 size="lg"
//                 onClick={() => navigate('/map')}
//                 className="hover:scale-105 transition-transform"
//               >
//                 Explore All Properties on Map
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Onboarding Modal */}
//       <OnboardingModal
//         isOpen={showOnboarding}
//         onClose={() => setShowOnboarding(false)}
//         onComplete={handleOnboardingComplete}
//       />
//     </>
//   );
// }

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
import OnboardingModal, { UserPreferences } from "@/components/OnboardingModal";
import LandPropertyCard from "@/components/LandPropertyCard";
import {
  Brain,
  MapPin,
  TrendingUp,
  Users,
  Building,
  Search,
  Zap,
  Home,
  Star,
  Award,
  Shield,
  Clock,
  Target,
  DollarSign,
  BarChart3,
  HeartHandshake,
} from "lucide-react";
import Seo from "@/components/Seo";
import axios from "axios";

export default function Index() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [showUnlockedView, setShowUnlockedView] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnboardingComplete = async (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setShowUnlockedView(true);
    await fetchRecommendations(preferences);
  };

  const fetchRecommendations = async (preferences?: UserPreferences) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Please sign in to view recommendations.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setProperties(response.data.properties);
      } else {
        setError(response.data.message || "Failed to fetch recommendations");
        if (response.data.message.includes("preferences")) {
          setShowOnboarding(true); // Open onboarding if preferences are not set
        }
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Please set your preferences first.");
        setShowOnboarding(true);
      } else if (err.response?.data?.message.includes("user_id")) {
        setError(
          "Authentication error: Please log in again or contact support."
        );
      } else {
        setError("Failed to fetch recommendations. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token && !userPreferences) {
      fetchRecommendations();
    }
  }, [userPreferences]);

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <>
      <Seo
        title="Smart Land Investments for High Earners | Premium Land Portal"
        description="Curated land opportunities with AI-driven insights for high-salaried professionals. Agricultural, commercial, and farmhouse plots with guaranteed ROI."
        canonicalPath="/"
      />

      {/* Hero Section */}
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
              <Button
                size="lg"
                onClick={() => setShowOnboarding(true)}
                className="bg-gradient-to-r from-primary to-primary/80 text-black font-semibold hover:scale-105 transition-transform"
              >
                <Search className="w-4 h-4 mr-2" />
                Set Preferences
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/map")}
                className="border-white/30 text-black hover:bg-white/10 hover:scale-105 transition-transform"
              >
                <MapPin className="w-4 h-4 mr-2" />
                View AI Map
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Comparison Section - Why Land > Flats & Commercial */}
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
                <div className="text-4xl mb-4">🏞️</div>
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
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>Tax
                    benefits
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
                <div className="text-4xl mb-4">🏢</div>
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
                <div className="text-4xl mb-4">🏬</div>
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
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>High
                    entry cost
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

      {/* Assurance Section */}
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

      {/* Sample Listings */}
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
              >
                <Search className="w-4 h-4 mr-2" />
                Set Preferences
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(showUnlockedView ? properties : []).map((property) => (
              <LandPropertyCard
                key={property.id}
                property={{
                  ...property,
                  isLocked: !showUnlockedView,
                  images: property.images.map(
                    (img) => `http://localhost:5000/${img}`
                  ),
                  aiInsights: {
                    matchScore: property.matchPercentage || 0,
                    growthPotential:
                      property.aiInsights?.growthPotential || "Medium",
                    expectedROI:
                      property.aiInsights?.expectedROI || "10-12% annually",
                    riskLevel: property.aiInsights?.riskLevel || "Low",
                    demandIndicators: {
                      viewsThisWeek: property.views || 0,
                      nearbyDevelopments:
                        property.aiInsights?.demandIndicators
                          ?.nearbyDevelopments || [],
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

          <div className="text-center mt-8">
            {showUnlockedView ? (
              <Button
                size="lg"
                onClick={() => navigate("/map")}
                className="hover:scale-105 transition-transform"
              >
                Explore All Properties on Map
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => setShowOnboarding(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform"
              >
                Unlock All Details
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
}
