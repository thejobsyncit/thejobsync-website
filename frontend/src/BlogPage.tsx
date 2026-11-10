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
      style={{ height: '220px', overflow: 'hidden', position: 'relative', background: '#0b172a', borderRadius: '8px 8px 0 0' }}
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
        <span className="blog-quick-badge" style={{ borderRadius: '2px' }}>
          Click to view brief summary
        </span>
      </div>

      {/* Slide Progress Dots - Plain dots with no pill background bar */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            zIndex: 3
          }}
        >
          {images.map((_, i) => (
            <span
              key={i}
              style={{
                width: currentIdx === i ? '14px' : '6px',
                height: '4px',
                borderRadius: '1px',
                background: currentIdx === i ? '#ffffff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease'
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
          borderRadius: '2px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e2e8f0',
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
              borderRadius: '2px',
              width: '32px',
              height: '32px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
              background: '#0f766e',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: '600',
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
                zIndex: 4
              }}
            >
              {images.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: modalSlideIdx === i ? '14px' : '6px',
                    height: '4px',
                    borderRadius: '1px',
                    background: modalSlideIdx === i ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span>Published {post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <h2 style={{ fontSize: '22px', color: '#0f172a', fontWeight: '700', marginBottom: '16px', lineHeight: '1.3' }}>
            {post.title}
          </h2>

          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '2px', borderLeft: '3px solid #0f766e', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#0f766e', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Summary
            </h4>
            <p style={{ margin: 0, fontSize: '14.5px', color: '#334155', lineHeight: '1.6' }}>
              {post.excerpt || post.content.slice(0, 220) + '...'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              style={{ padding: '10px 20px', borderRadius: '2px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              Close
            </button>
            <button
              className="btn-rect-primary"
              onClick={() => onReadFull(post)}
              style={{ padding: '10px 24px', borderRadius: '2px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Read full article &rarr;
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
          borderRadius: '2px',
          maxWidth: '750px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
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
              borderRadius: '2px',
              width: '32px',
              height: '32px',
              fontSize: '14px',
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
        <div style={{ padding: '16px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{caption}</span>
          <button onClick={onClose} className="btn-rect-primary" style={{ padding: '8px 16px', borderRadius: '2px', fontSize: '13px', cursor: 'pointer' }}>
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
    <section className="blog-section" style={{ padding: '80px 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="eyebrow-plain" style={{ color: '#0f766e', fontWeight: '600', fontSize: '13px' }}>
              Latest insights &amp; publications
            </span>
            <h2 className="editorial-heading" style={{ fontSize: '32px', color: '#0f172a', margin: '4px 0 0 0' }}>Technology &amp; Insights Blog</h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginTop: '6px' }}>Expert perspectives on Cloud Solutions, Cybersecurity, and Software Architecture.</p>
          </div>
          <button
            className="btn-rect-outline"
            onClick={() => {
              setActiveTab('blog');
              window.scrollTo(0, 0);
            }}
          >
            Read All Articles &rarr;
          </button>
        </div>

        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {blogs.slice(0, 3).map((post) => {
            return (
              <article
                key={post.id}
                className="blog-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.25s ease, background-color 0.25s ease'
                }}
              >
                <div>
                  {/* AUTOMATIC CROSS-FADING SLIDESHOW HEADER */}
                  <BlogCardSlideshow
                    post={post}
                    onImageClick={() => setPreviewPost(post)}
                  />

                  <div style={{ padding: '24px', cursor: 'pointer' }} onClick={() => { setActiveTab('blog'); window.scrollTo(0, 0); }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f766e', display: 'block', marginBottom: '6px' }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '10px', lineHeight: '1.4' }}>{post.title}</h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>{post.excerpt}</p>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => { setActiveTab('blog'); window.scrollTo(0, 0); }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>{post.date}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f766e' }}>Read article &rarr;</span>
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
            Blog
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: '#94a3b8', fontSize: '16px', lineHeight: 1.6 }}>
            News, events and notes from The Jobsync team.
          </p>
        </div>
      </div>

      <div style={{ padding: '45px 0 90px', background: 'transparent' }}>
        <div className="container">
          {selectedPost ? (
            /* DETAILED POST READER VIEW */
            <div style={{ background: '#ffffff', borderRadius: '2px', padding: '36px', boxShadow: 'none', maxWidth: '720px', margin: '0 auto', border: '1px solid #e2e8f0' }}>
              <button
                className="btn-rect-outline"
                onClick={() => setSelectedPost(null)}
                style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', borderRadius: '2px' }}
              >
                &larr; Back to all articles
              </button>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#0f766e', fontWeight: '600', fontSize: '13px' }}>
                  {selectedPost.category}
                </span>
              </div>

              <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: '700', marginBottom: '16px', lineHeight: '1.3' }}>
                {selectedPost.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', fontSize: '13px', color: '#64748b' }}>
                <span>Published on {selectedPost.date}</span>
                <span>·</span>
                <span>Estimated read: {selectedPost.readTime}</span>
              </div>

              {Boolean(selectedPost.coverImage && selectedPost.coverImage.trim() !== '') && (
                <div
                  className="blog-img-card"
                  style={{ borderRadius: '2px', overflow: 'hidden', marginBottom: '28px', maxHeight: '420px', border: '1px solid #e2e8f0' }}
                  onClick={() => setPreviewPost(selectedPost)}
                >
                  <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'cover' }}
                  />
                  <div className="blog-img-card-overlay">
                    <span className="blog-quick-badge" style={{ borderRadius: '2px' }}>
                      Click to view brief summary
                    </span>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '15.5px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-line', marginBottom: '36px' }}>
                {selectedPost.content}
              </div>

              {/* Photo Gallery Grid */}
              {Array.isArray(selectedPost.images) && selectedPost.images.length > 0 && (
                <div style={{ marginTop: '36px', marginBottom: '36px', borderTop: '1px solid #e2e8f0', paddingTop: '28px' }}>
                  <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '16px' }}>
                    Article Gallery ({selectedPost.images.length})
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                    {selectedPost.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="blog-img-card"
                        style={{ height: '180px', borderRadius: '2px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: 'none', position: 'relative', background: '#f1f5f9' }}
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
                          <span className="blog-quick-badge" style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '2px' }}>
                            View photo {idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Footer */}
              <div style={{ background: '#0b172a', color: 'white', borderRadius: '2px', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px', border: '1px solid #1e293b' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', color: 'white', fontWeight: '700' }}>Need technical guidance for your project?</h3>
                  <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>Schedule a consultation with our technology architecture team.</p>
                </div>
                <button
                  className="btn-rect-primary"
                  onClick={() => setActiveTab('contact')}
                  style={{ padding: '10px 22px', fontSize: '14px', borderRadius: '2px', cursor: 'pointer' }}
                >
                  Consult IT experts &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* ALL BLOGS LIST */
            <>
              {blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '2px', border: '1px solid #e2e8f0', maxWidth: '580px', margin: '0 auto', boxShadow: 'none' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>📰</div>
                  <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '8px' }}>No Blog Articles Published Yet</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                    Log into the Admin Portal (at <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '2px' }}>/admin</code>) to publish your first article.
                  </p>
                </div>
              ) : (
                <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {blogs.map((post) => {
                    return (
                      <article
                        key={post.id}
                        className="blog-card"
                        style={{
                          background: '#ffffff',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: 'none',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'border-color 0.25s ease, background-color 0.25s ease'
                        }}
                      >
                        <div>
                          {/* AUTOMATIC CROSS-FADING SLIDESHOW HEADER */}
                          <BlogCardSlideshow
                            post={post}
                            onImageClick={() => setPreviewPost(post)}
                          />

                          <div style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setSelectedPost(post)}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f766e', display: 'block', marginBottom: '6px' }}>
                              {post.category}
                            </span>
                            <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', marginBottom: '10px', lineHeight: '1.4' }}>{post.title}</h3>
                            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '14px' }}>{post.excerpt}</p>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{ padding: '14px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                          onClick={() => setSelectedPost(post)}
                        >
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>{post.date}</span>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f766e' }}>Read article &rarr;</span>
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
