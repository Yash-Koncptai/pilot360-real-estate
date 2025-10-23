// export type LandProperty = {
//   id: string;
//   title: string;
//   price: number;
//   type: 'Agricultural' | 'Non-Agricultural' | 'Farmhouse' | 'Industrial' | 'Commercial';
//   size: string; // in acres or sq ft
//   location: string;
//   lat: number;
//   lng: number;
//   images: string[];
//   isLocked: boolean;
//   features: string[];
//   description: string;
//   aiInsights?: {
//     matchScore?: number;
//     growthPotential: 'Low' | 'Medium' | 'High';
//     expectedROI: string;
//     riskLevel: 'Low' | 'Medium' | 'High';
//     demandIndicators: {
//       viewsThisWeek: number;
//       nearbyDevelopments: string[];
//     };
//   };
// };

// // Sample land properties with premium focus
// export const landProperties: LandProperty[] = [
//   {
//     id: 'land1',
//     title: 'Premium Agricultural Land - Bopal',
//     price: 6000000, // 60L
//     type: 'Agricultural',
//     size: '2.5 acres',
//     location: 'Bopal, Ahmedabad',
//     lat: 23.0473,
//     lng: 72.4634,
//     images: ['/placeholder.svg'],
//     isLocked: true,
//     features: ['Water Connection', 'Road Access', 'Fertile Soil', 'Non-Agri Potential'],
//     description: 'Prime agricultural land with excellent conversion potential near growing residential area.',
//     aiInsights: {
//       matchScore: 92,
//       growthPotential: 'High',
//       expectedROI: '15-18% annually',
//       riskLevel: 'Low',
//       demandIndicators: {
//         viewsThisWeek: 45,
//         nearbyDevelopments: ['Bopal IT Hub', 'Residential Projects']
//       }
//     }
//   },
//   {
//     id: 'land2',
//     title: 'Luxury Farmhouse Plot - Sanand',
//     price: 9000000, // 90L
//     type: 'Farmhouse',
//     size: '1.8 acres',
//     location: 'Sanand, Ahmedabad',
//     lat: 22.9676,
//     lng: 72.3925,
//     images: ['/placeholder.svg'],
//     isLocked: true,
//     features: ['Weekend Retreat Zone', 'Scenic Views', 'Private Access', 'Plantation Ready'],
//     description: 'Perfect for weekend farmhouse development with excellent connectivity to city.',
//     aiInsights: {
//       matchScore: 87,
//       growthPotential: 'High',
//       expectedROI: '12-15% annually',
//       riskLevel: 'Low',
//       demandIndicators: {
//         viewsThisWeek: 32,
//         nearbyDevelopments: ['Tata Motors Plant', 'Highway Expansion']
//       }
//     }
//   },
//   {
//     id: 'land3',
//     title: 'Industrial Land - SG Highway',
//     price: 25000000, // 2.5 Cr
//     type: 'Industrial',
//     size: '5000 sq ft',
//     location: 'SG Highway, Ahmedabad',
//     lat: 23.0225,
//     lng: 72.5069,
//     images: ['/placeholder.svg'],
//     isLocked: true,
//     features: ['Corporate Zone', 'Highway Frontage', 'All Utilities', 'High Visibility'],
//     description: 'Premium industrial plot on SG Highway - ideal for corporate development.',
//     aiInsights: {
//       matchScore: 95,
//       growthPotential: 'High',
//       expectedROI: '20-25% annually',
//       riskLevel: 'Medium',
//       demandIndicators: {
//         viewsThisWeek: 78,
//         nearbyDevelopments: ['IT Parks', 'Corporate Offices']
//       }
//     }
//   },
//   {
//     id: 'land4',
//     title: 'Agricultural Land - Bavla',
//     price: 3500000, // 35L
//     type: 'Agricultural',
//     size: '4 acres',
//     location: 'Bavla, Ahmedabad',
//     lat: 22.8481,
//     lng: 72.1067,
//     images: ['/placeholder.svg'],
//     isLocked: false, // Unlocked for demo
//     features: ['Large Plot', 'Water Bore', 'Road Connectivity', 'Investment Grade'],
//     description: 'Large agricultural plot perfect for long-term investment and cultivation.',
//     aiInsights: {
//       matchScore: 78,
//       growthPotential: 'Medium',
//       expectedROI: '10-12% annually',
//       riskLevel: 'Low',
//       demandIndicators: {
//         viewsThisWeek: 23,
//         nearbyDevelopments: ['Proposed Ring Road', 'Industrial Area']
//       }
//     }
//   },
//   {
//     id: 'land5',
//     title: 'Commercial Plot - Satellite',
//     price: 15000000, // 1.5 Cr
//     type: 'Commercial',
//     size: '3500 sq ft',
//     location: 'Satellite, Ahmedabad',
//     lat: 23.0225,
//     lng: 72.5714,
//     images: ['/placeholder.svg'],
//     isLocked: true,
//     features: ['Prime Location', 'Commercial Zone', 'High Footfall', 'Retail Potential'],
//     description: 'Premium commercial plot in established Satellite area with high appreciation potential.',
//     aiInsights: {
//       matchScore: 89,
//       growthPotential: 'High',
//       expectedROI: '18-22% annually',
//       riskLevel: 'Medium',
//       demandIndicators: {
//         viewsThisWeek: 56,
//         nearbyDevelopments: ['Malls', 'Residential Complexes']
//       }
//     }
//   },
//   {
//     id: 'land6',
//     title: 'Non-Agricultural Plot - Vastrapur',
//     price: 12000000, // 1.2 Cr
//     type: 'Non-Agricultural',
//     size: '2800 sq ft',
//     location: 'Vastrapur, Ahmedabad',
//     lat: 23.0395,
//     lng: 72.5693,
//     images: ['/placeholder.svg'],
//     isLocked: false, // Unlocked for demo
//     features: ['Residential Zone', 'All Approvals', 'Construction Ready', 'Prime Area'],
//     description: 'Ready-to-build non-agricultural plot in premium Vastrapur location.',
//     aiInsights: {
//       matchScore: 85,
//       growthPotential: 'High',
//       expectedROI: '14-17% annually',
//       riskLevel: 'Low',
//       demandIndicators: {
//         viewsThisWeek: 41,
//         nearbyDevelopments: ['Luxury Apartments', 'Shopping Centers']
//       }
//     }
//   }
// ];

// // Location-based heatmap data for land prices
// export const landHeatmapData = [
//   { area: 'SG Highway', avgPricePerSqFt: 8500, zone: [23.0225, 72.5069], radius: 2000 },
//   { area: 'Bopal', avgPricePerSqFt: 6200, zone: [23.0473, 72.4634], radius: 1800 },
//   { area: 'Satellite', avgPricePerSqFt: 7800, zone: [23.0225, 72.5714], radius: 1500 },
//   { area: 'Vastrapur', avgPricePerSqFt: 7200, zone: [23.0395, 72.5693], radius: 1400 },
//   { area: 'Sanand', avgPricePerSqFt: 2800, zone: [22.9676, 72.3925], radius: 2500 },
//   { area: 'Bavla', avgPricePerSqFt: 1200, zone: [22.8481, 72.1067], radius: 3000 }
// ];

// // Comparison data for Land vs Flats vs Commercial
// export const investmentComparison = [
//   {
//     type: 'Land Investment',
//     icon: '🏞️',
//     appreciation: '15-25% annually',
//     maintenance: 'Minimal',
//     liquidity: 'Medium',
//     flexibility: 'High - Multiple uses',
//     entryBarrier: 'Medium',
//     pros: ['High appreciation', 'Flexible use', 'Lower maintenance', 'Tax benefits'],
//     cons: ['Longer liquidity', 'Market research needed']
//   },
//   {
//     type: 'Residential Flats',
//     icon: '🏢',
//     appreciation: '8-12% annually',
//     maintenance: 'High (Society charges)',
//     liquidity: 'High',
//     flexibility: 'Low - Fixed use',
//     entryBarrier: 'High',
//     pros: ['Ready to use', 'Rental income', 'Quick liquidity'],
//     cons: ['Society charges', 'Depreciation', 'Limited appreciation']
//   },
//   {
//     type: 'Commercial Properties',
//     icon: '🏬',
//     appreciation: '10-15% annually',
//     maintenance: 'Medium',
//     liquidity: 'Medium',
//     flexibility: 'Medium',
//     entryBarrier: 'Very High',
//     pros: ['Higher rental yields', 'Business use'],
//     cons: ['High entry cost', 'Market dependent', 'Complex regulations']
//   }
// ];

// // User preference options for onboarding
// export const purposeOptions = [
//   { id: 'self-use', label: 'Self Use', description: 'Build your dream home or farmhouse' },
//   { id: 'investment', label: 'Investment', description: 'Long-term wealth creation' },
//   { id: 'corporate', label: 'Corporate', description: 'Business or industrial use' }
// ];

// export const landTypeOptions = [
//   { id: 'agricultural', label: 'Agricultural', description: 'Farming and cultivation' },
//   { id: 'non-agricultural', label: 'Non-Agricultural', description: 'Residential development' },
//   { id: 'farmhouse', label: 'Country Home', description: 'Weekend retreat and lifestyle' },
//   { id: 'industrial', label: 'Industrial', description: 'Manufacturing and business' },
//   { id: 'commercial', label: 'Commercial', description: 'Retail and office space' }
// ];

// export const locationOptions = [
//   { id: 'satellite', label: 'Satellite', description: 'Established residential area' },
//   { id: 'bopal', label: 'Bopal', description: 'Growing IT corridor' },
//   { id: 'sg-highway', label: 'SG Highway', description: 'Premium business district' },
//   { id: 'sanand', label: 'Sanand', description: 'Industrial and automotive hub' },
//   { id: 'vastrapur', label: 'Vastrapur', description: 'Upscale residential zone' },
//   { id: 'bavla', label: 'Bavla', description: 'Emerging development area' }
// ];

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
