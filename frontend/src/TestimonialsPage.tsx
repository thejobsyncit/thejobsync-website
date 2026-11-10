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

const FAKE_TESTIMONIAL_NAMES = new Set(['sarah jenkins', 'marcus vance', 'elena rostova', 'sophia loren', 'test client', 'wertyfg']);
const FAKE_TESTIMONIAL_COMPANIES = new Set(['fintech dynamics', 'aeroglobal logistics', 'quantum systems emea', 'quantum innovations', 'acme tech', 'werthbvcx']);

const filterRealTestimonials = (list: Testimonial[]): Testimonial[] => {
  return (list || []).filter(item => {
    if (!item) return false;
    const name = (item.name || '').trim().toLowerCase();
    const company = (item.company || '').trim().toLowerCase();
    const quote = (item.quote || '').toLowerCase();
    if (FAKE_TESTIMONIAL_NAMES.has(name)) return false;
    if (FAKE_TESTIMONIAL_COMPANIES.has(company)) return false;
    if (quote.includes('42%') || quote.includes('sdcvfgbhnnjhytgrfd')) return false;
    return true;
  });
};

export const TestimonialsSection = ({
  setActiveTab: _setActiveTab,
  isHomePage = false
}: {
  setActiveTab?: (tab: string) => void;
  isHomePage?: boolean;
}) => {
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

  const isDirectPhotoUrl = (url: string): boolean => {
    if (!url || !url.trim()) return true; // optional
    const trimmed = url.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
      }

      // Check known image file extensions in path
      const hasImageExt = /\.(jpe?g|png|webp|svg|gif|avif|bmp|ico)($|\?|#)/i.test(parsed.pathname + parsed.search);
      if (hasImageExt) return true;

      // Check trusted image CDNs that generate images via API or URL paths
      const host = parsed.hostname.toLowerCase();
      const isImageHost = (
        host.includes('images.unsplash.com') ||
        host.includes('cloudinary.com') ||
        host.includes('imgur.com') ||
        host.includes('googleusercontent.com') ||
        host.includes('githubusercontent.com') ||
        host.includes('gravatar.com') ||
        host.includes('images.pexels.com') ||
        host.includes('cdn.pixabay.com') ||
        host.includes('media.licdn.com')
      );
      if (isImageHost) return true;

      // Check format query parameters (e.g. ?fm=jpg, &format=png)
      const formatParam = parsed.searchParams.get('format') || parsed.searchParams.get('fm');
      if (formatParam && ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(formatParam.toLowerCase())) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

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
          const clean = filterRealTestimonials(data.data);
          setItems(clean);
          try {
            localStorage.setItem('jobsync_testimonials_data', JSON.stringify(clean));
          } catch {}
        } else {
          const saved = localStorage.getItem('jobsync_testimonials_data');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed)) {
                const clean = filterRealTestimonials(parsed);
                setItems(clean);
                localStorage.setItem('jobsync_testimonials_data', JSON.stringify(clean));
              }
            } catch {}
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('jobsync_testimonials_data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              const clean = filterRealTestimonials(parsed);
              setItems(clean);
              localStorage.setItem('jobsync_testimonials_data', JSON.stringify(clean));
            }
          } catch {}
        }
      });
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Validate Name (Letters and spaces only, no numbers)
    const cleanName = fName.trim();
    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (/\d/.test(cleanName)) {
      setErrorMsg('Name field cannot accept numbers. Please enter alphabetic characters only.');
      return;
    }
    if (cleanName.length < 2 || !/^[a-zA-Z\s.'-]+$/.test(cleanName)) {
      setErrorMsg('Please enter a valid name (letters only, minimum 2 characters).');
      return;
    }

    // 2. Validate Role / Title (No numbers allowed)
    const cleanRole = fRole.trim();
    if (cleanRole) {
      if (/\d/.test(cleanRole)) {
        setErrorMsg('Role / Title cannot contain numbers. Please enter a valid professional title (e.g. CTO, Operations Director).');
        return;
      }
      if (cleanRole.length < 2 || !/^[a-zA-Z\s/&.'-]+$/.test(cleanRole)) {
        setErrorMsg('Role / Title contains invalid characters. Please enter letters and standard symbols only.');
        return;
      }
    }

    // 3. Validate Company Name (No phone / mobile numbers allowed, must contain company letters)
    const cleanCompany = fCompany.trim();
    if (cleanCompany) {
      const isPurelyDigitsOrPhone = /^[\d\s+\-().]{6,}$/.test(cleanCompany);
      const hasLetters = /[a-zA-Z]/.test(cleanCompany);
      if (isPurelyDigitsOrPhone || !hasLetters) {
        setErrorMsg('Company Name cannot be a mobile or phone number. Please enter a valid organization name (e.g. Acme Corp).');
        return;
      }
      if (cleanCompany.length < 2) {
        setErrorMsg('Company Name must be at least 2 characters long.');
        return;
      }
    }

    // 4. Validate Profile Photo URL (Only direct photo/image URLs allowed, no regular website links)
    const cleanAvatar = fAvatar.trim();
    if (cleanAvatar) {
      if (!isDirectPhotoUrl(cleanAvatar)) {
        setErrorMsg('Invalid Profile Photo URL. Only direct photo URLs (ending in .jpg, .jpeg, .png, .webp, or from an image host like Unsplash) are accepted. Generic website links are not allowed.');
        return;
      }
    }

    // 5. Validate Feedback Review text
    const cleanQuote = fQuote.trim();
    if (!cleanQuote || cleanQuote.length < 10) {
      setErrorMsg('Please enter a feedback review of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: cleanName,
      role: cleanRole || 'Client Partner',
      company: cleanCompany || 'Enterprise Client',
      category: fCategory,
      rating: Number(fRating) || 5,
      avatar: cleanAvatar || '',
      quote: cleanQuote,
    };

    try {
      const res = await fetch(`${getApiUrl()}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const createdTestimonial: Testimonial = data.data || {
          id: Date.now(),
          ...payload,
        };

        // Immediately update state and localStorage so feedback is visible without delay
        setItems(prev => [createdTestimonial, ...prev]);
        try {
          const existing = localStorage.getItem('jobsync_testimonials_data');
          const list = existing ? JSON.parse(existing) : [];
          localStorage.setItem('jobsync_testimonials_data', JSON.stringify([createdTestimonial, ...list]));
        } catch {}

        setSuccessMsg('Thank you for your feedback! Your review has been submitted successfully.');
        setFName('');
        setFRole('');
        setFCompany('');
        setFAvatar('');
        setFQuote('');

        setTimeout(() => {
          setSuccessMsg('');
          setShowFeedbackModal(false);
        }, 2200);
      } else {
        setErrorMsg(data.error || 'Failed to submit feedback. Please check your inputs and try again.');
      }
    } catch (err: any) {
      // Graceful offline fallback
      const localTestimonial: Testimonial = {
        id: Date.now(),
        ...payload,
      };
      setItems(prev => [localTestimonial, ...prev]);
      try {
        const existing = localStorage.getItem('jobsync_testimonials_data');
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem('jobsync_testimonials_data', JSON.stringify([localTestimonial, ...list]));
      } catch {}

      setSuccessMsg('Thank you for your feedback! Your review has been recorded.');
      setFName('');
      setFRole('');
      setFCompany('');
      setFAvatar('');
      setFQuote('');

      setTimeout(() => {
        setSuccessMsg('');
        setShowFeedbackModal(false);
      }, 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', 'Cloud Infrastructure', 'Custom Software', 'IT Consulting', 'Enterprise Systems'];

  const filteredTestimonials = activeCategory === 'All'
    ? items
    : items.filter(t => t.category === activeCategory);

  // If on the Home page and no client testimonials have been published yet, hide section
  if (isHomePage && items.length === 0) {
    return null;
  }

  return (
    <section className="testimonials-section" id="testimonials" style={{ padding: '90px 0', background: 'transparent' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', color: '#0f172a', fontWeight: '700', marginBottom: '12px' }}>
            Client feedback
          </h2>
          <p style={{ maxWidth: '680px', margin: '0 auto', color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
            Feedback from clients we have worked with across our consulting and staffing projects.
          </p>
        </div>

        {/* Feedback Submission Banner */}
        <div style={{
          background: '#ffffff',
          borderRadius: '2px',
          padding: '28px 32px',
          marginBottom: '40px',
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: 'none'
        }}>
          <div style={{ maxWidth: '620px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
              Worked with us? We would like to hear how it went.
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
              We welcome feedback from current and past project stakeholders.
            </p>
          </div>

          <button
            className="btn-rect-primary"
            onClick={() => setShowFeedbackModal(true)}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              borderRadius: '2px',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Share feedback
          </button>
        </div>

        {/* Category Filter Tabs */}
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '36px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '0',
                  border: 'none',
                  borderBottom: activeCategory === category ? '2px solid #0f766e' : '2px solid transparent',
                  background: 'transparent',
                  color: activeCategory === category ? '#0f766e' : '#475569',
                  fontWeight: activeCategory === category ? '700' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease, border-color 0.15s ease'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Testimonial Cards Grid or Empty State */}
        {filteredTestimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '580px', margin: '0 auto 40px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }} aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No Public Reviews Published Yet</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
              We are actively gathering direct feedback from our recent client engagements. If you have partnered with The Jobsync, we would appreciate hearing about your experience.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '50px' }}>
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="testimonial-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  padding: '28px',
                  boxShadow: 'none',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'border-color 0.25s ease, background-color 0.25s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ color: '#0f766e', fontSize: '12px', fontWeight: '600' }}>
                      {item.category}
                    </span>
                    <div style={{ color: '#f59e0b', fontSize: '13px', letterSpacing: '1px' }}>
                      {'★'.repeat(item.rating || 5)}
                    </div>
                  </div>

                  <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', marginBottom: '20px' }}>
                    "{item.quote}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      style={{ width: '42px', height: '42px', borderRadius: '2px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '2px',
                        background: '#0f766e',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '16px',
                        flexShrink: 0
                      }}
                    >
                      {item.name ? item.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>{item.name}</h4>
                    <p style={{ margin: '1px 0 0', fontSize: '12px', color: '#64748b' }}>{item.role}</p>
                    <span style={{ fontSize: '12px', color: '#0f766e', fontWeight: '600' }}>{item.company}</span>
                  </div>
                </div>
              </div>
            ))}
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
              borderRadius: '2px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0',
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
                borderRadius: '2px',
                width: '32px',
                height: '32px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '2px',
                background: 'rgba(15, 118, 110, 0.1)',
                color: '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
                Share your feedback
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                We value your partnership. Submit your feedback below to help us continuously improve our services.
              </p>
            </div>

            {errorMsg && (
              <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '12px 14px', borderRadius: '2px', fontSize: '13px', marginBottom: '20px' }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#ecfdf5', borderLeft: '4px solid #10b981', color: '#065f46', padding: '12px 14px', borderRadius: '2px', fontSize: '13px', marginBottom: '20px' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Your Name *</label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Letters only (no numbers)</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={fName}
                  onKeyDown={(e) => {
                    // Prevent entering numeric characters directly
                    if (/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    // Strip numeric characters if pasted
                    setFName(e.target.value.replace(/[0-9]/g, ''));
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '2px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Your Role / Title</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. CTO / Operations Director"
                    value={fRole}
                    onKeyDown={(e) => {
                      if (/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setFRole(e.target.value.replace(/[0-9]/g, ''));
                      if (errorMsg) setErrorMsg('');
                    }}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '2px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>No numbers allowed</span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Company Name</label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={fCompany}
                    onChange={(e) => {
                      setFCompany(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '2px',
                      border: `1px solid ${fCompany && (/^[\d\s+\-().]{6,}$/.test(fCompany.trim()) || (!/[a-zA-Z]/.test(fCompany.trim()) && fCompany.trim().length > 3)) ? '#ef4444' : '#cbd5e1'}`,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: fCompany && (/^[\d\s+\-().]{6,}$/.test(fCompany.trim()) || (!/[a-zA-Z]/.test(fCompany.trim()) && fCompany.trim().length > 3)) ? '#ef4444' : '#94a3b8', display: 'block', marginTop: '4px' }}>
                    {fCompany && (/^[\d\s+\-().]{6,}$/.test(fCompany.trim()) || (!/[a-zA-Z]/.test(fCompany.trim()) && fCompany.trim().length > 3))
                      ? 'Cannot be a mobile or phone number'
                      : 'Organization name (not a mobile number)'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Service Category</label>
                  <select
                    value={fCategory}
                    onChange={(e) => setFCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '2px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="IT Consulting">IT Consulting</option>
                    <option value="Enterprise Systems">Enterprise Systems</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Rating</label>
                  <select
                    value={fRating}
                    onChange={(e) => setFRating(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '2px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Profile Photo URL (Optional)</label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Photo image link only (.jpg, .png, etc.)</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="url"
                    placeholder="https://example.com/client-photo.jpg"
                    value={fAvatar}
                    onChange={(e) => {
                      setFAvatar(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '2px',
                      border: `1px solid ${fAvatar && !isDirectPhotoUrl(fAvatar) ? '#ef4444' : '#cbd5e1'}`,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  {fAvatar && isDirectPhotoUrl(fAvatar) && (
                    <div style={{ width: '40px', height: '40px', borderRadius: '2px', overflow: 'hidden', border: '1px solid #10b981', flexShrink: 0, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Photo Preview">
                      <img
                        src={fAvatar}
                        alt="Photo Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                {fAvatar && !isDirectPhotoUrl(fAvatar) ? (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', marginBottom: 0, fontWeight: '500' }}>
                    ⚠️ Only direct photo URLs (ending in .jpg, .jpeg, .png, .webp, or from Unsplash/image CDNs) are accepted. General website links (e.g. google.com) cannot be used.
                  </p>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px', marginBottom: 0 }}>
                    Leave blank to use a default professional avatar, or paste a direct photo URL.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Your Feedback & Review *</label>
                <textarea
                  rows={4}
                  placeholder="Share details about your experience working with The Jobsync..."
                  value={fQuote}
                  onChange={(e) => {
                    setFQuote(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '2px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '2px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-rect-primary"
                  style={{ padding: '10px 24px', borderRadius: '2px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit feedback'}
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
      {/* Hero Header - Flat solid dark navy with straight edge */}
      <div
        style={{
          position: 'relative',
          padding: '70px 0 80px',
          background: '#0b172a',
          borderBottom: '1px solid #1e293b',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: '38px', fontWeight: 700, color: '#ffffff', marginBottom: '14px', letterSpacing: '-0.5px' }}>
            What Our Clients Say
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: 1.6 }}>
            What clients say about working with The Jobsync.
          </p>
        </div>
      </div>

      <TestimonialsSection setActiveTab={setActiveTab} />
    </div>
  );
};
