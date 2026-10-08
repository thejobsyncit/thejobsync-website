import React, { useState, useEffect } from 'react';

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

export const TestimonialsSection = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Form State
  const [fName, setFName] = useState('');
  const [fRole, setFRole] = useState('');
  const [fCompany, setFCompany] = useState('');
  const [fCategory, setFCategory] = useState('Cloud Infrastructure');
  const [fRating, setFRating] = useState(5);
  const [fAvatar, setFAvatar] = useState('');
  const [fQuote, setFQuote] = useState('');

  const getApiUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
    if (!url) {
      url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '';
    }
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, '');
  };

  const fetchTestimonials = () => {
    fetch(`${getApiUrl()}/api/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setItems(data.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim() || !fQuote.trim()) {
      setErrorMsg('Please enter your Name and Feedback details.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const payload = {
      name: fName.trim(),
      role: fRole.trim() || 'Client Partner',
      company: fCompany.trim() || 'Enterprise Client',
      category: fCategory,
      rating: Number(fRating) || 5,
      avatar: fAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: fQuote.trim(),
    };

    try {
      const res = await fetch(`${getApiUrl()}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('🎉 Thank you for your feedback! Your review is now live.');
        setFName('');
        setFRole('');
        setFCompany('');
        setFAvatar('');
        setFQuote('');
        fetchTestimonials();
        setTimeout(() => {
          setSuccessMsg('');
          setShowFeedbackModal(false);
        }, 2200);
      } else {
        setErrorMsg(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error: Unable to reach backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', 'Cloud Infrastructure', 'Custom Software', 'IT Consulting', 'Digital Transformation'];

  const filteredTestimonials = activeCategory === 'All'
    ? items
    : items.filter(t => t.category === activeCategory);

  return (
    <section className="testimonials-section" id="testimonials" style={{ padding: '90px 0', background: 'transparent' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: 'var(--primary-cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '13px', background: 'rgba(43, 182, 180, 0.1)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(43, 182, 180, 0.2)' }}>
            ⭐ CLIENT REVIEWS & FEEDBACK
          </span>
          <h2 style={{ fontSize: '36px', color: 'var(--logo-navy-primary)', fontWeight: '900', marginTop: '14px', marginBottom: '12px' }}>
            What Our Partners & Clients Say
          </h2>
          <p style={{ maxWidth: '680px', margin: '0 auto', color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
            Read real feedback from tech leaders who rely on The Jobsync for cloud architecture, software development, and IT consulting.
          </p>
        </div>

        {/* Catchy Feedback Submission Banner */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '32px 36px',
          marginBottom: '45px',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ maxWidth: '620px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(43, 182, 180, 0.12)', color: 'var(--primary-cyan)', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', marginBottom: '10px', border: '1px solid rgba(43, 182, 180, 0.3)' }}>
              <span>💬</span> SHARE YOUR EXPERIENCE
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              Worked with The Jobsync? We'd Love Your Feedback!
            </h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
              Your testimonial helps us continuously elevate our IT solutions. Submit your review and join our featured partner stories.
            </p>
          </div>

          <button
            className="btn-solid"
            onClick={() => setShowFeedbackModal(true)}
            style={{
              padding: '14px 30px',
              fontSize: '15px',
              borderRadius: '30px',
              fontWeight: '800',
              letterSpacing: '0.5px',
              boxShadow: '0 10px 25px rgba(43, 182, 180, 0.3)',
              whiteSpace: 'nowrap'
            }}
          >
            ✨ Submit Client Feedback
          </button>
        </div>

        {/* Category Filter Pills */}
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '9px 20px',
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
        )}

        {/* Testimonial Cards Grid or Empty State */}
        {filteredTestimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto 50px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Be the First to Share Your Feedback!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
              No client reviews published in this category yet. Click below to submit your experience with The Jobsync.
            </p>
            <button
              className="btn-solid"
              onClick={() => setShowFeedbackModal(true)}
              style={{ padding: '12px 30px', borderRadius: '30px', fontSize: '14px', fontWeight: '700' }}
            >
              Submit Client Feedback &rarr;
            </button>
          </div>
        ) : (
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
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary-cyan)', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '800' }}>
                      {item.category}
                    </span>
                    <div style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '2px' }}>
                      {'★'.repeat(item.rating || 5)}
                    </div>
                  </div>

                  <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '24px' }}>
                    "{item.quote}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                  <img
                    src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
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
        )}

        {/* Impact Metrics Banner */}
        <div style={{ background: 'var(--navy-gradient)', color: '#ffffff', borderRadius: '24px', padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center', border: '1px solid rgba(43, 182, 180, 0.2)', boxShadow: '0 20px 40px rgba(11, 23, 42, 0.15)' }}>
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

      {/* FEEDBACK SUBMISSION MODAL */}
      {showFeedbackModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFeedbackModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>⭐</div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
                Share Your Experience
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                We value your partnership! Submit your feedback below to be featured on our website.
              </p>
            </div>

            {errorMsg && (
              <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#ecfdf5', borderLeft: '4px solid #10b981', color: '#065f46', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Your Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. CTO / Operations Director"
                    value={fRole}
                    onChange={(e) => setFRole(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. FinTech Dynamics"
                    value={fCompany}
                    onChange={(e) => setFCompany(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Service Category</label>
                  <select
                    value={fCategory}
                    onChange={(e) => setFCategory(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="IT Consulting">IT Consulting</option>
                    <option value="Digital Transformation">Digital Transformation</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Rating</label>
                  <select
                    value={fRating}
                    onChange={(e) => setFRating(Number(e.target.value))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 / 5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 / 5 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 / 5 Stars)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={fAvatar}
                  onChange={(e) => setFAvatar(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Your Feedback & Review *</label>
                <textarea
                  rows={4}
                  placeholder="Share details about your experience working with The Jobsync..."
                  value={fQuote}
                  onChange={(e) => setFQuote(e.target.value)}
                  required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  style={{ padding: '12px 22px', borderRadius: '25px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-solid"
                  style={{ padding: '12px 28px', borderRadius: '25px', fontSize: '14px', fontWeight: '700' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export const TestimonialsPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <div className="testimonials-page">

      <div style={{ background: 'linear-gradient(135deg, #040914 0%, #091322 50%, #0c1a2e 100%)', color: '#ffffff', padding: '60px 0 75px', position: 'relative', borderBottom: '1px solid rgba(43, 182, 180, 0.25)' }}>
        <div className="container" style={{ position: 'relative' }}>
          <div className="breadcrumb" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 18px', borderRadius: '30px', fontSize: '13px', border: '1px solid rgba(43, 182, 180, 0.3)', marginBottom: '24px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>
              Home
            </a>
            <span style={{ color: '#cbd5e1', opacity: 0.6, fontSize: '12px' }}>/</span>
            <span style={{ color: '#38bdf8', fontWeight: '700' }}>
              Testimonials
            </span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ background: 'rgba(43, 182, 180, 0.18)', color: '#00f5d4', padding: '8px 22px', borderRadius: '30px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block', marginBottom: '18px', border: '1px solid rgba(43, 182, 180, 0.4)', boxShadow: '0 4px 15px rgba(0, 245, 212, 0.15)' }}>
              VERIFIED CLIENT REVIEWS
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#ffffff', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              What Our Clients <span style={{ background: 'linear-gradient(135deg, #2bb6b4 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Say About Us</span>
            </h1>
            <p style={{ maxWidth: '720px', margin: '0 auto', color: '#e2e8f0', fontSize: '17px', lineHeight: '1.6', fontWeight: '400' }}>
              Read real feedback from CTOs, Directors, and Tech Leaders who rely on The JobSync for cloud infrastructure, custom software engineering, and strategic IT consulting.
            </p>
          </div>
        </div>
      </div>

      <TestimonialsSection setActiveTab={setActiveTab} />
    </div>
  );
};
