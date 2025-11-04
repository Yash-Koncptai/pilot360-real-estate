
export type LandProperty = {
  id: number;
  title: string;
  price: number;
  type:
    | "Agricultural"
    | "Non-Agricultural"
    | "Farmhouse"
    | "Industrial"
    | "Commercial";
  size: string; // in acres or sq ft
  location: string;
  latitude: number;
  longitude: number;
  images: string[];
  isLocked?: boolean;
  private: boolean;
  features: string[];
  description: string;
  views: number;
  matchPercentage: number;
  primary_purpose?: string;
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  investment_gain?: number;
  return_of_investment?: number;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  risk_percentage?: number;
  createdAt: string;
  updatedAt: string;
  aiInsights?: {
    matchScore?: number;
    growthPotential: "Low" | "Medium" | "High";
    expectedROI: string;
    riskLevel: "Low" | "Medium" | "High";
    demandIndicators: {
      viewsThisWeek: number;
      nearbyDevelopments: string[];
    };
  };
};

export type Property = {
  id: number;
  title: string;
  price: number;
  type:
    | "Agricultural"
    | "Non-Agricultural"
    | "Farmhouse"
    | "Industrial"
    | "Commercial";
  size: string;
  location: string;
  latitude: number;
  longitude: number;
  images: string[];
  private: boolean;
  amenities: string[]; // Maps to features
  description: string;
  views: number;
  matchPercentage?: number;
  primary_purpose?: string;
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  investment_gain?: number;
  return_of_investment?: number;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  risk_percentage?: number;
  floorplan?: string; // Added for PropertyDetails.tsx
  createdAt: string;
  updatedAt: string;
  aiInsights?: {
    matchScore?: number;
    growthPotential: "Low" | "Medium" | "High";
    expectedROI: string;
    riskLevel: "Low" | "Medium" | "High";
    demandIndicators: {
      viewsThisWeek: number;
      nearbyDevelopments: string[];
    };
  };
};
// Location-based heatmap data for land prices
export const landHeatmapData = [
  {
    area: "SG Highway",
    avgPricePerSqFt: 8500,
    zone: [23.0225, 72.5069],
    radius: 2000,
  },
  {
    area: "Bopal",
    avgPricePerSqFt: 6200,
    zone: [23.0473, 72.4634],
    radius: 1800,
  },
  {
    area: "Satellite",
    avgPricePerSqFt: 7800,
    zone: [23.0225, 72.5714],
    radius: 1500,
  },
  {
    area: "Vastrapur",
    avgPricePerSqFt: 7200,
    zone: [23.0395, 72.5693],
    radius: 1400,
  },
  {
    area: "Sanand",
    avgPricePerSqFt: 2800,
    zone: [22.9676, 72.3925],
    radius: 2500,
  },
  {
    area: "Bavla",
    avgPricePerSqFt: 1200,
    zone: [22.8481, 72.1067],
    radius: 3000,
  },
];

// Comparison data for Land vs Flats vs Commercial
export const investmentComparison = [
  {
    type: "Land Investment",
    icon: "🏞️",
    appreciation: "15-25% annually",
    maintenance: "Minimal",
    liquidity: "Medium",
    flexibility: "High - Multiple uses",
    entryBarrier: "Medium",
    pros: [
      "High appreciation",
      "Flexible use",
      "Lower maintenance",
      "Tax benefits",
    ],
    cons: ["Longer liquidity", "Market research needed"],
  },
  {
    type: "Residential Flats",
    icon: "🏢",
    appreciation: "8-12% annually",
    maintenance: "High (Society charges)",
    liquidity: "High",
    flexibility: "Low - Fixed use",
    entryBarrier: "High",
    pros: ["Ready to use", "Rental income", "Quick liquidity"],
    cons: ["Society charges", "Depreciation", "Limited appreciation"],
  },
  {
    type: "Commercial Properties",
    icon: "🏬",
    appreciation: "10-15% annually",
    maintenance: "Medium",
    liquidity: "Medium",
    flexibility: "Medium",
    entryBarrier: "Very High",
    pros: ["Higher rental yields", "Business use"],
    cons: ["High entry cost", "Market dependent", "Complex regulations"],
  },
];

// User preference options for onboarding
export const purposeOptions = [
  {
    id: "Personal Use",
    label: "Personal Use",
    description: "Build your dream home or farmhouse",
  },
  {
    id: "Investment",
    label: "Investment",
    description: "Long-term wealth creation",
  },
  {
    id: "Corporate",
    label: "Corporate",
    description: "Business or industrial use",
  },
];

export const landTypeOptions = [
  {
    id: "Agricultural",
    label: "Agricultural",
    description: "Farming and cultivation",
  },
  {
    id: "Residential",
    label: "Residential",
    description: "Residential development",
  },
  {
    id: "Farmhouse",
    label: "Country Home",
    description: "Weekend retreat and lifestyle",
  },
  {
    id: "Industrial",
    label: "Industrial",
    description: "Manufacturing and business",
  },
  {
    id: "Commercial",
    label: "Commercial",
    description: "Retail and office space",
  },
];

export const locationOptions = [
  {
    id: "Satellite",
    label: "Satellite",
    description: "Established residential area",
  },
  { id: "Bopal", label: "Bopal", description: "Growing IT corridor" },
  {
    id: "SG Highway",
    label: "SG Highway",
    description: "Premium business district",
  },
  {
    id: "Sanand",
    label: "Sanand",
    description: "Industrial and automotive hub",
  },
  {
    id: "Vastrapur",
    label: "Vastrapur",
    description: "Upscale residential zone",
  },
  { id: "Bavla", label: "Bavla", description: "Emerging development area" },
  {
    id: "Udaipur",
    label: "Udaipur",
    description: "Scenic tourist destination",
  },
];
