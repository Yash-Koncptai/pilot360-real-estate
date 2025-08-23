import Seo from "@/components/Seo";
export default function About() {
  return <>
      <Seo title="About Us | EstateHub" description="Learn about EstateHub's mission and team. We help people buy and rent properties with a modern, transparent experience." canonicalPath="/about" />
      
      {/* Housing.com style hero section */}
      <section className="py-16 px-4 text-center text-white mb-12" style={{
      background: 'var(--gradient-hero)'
    }}>
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We're revolutionizing real estate in Ahmedabad with AI-powered insights and modern technology
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome to EstateHub</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-muted-foreground mb-4">
                At EstateHub, we believe everyone deserves to find their perfect home. Our AI-powered platform 
                makes property discovery in Ahmedabad transparent, efficient, and delightful.
              </p>
              <p className="text-muted-foreground mb-4">
                With over 15,000+ verified properties and cutting-edge technology, we're transforming how 
                people buy and rent properties in the city.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">15K+</div>
                  <div className="text-sm text-muted-foreground">Properties</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Users</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To make real estate transparent and accessible through AI-powered insights, 
                helping everyone find their perfect home in Ahmedabad.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
            year: '2023',
            title: 'Founded',
            desc: 'Started with a vision to revolutionize real estate'
          }, {
            year: '2024',
            title: 'AI Integration',
            desc: 'Launched AI-powered property recommendations'
          }, {
            year: '2025',
            title: 'Market Leader',
            desc: 'Became Ahmedabad\'s most trusted property platform'
          }].map(milestone => <div key={milestone.year} className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-primary mb-2">{milestone.year}</div>
                <h3 className="font-semibold mb-2">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground">{milestone.desc}</p>
              </div>)}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[{
            name: 'Alex Carter',
            role: 'CEO'
          }, {
            name: 'Jamie Lee',
            role: 'Head of Product'
          }, {
            name: 'Riley Patel',
            role: 'CTO'
          }].map(m => <div key={m.name} className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary mx-auto mb-4">
                  {m.name.split(' ').map(p => p[0]).join('')}
                </div>
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>)}
          </div>
        </section>
      </div>
    </>;
}