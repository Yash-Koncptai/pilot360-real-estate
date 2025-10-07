import Seo from "@/components/Seo";
import { landProperties } from "@/data/landProperties";
import LandPropertyCard from "@/components/LandPropertyCard";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSearchParams, Link } from "react-router-dom";

export default function Listings() {
  const [params] = useSearchParams();
  const [location, setLocation] = useState(params.get('location') || '');
  const [type, setType] = useState<'Agricultural' | 'Non-Agricultural' | 'Farmhouse' | 'Industrial' | 'any'>((params.get('type') as any) || 'any');
  const [min, setMin] = useState(params.get('min') || '');
  const [max, setMax] = useState(params.get('max') || '');
  const [view, setView] = useState<'grid'|'list'>('grid');

  const filtered = useMemo(() => {
    return landProperties.filter((p) => {
      if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (type !== 'any' && p.type !== type) return false;
      if (min && p.price < Number(min)) return false;
      if (max && p.price > Number(max)) return false;
      // Size filtering removed as size is stored as string with units
      return true;
    });
  }, [location, type, min, max]);

  return (
    <>
      <Seo
        title="Land Listings | EstateHub"
        description="Browse land properties for sale. Filter by location, price, land type, and size. Find agricultural land, non-agricultural plots, farmhouses, and industrial land."
        canonicalPath="/listings"
      />
      <h1 className="sr-only">Land Listings</h1>

      <section className="bg-card p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-5 gap-3">
        <Input placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} className="col-span-2" />
        <Input placeholder="Min Price (₹)" type="number" value={min} onChange={(e)=>setMin(e.target.value)} />
        <Input placeholder="Max Price (₹)" type="number" value={max} onChange={(e)=>setMax(e.target.value)} />
        <Select value={type} onValueChange={(v)=>setType(v as any)}>
          <SelectTrigger><SelectValue placeholder="Land Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Type</SelectItem>
            <SelectItem value="Agricultural">Agricultural</SelectItem>
            <SelectItem value="Non-Agricultural">Non-Agricultural</SelectItem>
            <SelectItem value="Farmhouse">Farmhouse</SelectItem>
            <SelectItem value="Industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>
        <div className="col-span-2 md:col-span-5 flex items-center justify-end gap-2">
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
                <LandPropertyCard property={p} showFullDetails />
              ) : (
                <>
                  <img src={p.images[0]} alt={`${p.title}`} className="w-full h-40 object-cover rounded-md" />
                  <div className="sm:col-span-2 flex flex-col justify-between">
                    <LandPropertyCard property={p} showFullDetails />
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
