import Seo from "@/components/Seo";
import PropertySearch from "@/components/PropertySearch";
import PropertyCard from "@/components/PropertyCard";
import AIChatbot from "@/components/AIChatbot";
import { properties } from "@/data/properties";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Brain, TrendingUp, Users, Search, Map } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <Seo
        title="AI-Powered Real Estate Platform | Ahmedabad Properties"
        description="Discover properties in Ahmedabad with AI insights. Interactive map, personalized recommendations, and smart property search for buying and renting."
        canonicalPath="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'AI EstateHub',
          url: window.location.origin,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${window.location.origin}/listings?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      <AIChatbot />

      <section className="text-center space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Brain className="w-4 h-4 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <MapPin className="w-4 h-4 mr-1" />
              Ahmedabad Focus
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Smart Real Estate Platform for 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Ahmedabad</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover properties with AI insights, interactive maps, and personalized recommendations. 
            Experience the future of property search in Ahmedabad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" onClick={() => navigate('/map')} className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Explore AI Map
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/listings')} className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Browse Properties
            </Button>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="grid md:grid-cols-3 gap-6 my-16">
        <div className="text-center p-6 rounded-lg border bg-card/50">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">AI Property Insights</h3>
          <p className="text-muted-foreground text-sm">
            Get intelligent analysis of neighborhoods, investment potential, and property value predictions.
          </p>
        </div>
        
        <div className="text-center p-6 rounded-lg border bg-card/50">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
          <p className="text-muted-foreground text-sm">
            Personalized property suggestions based on your budget, preferences, and lifestyle needs.
          </p>
        </div>
        
        <div className="text-center p-6 rounded-lg border bg-card/50">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Neighborhood Data</h3>
          <p className="text-muted-foreground text-sm">
            Comprehensive data on schools, hospitals, crime rates, and commute times for every location.
          </p>
        </div>
      </section>

      {/* Property Search */}
      <section className="bg-card/30 p-8 rounded-xl border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Property</h2>
            <p className="text-muted-foreground">Use our AI-powered search to discover properties that match your exact needs.</p>
          </div>
          <PropertySearch onSearch={(f) => {
            const params = new URLSearchParams();
            params.set('for', f.forType);
            if (f.location) params.set('location', f.location);
            if (f.minPrice) params.set('min', String(f.minPrice));
            if (f.maxPrice) params.set('max', String(f.maxPrice));
            if (f.type && f.type !== 'any') params.set('type', f.type);
            if (f.bedrooms) params.set('bedrooms', String(f.bedrooms));
            if (f.aiSearch) params.set('ai', f.aiSearch);
            navigate(`/listings?${params.toString()}`);
          }} />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="featured-heading">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="featured-heading" className="text-2xl md:text-3xl font-bold">AI-Recommended Properties</h2>
            <p className="text-muted-foreground mt-1">Handpicked properties based on market trends and user preferences</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/listings')}>
            View All Properties
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.filter(p => p.aiInsights?.bestMatch).slice(0,3).map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* Interactive Map Showcase */}
      <section className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Explore Ahmedabad Like Never Before</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our interactive AI-powered map shows real-time property data, price heatmaps, and neighborhood insights. 
          Click on any property to see detailed AI analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/map')} className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Launch Interactive Map
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
            List Your Property
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
          <div className="bg-background/60 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Price Heatmaps
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualize property prices across different areas of Ahmedabad with color-coded heatmaps.
            </p>
          </div>
          <div className="bg-background/60 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              AI Insights
            </h3>
            <p className="text-sm text-muted-foreground">
              Get detailed analysis of each property including investment potential and neighborhood data.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
