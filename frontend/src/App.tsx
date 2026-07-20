import { useState } from 'react';
import './index.css';

const ContactPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMsg(result.message || "Thank you! Your inquiry has been submitted successfully.");
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMsg(result.error || "Failed to send email. Please try again later.");
      }
    } catch (error) {
      setErrorMsg("Failed to send email. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <div className="breadcrumb">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} style={{ color: 'white', textDecoration: 'none' }}>Home</a>
            <span className="separator">&gt;</span>
            <span>Contact</span>
          </div>
        </div>
      </div>

      <div className="contact-page-body container">
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
              <p>hr@thejobsync.com</p>
            </div>
          </div>
        </div>

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
              <textarea name="message" placeholder="Tell Us About Project *" required rows={4}></textarea>
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
      </div>
    </div>
  );
};

const CareersPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
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
      <div className="contact-hero">
        <div className="container">
          <h1>Careers</h1>
          <div className="breadcrumb">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} style={{ color: 'white', textDecoration: 'none' }}>Home</a>
            <span className="separator">&gt;</span>
            <span>Careers</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 0' }}>
        <div className="careers-intro">
          <h2>Join The JobSync</h2>
          <p>The JobSync is a global recruitment and career platform dedicated to connecting talented professionals with leading employers across India, the UAE, Singapore, and other international markets. We are expanding our team and inviting passionate individuals to build rewarding careers with us.</p>
          <h3 style={{ marginTop: '40px', color: '#1a2238' }}>Current Openings</h3>
        </div>

        <div className="jobs-grid">
          {jobs.map((job, index) => (
            <div className="job-card" key={index}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <div className="about-page">
      <div className="contact-hero">
        <div className="container">
          <h1>About Us</h1>
          <div className="breadcrumb">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} style={{ color: 'white', textDecoration: 'none' }}>Home</a>
            <span className="separator">&gt;</span>
            <span>About Us</span>
          </div>
        </div>
      </div>

      <section className="about" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-title">
            <h2>About Our Company</h2>
          </div>

          <div className="about-grid">
            <img src="/features.png" alt="About The Jobsync" className="about-img" />
            <div className="about-content">
              <h3>The JobSync – IT Consulting & Services</h3>
              <p>The JobSync is a global IT consulting and technology services company committed to helping organizations accelerate digital transformation, optimize business operations, and achieve sustainable growth through innovative technology solutions.</p>
              <p>We partner with startups, SMEs, and large enterprises to deliver strategic consulting, custom software development, cloud solutions, cybersecurity, managed IT services, enterprise applications, AI-driven innovation, and IT staffing. Our experienced consultants and technology specialists provide end-to-end solutions that improve operational efficiency, reduce costs, enhance security, and enable business scalability.</p>
              <p>Our customer-centric approach, industry expertise, and commitment to quality make The JobSync a trusted technology partner for organizations across multiple industries worldwide.</p>

              <div className="about-bottom">
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ServicesPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  return (
    <div className="services-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Our Services</h1>
          <div className="breadcrumb">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} style={{ color: 'white', textDecoration: 'none' }}>Home</a>
            <span className="separator">&gt;</span>
            <span>Services</span>
          </div>
        </div>
      </div>

      <section className="services" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="services-header">
            <h2>Comprehensive IT Solutions</h2>
            <div>
              <span style={{ marginRight: '10px', cursor: 'pointer' }}>&lt;</span>
              <span style={{ cursor: 'pointer' }}>&gt;</span>
            </div>
          </div>

          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>IT Strategy Consulting</h3>
              <ul className="service-list">
                <li>Digital Transformation Consulting</li>
                <li>Business Process Consulting</li>
                <li>Technology Advisory Services</li>
                <li>Enterprise Architecture Consulting</li>
                <li>IT Infrastructure Consulting</li>
                <li>Cloud Strategy Consulting</li>
                <li>Cybersecurity Consulting</li>
                <li>Data Analytics & BI Consulting</li>
                <li>AI & Machine Learning Consulting</li>
                <li>ERP Consulting (SAP, Oracle, Dynamics)</li>
                <li>CRM Consulting (Salesforce, Zoho, HubSpot)</li>
                <li>Project Management Consulting</li>
                <li>IT Governance & Compliance</li>
                <li>Disaster Recovery & Business Continuity</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Software Development</h3>
              <ul className="service-list">
                <li>Custom Software Development</li>
                <li>Web Application Development</li>
                <li>Mobile App Development (Android & iOS)</li>
                <li>Enterprise Application Development</li>
                <li>SaaS Product Development</li>
                <li>E-commerce Development</li>
                <li>API Development & Integration</li>
                <li>Software Maintenance & Support</li>
                <li>Legacy System Modernization</li>
                <li>Low-Code/No-Code Development</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Cloud Services</h3>
              <ul className="service-list">
                <li>Cloud Migration</li>
                <li>Cloud Infrastructure Management</li>
                <li>AWS Consulting & Support</li>
                <li>Microsoft Azure Services</li>
                <li>Google Cloud Platform (GCP) Services</li>
                <li>Cloud Security</li>
                <li>Cloud Backup & Disaster Recovery</li>
                <li>DevOps & CI/CD Implementation</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Cybersecurity Services</h3>
              <ul className="service-list">
                <li>Information Security Consulting</li>
                <li>Vulnerability Assessment</li>
                <li>Penetration Testing</li>
                <li>Managed Security Services</li>
                <li>Network Security Solutions</li>
                <li>Endpoint Security</li>
                <li>Identity & Access Management</li>
                <li>Security Audits & Compliance (ISO 27001)</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Data & AI Services</h3>
              <ul className="service-list">
                <li>Data Warehousing Solutions</li>
                <li>Big Data Analytics</li>
                <li>Business Intelligence Reporting</li>
                <li>Machine Learning Models</li>
                <li>Predictive Analytics</li>
                <li>Natural Language Processing (NLP)</li>
                <li>Computer Vision Solutions</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>IT Infrastructure</h3>
              <ul className="service-list">
                <li>Network Design & Implementation</li>
                <li>Server Virtualization</li>
                <li>Storage Solutions</li>
                <li>Data Center Management</li>
                <li>IT Asset Management</li>
                <li>Helpdesk & Technical Support</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Enterprise Applications</h3>
              <ul className="service-list">
                <li>ERP Implementation & Customization</li>
                <li>CRM Implementation</li>
                <li>HRMS Solutions</li>
                <li>Supply Chain Management Solutions</li>
                <li>Application Modernization</li>
                <li>Application Support & Maintenance</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Digital Marketing</h3>
              <ul className="service-list">
                <li>Search Engine Optimization (SEO)</li>
                <li>Search Engine Marketing (SEM)</li>
                <li>Social Media Marketing (SMM)</li>
                <li>Content Marketing & Strategy</li>
                <li>Email Marketing Campaigns</li>
                <li>Digital Analytics & Reporting</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Emerging Technology</h3>
              <ul className="service-list">
                <li>Internet of Things (IoT)</li>
                <li>Blockchain Development</li>
                <li>AR/VR Solutions</li>
                <li>Digital Twin Solutions</li>
                <li>Edge Computing</li>
                <li>Smart Automation Solutions</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>IT Staffing</h3>
              <ul className="service-list">
                <li>IT Recruitment Services</li>
                <li>Contract Staffing</li>
                <li>Permanent Staffing</li>
                <li>Dedicated Development Teams</li>
                <li>Offshore Development Center (ODC)</li>
                <li>Technical Resource Augmentation</li>
              </ul>
            </div>

            <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
              <h3 style={{ marginTop: '0' }}>Training & Support</h3>
              <ul className="service-list">
                <li>Corporate IT Training</li>
                <li>Technical Certification Training</li>
                <li>User Training</li>
                <li>Software Implementation Training</li>
                <li>Technical Documentation</li>
                <li>Annual Maintenance Contracts (AMC)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMsg(result.message || "Thank you! Your inquiry has been submitted successfully.");
        (e.target as HTMLFormElement).reset();
      } else {
        setErrorMsg(result.error || "Failed to send email. Please try again later.");
      }
    } catch (error) {
      setErrorMsg("Failed to send email. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Phone: +971 54 740 5625 | +91 9789569391
            </span>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              hr@thejobsync.com
            </span>
          </div>
          <div className="top-bar-right">
            <span>Stay Connected:</span>
            <div className="top-bar-social">
              <a href="https://www.facebook.com/Thejobsync" target="_blank" rel="noopener noreferrer"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="https://www.instagram.com/thejobsync/" target="_blank" rel="noopener noreferrer"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></a>
              <a href="#"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
              <a href="https://www.youtube.com/@thejobsync-it" target="_blank" rel="noopener noreferrer"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,5.493C21.346,4.618 20.654,3.927 19.779,3.691C18.172,3.262 12,3.262 12,3.262C12,3.262 5.828,3.262 4.221,3.691C3.346,3.927 2.654,4.618 2.418,5.493C1.989,7.1 1.989,12 1.989,12C1.989,12 1.989,16.9 2.418,18.507C2.654,19.382 3.346,20.073 4.221,20.309C5.828,20.738 12,20.738 12,20.738C12,20.738 18.172,20.738 19.779,20.309C20.654,20.073 21.346,19.382 21.582,18.507C22.011,16.9 22.011,12 22.011,12C22.011,12 22.011,7.1 21.582,5.493ZM10.024,15.701L10.024,8.299L15.356,12L10.024,15.701Z"></path></svg></a>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="/jobsync-logo.jpg" alt="The Jobsync Logo" width="45" height="45" style={{ marginRight: '10px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="logo-text">The Jobsync</span>
              <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '1px' }}>IT CONSULTING & SERVICES</span>
            </div>
          </div>

          <div className="nav-wrapper">
            <nav className="nav">
              <a href="#" onClick={() => setActiveTab('home')} style={{ color: activeTab === 'home' ? 'var(--primary-cyan)' : '' }}>HOME</a>
              <a href="#about" onClick={() => setActiveTab('about')} style={{ color: activeTab === 'about' ? 'var(--primary-cyan)' : '' }}>ABOUT US</a>
              <a href="#services" onClick={() => setActiveTab('services')} style={{ color: activeTab === 'services' ? 'var(--primary-cyan)' : '' }}>SERVICES</a>
              <a href="#" onClick={() => setActiveTab('blog')} style={{ color: activeTab === 'blog' ? 'var(--primary-cyan)' : '' }}>BLOG</a>
              <a href="#" onClick={() => setActiveTab('careers')} style={{ color: activeTab === 'careers' ? 'var(--primary-cyan)' : '' }}>CAREERS</a>
              <a href="#contact" onClick={() => setActiveTab('contact')} style={{ color: activeTab === 'contact' ? 'var(--primary-cyan)' : '' }}>CONTACT US</a>
            </nav>
          </div>
        </div>
      </header>

      {activeTab !== 'contact' && activeTab !== 'careers' && activeTab !== 'about' && activeTab !== 'services' && (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-overlay"></div>
            <div className="container">
              <div className="hero-content">
                <h1>Looking for first class IT solutions?</h1>
                <p>With over 10 years of experience helping businesses to find comprehensive technological solutions and strategic IT consulting.</p>
                <div className="hero-buttons">
                  <button className="btn-outline" onClick={() => { setActiveTab('about'); window.scrollTo(0, 0); }}>OUR COMPANY</button>
                  <button className="btn-solid" onClick={() => { setActiveTab('contact'); window.scrollTo(0, 0); }}>CONTACT US</button>
                </div>
              </div>
            </div>
          </section>

          {/* Welcome Section */}
          <section className="welcome">
            <div className="container">
              <div className="section-title">
                <h2>Welcome to The Jobsync</h2>
                <p><strong>Transforming Businesses Through Innovation, Technology & Talent.</strong> The JobSync is a leading IT Consulting and Technology Services company delivering innovative digital solutions that empower businesses to thrive in a rapidly evolving world. Innovate. Transform. Grow.</p>
              </div>

              <div className="welcome-grid">
                <div className="welcome-card">
                  <img src="/service1.png" alt="Software Development" className="welcome-card-img" />
                  <div className="welcome-card-content">
                    <h3>Custom Software</h3>
                    <p>We build scalable applications tailored to your business needs, ensuring high performance.</p>
                  </div>
                </div>
                <div className="welcome-card">
                  <img src="/service2.png" alt="Cloud Infrastructure" className="welcome-card-img" />
                  <div className="welcome-card-content">
                    <h3>Cloud Infrastructure</h3>
                    <p>Launch your infrastructure in no time with our fast and simple cloud deployment process.</p>
                  </div>
                </div>
                <div className="welcome-card">
                  <img src="/service3.png" alt="Cybersecurity" className="welcome-card-img" />
                  <div className="welcome-card-content">
                    <h3>Cybersecurity</h3>
                    <p>Protect your data with maximum impact solutions and advanced threat detection.</p>
                  </div>
                </div>
                <div className="welcome-card">
                  <img src="/service4.png" alt="Data Analytics & AI" className="welcome-card-img" />
                  <div className="welcome-card-content">
                    <h3>Data Analytics & AI</h3>
                    <p>Unlock actionable insights and automate workflows with cutting-edge artificial intelligence.</p>
                  </div>
                </div>
                <div className="welcome-card">
                  <img src="/service5.png" alt="Enterprise Solutions" className="welcome-card-img" />
                  <div className="welcome-card-content">
                    <h3>Enterprise Solutions</h3>
                    <p>Streamline business operations with custom ERP, CRM, and supply chain implementations.</p>
                  </div>
                </div>
                <div className="welcome-card">
                  <img src="/service6.png" alt="IT Staffing" className="welcome-card-img" />
                  <div className="welcome-card-content">
                    <h3>IT Staffing</h3>
                    <p>Find the right technical talent quickly with our professional IT recruitment and augmentation services.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* About Our Company Section */}
          <section className="about" id="about">
            <div className="container">
              <div className="section-title">
                <h2>About Our Company</h2>
              </div>

              <div className="about-grid">
                <img src="/features.png" alt="About The Jobsync" className="about-img" />
                <div className="about-content">
                  <h3>The JobSync – IT Consulting & Services</h3>
                  <p>The JobSync is a global IT consulting and technology services company committed to helping organizations accelerate digital transformation, optimize business operations, and achieve sustainable growth through innovative technology solutions.</p>
                  <p>We partner with startups, SMEs, and large enterprises to deliver strategic consulting, custom software development, cloud solutions, cybersecurity, managed IT services, enterprise applications, AI-driven innovation, and IT staffing. Our experienced consultants and technology specialists provide end-to-end solutions that improve operational efficiency, reduce costs, enhance security, and enable business scalability.</p>
                  <p>Our customer-centric approach, industry expertise, and commitment to quality make The JobSync a trusted technology partner for organizations across multiple industries worldwide.</p>

                  <div className="about-bottom">
                    <button className="btn-solid" style={{ padding: '10px 25px' }} onClick={(e) => { e.preventDefault(); setActiveTab('about'); window.scrollTo(0, 0); }}>READ MORE</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="services" id="services">
            <div className="container">
              <div className="services-header">
                <h2>Our Services</h2>
                <div>
                  <span style={{ marginRight: '10px', cursor: 'pointer' }}>&lt;</span>
                  <span style={{ cursor: 'pointer' }}>&gt;</span>
                </div>
              </div>

              <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>IT Strategy Consulting</h3>
                  <ul className="service-list">
                    <li>Digital Transformation Consulting</li>
                    <li>Business Process Consulting</li>
                    <li>Technology Advisory Services</li>
                    <li>Enterprise Architecture Consulting</li>
                    <li>IT Infrastructure Consulting</li>
                    <li>Cloud Strategy Consulting</li>
                    <li>Cybersecurity Consulting</li>
                    <li>Data Analytics & BI Consulting</li>
                    <li>AI & Machine Learning Consulting</li>
                    <li>ERP Consulting (SAP, Oracle, Dynamics)</li>
                    <li>CRM Consulting (Salesforce, Zoho, HubSpot)</li>
                    <li>Project Management Consulting</li>
                    <li>IT Governance & Compliance</li>
                    <li>Disaster Recovery & Business Continuity</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Software Development</h3>
                  <ul className="service-list">
                    <li>Custom Software Development</li>
                    <li>Web Application Development</li>
                    <li>Mobile App Development (Android & iOS)</li>
                    <li>Enterprise Application Development</li>
                    <li>SaaS Product Development</li>
                    <li>E-commerce Development</li>
                    <li>API Development & Integration</li>
                    <li>Software Maintenance & Support</li>
                    <li>Legacy System Modernization</li>
                    <li>Low-Code/No-Code Development</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Cloud Services</h3>
                  <ul className="service-list">
                    <li>Cloud Migration</li>
                    <li>Cloud Infrastructure Management</li>
                    <li>AWS Consulting & Support</li>
                    <li>Microsoft Azure Services</li>
                    <li>Google Cloud Platform (GCP) Services</li>
                    <li>Cloud Security</li>
                    <li>Cloud Backup & Disaster Recovery</li>
                    <li>DevOps & CI/CD Implementation</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Cybersecurity Services</h3>
                  <ul className="service-list">
                    <li>Security Risk Assessment</li>
                    <li>Vulnerability Assessment & Pen Testing</li>
                    <li>Security Operations Center (SOC)</li>
                    <li>Identity & Access Management (IAM)</li>
                    <li>Endpoint Security</li>
                    <li>Network Security</li>
                    <li>Security Monitoring</li>
                    <li>Incident Response</li>
                    <li>Compliance Audits (ISO 27001, GDPR)</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Infrastructure & Network</h3>
                  <ul className="service-list">
                    <li>Network Design & Implementation</li>
                    <li>Server Installation & Management</li>
                    <li>Data Center Services</li>
                    <li>Virtualization Services</li>
                    <li>Storage Solutions</li>
                    <li>IT Infrastructure Monitoring</li>
                    <li>Remote IT Support</li>
                    <li>Help Desk Services</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Managed IT Services</h3>
                  <ul className="service-list">
                    <li>24/7 IT Support</li>
                    <li>Managed Cloud Services</li>
                    <li>Managed Network Services</li>
                    <li>Managed Security Services (MSSP)</li>
                    <li>Managed Backup Services</li>
                    <li>IT Asset Management</li>
                    <li>End-User Support</li>
                    <li>IT Outsourcing</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Data & AI Services</h3>
                  <ul className="service-list">
                    <li>Data Engineering</li>
                    <li>Data Warehousing</li>
                    <li>Business Intelligence (BI)</li>
                    <li>Big Data Analytics</li>
                    <li>Artificial Intelligence Solutions</li>
                    <li>Machine Learning Development</li>
                    <li>Generative AI Solutions</li>
                    <li>Chatbot Development</li>
                    <li>Robotic Process Automation (RPA)</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Enterprise Solutions</h3>
                  <ul className="service-list">
                    <li>ERP Implementation</li>
                    <li>CRM Implementation</li>
                    <li>HRMS Development</li>
                    <li>Payroll Solutions</li>
                    <li>Document Management Systems</li>
                    <li>Supply Chain Management Solutions</li>
                    <li>Inventory Management Systems</li>
                    <li>POS Solutions</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Emerging Technology</h3>
                  <ul className="service-list">
                    <li>Internet of Things (IoT)</li>
                    <li>Blockchain Development</li>
                    <li>AR/VR Solutions</li>
                    <li>Digital Twin Solutions</li>
                    <li>Edge Computing</li>
                    <li>Smart Automation Solutions</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>IT Staffing & Outsourcing</h3>
                  <ul className="service-list">
                    <li>IT Recruitment Services</li>
                    <li>Contract Staffing</li>
                    <li>Permanent Staffing</li>
                    <li>Dedicated Development Teams</li>
                    <li>Offshore Development Center (ODC)</li>
                    <li>Technical Resource Augmentation</li>
                  </ul>
                </div>

                <div className="service-item" style={{ textAlign: 'left', alignItems: 'flex-start' }}>
                  <h3 style={{ marginTop: '0' }}>Training & Support</h3>
                  <ul className="service-list">
                    <li>Corporate IT Training</li>
                    <li>Technical Certification Training</li>
                    <li>User Training</li>
                    <li>Software Implementation Training</li>
                    <li>Technical Documentation</li>
                    <li>Annual Maintenance Contracts (AMC)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="contact" id="contact">
            <div className="container">
              <div className="contact-grid">
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
                      <p>Tamilnadu, Chennai<br />+91 9789569391</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div>
                      <h3>Mail Id</h3>
                      <p>hr@thejobsync.com</p>
                    </div>
                  </div>
                </div>

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
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'contact' && <ContactPage setActiveTab={setActiveTab} />}
      {activeTab === 'careers' && <CareersPage setActiveTab={setActiveTab} />}
      {activeTab === 'about' && <AboutPage setActiveTab={setActiveTab} />}
      {activeTab === 'services' && <ServicesPage setActiveTab={setActiveTab} />}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="logo" style={{ marginBottom: '20px' }}>
                <img src="/jobsync-logo.jpg" alt="The Jobsync Logo" width="45" height="45" style={{ marginRight: '10px', objectFit: 'contain' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="logo-text" style={{ color: 'white' }}>The Jobsync</span>
                  <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '1px' }}>IT CONSULTING & SERVICES</span>
                </div>
              </div>
              <p>At The Jobsync, we specialize in providing expert IT Consulting and technological solutions. Our goal is to help businesses grow and professionals achieve their IT career aspirations efficiently.</p>
              <div className="footer-social">
                <a href="https://www.facebook.com/Thejobsync" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="https://www.instagram.com/thejobsync/" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg></a>
                <a href="https://www.linkedin.com/company/the-jobsync/" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                <a href="https://www.youtube.com/@thejobsync-it" target="_blank" rel="noopener noreferrer"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,5.493C21.346,4.618 20.654,3.927 19.779,3.691C18.172,3.262 12,3.262 12,3.262C12,3.262 5.828,3.262 4.221,3.691C3.346,3.927 2.654,4.618 2.418,5.493C1.989,7.1 1.989,12 1.989,12C1.989,12 1.989,16.9 2.418,18.507C2.654,19.382 3.346,20.073 4.221,20.309C5.828,20.738 12,20.738 12,20.738C12,20.738 18.172,20.738 19.779,20.309C20.654,20.073 21.346,19.382 21.582,18.507C22.011,16.9 22.011,12 22.011,12C22.011,12 22.011,7.1 21.582,5.493ZM10.024,15.701L10.024,8.299L15.356,12L10.024,15.701Z"></path></svg></a>
              </div>
            </div>

            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#" className={activeTab === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo(0, 0); }}>Home</a></li>
                <li><a href="#" className={activeTab === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('about'); window.scrollTo(0, 0); }}>About Us</a></li>
                <li><a href="#" className={activeTab === 'services' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('services'); window.scrollTo(0, 0); }}>Our Services</a></li>
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
                  hr@thejobsync.com
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
