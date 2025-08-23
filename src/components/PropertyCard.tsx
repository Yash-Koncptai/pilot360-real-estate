import { Property } from "@/data/properties";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";

const formatPrice = (value: number, forType: 'buy' | 'rent') => {
  const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  return forType === 'rent' ? `${inr} / mo` : inr;
};

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.images?.[0];
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* AI Best Match Badge */}
      {property.aiInsights?.bestMatch && (
        <Badge className="absolute top-3 left-3 z-10 bg-primary text-white shadow-md">
          <Star className="w-3 h-3 mr-1" />
          AI Best Match
        </Badge>
      )}
      
      {/* Property Status Badge */}
      <Badge className="absolute top-3 right-3 z-10 bg-white/90 text-gray-800 shadow-md">
        {property.for === 'buy' ? 'For Sale' : 'For Rent'}
      </Badge>
      
      <img
        src={cover}
        alt={`${property.title} - ${property.location}`}
        loading="lazy"
        className="h-48 w-full object-cover"
      />
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold leading-tight mb-2">{property.title}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <p>{property.location}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{property.bedrooms}</span>
              <span className="text-muted-foreground">bed</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{property.bathrooms}</span>
              <span className="text-muted-foreground">bath</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <span className="text-sm text-muted-foreground">{property.type}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="font-bold text-xl text-primary">{formatPrice(property.price, property.for)}</div>
          {property.for === 'rent' && (
            <div className="text-xs text-muted-foreground">per month</div>
          )}
        </div>

        {/* AI Insights Preview */}
        {property.aiInsights && (
          <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Investment Rating:</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{property.aiInsights.investmentRating}/5</span>
              </div>
            </div>
            {property.aiInsights.neighborhood.commuteTime && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Commute:</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">{property.aiInsights.neighborhood.commuteTime}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium" asChild>
          <Link to={`/property/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
