export type Property = {
  id: string;
  title: string;
  price: number;
  for: 'buy' | 'rent';
  type: 'Apartment' | 'House' | 'Villa';
  bedrooms: number;
  bathrooms: number;
  location: string;
  lat: number;
  lng: number;
  images: string[];
  floorplan?: string;
  pros: string[];
  amenities: string[];
  description: string;
};

import house1 from '@/assets/properties/house1.jpg';
import house2 from '@/assets/properties/house2.jpg';
import house3 from '@/assets/properties/house3.jpg';
import house4 from '@/assets/properties/house4.jpg';
import placeholder from '/public/placeholder.svg';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment with City View',
    price: 320000,
    for: 'buy',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    location: 'Downtown, San Francisco',
    lat: 37.7749,
    lng: -122.4194,
    images: [house1, house2],
    floorplan: placeholder,
    pros: ['Near metro station', 'City skyline view', '24x7 Security'],
    amenities: ['Gym', 'Pool', 'Clubhouse', 'Covered Parking'],
    description: 'A stylish apartment in the heart of the city with stunning skyline views and premium amenities.'
  },
  {
    id: '2',
    title: 'Cozy Family House with Garden',
    price: 2400,
    for: 'rent',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    location: 'Palo Alto, California',
    lat: 37.4419,
    lng: -122.1430,
    images: [house3, house4],
    floorplan: placeholder,
    pros: ['Quiet neighborhood', 'Spacious garden', 'Nearby schools'],
    amenities: ['Backyard', 'Garage', 'Pet friendly'],
    description: 'A warm and welcoming family house with a lush garden, perfect for weekend gatherings.'
  },
  {
    id: '3',
    title: 'Beachfront Villa Retreat',
    price: 980000,
    for: 'buy',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 4,
    location: 'Malibu, California',
    lat: 34.0259,
    lng: -118.7798,
    images: [house2, house3, house4],
    floorplan: placeholder,
    pros: ['Sea view', 'Private beach access', 'Smart home'],
    amenities: ['Infinity pool', 'Home theater', 'Solar panels'],
    description: 'Luxury seaside living with unmatched ocean views and world-class amenities.'
  }
];
