// src/components/UserPreferencesBanner.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Target, DollarSign, Home, MapPin } from "lucide-react";

export default function UserPreferencesBanner({ preferences, onEdit }: any) {
  const format = (n: number) => n >= 10000000 ? `₹${(n/10000000).toFixed(1)}Cr` : `₹${(n/100000).toFixed(0)}L`;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Your Preferences (Personalized for You)
        </h3>
        <Button size="sm" onClick={onEdit}>
          <Edit2 className="w-4 h-4 mr-1" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground flex items-center gap-1">
            <Target className="w-4 h-4" /> Purpose
          </div>
          <Badge className="mt-1">{preferences.purpose}</Badge>
        </div>
        <div>
          <div className="text-muted-foreground flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> Budget
          </div>
          <Badge className="mt-1">
            {format(preferences.budgetRange[0])} – {format(preferences.budgetRange[1])}
          </Badge>
        </div>
        <div>
          <div className="text-muted-foreground flex items-center gap-1">
            <Home className="w-4 h-4" /> Land Types
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {preferences.landTypes.map((t: string) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4" /> Locations
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {preferences.locations.map((l: string) => (
              <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}