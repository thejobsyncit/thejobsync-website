import { useState, useEffect } from 'react';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  category: string;
  quote: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Chief Technology Officer',
    company: 'FinTech Dynamics Dubai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Cloud Infrastructure',
    quote: 'The Jobsync transformed our legacy financial systems into a scalable cloud infrastructure with zero downtime. Their technical expertise and strategic guidance were outstanding.'
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'VP of Operations',
    company: 'Apex Health Systems',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Custom Software',
    quote: 'Working with The Jobsync felt like extending our internal engineering team. They delivered our HIPAA-compliant client portal ahead of schedule with exceptional quality.'
  },
  {
    id: 3,
    name: 'Rajesh Kumar',
    role: 'Director of IT Operations',
    company: 'Global Retail Logistics India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'IT Consulting',
    quote: 'Their IT consulting team optimized our supply chain software architecture, resulting in a 40% improvement in processing speed and significant operational savings.'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    role: 'Head of Product Development',
    company: 'InnoTech Solutions',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Custom Software',
    quote: 'The Jobsync built our real-time customer analytics dashboard with high precision. The UI is modern, responsive, and extremely user-friendly.'
  },
  {
    id: 5,
    name: 'David Miller',
    role: 'Founder & CEO',
    company: 'CloudScale Enterprise',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Cloud Infrastructure',
    quote: 'Outstanding commitment to security and high performance. The Jobsync migrated our database cluster seamlessly to cloud without impacting live traffic.'
  },
  {
    id: 6,
    name: 'Priya Sharma',
    role: 'Chief Digital Officer',
    company: 'Nexus Media Group',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Digital Transformation',
    quote: 'From strategic talent consulting to end-to-end cloud engineering, The Jobsync delivered top-tier results. They are our trusted long-term IT partner.'
  }
];

export const TestimonialsSection = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const [items, setItems] = useState<Testimonial[]>(testimonialsData);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', 'Cloud Infrastructure', 'Custom Software', 'IT Consulting', 'Digital Transformation'];

  const filteredTestimonials = activeCategory === 'All'
    ? items
    : items.filter(t => t.category === activeCategory);

  return (
    <section className="testimonials-section" id="testimonials" style={{ padding: '90px 0', backgroundColor: '#ffffff' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--primary-cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '13px', background: 'rgba(14, 165, 233, 0.1)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(14,165,233,0.2)' }}>
            ⭐ CLIENT SUCCESS STORIES
          </span>
          <h2 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '900', marginTop: '14px', marginBottom: '12px' }}>
            What Our Clients Say About Us
          </h2>
          <p style={{ maxWidth: '680px', margin: '0 auto', color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
            Discover how The Jobsync helps organizations accelerate digital transformation, modernizes IT infrastructure, and delivers enterprise-grade software.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '45px' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '10px 22px',
                borderRadius: '30px',
                border: '1px solid',
                borderColor: activeCategory === category ? 'var(--primary-cyan)' : '#cbd5e1',
                background: activeCategory === category ? 'var(--primary-cyan)' : '#ffffff',
                color: activeCategory === category ? '#ffffff' : '#475569',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Testimonial Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Category Badge & Rating */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary-cyan)', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '800' }}>
                    {item.category}
                  </span>
                  <div style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '2px' }}>
                    {'★'.repeat(item.rating)}
                  </div>
                </div>

                {/* Quote Text */}
                <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                  "{item.quote}"
                </p>
              </div>

              {/* Author Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-cyan)' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '800' }}>{item.name}</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{item.role}</p>
                  <span style={{ fontSize: '12px', color: 'var(--primary-cyan)', fontWeight: '700' }}>{item.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Metrics Banner */}
        <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '24px', padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h3 style={{ fontSize: '36px', color: 'var(--primary-cyan)', fontWeight: '900', margin: 0 }}>150+</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px', margin: 0 }}>Enterprise Projects Delivered</p>
          </div>
          <div>
            <h3 style={{ fontSize: '36px', color: 'var(--primary-cyan)', fontWeight: '900', margin: 0 }}>99.4%</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px', margin: 0 }}>Client Satisfaction Rate</p>
          </div>
          <div>
            <h3 style={{ fontSize: '36px', color: 'var(--primary-cyan)', fontWeight: '900', margin: 0 }}>10+ Yrs</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px', margin: 0 }}>Domain IT Experience</p>
          </div>
          <div>
            <h3 style={{ fontSize: '36px', color: 'var(--primary-cyan)', fontWeight: '900', margin: 0 }}>24/7</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px', margin: 0 }}>Dedicated Support & SLA</p>
          </div>
        </div>

        {setActiveTab && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              className="btn-solid"
              onClick={() => {
                setActiveTab('contact');
                window.scrollTo(0, 0);
              }}
              style={{ padding: '14px 34px', fontSize: '15px', borderRadius: '30px' }}
            >
              Get Started with The Jobsync &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export const TestimonialsPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <div className="testimonials-page">

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '70px 0', textAlign: 'center', borderBottom: '3px solid var(--primary-cyan)' }}>
        <div className="container">
          <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: 'var(--primary-cyan)', padding: '8px 20px', borderRadius: '30px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block', marginBottom: '16px', border: '1px solid rgba(14,165,233,0.3)' }}>
            ⭐ VERIFIED CLIENT REVIEWS
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>
            Trusted by Leading Enterprises & Innovators
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: '1.6' }}>
            Read real feedback from CTOs, Directors, and Tech Leaders who rely on The Jobsync for cloud infrastructure, custom software engineering, and strategic IT consulting.
          </p>
        </div>
      </div>

      <TestimonialsSection setActiveTab={setActiveTab} />
    </div>
  );
};
