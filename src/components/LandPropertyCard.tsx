import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, TrendingUp, Users, Shield, Eye } from 'lucide-react';
import { LandProperty } from '@/data/landProperties';

interface LandPropertyCardProps {
  property: LandProperty;
  showFullDetails?: boolean;
}

export default function LandPropertyCard({ property, showFullDetails = false }: LandPropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(price / 100000).toFixed(0)}L`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Agricultural': return 'bg-green-100 text-green-800';
      case 'Industrial': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-purple-100 text-purple-800';
      case 'Farmhouse': return 'bg-orange-100 text-orange-800';
      case 'Non-Agricultural': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${property.isLocked && !showFullDetails ? 'relative overflow-hidden' : ''}`}>
      {property.isLocked && !showFullDetails && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded-lg text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-semibold">Details Locked</p>
            <p className="text-sm text-muted-foreground">Complete onboarding to unlock</p>
          </div>
        </div>
      )}
      
      <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg">
        <div className="absolute top-4 left-4">
          <Badge className={getTypeColor(property.type)}>
            {property.type}
          </Badge>
        </div>
        
        {property.aiInsights?.matchScore && showFullDetails && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground">
              {property.aiInsights.matchScore}% Match
            </Badge>
          </div>
        )}
        
        {property.aiInsights?.growthPotential === 'High' && showFullDetails && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-green-500 text-white flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              High Growth
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-muted-foreground text-sm">{property.location}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{property.size}</div>
              <div className="text-xs text-muted-foreground">Total Area</div>
            </div>
          </div>

          {showFullDetails && property.aiInsights && (
            <div className="space-y-3 border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Expected ROI</span>
                  </div>
                  <div className="text-green-600">{property.aiInsights.expectedROI}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Risk Level</span>
                  </div>
                  <div className={getRiskColor(property.aiInsights.riskLevel)}>
                    {property.aiInsights.riskLevel}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {property.aiInsights.demandIndicators.viewsThisWeek} views this week
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  High interest area
                </div>
              </div>
            </div>
          )}

          {!showFullDetails && property.isLocked && (
            <div className="text-center py-2 text-muted-foreground text-sm">
              Login to view full details, ROI analysis, and AI insights
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, showFullDetails ? 4 : 2).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {property.features.length > (showFullDetails ? 4 : 2) && (
              <Badge variant="secondary" className="text-xs">
                +{property.features.length - (showFullDetails ? 4 : 2)} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full" 
          variant={property.isLocked && !showFullDetails ? "outline" : "default"}
        >
          {property.isLocked && !showFullDetails ? 'Unlock Details' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
}