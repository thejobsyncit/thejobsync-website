import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  coverImage?: string;
  images?: string[];
  excerpt: string;
  content: string;
}

export const defaultSampleBlogs: BlogPost[] = [];

const getStoredBlogs = (): BlogPost[] => {
  try {
    const saved = localStorage.getItem('jobsync_blogs_data');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

/* Helper to gather all available images for a post (cover + gallery) */
const getAllPostImages = (post: BlogPost): string[] => {
  const list: string[] = [];
  if (post.coverImage && post.coverImage.trim() !== '') {
    list.push(post.coverImage.trim());
  }
  if (Array.isArray(post.images) && post.images.length > 0) {
    post.images.forEach(img => {
      if (img && img.trim() !== '' && !list.includes(img.trim())) {
        list.push(img.trim());
      }
    });
  }
  if (list.length === 0) {
    list.push('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80');
  }
  return list;
};

/* --- AUTOMATIC CROSS-FADE CAROUSEL FOR BLOG CARDS --- */
const BlogCardSlideshow = ({
  post,
  onImageClick
}: {
  post: BlogPost;
  onImageClick: () => void;
}) => {
  const images = getAllPostImages(post);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Automatic slideshow transition every 2.5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      className="blog-img-card"
      style={{ height: '220px', overflow: 'hidden', position: 'relative', background: '#0b172a', borderRadius: '16px 16px 0 0' }}
      onClick={onImageClick}
    >
      {/* Auto Cross-Fading Images */}
      {images.map((imgUrl, idx) => (
        <img
          key={idx}
          src={imgUrl}
          alt={`${post.title} slide ${idx + 1}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: currentIdx === idx ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out, transform 4s linear',
            transform: currentIdx === idx ? 'scale(1.05)' : 'scale(1)'
          }}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80';
          }}
        />
      ))}

      {/* Hover Overlay for Brief Content */}
      <div className="blog-img-card-overlay">
        <span className="blog-quick-badge">
          <span>👁️</span> Click to View Brief Content
        </span>
      </div>

      {/* Category Badge */}
      <span
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          background: 'rgba(15, 23, 42, 0.9)',
          color: 'var(--primary-cyan)',
          padding: '5px 13px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '800',
          border: '1px solid rgba(14,165,233,0.3)',
          zIndex: 3
        }}
      >
        {post.category}
      </span>

      {/* Animated Slide Progress Dots */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            zIndex: 3,
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '4px 10px',
            borderRadius: '12px',
            backdropFilter: 'blur(4px)'
          }}
        >
          {images.map((_, i) => (
            <span
              key={i}
              style={{
                width: currentIdx === i ? '18px' : '6px',
                height: '6px',
                borderRadius: '10px',
                background: currentIdx === i ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.4s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* --- BRIEF CONTENT PREVIEW MODAL WITH AUTO SLIDESHOW --- */
const BriefContentModal = ({
  post,
  onClose,
  onReadFull
}: {
  post: BlogPost;
  onClose: () => void;
  onReadFull: (post: BlogPost) => void;
}) => {
  const images = getAllPostImages(post);
  const [modalSlideIdx, setModalSlideIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setModalSlideIdx((prev) => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          animation: 'modalPopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Automatic Slideshow Banner inside Modal */}
        <div style={{ height: '270px', overflow: 'hidden', position: 'relative', background: '#0b172a' }}>
          {images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={post.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: modalSlideIdx === idx ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out'
              }}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80';
              }}
            />
          ))}

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 4
            }}
          >
            ✕
          </button>

          <span
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(14, 165, 233, 0.95)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '800',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 4
            }}
          >
            {post.category}
          </span>

          {images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                display: 'flex',
                gap: '6px',
                zIndex: 4,
                background: 'rgba(15, 23, 42, 0.5)',
                padding: '4px 10px',
                borderRadius: '12px'
              }}
            >
              {images.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: modalSlideIdx === i ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '10px',
                    background: modalSlideIdx === i ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.4s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#64748b', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span>📅 {post.date}</span>
            <span>•</span>
            <span>⏱️ {post.readTime}</span>
          </div>

          <h2 style={{ fontSize: '24px', color: '#0f172a', fontWeight: '800', marginBottom: '16px', lineHeight: '1.3' }}>
            {post.title}
          </h2>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--primary-cyan)', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--primary-cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📌 Brief Content & Summary
            </h4>
            <p style={{ margin: 0, fontSize: '15px', color: '#334155', lineHeight: '1.7' }}>
              {post.excerpt || post.content.slice(0, 220) + '...'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              style={{ padding: '12px 22px', borderRadius: '30px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              Close
            </button>
            <button
              className="btn-solid"
              onClick={() => onReadFull(post)}
              style={{ padding: '12px 28px', borderRadius: '30px', fontSize: '14px' }}
            >
              Read Full Article &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- GALLERY LIGHTBOX MODAL --- */
const GalleryImageModal = ({
  imageUrl,
  caption,
  onClose
}: {
  imageUrl: string;
  caption: string;
  onClose: () => void;
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '750px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          animation: 'modalPopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative', height: '420px', background: '#000000' }}>
          <img
            src={imageUrl}
            alt={caption}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '20px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{caption}</span>
          <button onClick={onClose} style={{ background: 'var(--primary-cyan)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const BlogSection = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(getStoredBlogs);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

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

  useEffect(() => {
    fetch(`${getApiUrl()}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
          localStorage.setItem('jobsync_blogs_data', JSON.stringify(data.data));
        }
      })
      .catch(() => {});
  }, []);

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="blog-section" style={{ padding: '80px 0', backgroundColor: '#f8fafc' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ color: 'var(--primary-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px' }}>
              Latest Insights & Publications
            </span>
            <h2 style={{ fontSize: '32px', color: '#0f172a', marginTop: '6px' }}>Technology & Insights Blog</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Expert perspectives on Cloud Solutions, Cybersecurity, and Software Architecture.</p>
          </div>
          <button
            className="btn-solid"
            onClick={() => {
              setActiveTab('blog');
              window.scrollTo(0, 0);
            }}
            style={{ padding: '12px 26px', fontSize: '14px', borderRadius: '30px' }}
          >
            Read All Articles &rarr;
          </button>
        </div>

        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {blogs.slice(0, 3).map((post) => {
            return (
              <article
                key={post.id}
                className="blog-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease, boxShadow 0.3s ease'
                }}
              >
                <div>
                  {/* AUTOMATIC CROSS-FADING SLIDESHOW HEADER */}
                  <BlogCardSlideshow
                    post={post}
                    onImageClick={() => setPreviewPost(post)}
                  />

                  <div style={{ padding: '24px', cursor: 'pointer' }} onClick={() => { setActiveTab('blog'); window.scrollTo(0, 0); }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                      <span>⏱️ {post.readTime}</span>
                    </div>
                    <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800', marginBottom: '10px', lineHeight: '1.4' }}>{post.title}</h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>{post.excerpt}</p>
                  </div>
                </div>

                <div
                  style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => { setActiveTab('blog'); window.scrollTo(0, 0); }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>📅 {post.date}</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-cyan)' }}>Read Article &rarr;</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {previewPost && (
        <BriefContentModal
          post={previewPost}
          onClose={() => setPreviewPost(null)}
          onReadFull={() => {
            setPreviewPost(null);
            setActiveTab('blog');
            window.scrollTo(0, 0);
          }}
        />
      )}
    </section>
  );
};

export const BlogPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(getStoredBlogs);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState<{ url: string; index: number } | null>(null);

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

  useEffect(() => {
    fetch(`${getApiUrl()}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data);
          localStorage.setItem('jobsync_blogs_data', JSON.stringify(data.data));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="blog-page">

      {/* Hero Header */}
      <div style={{ background: 'var(--navy-gradient)', color: 'white', padding: '75px 0', textAlign: 'center', borderBottom: '3px solid var(--primary-cyan)' }}>
        <div className="container">
          <span style={{ background: 'rgba(43, 182, 180, 0.15)', color: 'var(--primary-cyan)', padding: '8px 20px', borderRadius: '30px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block', marginBottom: '16px', border: '1px solid rgba(43, 182, 180, 0.3)' }}>
            LATEST INSIGHTS & ARTICLES
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>
            The Jobsync Technology Blog
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: '1.6' }}>
            Explore industry insights, technology trends, and architectural best practices from our cloud, cybersecurity, and software experts.
          </p>
        </div>
      </div>

      <div style={{ padding: '60px 0 90px', backgroundColor: '#f8fafc' }}>
        <div className="container">
          {selectedPost ? (
            /* DETAILED POST READER VIEW */
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '44px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', maxWidth: '920px', margin: '0 auto', border: '1px solid #e2e8f0' }}>
              <button
                className="btn-outline"
                onClick={() => setSelectedPost(null)}
                style={{ marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px', borderRadius: '25px' }}
              >
                &larr; Back to All Articles
              </button>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary-cyan)', padding: '6px 16px', borderRadius: '20px', fontWeight: '800', fontSize: '12px' }}>
                  {selectedPost.category}
                </span>
              </div>

              <h1 style={{ fontSize: '30px', color: '#0f172a', fontWeight: '900', marginBottom: '20px', lineHeight: '1.3' }}>
                {selectedPost.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' }}>
                  📅
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '700' }}>Published on {selectedPost.date}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Estimated Read: {selectedPost.readTime}</p>
                </div>
              </div>

              {Boolean(selectedPost.coverImage && selectedPost.coverImage.trim() !== '') && (
                <div
                  className="blog-img-card"
                  style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '32px', maxHeight: '440px' }}
                  onClick={() => setPreviewPost(selectedPost)}
                >
                  <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    style={{ width: '100%', height: '100%', maxHeight: '440px', objectFit: 'cover' }}
                  />
                  <div className="blog-img-card-overlay">
                    <span className="blog-quick-badge">
                      <span>👁️</span> Click to View Brief Content & Summary
                    </span>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-line', marginBottom: '40px' }}>
                {selectedPost.content}
              </div>

              {/* Photo Gallery Grid */}
              {Array.isArray(selectedPost.images) && selectedPost.images.length > 0 && (
                <div style={{ marginTop: '40px', marginBottom: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '30px' }}>
                  <h3 style={{ fontSize: '20px', color: '#0f172a', fontWeight: '800', marginBottom: '18px' }}>
                    📸 Article Gallery ({selectedPost.images.length})
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {selectedPost.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="blog-img-card"
                        style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative', background: '#f1f5f9' }}
                        onClick={() => setActiveGalleryImg({ url: imgUrl, index: idx + 1 })}
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery image ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="blog-img-card-overlay">
                          <span className="blog-quick-badge" style={{ fontSize: '11px', padding: '6px 12px' }}>
                            🔍 View Photo {idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Footer */}
              <div style={{ background: 'var(--navy-gradient)', color: 'white', borderRadius: '16px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', border: '1px solid rgba(43, 182, 180, 0.2)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'white' }}>Need Technical Guidance for Your Enterprise?</h3>
                  <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>Schedule a consultation with our technology architecture experts.</p>
                </div>
                <button
                  className="btn-solid"
                  onClick={() => setActiveTab('contact')}
                  style={{ padding: '14px 28px', fontSize: '14px', borderRadius: '30px' }}
                >
                  Consult IT Experts &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* ALL BLOGS LIST */
            <>
              {blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '70px 20px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
                  <h3 style={{ fontSize: '20px', color: '#0f172a', fontWeight: '800', marginBottom: '8px' }}>No Blog Articles Published Yet</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                    Log into the Admin Portal (at <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>/admin</code>) to publish your first article!
                  </p>
                </div>
              ) : (
                <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
                  {blogs.map((post) => {
                    return (
                      <article
                        key={post.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                      >
                        <div>
                          {/* AUTOMATIC CROSS-FADING SLIDESHOW HEADER */}
                          <BlogCardSlideshow
                            post={post}
                            onImageClick={() => setPreviewPost(post)}
                          />

                          <div style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setSelectedPost(post)}>
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                              <span>⏱️ {post.readTime}</span>
                            </div>
                            <h3 style={{ fontSize: '19px', color: '#0f172a', fontWeight: '800', marginBottom: '12px', lineHeight: '1.4' }}>{post.title}</h3>
                            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>{post.excerpt}</p>
                          </div>
                        </div>

                        <div
                          style={{ padding: '18px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                          onClick={() => setSelectedPost(post)}
                        >
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>📅 {post.date}</span>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-cyan)' }}>Read Article &rarr;</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {previewPost && (
        <BriefContentModal
          post={previewPost}
          onClose={() => setPreviewPost(null)}
          onReadFull={(post) => {
            setPreviewPost(null);
            setSelectedPost(post);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
        />
      )}

      {activeGalleryImg && selectedPost && (
        <GalleryImageModal
          imageUrl={activeGalleryImg.url}
          caption={`Gallery Image ${activeGalleryImg.index} of ${selectedPost.images?.length || 0} • ${selectedPost.title}`}
          onClose={() => setActiveGalleryImg(null)}
        />
      )}
    </div>
  );
};
