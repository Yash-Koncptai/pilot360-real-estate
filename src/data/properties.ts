
export type Property = {
  id: number;
  title: string;
  price: number;
  type: string;
  size: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  private: boolean;
  features: string[] | null;
  images: string[];
  views?: number | null;
  createdAt: string;
  updatedAt: string;
  primary_purpose?: "Personal Use" | "Investment" | "Commercial Use";
  matchPercentage?: number;
  // New fields from API
  investment_gain?: number; // Absolute investment gain in INR
  return_of_investment?: number; // Percentage ROI
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  risk_percentage?: number; // Overall risk percentage
  // Optional fields for frontend compatibility
  for?: "buy" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  floorplan?: string;
  pros?: string[];
  amenities?: string[];
  aiInsights?: {
    bestMatch?: boolean;
    neighborhood: {
      schools: number;
      hospitals: number;
      malls: number;
      crimeRate: "Low" | "Medium" | "High";
      commuteTime: string;
    };
    priceAnalysis: string;
    investmentRating: number;
  };
};

// Heatmap data for different zones in Ahmedabad
export const priceHeatmapData = [
  {
    area: "SG Highway",
    avgPrice: 5500,
    zone: [23.0225, 72.5069],
    radius: 2000,
  },
  { area: "Satellite", avgPrice: 4200, zone: [23.0225, 72.5714], radius: 1500 },
  { area: "Bopal", avgPrice: 6200, zone: [23.0473, 72.4634], radius: 1800 },
  { area: "Maninagar", avgPrice: 2800, zone: [22.985, 72.6058], radius: 1200 },
  {
    area: "Prahlad Nagar",
    avgPrice: 5800,
    zone: [23.0073, 72.5067],
    radius: 1000,
  },
  { area: "Vastrapur", avgPrice: 5200, zone: [23.0395, 72.5693], radius: 1400 },
  { area: "CG Road", avgPrice: 4800, zone: [23.0322, 72.557], radius: 1300 },
];
