import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, X, Star, Briefcase, Home, Building2 } from 'lucide-react';

export type PropertyFilters = {
  purpose: 'self-use' | 'investment' | 'corporate';
  propertyTypes: string[];
  budgetRange: [number, number];
  location: string;
  sizeRange: [number, number];
  features: string[];
  aiSearch: string;
};

const defaultFilters: PropertyFilters = {
  purpose: 'investment',
  propertyTypes: [],
  budgetRange: [0, 100000000],
  location: '',
  sizeRange: [0, 100000],
  features: [],
  aiSearch: ''
};

interface PropertyFiltersProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  onClearFilters: () => void;
  topSuggestions?: Array<{
    id: string;
    title: string;
    matchScore: number;
    badge: string;
  }>;
}

export default function PropertyFilters({ 
  onFiltersChange, 
  onClearFilters,
  topSuggestions = []
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    onClearFilters();
  };

  const propertyTypeOptions = [
    { value: 'Agricultural', label: 'Agricultural', icon: MapPin },
    { value: 'Non-Agricultural', label: 'Non-Agricultural', icon: Building2 },
    { value: 'Farmhouse', label: 'Farmhouse', icon: Home },
    { value: 'Industrial', label: 'Industrial', icon: Building2 },
    { value: 'Commercial', label: 'Commercial Land', icon: Briefcase },
  ];

  const featureOptions = [
    'Water Access', 'Electricity', 'Road Access', 'Fenced', 'Clear Title',
    'Approved Layout', 'Corner Plot', 'Gated Community', 'Highway Facing', 'Metro Connectivity'
  ];

  const togglePropertyType = (type: string) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    updateFilters({ propertyTypes: newTypes });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(a => a !== feature)
      : [...filters.features, feature];
    updateFilters({ features: newFeatures });
  };

  const formatBudget = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  return (
    <div className="h-full bg-background border-r border-border overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>

        {/* AI Natural Language Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Agricultural land near Sanand under ₹50L"
              value={filters.aiSearch}
              onChange={(e) => updateFilters({ aiSearch: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Purpose</label>
          <Select value={filters.purpose} onValueChange={(v) => updateFilters({ purpose: v as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self-use">Self Use</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Land Type</label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = filters.propertyTypes.includes(option.value);
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePropertyType(option.value)}
                  className="justify-start h-auto p-3"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Budget Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Budget Range</label>
          <div className="px-2">
            <Slider
              value={filters.budgetRange}
              onValueChange={(value) => updateFilters({ budgetRange: value as [number, number] })}
              max={100000000}
              min={0}
              step={500000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatBudget(filters.budgetRange[0])}</span>
              <span>{formatBudget(filters.budgetRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ahmedabad, Gandhinagar, Sanand..."
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Size Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Land Size (sq. ft.)</label>
          <div className="px-2">
            <Slider
              value={filters.sizeRange}
              onValueChange={(value) => updateFilters({ sizeRange: value as [number, number] })}
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{filters.sizeRange[0].toLocaleString()} sq ft</span>
              <span>{filters.sizeRange[1].toLocaleString()} sq ft</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Features */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Features</label>
          <div className="grid grid-cols-2 gap-2">
            {featureOptions.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={filters.features.includes(feature)}
                  onCheckedChange={() => toggleFeature(feature)}
                />
                <label htmlFor={feature} className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Top AI Suggestions */}
        {topSuggestions.length > 0 && (
          <>
            <Separator />
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Top AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium line-clamp-2">{suggestion.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.matchScore}% Match
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.badge}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}