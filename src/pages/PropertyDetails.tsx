import Seo from "@/components/Seo";
import { useParams } from "react-router-dom";
import { properties } from "@/data/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function PropertyDetails() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  if (!property) {
    return (
      <div>
        <Seo title="Property Not Found | EstateHub" description="The property you are looking for does not exist." canonicalPath={`/property/${id}`} />
        <h1 className="text-2xl font-semibold">Property not found</h1>
        <p className="text-muted-foreground">Please return to the listings page.</p>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${window.location.origin}/property/${property.id}`,
    numberOfRoomsTotal: property.bedrooms + property.bathrooms,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <>
      <Seo
        title={`${property.title} | EstateHub`}
        description={property.description}
        canonicalPath={`/property/${property.id}`}
        structuredData={jsonLd}
      />
      <article>
        <header className="mb-4">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">{property.location}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{property.type}</Badge>
            <Badge variant="secondary">{property.bedrooms} Bed</Badge>
            <Badge variant="secondary">{property.bathrooms} Bath</Badge>
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <img src={property.images[0]} alt={`${property.title} photo 1`} className="w-full h-64 object-cover rounded-md md:col-span-2" />
          <div className="grid gap-3">
            {property.images.slice(1,3).map((img, i) => (
              <img key={i} src={img} alt={`${property.title} photo ${i+2}`} className="w-full h-30 object-cover rounded-md" />
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{property.description}</p>

            <h2 className="text-xl font-semibold mt-6">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2 text-muted-foreground list-disc pl-4">
              {property.amenities.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>

            {property.floorplan && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Floor plan</h2>
                <img src={property.floorplan} alt={`${property.title} floor plan`} className="mt-2 rounded-md border" />
              </div>
            )}
          </div>

          <aside className="bg-card p-4 rounded-lg h-fit">
            <h2 className="text-lg font-semibold">Contact / Schedule a visit</h2>
            <div className="mt-3 space-y-3">
              <Input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
              <Input placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <Input placeholder="Preferred date" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
              <Textarea placeholder="Message" value={message} onChange={(e)=>setMessage(e.target.value)} />
              <Button onClick={()=>{
                toast.success('Your request has been sent!');
                setName(''); setEmail(''); setDate(''); setMessage('');
              }}>Send</Button>
            </div>
          </aside>
        </section>
      </article>
    </>
  );
}
