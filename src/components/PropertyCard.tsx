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
    <Card className="hover:shadow-lg transition-shadow relative">
      {/* AI Best Match Badge */}
      {property.aiInsights?.bestMatch && (
        <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <Star className="w-3 h-3 mr-1" />
          AI Best Match
        </Badge>
      )}
      
      <img
        src={cover}
        alt={`${property.title} - ${property.location}`}
        loading="lazy"
        className="h-48 w-full object-cover rounded-t-md"
      />
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{property.title}</span>
          <span className="text-primary font-semibold">{formatPrice(property.price, property.for)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <p>{property.location}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary/30 text-foreground px-3 py-1 text-xs">{property.type}</span>
          {property.bedrooms > 0 && (
            <span className="rounded-full bg-secondary/30 text-foreground px-3 py-1 text-xs">{property.bedrooms} Bed</span>
          )}
          <span className="rounded-full bg-secondary/30 text-foreground px-3 py-1 text-xs">{property.bathrooms} Bath</span>
        </div>

        {/* AI Insights Preview */}
        {property.aiInsights && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span>Investment Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{property.aiInsights.investmentRating}/5</span>
              </div>
            </div>
            {property.aiInsights.neighborhood.commuteTime && (
              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                <span>{property.aiInsights.neighborhood.commuteTime}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground line-clamp-2">{property.aiInsights.priceAnalysis}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link to={`/property/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
