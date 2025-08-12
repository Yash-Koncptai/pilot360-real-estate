import { Property } from "@/data/properties";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const formatPrice = (value: number, forType: 'buy' | 'rent') => {
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  return forType === 'rent' ? `${usd} / mo` : usd;
};

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.images?.[0];
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
      <CardContent className="text-sm text-muted-foreground">
        <p>{property.location}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary/30 text-foreground px-3 py-1 text-xs">{property.type}</span>
          <span className="rounded-full bg-secondary/30 text-foreground px-3 py-1 text-xs">{property.bedrooms} Bed</span>
          <span className="rounded-full bg-secondary/30 text-foreground px-3 py-1 text-xs">{property.bathrooms} Bath</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link to={`/property/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
