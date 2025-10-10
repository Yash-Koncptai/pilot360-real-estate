// export type Property = {
//   id: string;
//   title: string;
//   price: number;
//   for: "buy" | "rent";
//   type: "Apartment" | "House" | "Villa" | "Office";
//   bedrooms: number;
//   bathrooms: number;
//   location: string;
//   lat: number;
//   lng: number;
//   images: string[];
//   floorplan?: string;
//   pros: string[];
//   amenities: string[];
//   description: string;
//   aiInsights?: {
//     bestMatch?: boolean;
//     neighborhood: {
//       schools: number;
//       hospitals: number;
//       malls: number;
//       crimeRate: "Low" | "Medium" | "High";
//       commuteTime: string;
//     };
//     priceAnalysis: string;
//     investmentRating: number;
//   };
// };

// import house1 from "@/assets/properties/house1.jpg";
// import house2 from "@/assets/properties/house2.jpg";
// import house3 from "@/assets/properties/house3.jpg";
// import house4 from "@/assets/properties/house4.jpg";
// const placeholder = "/placeholder.svg";

// export const properties: Property[] = [
//   {
//     id: "1",
//     title: "2BHK Apartment in Satellite",
//     price: 25000,
//     for: "rent",
//     type: "Apartment",
//     bedrooms: 2,
//     bathrooms: 2,
//     location: "Satellite, Ahmedabad",
//     lat: 23.0225,
//     lng: 72.5714,
//     images: [house1, house2],
//     floorplan: placeholder,
//     pros: ["Near schools & malls", "Well-connected area", "24x7 Security"],
//     amenities: ["Gym", "Swimming Pool", "Garden", "Covered Parking"],
//     description:
//       "Modern 2BHK apartment in the heart of Satellite with excellent connectivity and amenities.",
//     aiInsights: {
//       bestMatch: true,
//       neighborhood: {
//         schools: 8,
//         hospitals: 5,
//         malls: 3,
//         crimeRate: "Low",
//         commuteTime: "15 min to SG Highway",
//       },
//       priceAnalysis:
//         "Fair value for the area. Similar properties rent for ₹22k-28k.",
//       investmentRating: 4.2,
//     },
//   },
//   {
//     id: "2",
//     title: "3BHK Villa in Bopal",
//     price: 12000000,
//     for: "buy",
//     type: "Villa",
//     bedrooms: 3,
//     bathrooms: 3,
//     location: "Bopal, Ahmedabad",
//     lat: 23.0473,
//     lng: 72.4634,
//     images: [house3, house4],
//     floorplan: placeholder,
//     pros: ["Gated community", "Clubhouse facilities", "Premium location"],
//     amenities: [
//       "Clubhouse",
//       "Swimming Pool",
//       "Gym",
//       "Kids Play Area",
//       "Security",
//     ],
//     description:
//       "Luxurious 3BHK villa in premium gated community with world-class amenities.",
//     aiInsights: {
//       neighborhood: {
//         schools: 6,
//         hospitals: 4,
//         malls: 2,
//         crimeRate: "Low",
//         commuteTime: "20 min to SG Highway",
//       },
//       priceAnalysis:
//         "Slightly above market rate. Expected appreciation: 8-10% annually.",
//       investmentRating: 4.5,
//     },
//   },
//   {
//     id: "3",
//     title: "1BHK Flat in Maninagar",
//     price: 12000,
//     for: "rent",
//     type: "Apartment",
//     bedrooms: 1,
//     bathrooms: 1,
//     location: "Maninagar, Ahmedabad",
//     lat: 22.985,
//     lng: 72.6058,
//     images: [house2, house3],
//     floorplan: placeholder,
//     pros: ["Close to railway station", "Affordable rent", "Good connectivity"],
//     amenities: ["Lift", "Security", "Water Supply"],
//     description:
//       "Compact 1BHK flat perfect for working professionals, close to railway station.",
//     aiInsights: {
//       bestMatch: true,
//       neighborhood: {
//         schools: 4,
//         hospitals: 6,
//         malls: 1,
//         crimeRate: "Medium",
//         commuteTime: "5 min to railway station",
//       },
//       priceAnalysis: "Excellent value for money in central location.",
//       investmentRating: 3.8,
//     },
//   },
//   {
//     id: "4",
//     title: "Office Space in Prahlad Nagar",
//     price: 75000,
//     for: "rent",
//     type: "Office",
//     bedrooms: 0,
//     bathrooms: 2,
//     location: "Prahlad Nagar, Ahmedabad",
//     lat: 23.0073,
//     lng: 72.5067,
//     images: [house4, house1],
//     floorplan: placeholder,
//     pros: ["Prime commercial area", "IT hub proximity", "Metro connectivity"],
//     amenities: ["Conference Room", "Reception", "Parking", "Power Backup"],
//     description:
//       "Premium office space in the heart of Ahmedabad's business district.",
//     aiInsights: {
//       neighborhood: {
//         schools: 2,
//         hospitals: 3,
//         malls: 4,
//         crimeRate: "Low",
//         commuteTime: "10 min to IT companies",
//       },
//       priceAnalysis: "Premium pricing justified by location and amenities.",
//       investmentRating: 4.7,
//     },
//   },
//   {
//     id: "5",
//     title: "2BHK Apartment on SG Highway",
//     price: 5500000,
//     for: "buy",
//     type: "Apartment",
//     bedrooms: 2,
//     bathrooms: 2,
//     location: "SG Highway, Ahmedabad",
//     lat: 23.0225,
//     lng: 72.5069,
//     images: [house1, house4],
//     floorplan: placeholder,
//     pros: ["Investment hotspot", "IT corridor", "Excellent connectivity"],
//     amenities: [
//       "Gym",
//       "Swimming Pool",
//       "Club House",
//       "Garden",
//       "24x7 Security",
//     ],
//     description:
//       "Modern 2BHK apartment on SG Highway - Ahmedabad's prime investment corridor.",
//     aiInsights: {
//       bestMatch: true,
//       neighborhood: {
//         schools: 7,
//         hospitals: 5,
//         malls: 5,
//         crimeRate: "Low",
//         commuteTime: "IT corridor location",
//       },
//       priceAnalysis:
//         "Great investment potential. Property values increased 12% last year.",
//       investmentRating: 4.8,
//     },
//   },
// ];

// // Heatmap data for different zones in Ahmedabad
// export const priceHeatmapData = [
//   {
//     area: "SG Highway",
//     avgPrice: 5500,
//     zone: [23.0225, 72.5069],
//     radius: 2000,
//   },
//   { area: "Satellite", avgPrice: 4200, zone: [23.0225, 72.5714], radius: 1500 },
//   { area: "Bopal", avgPrice: 6200, zone: [23.0473, 72.4634], radius: 1800 },
//   { area: "Maninagar", avgPrice: 2800, zone: [22.985, 72.6058], radius: 1200 },
//   {
//     area: "Prahlad Nagar",
//     avgPrice: 5800,
//     zone: [23.0073, 72.5067],
//     radius: 1000,
//   },
//   { area: "Vastrapur", avgPrice: 5200, zone: [23.0395, 72.5693], radius: 1400 },
//   { area: "CG Road", avgPrice: 4800, zone: [23.0322, 72.557], radius: 1300 },
// ];
// export type Property = {
//   id: number;
//   title: string;
//   price: number;
//   type: string;
//   size: string;
//   location: string;
//   latitude: number;
//   longitude: number;
//   description: string;
//   private: boolean;
//   features: string[] | null;
//   images: string[];
//   createdAt: string;
//   updatedAt: string;
//   // Optional fields for frontend compatibility
//   for?: "buy" | "rent"; // Not in API, used in frontend
//   bedrooms?: number; // Not in API, used in frontend
//   bathrooms?: number; // Not in API, used in frontend
//   floorplan?: string; // Not in API, used in frontend
//   pros?: string[]; // Not in API, used in frontend
//   amenities?: string[]; // Map from features
//   aiInsights?: {
//     bestMatch?: boolean;
//     neighborhood: {
//       schools: number;
//       hospitals: number;
//       malls: number;
//       crimeRate: "Low" | "Medium" | "High";
//       commuteTime: string;
//     };
//     priceAnalysis: string;
//     investmentRating: number;
//   };
// };

// // Heatmap data for different zones in Ahmedabad
// export const priceHeatmapData = [
//   {
//     area: "SG Highway",
//     avgPrice: 5500,
//     zone: [23.0225, 72.5069],
//     radius: 2000,
//   },
//   { area: "Satellite", avgPrice: 4200, zone: [23.0225, 72.5714], radius: 1500 },
//   { area: "Bopal", avgPrice: 6200, zone: [23.0473, 72.4634], radius: 1800 },
//   { area: "Maninagar", avgPrice: 2800, zone: [22.985, 72.6058], radius: 1200 },
//   {
//     area: "Prahlad Nagar",
//     avgPrice: 5800,
//     zone: [23.0073, 72.5067],
//     radius: 1000,
//   },
//   { area: "Vastrapur", avgPrice: 5200, zone: [23.0395, 72.5693], radius: 1400 },
//   { area: "CG Road", avgPrice: 4800, zone: [23.0322, 72.557], radius: 1300 },
// ];
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
  primary_purpose?: "Personal Use" | "Investment" | "Commercial Use"; // From API (snake_case)
  // Optional fields for frontend compatibility
  for?: "buy" | "rent"; // Not in API, used in frontend (derived from type)
  bedrooms?: number; // Not in API, used in frontend
  bathrooms?: number; // Not in API, used in frontend
  floorplan?: string; // Not in API, used in frontend
  pros?: string[]; // Not in API, used in frontend
  amenities?: string[]; // Map from features
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
