import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, ArrowRight, Target, DollarSign, MapPin, Home } from 'lucide-react';
import { purposeOptions, landTypeOptions, locationOptions } from '@/data/landProperties';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (preferences: UserPreferences) => void;
}

export interface UserPreferences {
  purpose: string;
  budgetRange: [number, number];
  landTypes: string[];
  locations: string[];
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    purpose: '',
    budgetRange: [2000000, 10000000], // 20L to 1Cr default
    landTypes: [],
    locations: []
  });

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'landTypes' | 'locations', item: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(item) 
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item]
    }));
  };

  const handleComplete = () => {
    onComplete(preferences);
    onClose();
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(value / 100000).toFixed(0)}L`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Let's Find Your Perfect Land Investment
          </DialogTitle>
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">What's your primary purpose?</h3>
                <p className="text-muted-foreground">This helps us recommend the right type of land for you</p>
              </div>
              
              <div className="grid gap-4">
                {purposeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updatePreference('purpose', option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                      preferences.purpose === option.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                  >
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">What's your investment budget?</h3>
                <p className="text-muted-foreground">Set your comfortable investment range</p>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {formatCurrency(preferences.budgetRange[0])} - {formatCurrency(preferences.budgetRange[1])}
                  </div>
                </div>
                
                <div className="px-4">
                  <Slider
                    value={preferences.budgetRange}
                    onValueChange={(value) => updatePreference('budgetRange', value)}
                    min={1000000} // 10L
                    max={50000000} // 5Cr
                    step={500000} // 5L
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹10L</span>
                    <span>₹5Cr</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Home className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">What type of land interests you?</h3>
                <p className="text-muted-foreground">Select all that apply - we'll show you the best options</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {landTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleArrayItem('landTypes', option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                      preferences.landTypes.includes(option.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                    {preferences.landTypes.includes(option.id) && (
                      <CheckCircle className="w-5 h-5 text-primary mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Preferred locations?</h3>
                <p className="text-muted-foreground">Choose areas you're interested in exploring</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {locationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleArrayItem('locations', option.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                      preferences.locations.includes(option.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="font-semibold mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                    {preferences.locations.includes(option.id) && (
                      <CheckCircle className="w-5 h-5 text-primary mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 4 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !preferences.purpose) ||
                    (step === 3 && preferences.landTypes.length === 0) ||
                    (step === 4 && preferences.locations.length === 0)
                  }
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={preferences.locations.length === 0}
                  className="bg-gradient-to-r from-primary to-primary-dark"
                >
                  Get My Recommendations
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}