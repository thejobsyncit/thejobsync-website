import React, { useState, useEffect } from 'react';
import type { Testimonial } from './TestimonialsPage';

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'New' | 'In Progress' | 'Contacted' | 'Resolved';
}

interface JobOpening {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  status: string;
}

const initialTestimonials: Testimonial[] = [
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
  }
];

const initialBlogs: BlogItem[] = [
  {
    id: '1',
    title: 'The Future of Multi-Cloud Architecture in Enterprise IT',
    slug: 'future-of-multi-cloud-architecture-enterprise-it',
    category: 'Cloud Solutions',
    author: 'The Jobsync Cloud Team',
    date: 'August 24, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Explore how multi-cloud strategy, serverless computing, and AI-driven automation are reshaping modern corporate IT infrastructure.',
    content: `Cloud computing has evolved into the bedrock of modern digital business transformation.`
  },
  {
    id: '2',
    title: 'Essential Zero-Trust Cybersecurity Best Practices for 2026',
    slug: 'essential-zero-trust-cybersecurity-best-practices-2026',
    category: 'Cybersecurity',
    author: 'The Jobsync Security Team',
    date: 'August 20, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Key security frameworks and identity-first strategies to protect your enterprise digital assets against emerging cyber threats.',
    content: `With sophisticated cyber security threats on the rise, static perimeter defense is no longer sufficient.`
  }
];

const initialInquiries: Inquiry[] = [
  {
    id: '1',
    name: 'Robert Vance',
    email: 'robert@fintechdynamics.com',
    phone: '+971 50 123 4567',
    message: 'We are looking to migrate our core transactional database to multi-cloud AWS infrastructure. Please share consultation availability.',
    date: 'August 25, 2026, 2:30 PM',
    status: 'New'
  },
  {
    id: '2',
    name: 'Anita Desai',
    email: 'anita@apexhealth.org',
    phone: '+91 9876543210',
    message: 'Requesting a quote for HIPAA-compliant custom portal development and security audit.',
    date: 'August 24, 2026, 11:15 AM',
    status: 'In Progress'
  }
];

const initialCareers: JobOpening[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Engineer (React / Node.js)',
    department: 'Engineering',
    type: 'Full-Time',
    location: 'Dubai / Remote',
    experience: '4+ Years',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Cloud & DevOps Solutions Architect',
    department: 'Cloud Solutions',
    type: 'Full-Time',
    location: 'Chennai / Hybrid',
    experience: '5+ Years',
    status: 'Active'
  }
];

export const AdminPage = ({ onExit }: { onExit: () => void }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('jobsync_admin_logged_in') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role?: string } | null>(() => {
    const saved = localStorage.getItem('jobsync_admin_user');
    return saved ? JSON.parse(saved) : { name: 'Master Admin', email: 'admin@thejobsync.com', role: 'Super Admin' };
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState('admin@thejobsync.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Active Admin Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'inquiries' | 'blogs' | 'testimonials' | 'careers'>('dashboard');

  // State Collections
  const [blogs, setBlogs] = useState<BlogItem[]>(() => {
    try {
      const saved = localStorage.getItem('jobsync_blogs_data');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [careers, setCareers] = useState<JobOpening[]>([]);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Form states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogDate, setBlogDate] = useState('');
  const [blogCoverImage, setBlogCoverImage] = useState('');
  const [blogGalleryImages, setBlogGalleryImages] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSuccess, setBlogSuccess] = useState('');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tCompany, setTCompany] = useState('');
  const [tCategory, setTCategory] = useState('Cloud Infrastructure');
  const [tRating, setTRating] = useState(5);
  const [tQuote, setTQuote] = useState('');
  const [tAvatar, setTAvatar] = useState('');
  const [tSuccess, setTSuccess] = useState('');

  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobType, setJobType] = useState('Full-Time');
  const [jobLoc, setJobLoc] = useState('Remote / Hybrid');
  const [jobExp, setJobExp] = useState('2+ Years');
  const [jobSuccess, setJobSuccess] = useState('');

  useEffect(() => {
    // Health Check
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') setServerStatus('online');
        else setServerStatus('offline');
      })
      .catch(() => setServerStatus('offline'));

    // Fetch Initial Data
    fetch('/api/blogs')
      .then(res => res.json())
      .then(d => d.success && setBlogs(d.data))
      .catch(() => {});

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(d => d.success && setTestimonials(d.data))
      .catch(() => {});

    fetch('/api/inquiries')
      .then(res => res.json())
      .then(d => d.success && setInquiries(d.data))
      .catch(() => {});

    fetch('/api/careers')
      .then(res => res.json())
      .then(d => d.success && setCareers(d.data))
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('jobsync_admin_logged_in', 'true');
        localStorage.setItem('jobsync_admin_user', JSON.stringify(data.user));
      } else {
        setAuthError(data.error || 'Invalid admin credentials');
      }
    } catch (err) {
      if (loginEmail === 'admin@thejobsync.com' && loginPassword === 'admin123') {
        const user = { name: 'Master Admin', email: loginEmail, role: 'Super Admin' };
        setAdminUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('jobsync_admin_logged_in', 'true');
        localStorage.setItem('jobsync_admin_user', JSON.stringify(user));
      } else {
        setAuthError('Invalid credentials. Default: admin@thejobsync.com / admin123');
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
      });
      const data = await res.json();
      if (data.success) {
        setAuthSuccess('🎉 Account registered! Logging you in...');
        setTimeout(() => {
          setAdminUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('jobsync_admin_logged_in', 'true');
          localStorage.setItem('jobsync_admin_user', JSON.stringify(data.user));
        }, 1000);
      } else {
        setAuthError(data.error || 'Failed to register account');
      }
    } catch (err) {
      const user = { name: regName || 'Admin User', email: regEmail, role: 'Administrator' };
      setAuthSuccess('🎉 Account registered! Logging you in...');
      setTimeout(() => {
        setAdminUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('jobsync_admin_logged_in', 'true');
        localStorage.setItem('jobsync_admin_user', JSON.stringify(user));
      }, 1000);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('jobsync_admin_logged_in');
  };

  const formatDateForDisplay = (rawDate: string): string => {
    if (!rawDate || !rawDate.trim()) {
      return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate.trim())) {
      const [year, month, day] = rawDate.trim().split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return rawDate.trim();
  };

  const handleStartEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title || '');
    setBlogCategory(blog.category || '');
    setBlogDate(blog.date || '');
    setBlogCoverImage(blog.coverImage || '');
    setBlogGalleryImages(Array.isArray(blog.images) ? blog.images.join(', ') : '');
    setBlogExcerpt(blog.excerpt || '');
    setBlogContent(blog.content || '');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEditBlog = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogCategory('');
    setBlogDate('');
    setBlogContent('');
    setBlogExcerpt('');
    setBlogCoverImage('');
    setBlogGalleryImages('');
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) return;

    const parsedImages = (() => {
      if (!blogGalleryImages.trim()) return [];
      const matches = blogGalleryImages.match(/https?:\/\/[^\s,]+/gi);
      if (matches && matches.length > 0) return matches.map(u => u.trim());
      return blogGalleryImages.split(/[\n,\r]+/).flatMap(s => s.trim().split(/\s+/)).map(s => s.trim()).filter(Boolean);
    })();

    const formattedDate = formatDateForDisplay(blogDate);
    const categoryName = blogCategory.trim() || 'General';

    if (editingBlogId) {
      // UPDATE EXISTING POST
      const existing = blogs.find(b => b.id === editingBlogId);
      const wordCount = blogContent.trim().split(/\s+/).length;
      const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

      const updatedPost: BlogPost = {
        id: editingBlogId,
        title: blogTitle.trim(),
        slug: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category: categoryName,
        author: '',
        date: blogDate.trim() ? formattedDate : (existing?.date || formattedDate),
        readTime: estimatedReadTime,
        coverImage: blogCoverImage.trim(),
        images: parsedImages,
        excerpt: blogExcerpt.trim() || blogContent.slice(0, 120) + '...',
        content: blogContent.trim()
      };

      const updatedList = blogs.map(b => b.id === editingBlogId ? updatedPost : b);
      setBlogs(updatedList);
      localStorage.setItem('jobsync_blogs_data', JSON.stringify(updatedList));

      try {
        const res = await fetch(`/api/blogs/${editingBlogId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost)
        });
        const data = await res.json();
        if (data.success && data.data) {
          const synced = blogs.map(b => b.id === editingBlogId ? data.data : b);
          setBlogs(synced);
          localStorage.setItem('jobsync_blogs_data', JSON.stringify(synced));
        }
      } catch (err) {}

      setBlogSuccess('Article updated successfully!');
      handleCancelEditBlog();
      setTimeout(() => setBlogSuccess(''), 3000);
      return;
    }

    // CREATE NEW POST
    const wordCount = blogContent.trim().split(/\s+/).length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

    const newPost = {
      id: Date.now().toString(),
      title: blogTitle.trim(),
      slug: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: categoryName,
      author: '',
      date: formattedDate,
      readTime: estimatedReadTime,
      coverImage: blogCoverImage.trim() ? blogCoverImage.trim() : '',
      images: parsedImages,
      excerpt: blogExcerpt.trim() || blogContent.slice(0, 120) + '...',
      content: blogContent.trim()
    };

    const updatedList = [newPost, ...blogs];
    setBlogs(updatedList);
    localStorage.setItem('jobsync_blogs_data', JSON.stringify(updatedList));

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      const data = await res.json();
      if (data.success && data.data) {
        const synced = [data.data, ...blogs.filter(b => b.id !== data.data.id)];
        setBlogs(synced);
        localStorage.setItem('jobsync_blogs_data', JSON.stringify(synced));
      }
    } catch (err) {}

    setBlogSuccess('Article published successfully!');
    handleCancelEditBlog();
    setTimeout(() => setBlogSuccess(''), 3000);
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    } catch (err) {}
    if (editingBlogId === id) handleCancelEditBlog();
    const filtered = blogs.filter(b => b.id !== id);
    setBlogs(filtered);
    localStorage.setItem('jobsync_blogs_data', JSON.stringify(filtered));
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !tQuote.trim()) return;

    const newT = {
      id: Date.now(),
      name: tName.trim(),
      role: tRole.trim() || 'Client',
      company: tCompany.trim() || 'Enterprise Partner',
      category: tCategory,
      rating: Number(tRating),
      avatar: tAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      quote: tQuote.trim()
    };

    try {
      await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newT)
      });
    } catch (err) {}

    setTestimonials([newT, ...testimonials]);
    setTSuccess('Testimonial added live!');
    setTName('');
    setTRole('');
    setTCompany('');
    setTQuote('');
    setTAvatar('');
    setTimeout(() => setTSuccess(''), 3000);
  };

  const handleDeleteTestimonial = async (id: number) => {
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    } catch (err) {}
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: Inquiry['status']) => {
    try {
      await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {}
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    } catch (err) {}
    setInquiries(inquiries.filter(i => i.id !== id));
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    const newJob: JobOpening = {
      id: Date.now().toString(),
      title: jobTitle.trim(),
      department: jobDept,
      type: jobType,
      location: jobLoc.trim(),
      experience: jobExp.trim(),
      status: 'Active'
    };

    try {
      await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
    } catch (err) {}

    setCareers([newJob, ...careers]);
    setJobSuccess('Job posting published!');
    setJobTitle('');
    setTimeout(() => setJobSuccess(''), 3000);
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await fetch(`/api/careers/${id}`, { method: 'DELETE' });
    } catch (err) {}
    setCareers(careers.filter(c => c.id !== id));
  };

  // UNAUTHENTICATED LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--navy-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '36px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary-cyan)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '20px' }}>J</div>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>The Jobsync Admin</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Secure Control Center Login</p>
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
            <button
              onClick={() => setAuthMode('login')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: authMode === 'login' ? '#ffffff' : 'transparent', color: authMode === 'login' ? '#0f172a' : '#64748b', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: authMode === 'register' ? '#ffffff' : 'transparent', color: authMode === 'register' ? '#0f172a' : '#64748b', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              Register Admin
            </button>
          </div>

          {authError && <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '12px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>{authError}</div>}
          {authSuccess && <div style={{ background: '#ecfdf5', borderLeft: '4px solid #10b981', color: '#065f46', padding: '12px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px' }}>{authSuccess}</div>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Admin Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={isAuthSubmitting}
                className="btn-solid"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '700' }}
              >
                {isAuthSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Work Email</label>
                <input
                  type="email"
                  placeholder="alex@thejobsync.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={isAuthSubmitting}
                className="btn-solid"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '700' }}
              >
                {isAuthSubmitting ? 'Registering...' : 'Create Admin Account'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
            <button onClick={onExit} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
              &larr; Back to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD LAYOUT
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* Sidebar Navigation */}
      <aside style={{ width: '270px', background: 'var(--navy-gradient)', color: '#ffffff', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(43, 182, 180, 0.2)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px 24px 12px', borderBottom: '1px solid #1e293b', marginBottom: '24px' }}>
            <div style={{ width: '38px', height: '38px', background: 'var(--primary-cyan)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '18px' }}>J</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#ffffff', fontWeight: '800' }}>The Jobsync</h3>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Management Suite</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveAdminTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeAdminTab === 'dashboard' ? 'var(--primary-cyan)' : 'transparent',
                color: activeAdminTab === 'dashboard' ? '#ffffff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📊 Overview Dashboard
            </button>

            <button
              onClick={() => setActiveAdminTab('inquiries')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeAdminTab === 'inquiries' ? 'var(--primary-cyan)' : 'transparent',
                color: activeAdminTab === 'inquiries' ? '#ffffff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <span>📬 Customer Inquiries</span>
              {inquiries.filter(i => i.status === 'New').length > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                  {inquiries.filter(i => i.status === 'New').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('blogs')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeAdminTab === 'blogs' ? 'var(--primary-cyan)' : 'transparent',
                color: activeAdminTab === 'blogs' ? '#ffffff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📰 Manage Blog Articles ({blogs.length})
            </button>

            <button
              onClick={() => setActiveAdminTab('testimonials')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeAdminTab === 'testimonials' ? 'var(--primary-cyan)' : 'transparent',
                color: activeAdminTab === 'testimonials' ? '#ffffff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              💬 Manage Testimonials ({testimonials.length})
            </button>

            <button
              onClick={() => setActiveAdminTab('careers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeAdminTab === 'careers' ? 'var(--primary-cyan)' : 'transparent',
                color: activeAdminTab === 'careers' ? '#ffffff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              💼 Career Job Postings ({careers.length})
            </button>
          </nav>
        </div>

        {/* User Info & Controls */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
          <div style={{ padding: '8px 12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>{adminUser?.name}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{adminUser?.email}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onExit} style={{ flex: 1, padding: '8px 10px', background: '#334155', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              🌐 View Site
            </button>
            <button onClick={handleLogout} style={{ flex: 1, padding: '8px 10px', background: '#991b1b', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              🔒 Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '36px', overflowY: 'auto' }}>

        {/* OVERVIEW DASHBOARD TAB */}
        {activeAdminTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '26px', color: '#0f172a', marginBottom: '6px' }}>Welcome, {adminUser?.name || 'Admin'} 👋</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Monitor incoming customer leads, manage published content, and check system health.</p>

            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Customer Inquiries</span>
                <h3 style={{ fontSize: '34px', color: '#0f172a', margin: '8px 0 4px 0', fontWeight: '900' }}>{inquiries.length}</h3>
                <span style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: '700' }}>
                  {inquiries.filter(i => i.status === 'New').length} New Unread Lead(s)
                </span>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Published Tech Blogs</span>
                <h3 style={{ fontSize: '34px', color: '#0f172a', margin: '8px 0 4px 0', fontWeight: '900' }}>{blogs.length}</h3>
                <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>Live on public blog</span>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Client Testimonials</span>
                <h3 style={{ fontSize: '34px', color: '#0f172a', margin: '8px 0 4px 0', fontWeight: '900' }}>{testimonials.length}</h3>
                <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>5.0 Rating Average</span>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Career Postings</span>
                <h3 style={{ fontSize: '34px', color: '#0f172a', margin: '8px 0 4px 0', fontWeight: '900' }}>{careers.length}</h3>
                <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '700' }}>Open for applications</span>
              </div>
            </div>

            {/* Quick Navigation Panel */}
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px' }}>Quick Admin Actions</h3>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button className="btn-solid" onClick={() => setActiveAdminTab('inquiries')} style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '8px' }}>
                  📬 View Customer Inquiries
                </button>
                <button className="btn-outline" onClick={() => setActiveAdminTab('blogs')} style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '8px' }}>
                  + Add New Blog Article
                </button>
                <button className="btn-outline" onClick={() => setActiveAdminTab('careers')} style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '8px' }}>
                  + Post Job Position
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMER INQUIRIES TAB */}
        {activeAdminTab === 'inquiries' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0 }}>Customer Inquiries & Leads ({inquiries.length})</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Messages submitted via the contact form on your website.</p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {inquiries.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No customer inquiries logged yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {inquiries.map((inq) => (
                    <div key={inq.id} style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontWeight: '800' }}>{inq.name}</h4>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '800',
                            background: inq.status === 'New' ? '#ef4444' : inq.status === 'Contacted' ? '#22c55e' : '#f59e0b',
                            color: '#ffffff'
                          }}>
                            {inq.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                          📧 <a href={`mailto:${inq.email}`} style={{ color: 'var(--primary-cyan)', fontWeight: '600', textDecoration: 'none' }}>{inq.email}</a> • 📞 {inq.phone} • 📅 {inq.date}
                        </div>
                        <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                          "{inq.message}"
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        {inq.status !== 'Contacted' && (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'Contacted')}
                            style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            ✓ Mark Contacted
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BLOG MANAGER TAB */}
        {activeAdminTab === 'blogs' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0 }}>Blog Article Manager ({blogs.length})</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Publish and manage technology articles on the public website.</p>
            </div>

            {blogSuccess && <div style={{ background: '#ecfdf5', color: '#047857', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{blogSuccess}</div>}

            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e2e8f0', marginBottom: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '18px', color: '#0f172a', margin: 0 }}>
                  {editingBlogId ? '✏️ Edit Blog Article' : '➕ Create New Blog Article'}
                </h3>
                {editingBlogId && (
                  <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '20px', fontWeight: '700' }}>
                    Editing Mode Active
                  </span>
                )}
              </div>

              <form onSubmit={handleAddBlog}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Article Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. The Future of Multi-Cloud Architecture in Enterprise IT"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Category / Tag Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. On-Campus Drive, Cloud Solutions, Tech Summit"
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Event / Article Date (Optional)</label>
                    <input
                      type="date"
                      value={blogDate}
                      onChange={(e) => setBlogDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: 'white' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Cover Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={blogCoverImage}
                      onChange={(e) => setBlogCoverImage(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Additional Gallery Images (Comma, space, or newline separated URLs)</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                      value={blogGalleryImages}
                      onChange={(e) => setBlogGalleryImages(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>Ensure URLs link directly to image files (ending in .jpg, .png, or direct CDN links).</span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Short Summary / Excerpt</label>
                  <input
                    type="text"
                    placeholder="Brief overview of the article..."
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Full Article Content *</label>
                  <textarea
                    rows={6}
                    placeholder="Write detailed post content..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button type="submit" className="btn-solid" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }}>
                    {editingBlogId ? 'Update Article Live ↵' : 'Publish Article Live →'}
                  </button>
                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={handleCancelEditBlog}
                      style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '8px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Published Articles */}
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '20px' }}>Published Articles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {blogs.map((b) => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: editingBlogId === b.id ? '#f0f9ff' : '#f8fafc', borderRadius: '10px', border: editingBlogId === b.id ? '1.5px solid #0ea5e9' : '1px solid #e2e8f0' }}>
                    <div>
                      <span style={{ fontSize: '11px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary-cyan)', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>{b.category}</span>
                      <h4 style={{ margin: '6px 0 2px 0', fontSize: '16px', color: '#0f172a' }}>{b.title}</h4>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {b.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => handleStartEditBlog(b)} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteBlog(b.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TESTIMONIALS MANAGER TAB */}
        {activeAdminTab === 'testimonials' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0 }}>Client Testimonial Manager ({testimonials.length})</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Add and manage verified client success stories.</p>
            </div>

            {tSuccess && <div style={{ background: '#ecfdf5', color: '#047857', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{tSuccess}</div>}

            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e2e8f0', marginBottom: '36px' }}>
              <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '18px' }}>Add New Testimonial</h3>
              <form onSubmit={handleAddTestimonial}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Client Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Designation / Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Technology Officer"
                      value={tRole}
                      onChange={(e) => setTRole(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. FinTech Dynamics"
                      value={tCompany}
                      onChange={(e) => setTCompany(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Client Review Quote *</label>
                  <textarea
                    rows={4}
                    placeholder="Enter client review feedback..."
                    value={tQuote}
                    onChange={(e) => setTQuote(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <button type="submit" className="btn-solid" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }}>
                  Publish Testimonial &rarr;
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CAREERS MANAGER TAB */}
        {activeAdminTab === 'careers' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0 }}>Career Job Postings ({careers.length})</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Post open engineering and consulting positions.</p>
            </div>

            {jobSuccess && <div style={{ background: '#ecfdf5', color: '#047857', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>{jobSuccess}</div>}

            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e2e8f0', marginBottom: '36px' }}>
              <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '18px' }}>Post New Job Opening</h3>
              <form onSubmit={handleAddJob}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Job Position Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Cloud Solutions Architect"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Cloud Solutions / Engineering"
                      value={jobDept}
                      onChange={(e) => setJobDept(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Job Type</label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai / Remote"
                      value={jobLoc}
                      onChange={(e) => setJobLoc(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>Required Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 3+ Years"
                      value={jobExp}
                      onChange={(e) => setJobExp(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-solid" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }}>
                  Post Job Opening &rarr;
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '20px' }}>Active Job Postings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {careers.map((job) => (
                  <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <span style={{ fontSize: '11px', background: '#8b5cf6', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>{job.type}</span>
                      <h4 style={{ margin: '6px 0 2px 0', fontSize: '16px', color: '#0f172a' }}>{job.title}</h4>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{job.department} • 📍 {job.location} • ⏳ {job.experience}</span>
                    </div>
                    <button onClick={() => handleDeleteJob(job.id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
