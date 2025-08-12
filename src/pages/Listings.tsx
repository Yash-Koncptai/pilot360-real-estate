import Seo from "@/components/Seo";
import { properties, Property } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSearchParams, Link } from "react-router-dom";

export default function Listings() {
  const [params] = useSearchParams();
  const [location, setLocation] = useState(params.get('location') || '');
  const [forType, setForType] = useState<'buy' | 'rent'>( (params.get('for') as any) || 'buy');
  const [type, setType] = useState<'Apartment' | 'House' | 'Villa' | ''>((params.get('type') as any) || '');
  const [min, setMin] = useState(params.get('min') || '');
  const [max, setMax] = useState(params.get('max') || '');
  const [bed, setBed] = useState('');
  const [bath, setBath] = useState('');
  const [view, setView] = useState<'grid'|'list'>('grid');

  const filtered = useMemo(() => {
    return properties.filter((p: Property) => {
      if (p.for !== forType) return false;
      if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (type && p.type !== type) return false;
      if (min && p.price < Number(min)) return false;
      if (max && p.price > Number(max)) return false;
      if (bed && p.bedrooms < Number(bed)) return false;
      if (bath && p.bathrooms < Number(bath)) return false;
      return true;
    });
  }, [forType, location, type, min, max, bed, bath]);

  return (
    <>
      <Seo
        title="Property Listings | EstateHub"
        description="Browse properties for sale and rent. Filter by location, price, type, bedrooms and bathrooms. Switch grid or list view, or open map view."
        canonicalPath="/listings"
      />
      <h1 className="sr-only">Property Listings</h1>

      <section className="bg-card p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-6 gap-3">
        <Select value={forType} onValueChange={(v) => setForType(v as any)}>
          <SelectTrigger className="col-span-2 md:col-span-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} className="col-span-2 md:col-span-2" />
        <Input placeholder="Min" type="number" value={min} onChange={(e)=>setMin(e.target.value)} />
        <Input placeholder="Max" type="number" value={max} onChange={(e)=>setMax(e.target.value)} />
        <Select value={type} onValueChange={(v)=>setType(v as any)}>
          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="House">House</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Bedrooms" type="number" value={bed} onChange={(e)=>setBed(e.target.value)} />
        <Input placeholder="Bathrooms" type="number" value={bath} onChange={(e)=>setBath(e.target.value)} />
        <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
          <Button variant={view==='grid'?'default':'secondary'} onClick={()=>setView('grid')}>Grid</Button>
          <Button variant={view==='list'?'default':'secondary'} onClick={()=>setView('list')}>List</Button>
          <Button asChild>
            <Link to="/map">Map view</Link>
          </Button>
        </div>
      </section>

      <section className="mt-6">
        <div className={view==='grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-4'}>
          {filtered.map(p => (
            <div key={p.id} className={view==='grid' ? '' : 'grid grid-cols-1 sm:grid-cols-3 items-stretch gap-4 p-4 rounded-lg border'}>
              {view==='grid' ? (
                <PropertyCard property={p} />
              ) : (
                <>
                  <img src={p.images[0]} alt={`${p.title}`} className="w-full h-40 object-cover rounded-md" />
                  <div className="sm:col-span-2 flex flex-col justify-between">
                    <PropertyCard property={p} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
