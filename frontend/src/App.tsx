import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import './index.css';
import { TestimonialsPage, TestimonialsSection } from './TestimonialsPage';
import { BlogPage, BlogSection } from './BlogPage';
import { AdminPage } from './AdminPage';

// EDIT THIS. Only include details that are true. Empty fields are hidden.
const FOUNDER = {
  name: 'Anitha Ekambaram',
  title: 'Founder & Managing Director',
  photo: '/founder.jpg',

  bio: [
    'Anitha Ekambaram, M.B.A., is the Founder & Managing Director of The JobSync, a technology-driven recruitment and IT services company focused on connecting businesses with talent and delivering innovative technology solutions.',

    'Under her leadership, The JobSync / GoJobSync focuses on software development, IT consulting, digital transformation, cloud solutions, cybersecurity, AI and technology services, recruitment, talent acquisition, for startups, SMEs, and enterprises.',

    'With a strong focus on innovation, people, and technology, Anitha is committed to building trusted partnerships, creating effective recruitment solutions, and helping organizations improve their operations, scale their capabilities, and achieve sustainable business growth.'
  ] as string[],

  quote: 'At The JobSync, we believe that the right combination of people, technology, and trusted partnerships can create meaningful opportunities and sustainable business growth.',

  highlights: [
    'Founder & Managing Director of The JobSync',
    'Focused on recruitment, talent acquisition, and HR technology solutions',
    'Driving IT consulting, software development, and digital transformation',
    'Building technology-driven solutions for startups, SMEs, and enterprises'
  ] as string[],

  linkedin: 'https://www.linkedin.com',
  email:  'anithaekambaram@thejobsync.com',
};

// EDIT THIS. Configuration for About Us page content.
// Provide your custom text below. Any field left empty ("") or blank will be hidden automatically.
const ABOUT_CONTENT = {
  // Mission statement placeholder (empty "" hides the mission card)
  mission: 'To help organizations grow with reliable technology and the right talent. We deliver practical IT consulting, software, and staffing solutions that solve real business problems and create lasting value for our clients.',
  // Vision statement placeholder (empty "" hides the vision card)
  vision: 'To be a trusted global technology and talent partner, known for quality, integrity, and long-term relationships with the businesses and professionals we serve.',

  // Core values placeholders (empty text "" hides that specific card)
  // Titles: Customer Focus, Quality, Innovation, Expertise
  values: [
    {
      title: 'Customer Focus',
      text: 'We start with your goals and build solutions around your business, not ours.',
    },
    {
      title: 'Quality',
      text: 'We hold our work to a high standard, from the first consultation to ongoing support.',
    },
    {
      title: 'Innovation',
      text: 'We use modern technology thoughtfully to help businesses improve and scale.',
    },
    {
      title: 'Expertise',
      text: 'Our consultants and specialists bring hands-on knowledge across many technology areas.',
    },
    {
      title: 'Integrity',
      text: 'We communicate openly and deliver what we promise.',
    },
  ],
};

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out';
  duration?: number;
  delay?: number;
  threshold?: number;
}

const ScrollReveal = ({
  children,
  animation = 'fade-up',
  duration = 800,
  delay = 0,
  threshold = 0.1
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={domRef}
      className={`reveal-element reveal-${animation} ${isVisible ? 'is-visible' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

const ContactPage = ({ setActiveTab: _setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [message, setMessage] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const svc = params.get('service');
      if (svc) return `I would like to inquire about your ${svc} services.`;
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const svc = params.get('service');
      if (svc) {
        setMessage(`I would like to inquire about your ${svc} services.`);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: (formData.get('name') as string || '').trim(),
      email: (formData.get('email') as string || '').trim(),
      phone: (formData.get('phone') as string || '').trim(),
      message: (formData.get('message') as string || '').trim(),
    };

    try {
      const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'a7cd1aa3-f5a4-4f75-8c7d-0e6d032a3a13';
      if (web3Key) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `Website Inquiry from ${data.name}`,
            from_name: 'The JobSync Website',
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
          }),
        }).catch((err) => console.warn('Web3Forms dispatch note:', err));
      }

      let apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
      if (!apiUrl) {
        apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '';
      }
      if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        apiUrl = `https://${apiUrl}`;
      }
      apiUrl = apiUrl.replace(/\/+$/, '');

      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && (result.success || response.status === 200)) {
        setSuccessMsg(result.message || "Thank you! Your inquiry has been submitted successfully to hr@thejobsyn.com.");
        form.reset();
        setMessage('');

        // Cache inquiry locally so Admin Dashboard reflects it immediately
        try {
          const localEntry = {
            id: `inq_${Date.now()}`,
            name: data.name,
            email: data.email,
            phone: data.phone || 'N/A',
            message: data.message,
            date: new Date().toLocaleString(),
            status: 'New',
          };
          const prev = JSON.parse(localStorage.getItem('jobsync_inquiries_data') || '[]');
          localStorage.setItem('jobsync_inquiries_data', JSON.stringify([localEntry, ...prev]));
        } catch (_) {}
      } else {
        setErrorMsg(result.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error: Unable to connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Header - Merged seamlessly with the page */}
      <div
        className="contact-hero contact-hero-merged"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '70px 0 90px',
          borderBottom: 'none',
          background: 'radial-gradient(circle at 50% 20%, rgba(43, 182, 180, 0.15) 0%, transparent 60%), linear-gradient(135deg, #071224 0%, #0b1a30 50%, #102442 100%)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span
            style={{
              background: 'rgba(43, 182, 180, 0.16)',
              color: '#2bb6b4',
              padding: '6px 20px',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '16px',
              border: '1px solid rgba(43, 182, 180, 0.35)'
            }}
          >
            GET IN TOUCH
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Contact <span style={{ background: 'linear-gradient(135deg, #2bb6b4 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Us</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: 1.6 }}>
            Have questions or a project in mind? Reach out to our global teams in Dubai and Chennai.
          </p>
        </div>

        {/* Seamless Wave Divider Merging into the section below */}
        <div
          className="hero-wave-divider"
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            lineHeight: 0,
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: 'relative',
              display: 'block',
              width: 'calc(100% + 1.3px)',
              height: '52px',
              fill: 'var(--pastel-bg, #edf7f8)'
            }}
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      <div className="contact-page-body container" style={{ padding: '45px 0 80px' }}>
        <ScrollReveal animation="fade-right">
          <div className="contact-left">
            <h2>Connect with us</h2>

            <div className="contact-info-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h3>Dubai Office</h3>
                <p>Dubai Creek Tower - 1st St - Deira-Riggat Al Buteen<br />+971 54 740 5625</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h3>India Office</h3>
                <p>Tamilnadu, Chennai<br />+91 9789569391</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h3>Mail Id</h3>
                <p><a href="mailto:hr@thejobsyn.com" style={{ color: 'inherit', textDecoration: 'none' }}>hr@thejobsyn.com</a></p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-left">
          <div className="contact-right">
            <form className="contact-page-form" onSubmit={handleSubmit}>
              {successMsg && <div style={{ color: '#4caf50', marginBottom: '15px', fontWeight: '500' }}>{successMsg}</div>}
              {errorMsg && <div style={{ color: '#f44336', marginBottom: '15px', fontWeight: '500' }}>{errorMsg}</div>}
              <div className="form-row">
                <input type="text" name="name" placeholder="Name" required />
                <input type="email" name="email" placeholder="Email*" required />
              </div>
              <div className="form-row">
                <input type="tel" name="phone" placeholder="Phone" />
              </div>
              <div className="form-row">
                <textarea
                  name="message"
                  placeholder="Tell Us About Project *"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="form-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I accept your Terms & Conditions</label>
              </div>
              <button type="submit" className="btn-solid btn-get-touch" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                {isLoading ? (
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px', verticalAlign: 'middle' }}></span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                )}
                {isLoading ? 'Sending...' : 'Get In Touch'}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

const CareersPage = ({ setActiveTab: _setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const jobs = [
    {
      title: "HR Recruiter",
      experience: "Freshers / Experienced",
      qualification: "Any Graduate / MBA HR (Preferred)",
      responsibilities: [
        "Source candidates through job portals and social media.",
        "Screen resumes and conduct initial interviews.",
        "Coordinate interview schedules with clients.",
        "Maintain candidate databases and recruitment reports.",
        "Build strong relationships with candidates and employers."
      ]
    },
    {
      title: "Technical Support Executive",
      experience: "0–2 Years",
      qualification: "Diploma / BE / B.Tech / BCA / B.Sc (IT/CS)",
      responsibilities: [
        "Provide technical support to customers and internal teams.",
        "Troubleshoot hardware, software, and network issues.",
        "Install and configure operating systems and applications.",
        "Resolve customer queries through phone, email, and remote support.",
        "Maintain service records and documentation."
      ]
    },
    {
      title: "Application Support Analyst (ERP)",
      experience: "0–2 Years",
      qualification: "BCA / B.Sc / BE / B.Tech / MCA",
      responsibilities: [
        "Support ERP applications and business users.",
        "Analyze and resolve application-related issues.",
        "Coordinate with development teams for bug fixes.",
        "Prepare user documentation and training materials.",
        "Monitor application performance."
      ]
    },
    {
      title: "Software Developer Trainee",
      experience: "Freshers",
      qualification: "BE / B.Tech / MCA / BCA / B.Sc Computer Science",
      responsibilities: [
        "Develop and maintain web and software applications.",
        "Write clean, efficient, and reusable code.",
        "Participate in testing and debugging activities.",
        "Collaborate with senior developers on project delivery.",
        "Learn modern development frameworks and tools."
      ]
    },
    {
      title: "Software Testing Engineer (QA)",
      experience: "Freshers / 1+ Year",
      qualification: "BE / B.Tech / MCA / BCA",
      responsibilities: [
        "Prepare and execute test cases.",
        "Identify, document, and track software defects.",
        "Perform manual and basic automation testing.",
        "Validate application functionality before release.",
        "Work closely with developers to improve product quality."
      ]
    },
    {
      title: "Accountant",
      experience: "0–3 Years",
      qualification: "B.Com / M.Com / CA Inter",
      responsibilities: [
        "Manage all accounting transactions and records.",
        "Prepare budget forecasts and financial statements.",
        "Handle monthly, quarterly, and annual closings.",
        "Reconcile accounts payable and receivable.",
        "Ensure timely bank payments and compute taxes."
      ]
    },
    {
      title: "Digital Marketing Executive",
      experience: "0–2 Years",
      qualification: "Any Graduate",
      responsibilities: [
        "Manage social media platforms.",
        "Create digital marketing campaigns.",
        "Improve SEO and website visibility.",
        "Generate leads through online marketing.",
        "Analyze campaign performance."
      ]
    }
  ];

  return (
    <div className="careers-page">
      {/* Hero Header - Merged seamlessly with the page */}
      <div
        className="contact-hero careers-hero-merged"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '70px 0 90px',
          borderBottom: 'none',
          background: 'radial-gradient(circle at 50% 20%, rgba(43, 182, 180, 0.15) 0%, transparent 60%), linear-gradient(135deg, #071224 0%, #0b1a30 50%, #102442 100%)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span
            style={{
              background: 'rgba(43, 182, 180, 0.16)',
              color: '#2bb6b4',
              padding: '6px 20px',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '16px',
              border: '1px solid rgba(43, 182, 180, 0.35)'
            }}
          >
            CAREERS & OPPORTUNITIES
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Explore <span style={{ background: 'linear-gradient(135deg, #2bb6b4 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Careers</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: 1.6 }}>
            Join a dynamic global team shaping the future of IT consulting, software engineering, and digital solutions.
          </p>
        </div>

        {/* Seamless Wave Divider Merging into the section below */}
        <div
          className="hero-wave-divider"
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            lineHeight: 0,
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: 'relative',
              display: 'block',
              width: 'calc(100% + 1.3px)',
              height: '52px',
              fill: 'var(--pastel-bg, #edf7f8)'
            }}
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      <div className="container" style={{ padding: '45px 0 70px' }}>
        <ScrollReveal animation="fade-up">
          <div className="careers-intro">
            <h2>Join The JobSync</h2>
            <p>The JobSync is a global recruitment and career platform dedicated to connecting talented professionals with leading employers across India, the UAE, Singapore, and other international markets. We are expanding our team and inviting passionate individuals to build rewarding careers with us.</p>
            <h3 style={{ marginTop: '40px', color: '#1a2238' }}>Current Openings</h3>
          </div>
        </ScrollReveal>

        <div className="jobs-grid">
          {jobs.map((job, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={(index % 3) * 100}>
              <div className="job-card">
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <span className="job-experience">{job.experience}</span>
                </div>
                <p className="job-qualification"><strong>Qualification:</strong> {job.qualification}</p>

                <div className="job-responsibilities">
                  <strong>Responsibilities:</strong>
                  <ul className="service-list">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <button className="btn-solid apply-btn">Apply Now</button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

const FounderSection = () => {
  const [imgError, setImgError] = useState(false);

  if (!FOUNDER.name || !FOUNDER.name.trim()) {
    return null;
  }

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <section className="founder" id="founder">
      <div className="container">
        <div className="founder-grid">
          {/* Photo Column on the LEFT */}
          <ScrollReveal animation="fade-right">
            <div className="founder-photo-wrap">
              {!imgError && FOUNDER.photo ? (
                <img
                  src={FOUNDER.photo}
                  alt={FOUNDER.name}
                  className="founder-photo"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="founder-photo founder-avatar-fallback">
                  <span className="founder-initials">{getInitials(FOUNDER.name)}</span>
                </div>
              )}
              <div className="founder-badge">Founder</div>
            </div>
          </ScrollReveal>

          {/* Text Column on the RIGHT */}
          <ScrollReveal animation="fade-left">
            <div className="founder-content">
              <span className="about-tag">Meet Our Founder</span>
              <h2>{FOUNDER.name}</h2>
              {FOUNDER.title && <p className="founder-title">{FOUNDER.title}</p>}
              <div className="founder-underline" />

              {/* Bio Paragraphs */}
              {FOUNDER.bio && FOUNDER.bio.length > 0 && (
                <div className="founder-bio">
                  {FOUNDER.bio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Quote Blockquote */}
              {FOUNDER.quote && (
                <blockquote className="founder-quote">
                  <p>"{FOUNDER.quote}"</p>
                </blockquote>
              )}

              {/* Highlights Check-icon List */}
              {FOUNDER.highlights && FOUNDER.highlights.length > 0 && (
                <ul className="founder-highlights">
                  {FOUNDER.highlights.map((highlight, index) => (
                    <li key={index}>
                      <svg
                        className="founder-check-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Action Links */}
              {FOUNDER.linkedin && (
                <div className="founder-links">
                  <a
                    href={FOUNDER.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="founder-btn-linkedin"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
                    </svg>
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const AboutPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const hasMission = Boolean(ABOUT_CONTENT.mission && ABOUT_CONTENT.mission.trim());
  const hasVision = Boolean(ABOUT_CONTENT.vision && ABOUT_CONTENT.vision.trim());
  const activeValues = ABOUT_CONTENT.values.filter((v) => v.text && v.text.trim().length > 0);

  return (
    <div className="about-page">
      {/* Hero Header - Merged seamlessly with the page */}
      <div
        className="contact-hero about-hero-merged"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '70px 0 90px',
          borderBottom: 'none',
          background: 'radial-gradient(circle at 50% 20%, rgba(43, 182, 180, 0.15) 0%, transparent 60%), linear-gradient(135deg, #071224 0%, #0b1a30 50%, #102442 100%)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span
            style={{
              background: 'rgba(43, 182, 180, 0.16)',
              color: '#2bb6b4',
              padding: '6px 20px',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '16px',
              border: '1px solid rgba(43, 182, 180, 0.35)'
            }}
          >
            WHO WE ARE
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            About <span style={{ background: 'linear-gradient(135deg, #2bb6b4 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Us</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: 1.6 }}>
            Empowering global organizations with modern technology consulting and premier engineering talent.
          </p>
        </div>

        {/* Seamless Wave Divider Merging into the section below */}
        <div
          className="hero-wave-divider"
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            lineHeight: 0,
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: 'relative',
              display: 'block',
              width: 'calc(100% + 1.3px)',
              height: '52px',
              fill: 'var(--pastel-bg, #edf7f8)'
            }}
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* 1. Layout Fix: About Our Company Two-Column Block (Equal Height on Desktop) */}
      <section className="about bg-white" style={{ padding: '45px 0 70px' }}>
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-title">
              <h2>About Our Company</h2>
            </div>
          </ScrollReveal>

          <div className="about-grid">
            <ScrollReveal animation="fade-right">
              <div className="about-img-wrap">
                <img src="/features.png" alt="About The Jobsync" className="about-img" />
                <div className="about-img-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '2px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Dubai • Chennai
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-left">
              <div className="about-content">
                <span className="about-tag">About The JobSync</span>
                <h3>IT Consulting & Services</h3>
                <div className="about-highlight">
                  The JobSync is a global IT consulting and technology services company committed to helping organizations accelerate digital transformation, optimize business operations, and achieve sustainable growth through innovative technology solutions.
                </div>
                <p>We partner with startups, SMEs, and large enterprises to deliver strategic consulting, custom software development, cloud solutions, cybersecurity, managed IT services, enterprise applications, AI-driven innovation, and IT staffing. Our experienced consultants and technology specialists provide end-to-end solutions that improve operational efficiency, reduce costs, enhance security, and enable business scalability.</p>
                <p>Our customer-centric approach, industry expertise, and commitment to quality make The JobSync a trusted technology partner for organizations across multiple industries worldwide.</p>
                <div className="about-bottom"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2a. Mission and Vision (Enhanced Executive Design with Credibility Ribbon) */}
      {(hasMission || hasVision) && (
        <section className="mission-vision-section">
          <div className="container">
            <ScrollReveal animation="fade-up">
              <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
                <span className="about-header-pill">PURPOSE &amp; DIRECTION</span>
                <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '14px' }}>
                  Our Mission &amp; Vision
                </h2>
                <p style={{ color: '#475569', fontSize: '16.5px', lineHeight: 1.65 }}>
                  The practical commitment driving our IT consulting, software engineering, and premier talent placement across Dubai and Chennai.
                </p>
              </div>
            </ScrollReveal>

            <div className="mission-vision-grid" style={{ gridTemplateColumns: hasMission && hasVision ? '1fr 1fr' : '1fr' }}>
              {hasMission && (
                <ScrollReveal animation="fade-up" delay={50}>
                  <div className="mission-card-modern">
                    <div className="mission-card-top">
                      <span className="mission-num-badge">01 • OUR MISSION</span>
                      <span className="mission-status-tag">ACTIVE COMMITMENT</span>
                    </div>
                    <h3 className="mission-card-title">Delivering Practical IT &amp; Scalable Talent</h3>
                    <p className="mission-card-lead">
                      "{ABOUT_CONTENT.mission}"
                    </p>
                    <ul className="mission-pillars-list">
                      <li className="mission-pillar-item">
                        <span className="mission-pillar-bullet">✓</span>
                        <span><strong>Business-Aligned Tech:</strong> Tailoring cloud, software, and systems to real commercial goals.</span>
                      </li>
                      <li className="mission-pillar-item">
                        <span className="mission-pillar-bullet">✓</span>
                        <span><strong>Verified Engineering Talent:</strong> Connecting enterprises with vetted developers and specialists.</span>
                      </li>
                      <li className="mission-pillar-item">
                        <span className="mission-pillar-bullet">✓</span>
                        <span><strong>Long-Term Delivery:</strong> Maintaining high standards from architecture through post-launch support.</span>
                      </li>
                    </ul>
                    <div className="mission-card-footer">
                      <span>OPERATIONAL SCOPE</span>
                      <span style={{ color: '#0f766e', fontWeight: 800 }}>UAE • India • Global</span>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {hasVision && (
                <ScrollReveal animation="fade-up" delay={150}>
                  <div className="mission-card-modern vision-card">
                    <div className="mission-card-top">
                      <span className="mission-num-badge">02 • OUR VISION</span>
                      <span className="mission-status-tag">LONG-TERM HORIZON</span>
                    </div>
                    <h3 className="mission-card-title">The Globally Trusted Technology Partner</h3>
                    <p className="mission-card-lead">
                      "{ABOUT_CONTENT.vision}"
                    </p>
                    <ul className="mission-pillars-list">
                      <li className="mission-pillar-item">
                        <span className="mission-pillar-bullet">★</span>
                        <span><strong>Cross-Border Bridges:</strong> Connecting talent and enterprises between the Middle East and South Asia.</span>
                      </li>
                      <li className="mission-pillar-item">
                        <span className="mission-pillar-bullet">★</span>
                        <span><strong>Relationship Over Transaction:</strong> Fostering high-retention client trust and career growth.</span>
                      </li>
                      <li className="mission-pillar-item">
                        <span className="mission-pillar-bullet">★</span>
                        <span><strong>Sustainable Innovation:</strong> Thoughtfully adopting AI, cloud, and security frameworks built to scale.</span>
                      </li>
                    </ul>
                    <div className="mission-card-footer">
                      <span>STRATEGIC HUBS</span>
                      <span style={{ color: '#2563eb', fontWeight: 800 }}>Dubai Creek Tower &amp; Chennai</span>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Credibility Impact Ribbon */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="about-cred-ribbon">
                <div className="about-cred-item">
                  <span className="about-cred-num">2</span>
                  <span className="about-cred-label">Global Tech Hubs</span>
                  <span className="about-cred-sub">Dubai Creek Tower &amp; Chennai</span>
                </div>
                <div className="about-cred-item">
                  <span className="about-cred-num">100%</span>
                  <span className="about-cred-label">Vetted IT Talent</span>
                  <span className="about-cred-sub">Engineers &amp; Consultants</span>
                </div>
                <div className="about-cred-item">
                  <span className="about-cred-num">Full</span>
                  <span className="about-cred-label">Lifecycle Ownership</span>
                  <span className="about-cred-sub">From Strategy to Support</span>
                </div>
                <div className="about-cred-item">
                  <span className="about-cred-num">Direct</span>
                  <span className="about-cred-label">Transparent Delivery</span>
                  <span className="about-cred-sub">Honest Consulting &amp; No Fluff</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 2b. Core Values (Modern Human-Crafted Grid) */}
      {activeValues.length > 0 && (
        <section className="values-section-modern">
          <div className="container">
            <ScrollReveal animation="fade-up">
              <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 20px' }}>
                <span className="about-header-pill">OUR CULTURE &amp; CODE</span>
                <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '12px' }}>
                  Our Core Values
                </h2>
                <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6 }}>
                  The practical standards that guide every consulting engagement, candidate placement, and line of code we ship.
                </p>
              </div>
            </ScrollReveal>

            <div className="values-grid-modern">
              {activeValues.map((val, idx) => {
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <ScrollReveal key={idx} animation="fade-up" delay={idx * 70}>
                    <div className="value-card-modern">
                      <div className="value-card-top">
                        <span className="value-card-num">{numStr}</span>
                        <span className="value-tag-pill">PRINCIPLE</span>
                      </div>
                      <h3>{val.title}</h3>
                      <p>{val.text}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 2c. What We Do (Three Pillar Cards reusing wording already on the site) */}
      <section className="about-sub-section bg-soft">
        <div className="about-divider-curve top">
          <svg viewBox="0 0 1440 30" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C480,24 960,24 1440,0 L1440,30 L0,30 Z" fill="#f4f9fb" />
          </svg>
        </div>
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="about-sub-header">
              <h2>What We Do</h2>
              <p>Reinventing how modern enterprises build software, optimize infrastructure, and secure high-caliber tech talent.</p>
            </div>
          </ScrollReveal>

          <div className="pillars-grid">
            {/* Pillar 1: IT Consulting */}
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="about-card-lift pillar-card">
                <div className="about-icon-tile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3>IT Consulting & Services</h3>
                <p>We help startups, SMEs, and large enterprises plan and build technology that fits their business. Our services cover consulting, custom software, cloud, cybersecurity, managed IT, and enterprise applications.</p>
                <ul className="pillar-checklist">
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Custom Software Development</span>
                  </li>
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Cloud Solution & Migration</span>
                  </li>
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Cybersecurity & Managed IT</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Pillar 2: IT Staffing */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="about-card-lift pillar-card">
                <div className="about-icon-tile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <h3>IT Staffing & Recruitment</h3>
                <p>We connect businesses with skilled engineers, technical leads, and IT specialists through contract, permanent, and dedicated-team hiring. We also help professionals find the right opportunities with leading employers.</p>
                <ul className="pillar-checklist">
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Specialized Talent Augmentation</span>
                  </li>
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Dedicated Development Teams</span>
                  </li>
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Technical Resource Augmentation</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Pillar 3: Global Presence */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="about-card-lift pillar-card">
                <div className="about-icon-tile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3>Global Presence</h3>
                <p>With offices in Dubai (UAE) and Chennai (India), we support clients and candidates across India, the UAE, Singapore, and other international markets, keeping communication clear and projects moving.</p>
                <ul className="pillar-checklist">
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Dubai Office, UAE</span>
                  </li>
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Chennai Office, India</span>
                  </li>
                  <li>
                    <svg className="pillar-check-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Cross-Border Project Delivery</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2d. Why Choose Us (Checklist built only from claims in existing About text) */}
      <section className="about-sub-section bg-white">
        <div className="about-divider-curve top">
          <svg viewBox="0 0 1440 30" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C480,24 960,24 1440,0 L1440,30 L0,30 Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="about-sub-header">
              <h2>Why Choose The JobSync</h2>
              <p>Built upon proven engineering capabilities, trusted technology partnerships, and measurable business outcomes.</p>
            </div>
          </ScrollReveal>

          <div className="why-choose-grid">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="about-card-lift why-choose-card">
                <div className="why-choose-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="why-choose-info">
                  <h3>End-to-End Solutions</h3>
                  <p>Comprehensive capabilities spanning strategic consulting, custom development, cloud deployment, enterprise applications, and ongoing managed IT services.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={60}>
              <div className="about-card-lift why-choose-card">
                <div className="why-choose-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="why-choose-info">
                  <h3>Improved Operational Efficiency</h3>
                  <p>Optimizing enterprise workflows and technology infrastructure so your organization operates with maximum speed, agility, and accuracy.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120}>
              <div className="about-card-lift why-choose-card">
                <div className="why-choose-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="why-choose-info">
                  <h3>Reduced Costs</h3>
                  <p>Scalable software architectures and strategic resource planning that minimize infrastructure overhead and optimize total cost of ownership.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={180}>
              <div className="about-card-lift why-choose-card">
                <div className="why-choose-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="why-choose-info">
                  <h3>Enhanced Security</h3>
                  <p>Proactive cybersecurity practices, robust compliance standards, and continuous protection safeguarding critical organizational assets and data.</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={240}>
              <div className="about-card-lift why-choose-card">
                <div className="why-choose-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="why-choose-info">
                  <h3>Business Scalability</h3>
                  <p>Flexible cloud-native architectures and on-demand tech staffing tailored to scale smoothly as your customer base and operations expand.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2e. The FounderSection (About page only) */}
      <FounderSection />

      {/* 2f. Offices Block (Dubai and Chennai reusing existing addresses and phone numbers) */}
      <section className="about-sub-section bg-white">
        <div className="about-divider-curve top">
          <svg viewBox="0 0 1440 30" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C480,24 960,24 1440,0 L1440,30 L0,30 Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="about-sub-header">
              <h2>Our Global Offices</h2>
              <p>Connect with our teams in the United Arab Emirates and India to discuss your IT requirements or career growth.</p>
            </div>
          </ScrollReveal>

          <div className="offices-grid">
            {/* Dubai Office */}
            <ScrollReveal animation="fade-right">
              <div className="about-card-lift office-card">
                <div className="office-header">
                  <div className="about-icon-tile" style={{ marginBottom: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3>Dubai Office</h3>
                    <span style={{ fontSize: '13px', color: '#0f766e', fontWeight: 600 }}>Middle East Operations</span>
                  </div>
                </div>
                <div className="office-details">
                  <div className="office-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>Dubai Creek Tower - 1st St - Deira-Riggat Al Buteen</span>
                  </div>
                  <div className="office-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <a href="tel:+971547405625" style={{ color: 'inherit', textDecoration: 'none' }}>+971 54 740 5625</a>
                  </div>
                  <div className="office-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <a href="mailto:anithaekambaram@thejobsync.com" style={{ color: 'inherit', textDecoration: 'none' }}>anithaekambaram@thejobsync.com</a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Chennai Office */}
            <ScrollReveal animation="fade-left">
              <div className="about-card-lift office-card">
                <div className="office-header">
                  <div className="about-icon-tile" style={{ marginBottom: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3>India Office</h3>
                    <span style={{ fontSize: '13px', color: '#0f766e', fontWeight: 600 }}>Delivery & Engineering Hub</span>
                  </div>
                </div>
                <div className="office-details">
                  <div className="office-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>Tamilnadu, Chennai</span>
                  </div>
                  <div className="office-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <a href="tel:+919789569391" style={{ color: 'inherit', textDecoration: 'none' }}>+91 9789569391</a>
                  </div>
                  <div className="office-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <a href="mailto:anithaekambaram@thejobsync.com" style={{ color: 'inherit', textDecoration: 'none' }}>anithaekambaram@thejobsync.com</a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2g. Call-to-Action Strip: "Talk to Us" (Contact) and "Find a Job" (Careers) */}
      <section className="about-cta-strip">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="about-cta-content">
              <h2>Ready to Elevate Your Technology or Career?</h2>
              <p>Connect with our expert technology consultants in Dubai and Chennai to discuss enterprise solutions, or explore current career opportunities with The JobSync.</p>
              <div className="about-cta-buttons">
                <button
                  type="button"
                  className="about-cta-btn-primary"
                  onClick={() => { setActiveTab('contact'); window.scrollTo(0, 0); }}
                >
                  Talk to Us
                </button>
                <button
                  type="button"
                  className="about-cta-btn-secondary"
                  onClick={() => { setActiveTab('careers'); window.scrollTo(0, 0); }}
                >
                  Find a Job
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

const SERVICES_DATA = [
  
  {
    title: "Software Development",
    items: [
      "Custom Software Development",
      "Web Application Development",
      "Mobile App Development (Android & iOS)",
      "Enterprise Application Development",
      "SaaS Product Development",
      "E-commerce Development",
      "API Development & Integration",
      "Software Maintenance & Support",
      "Legacy System Modernization",
      "Low-Code/No-Code Development"
    ]
  },
  {
    title: "Cloud Services",
    items: [
      "Cloud Migration",
      "Cloud Infrastructure Management",
      "AWS Consulting & Support",
      "Microsoft Azure Services",
      "Google Cloud Platform (GCP) Services",
      "Cloud Security",
      "Cloud Backup & Disaster Recovery",
      "DevOps & CI/CD Implementation"
    ]
  },
  {
    title: "Cybersecurity Services",
    items: [
      "Information Security Consulting",
      "Vulnerability Assessment",
      "Penetration Testing",
      "Managed Security Services",
      "Network Security Solutions",
      "Endpoint Security",
      "Identity & Access Management",
      "Security Audits & Compliance (ISO 27001)"
    ]
  },
  {
    title: "Data & AI Services",
    items: [
      "Data Warehousing Solutions",
      "Big Data Analytics",
      "Business Intelligence Reporting",
      "Machine Learning Models",
      "Predictive Analytics",
      "Natural Language Processing (NLP)",
      "Computer Vision Solutions"
    ]
  },
  {
    title: "IT Infrastructure",
    items: [
      "Network Design & Implementation",
      "Server Virtualization",
      "Storage Solutions",
      "Data Center Management",
      "IT Asset Management",
      "Helpdesk & Technical Support"
    ]
  },
  {
    title: "IT Strategy Consulting",
    items: [
      "Digital Transformation Consulting",
      "Business Process Consulting",
      "Technology Advisory Services",
      "Enterprise Architecture Consulting",
      "IT Infrastructure Consulting",
      "Cloud Strategy Consulting",
      "Cybersecurity Consulting",
      "Data Analytics & BI Consulting",
      "AI & Machine Learning Consulting",
      "ERP Consulting (SAP, Oracle, Dynamics)",
      "CRM Consulting (Salesforce, Zoho, HubSpot)",
      "Project Management Consulting",
      "IT Governance & Compliance",
      "Disaster Recovery & Business Continuity"
    ]
  },
  {
    title: "Enterprise Applications",
    items: [
      "ERP Implementation & Customization",
      "CRM Implementation",
      "HRMS Solutions",
      "Supply Chain Management Solutions",
      "Application Modernization",
      "Application Support & Maintenance"
    ]
  },
  {
    title: "Digital Marketing",
    items: [
      "Search Engine Optimization (SEO)",
      "Search Engine Marketing (SEM)",
      "Social Media Marketing (SMM)",
      "Content Marketing & Strategy",
      "Email Marketing Campaigns",
      "Digital Analytics & Reporting"
    ]
  },
  {
    title: "Emerging Technology",
    items: [
      "Internet of Things (IoT)",
      "Blockchain Development",
      "AR/VR Solutions",
      "Digital Twin Solutions",
      "Edge Computing",
      "Smart Automation Solutions"
    ]
  },
  {
    title: "IT Staffing",
    items: [
      "IT Recruitment Services",
      "Contract Staffing",
      "Permanent Staffing",
      "Dedicated Development Teams",
      "Offshore Development Center (ODC)",
      "Technical Resource Augmentation"
    ]
  },
  {
    title: "Training & Support",
    items: [
      "Corporate IT Training",
      "Technical Certification Training",
      "User Training",
      "Software Implementation Training",
      "Technical Documentation",
      "Annual Maintenance Contracts (AMC)"
    ]
  }
];

const ServicesPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const handleServiceClick = (serviceTitle: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/contact?service=${encodeURIComponent(serviceTitle)}`);
    }
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="services-page">
      {/* Hero Header - Merged seamlessly with the page */}
      <div
        className="contact-hero services-hero-merged"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '70px 0 90px',
          borderBottom: 'none',
          background: 'radial-gradient(circle at 50% 20%, rgba(43, 182, 180, 0.15) 0%, transparent 60%), linear-gradient(135deg, #071224 0%, #0b1a30 50%, #102442 100%)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span
            style={{
              background: 'rgba(43, 182, 180, 0.16)',
              color: '#2bb6b4',
              padding: '6px 20px',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '16px',
              border: '1px solid rgba(43, 182, 180, 0.35)'
            }}
          >
            WHAT WE OFFER
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Our <span style={{ background: 'linear-gradient(135deg, #2bb6b4 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Services</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: 1.6 }}>
            Comprehensive technology consulting, enterprise software engineering, and strategic IT solutions tailored to your business.
          </p>
        </div>

        {/* Seamless Wave Divider Merging into the section below */}
        <div
          className="hero-wave-divider"
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            lineHeight: 0,
            pointerEvents: 'none',
            zIndex: 3
          }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: 'relative',
              display: 'block',
              width: 'calc(100% + 1.3px)',
              height: '52px',
              fill: 'var(--pastel-bg, #edf7f8)'
            }}
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      <section className="services" style={{ padding: '45px 0 80px' }}>
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 45px' }}>
              <span
                style={{
                  background: 'rgba(43, 182, 180, 0.12)',
                  color: '#0f766e',
                  padding: '6px 18px',
                  borderRadius: '30px',
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '14px',
                  border: '1px solid rgba(43, 182, 180, 0.3)'
                }}
              >
                END-TO-END CAPABILITIES
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '14px' }}>
                Comprehensive IT Solutions
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6 }}>
                Explore our full spectrum of technology consulting, custom software engineering, cloud architectures, and dedicated tech talent to accelerate your digital transformation.
              </p>
            </div>
          </ScrollReveal>

          <div className="services-grid">
            {SERVICES_DATA.map((service, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={(index % 3) * 80}>
                <div
                  className="service-item"
                  onClick={() => handleServiceClick(service.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleServiceClick(service.title); }}
                  title={`Click to inquire about ${service.title}`}
                >
                  <h3>{service.title}</h3>

                  <div className="service-list-wrap">
                    <ul className="service-list">
                      {service.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-card-cta">
                    <span>CONTACT US &rarr;</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* Hero Section: Soft Skyline with Cinematic Blur and Subtle Dark Gradient */
const InteractiveNetworkHero = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <section
      className="hero hero-skyline-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '620px',
        backgroundColor: '#0b172a',
        display: 'flex',
        alignItems: 'center'
      }}
      role="presentation"
    >
      {/* 1. Subtle Faded Background Image Layer (clear skyline faded into dark theme) */}
      <div
        className="hero-bg-layer"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/hero-skyline.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.72,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 2. Subtle Dark Gradient Overlay (soft contrast behind text, highly transparent across image) */}
      <div
        className="hero-gradient-overlay"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(8, 19, 36, 0.58) 0%, rgba(11, 25, 46, 0.42) 38%, rgba(15, 33, 60, 0.16) 72%, rgba(11, 23, 42, 0.04) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* 3. Existing Hero Content Sitting Directly Over Image (NO card, NO box, NO border) */}
      <div className="container" style={{ position: 'relative', zIndex: 3, padding: '85px 20px 105px', width: '100%' }}>
        <div className="hero-content">
          <h1>Looking for first class IT solutions?</h1>
          <p>With over 10 years of experience helping businesses to find comprehensive technological solutions and strategic IT consulting.</p>
          <div className="hero-buttons">
            <button className="btn-outline" onClick={() => { setActiveTab('about'); window.scrollTo(0, 0); }}>OUR COMPANY</button>
            <button className="btn-solid" onClick={() => { setActiveTab('contact'); window.scrollTo(0, 0); }}>CONTACT US</button>
          </div>
        </div>
      </div>

      {/* 4. Wave divider fading into next section */}
      <div
        className="hero-wave-divider"
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0,
          zIndex: 4,
          pointerEvents: 'none'
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: 'relative',
            display: 'block',
            width: 'calc(100% + 1.3px)',
            height: '56px',
            fill: 'var(--pastel-bg, #edf7f8)'
          }}
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

const getTabFromLocation = (): string => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase().replace(/^#/, '');

  if (path === '/admin' || hash === 'admin') return 'admin';
  if (path === '/blog' || path === '/blogs' || hash === 'blog' || hash === 'blogs') return 'blog';
  if (path === '/testimonials' || hash === 'testimonials') return 'testimonials';
  if (path === '/careers' || hash === 'careers') return 'careers';
  if (path === '/services' || hash === 'services') return 'services';
  if (path === '/about' || hash === 'about' || path === '/founder' || hash === 'founder') return 'about';
  if (path === '/contact' || hash === 'contact') return 'contact';

  return 'home';
};

function App() {
  const [activeTab, setActiveTab] = useState(getTabFromLocation);

  useEffect(() => {
    const checkPath = () => {
      const tab = getTabFromLocation();
      setActiveTab(tab);

      if (window.location.pathname.includes('/founder') || window.location.hash.includes('founder')) {
        setTimeout(() => {
          const el = document.getElementById('founder');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    window.addEventListener('hashchange', checkPath);
    return () => {
      window.removeEventListener('popstate', checkPath);
      window.removeEventListener('hashchange', checkPath);
    };
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleHomeServiceClick = (serviceTitle: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/contact?service=${encodeURIComponent(serviceTitle)}`);
    }
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: (formData.get('name') as string || '').trim(),
      email: (formData.get('email') as string || '').trim(),
      phone: (formData.get('phone') as string || '').trim(),
      message: (formData.get('message') as string || '').trim(),
    };

    try {
      const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'a7cd1aa3-f5a4-4f75-8c7d-0e6d032a3a13';
      if (web3Key) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `Website Inquiry from ${data.name}`,
            from_name: 'The JobSync Website',
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
          }),
        }).catch((err) => console.warn('Web3Forms dispatch note:', err));
      }

      const apiUrl = import.meta.env.VITE_API_BASE_URL !== undefined ? import.meta.env.VITE_API_BASE_URL : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '');
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && (result.success || response.status === 200)) {
        setSuccessMsg(result.message || "Thank you! Your inquiry has been submitted successfully to hr@thejobsyn.com.");
        form.reset();

        // Cache inquiry locally so Admin Dashboard reflects it immediately
        try {
          const localEntry = {
            id: `inq_${Date.now()}`,
            name: data.name,
            email: data.email,
            phone: data.phone || 'N/A',
            message: data.message,
            date: new Date().toLocaleString(),
            status: 'New',
          };
          const prev = JSON.parse(localStorage.getItem('jobsync_inquiries_data') || '[]');
          localStorage.setItem('jobsync_inquiries_data', JSON.stringify([localEntry, ...prev]));
        } catch (_) {}
      } else {
        setErrorMsg(result.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Network error: Unable to connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    const path = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  if (activeTab === 'admin') {
    return <AdminPage onExit={() => { setActiveTab('home'); window.history.pushState(null, '', '/'); }} />;
  }

  return (
    <div className="app-container">


      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
            <img src="/jobsync-logo.png" alt="The Jobsync Logo" width="45" height="45" className="logo-img" style={{ marginRight: '10px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="logo-text">The Jobsync</span>
              <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '1px' }}>IT CONSULTING & SERVICES</span>
            </div>
          </div>

          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>

          <div className={`nav-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <nav className="nav">
              <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} style={{ color: activeTab === 'home' ? 'var(--primary-cyan)' : '' }}>HOME</a>
              <a href="/about" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} style={{ color: activeTab === 'about' ? 'var(--primary-cyan)' : '' }}>ABOUT US</a>
              <a href="/services" onClick={(e) => { e.preventDefault(); handleNavClick('services'); }} style={{ color: activeTab === 'services' ? 'var(--primary-cyan)' : '' }}>SERVICES</a>
              <a href="/testimonials" onClick={(e) => { e.preventDefault(); handleNavClick('testimonials'); }} style={{ color: activeTab === 'testimonials' ? 'var(--primary-cyan)' : '' }}>TESTIMONIALS</a>
              <a href="/blog" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} style={{ color: activeTab === 'blog' ? 'var(--primary-cyan)' : '' }}>BLOG</a>
              <a href="/careers" onClick={(e) => { e.preventDefault(); handleNavClick('careers'); }} style={{ color: activeTab === 'careers' ? 'var(--primary-cyan)' : '' }}>CAREERS</a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} style={{ color: activeTab === 'contact' ? 'var(--primary-cyan)' : '' }}>CONTACT US</a>
            </nav>
          </div>
        </div>
      </header>

      {activeTab !== 'contact' && activeTab !== 'careers' && activeTab !== 'about' && activeTab !== 'services' && activeTab !== 'testimonials' && activeTab !== 'blog' && (
        <>
          {/* Interactive Network Hero Section */}
          <InteractiveNetworkHero setActiveTab={setActiveTab} />

          {/* Welcome Section */}
          <section className="welcome">
            <div className="container">
              <ScrollReveal animation="fade-up">
                <div className="section-title">
                  <h2>Welcome to The Jobsync</h2>
                  <p><strong>Transforming Businesses Through Innovation, Technology & Talent.</strong> The JobSync is a leading IT Consulting and Technology Services company delivering innovative digital solutions that empower businesses to thrive in a rapidly evolving world. Innovate. Transform. Grow.</p>
                </div>
              </ScrollReveal>

              <div className="welcome-grid">
                <ScrollReveal animation="fade-up" delay={0}>
                  <div className="welcome-card" onClick={() => { setActiveTab('services'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>
                    <div className="welcome-card-img-wrapper">
                      <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&auto=format&fit=crop&q=90" alt="Software Engineering" className="welcome-card-img" />
                      <div className="welcome-card-overlay">
                        <span className="welcome-badge">  SOFTWARE ENGINEERING</span>
                      </div>
                    </div>
                    <div className="welcome-card-content">
                      <div>
                        <h3>Custom Software</h3>
                        <p>We build scalable enterprise applications tailored to your business needs, ensuring high performance and security.</p>
                      </div>
                      <span className="welcome-action-btn">Explore Solutions &rarr;</span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                  <div className="welcome-card" onClick={() => { setActiveTab('services'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>
                    <div className="welcome-card-img-wrapper">
                      <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=90" alt="Cloud Infrastructure" className="welcome-card-img" />
                      <div className="welcome-card-overlay">
                        <span className="welcome-badge">  CLOUD ARCHITECTURE</span>
                      </div>
                    </div>
                    <div className="welcome-card-content">
                      <div>
                        <h3>Cloud Infrastructure</h3>
                        <p>Launch your multi-cloud infrastructure seamlessly with automated DevOps and enterprise cloud deployment.</p>
                      </div>
                      <span className="welcome-action-btn">Explore Solutions &rarr;</span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={200}>
                  <div className="welcome-card" onClick={() => { setActiveTab('services'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>
                    <div className="welcome-card-img-wrapper">
                      <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=90" alt="Cybersecurity SOC" className="welcome-card-img" />
                      <div className="welcome-card-overlay">
                        <span className="welcome-badge">  CYBERSECURITY & SOC</span>
                      </div>
                    </div>
                    <div className="welcome-card-content">
                      <div>
                        <h3>Cybersecurity</h3>
                        <p>Protect your critical infrastructure with 24/7 SOC monitoring, zero-trust protocols, and threat intelligence.</p>
                      </div>
                      <span className="welcome-action-btn">Explore Solutions &rarr;</span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={0}>
                  <div className="welcome-card" onClick={() => { setActiveTab('services'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>
                    <div className="welcome-card-img-wrapper">
                      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=90" alt="Data Analytics & AI" className="welcome-card-img" />
                      <div className="welcome-card-overlay">
                        <span className="welcome-badge">  DATA & AI SYSTEMS</span>
                      </div>
                    </div>
                    <div className="welcome-card-content">
                      <div>
                        <h3>Data Analytics & AI</h3>
                        <p>Unlock actionable business intelligence and automate enterprise workflows with generative AI and machine learning.</p>
                      </div>
                      <span className="welcome-action-btn">Explore Solutions &rarr;</span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                  <div className="welcome-card" onClick={() => { setActiveTab('services'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>
                    <div className="welcome-card-img-wrapper">
                      <img src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=1000&auto=format&fit=crop&q=90" alt="Enterprise Systems" className="welcome-card-img" />
                      <div className="welcome-card-overlay">
                        <span className="welcome-badge">  ENTERPRISE SYSTEMS</span>
                      </div>
                    </div>
                    <div className="welcome-card-content">
                      <div>
                        <h3>Enterprise Solutions</h3>
                        <p>Streamline core business operations with custom ERP, CRM, and supply chain management integrations.</p>
                      </div>
                      <span className="welcome-action-btn">Explore Solutions &rarr;</span>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={200}>
                  <div className="welcome-card" onClick={() => { setActiveTab('services'); window.scrollTo(0, 0); }} style={{ cursor: 'pointer' }}>
                    <div className="welcome-card-img-wrapper">
                      <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&auto=format&fit=crop&q=90" alt="IT Talent Augmentation" className="welcome-card-img" />
                      <div className="welcome-card-overlay">
                        <span className="welcome-badge">  TALENT AUGMENTATION</span>
                      </div>
                    </div>
                    <div className="welcome-card-content">
                      <div>
                        <h3>IT Staffing</h3>
                        <p>Accelerate project delivery with vetted top-tier engineers, tech leads, and specialized IT consultants.</p>
                      </div>
                      <span className="welcome-action-btn">Explore Solutions &rarr;</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
          {/* About Our Company Section */}
          <section className="about" id="about">
            <div className="container">
              <ScrollReveal animation="fade-up">
                <div className="section-title">
                  <h2>About Our Company</h2>
                </div>
              </ScrollReveal>

              <div className="about-grid">
                <ScrollReveal animation="fade-right">
                  <div className="about-img-wrap">
                    <img src="/features.png" alt="About The Jobsync" className="about-img" />
                    <div className="about-img-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '2px' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Dubai • Chennai
                    </div>
                  </div>
                </ScrollReveal>
                <ScrollReveal animation="fade-left">
                  <div className="about-content">
                    <span className="about-tag">About The JobSync</span>
                    <h3>Where Technology Meets Talent</h3>
                    <div className="about-highlight">
                      The Jobsync is a global IT consulting and staffing company. We help organizations choose the right technology and build the right teams, from our offices in Dubai and Chennai.
                    </div>
                    <p>Whether you are a startup, a growing business, or a large enterprise, we bring together technical expertise and recruitment experience under one roof. </p>
                    <p>From cloud and cybersecurity to custom software and dedicated teams, we focus on solutions that fit your goals and your budget. </p>

                    <div className="about-bottom">
                      <button className="btn-solid" style={{ padding: '10px 25px' }} onClick={(e) => { e.preventDefault(); setActiveTab('about'); window.scrollTo(0, 0); }}>READ MORE</button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="services" id="services" style={{ padding: '60px 0 85px' }}>
            <div className="container">
              <ScrollReveal animation="fade-up">
                <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 45px' }}>
                  <span
                    style={{
                      background: 'rgba(43, 182, 180, 0.12)',
                      color: '#0f766e',
                      padding: '6px 18px',
                      borderRadius: '30px',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      display: 'inline-block',
                      marginBottom: '14px',
                      border: '1px solid rgba(43, 182, 180, 0.3)'
                    }}
                  >
                    OUR CAPABILITIES
                  </span>
                  <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '14px' }}>
                    Our Services
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6 }}>
                    From strategic IT consulting to enterprise cloud transformations, discover how we empower organizations to innovate and scale.
                  </p>
                </div>
              </ScrollReveal>

              <div className="services-grid">
                {SERVICES_DATA.map((service, index) => (
                  <ScrollReveal key={index} animation="fade-up" delay={(index % 3) * 80}>
                    <div
                      className="service-item"
                      onClick={() => handleHomeServiceClick(service.title)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHomeServiceClick(service.title); }}
                      title={`Click to inquire about ${service.title}`}
                    >
                      <h3>{service.title}</h3>

                      <div className="service-list-wrap">
                        <ul className="service-list">
                          {service.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="service-card-cta">
                        <span>CONTACT US &rarr;</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="contact" id="contact">
            <div className="container">
              <div className="contact-grid">
                <ScrollReveal animation="fade-right">
                  <div className="contact-info">
                    <span className="contact-subtitle">GET IN TOUCH</span>
                    <h2>Connect with Our Team</h2>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <h3>Dubai Office</h3>
                        <p>Dubai Creek Tower - 1st St - Deira-Riggat Al Buteen<br />+971 54 740 5625</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <h3>India Office</h3>
                        <p> Tamilnadu, Chennai<br />+91 9789569391</p>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      </div>
                      <div>
                        <h3>Mail Id</h3>
                        <p>hr@thejobsyn.com</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-left">
                  <div className="contact-form">
                    <form onSubmit={handleContactSubmit}>
                      {successMsg && <div style={{ color: '#4caf50', marginBottom: '15px', fontWeight: '500' }}>{successMsg}</div>}
                      {errorMsg && <div style={{ color: '#f44336', marginBottom: '15px', fontWeight: '500' }}>{errorMsg}</div>}
                      <div className="form-row">
                        <input type="text" name="name" placeholder="Full Name" required />
                      </div>
                      <div className="form-row">
                        <input type="email" name="email" placeholder="Email*" required />
                        <input type="tel" name="phone" placeholder="Phone Number" />
                      </div>
                      <div className="form-row">
                        <textarea name="message" placeholder="Tell us about your IT requirements or business goals *" required rows={4}></textarea>
                      </div>
                      <div className="form-checkbox">
                        <input type="checkbox" id="terms_home" required />
                        <label htmlFor="terms_home">I accept your Terms & Conditions</label>
                      </div>
                      <button type="submit" className="btn-solid" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                        {isLoading ? (
                          <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '8px', verticalAlign: 'middle' }}></span>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        )}
                        {isLoading ? 'Sending...' : 'Submit Inquiry'}
                      </button>
                    </form>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
          {/* Testimonials Section on Home Page */}
          <TestimonialsSection setActiveTab={setActiveTab} />
          {/* Blog Section on Home Page */}
          <BlogSection setActiveTab={setActiveTab} />
        </>
      )}

      {activeTab === 'contact' && <ContactPage setActiveTab={setActiveTab} />}
      {activeTab === 'careers' && <CareersPage setActiveTab={setActiveTab} />}
      {activeTab === 'about' && <AboutPage setActiveTab={setActiveTab} />}
      {activeTab === 'services' && <ServicesPage setActiveTab={setActiveTab} />}
      {activeTab === 'testimonials' && <TestimonialsPage setActiveTab={setActiveTab} />}
      {activeTab === 'blog' && <BlogPage setActiveTab={setActiveTab} />}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="logo" style={{ marginBottom: '20px' }}>
                <img src="/jobsync-logo.png" alt="The Jobsync Logo" width="45" height="45" className="logo-img" style={{ marginRight: '10px', objectFit: 'contain' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="logo-text" style={{ color: 'white' }}>The Jobsync</span>
                  <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '1px' }}>IT CONSULTING & SERVICES</span>
                </div>
              </div>
              <p>At The Jobsync, we specialize in providing expert IT Consulting and technological solutions. Our goal is to help businesses grow and professionals achieve their IT career aspirations efficiently.</p>
              <div className="footer-social">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="https://www.instagram.com/thejobsyncit/?hl=en" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></a>
                <a href="https://www.linkedin.com/company/thejobsync/about/" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                <a href="https://www.youtube.com/@thejobsync-it" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,5.493C21.346,4.618 20.654,3.927 19.779,3.691C18.172,3.262 12,3.262 12,3.262C12,3.262 5.828,3.262 4.221,3.691C3.346,3.927 2.654,4.618 2.418,5.493C1.989,7.1 1.989,12 1.989,12C1.989,12 1.989,16.9 2.418,18.507C2.654,19.382 3.346,20.073 4.221,20.309C5.828,20.738 12,20.738 12,20.738C12,20.738 18.172,20.738 19.779,20.309C20.654,20.073 21.346,19.382 21.582,18.507C22.011,16.9 22.011,12 22.011,12C22.011,12 22.011,7.1 21.582,5.493ZM10.024,15.701L10.024,8.299L15.356,12L10.024,15.701Z"></path></svg></a>
              </div>
            </div>

            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#" className={activeTab === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo(0, 0); }}>Home</a></li>
                <li><a href="#" className={activeTab === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('about'); window.scrollTo(0, 0); }}>About Us</a></li>
                <li><a href="#" className={activeTab === 'services' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('services'); window.scrollTo(0, 0); }}>Our Services</a></li>
                <li><a href="#" className={activeTab === 'testimonials' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('testimonials'); window.scrollTo(0, 0); }}>Testimonials</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); window.scrollTo(0, 0); }}>Contact Us</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Our Services</h3>
              <ul className="footer-links">
                <li><a href="#">Cloud Infrastructure</a></li>
                <li><a href="#">Cybersecurity</a></li>
                <li><a href="#">Digital Transformation</a></li>
                <li><a href="#">Custom Software</a></li>
                <li><a href="#">IT Support</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Contact Info</h3>
              <ul className="footer-contact">
                <li style={{marginBottom: '5px'}}>
                  <strong style={{color: 'white'}}>Dubai Office</strong>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Dubai Creek Tower - 1st St - Dubai
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  +971 54 740 5625
                </li>
                
                <li style={{marginTop: '15px', marginBottom: '5px'}}>
                  <strong style={{color: 'white'}}>India Office</strong>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Tamilnadu, Chennai
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  +91 9789569391
                </li>
                
                <li style={{marginTop: '15px'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  hr@thejobsyn.com
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p>&copy; Copyright 2026 The Jobsync. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
