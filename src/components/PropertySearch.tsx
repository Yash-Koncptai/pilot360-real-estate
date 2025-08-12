import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type SearchFilters = {
  forType: 'buy' | 'rent';
  location: string;
  minPrice?: number;
  maxPrice?: number;
  type?: 'Apartment' | 'House' | 'Villa' | '';
};

export default function PropertySearch({ onSearch }: { onSearch: (f: SearchFilters) => void }) {
  const [forType, setForType] = useState<'buy' | 'rent'>('buy');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState<'Apartment' | 'House' | 'Villa' | ''>('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      forType,
      location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      type,
    });
  };

  return (
    <form onSubmit={submit} className="w-full grid grid-cols-1 md:grid-cols-6 gap-3">
      <ToggleGroup type="single" value={forType} onValueChange={(v) => v && setForType(v as 'buy' | 'rent')} className="md:col-span-1">
        <ToggleGroupItem value="buy">Buy</ToggleGroupItem>
        <ToggleGroupItem value="rent">Rent</ToggleGroupItem>
      </ToggleGroup>
      <Input className="md:col-span-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Input type="number" className="md:col-span-1" placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
      <Input type="number" className="md:col-span-1" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      <Select value={type} onValueChange={(v) => setType(v as any)}>
        <SelectTrigger className="md:col-span-1">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Any</SelectItem>
          <SelectItem value="Apartment">Apartment</SelectItem>
          <SelectItem value="House">House</SelectItem>
          <SelectItem value="Villa">Villa</SelectItem>
        </SelectContent>
      </Select>
      <div className="md:col-span-6 flex justify-end">
        <Button type="submit" className="hover-scale">Search</Button>
      </div>
    </form>
  );
}
