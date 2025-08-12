import Seo from "@/components/Seo";
import PropertySearch from "@/components/PropertySearch";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <Seo
        title="Property Buying & Renting | EstateHub"
        description="Find properties to buy or rent. Search by location, price, and type. Browse featured homes and list your property on EstateHub."
        canonicalPath="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'EstateHub',
          url: window.location.origin,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${window.location.origin}/listings?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }}
      />

      <section className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Buy or Rent Your Next Home with Confidence
          </h1>
          <p className="text-lg text-muted-foreground">
            Modern, minimal and professional listings. Explore curated properties with powerful filters and map view.
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg shadow-sm">
          <PropertySearch onSearch={(f) => {
            const params = new URLSearchParams();
            params.set('for', f.forType);
            if (f.location) params.set('location', f.location);
            if (f.minPrice) params.set('min', String(f.minPrice));
            if (f.maxPrice) params.set('max', String(f.maxPrice));
            if (f.type) params.set('type', f.type);
            navigate(`/listings?${params.toString()}`);
          }} />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="featured-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="featured-heading" className="text-2xl font-semibold">Featured properties</h2>
          <a href="/listings" className="story-link text-primary">View all</a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0,3).map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section className="mt-16 bg-secondary/20 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Have a property to list?</h2>
        <p className="text-muted-foreground mb-4">Reach thousands of buyers and renters. It only takes a minute to get started.</p>
        <a href="/contact" className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">List your property</a>
      </section>
    </>
  );
};

export default Index;
