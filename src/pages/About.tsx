import Seo from "@/components/Seo";

export default function About() {
  return (
    <>
      <Seo
        title="About Us | EstateHub"
        description="Learn about EstateHub's mission and team. We help people buy and rent properties with a modern, transparent experience."
        canonicalPath="/about"
      />
      <header>
        <h1 className="text-3xl font-bold">About EstateHub</h1>
        <p className="text-muted-foreground mt-2">Our mission is to simplify property discovery and make real estate transparent and delightful.</p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {[{name:'Alex Carter',role:'CEO'},{name:'Jamie Lee',role:'Head of Product'},{name:'Riley Patel',role:'CTO'}].map((m)=> (
          <div key={m.name} className="p-6 rounded-lg border bg-card">
            <div className="w-16 h-16 rounded-full bg-secondary/40 flex items-center justify-center text-lg font-semibold">{m.name.split(' ').map(p=>p[0]).join('')}</div>
            <h3 className="mt-3 font-semibold">{m.name}</h3>
            <p className="text-sm text-muted-foreground">{m.role}</p>
          </div>
        ))}
      </section>
    </>
  );
}
