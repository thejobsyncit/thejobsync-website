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
  excerpt: string;
  content: string;
}

const getStoredBlogs = (): BlogPost[] => {
  try {
    const saved = localStorage.getItem('jobsync_blogs_data');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const BlogSection = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(getStoredBlogs);

  useEffect(() => {
    fetch('/api/blogs')
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
    return null; // Don't show homepage section if no blogs exist yet
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
            const hasImage = Boolean(post.coverImage && post.coverImage.trim() !== '');
            return (
              <article
                key={post.id}
                className="blog-card"
                onClick={() => {
                  setActiveTab('blog');
                  window.scrollTo(0, 0);
                }}
                style={{
                  cursor: 'pointer',
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <div>
                  {hasImage && (
                    <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                      <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(15, 23, 42, 0.9)', color: 'var(--primary-cyan)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', border: '1px solid rgba(14,165,233,0.3)' }}>
                        {post.category}
                      </span>
                    </div>
                  )}

                  <div style={{ padding: '24px' }}>
                    {!hasImage && (
                      <span style={{ display: 'inline-block', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary-cyan)', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '800', marginBottom: '12px' }}>
                        {post.category}
                      </span>
                    )}
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: '800', marginBottom: '10px', lineHeight: '1.4' }}>{post.title}</h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>{post.excerpt}</p>
                  </div>
                </div>

                <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>By {post.author}</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-cyan)' }}>Read Article &rarr;</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const BlogPage = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(getStoredBlogs);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch('/api/blogs')
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
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: '70px 0', textAlign: 'center', borderBottom: '3px solid var(--primary-cyan)' }}>
        <div className="container">
          <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: 'var(--primary-cyan)', padding: '8px 20px', borderRadius: '30px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block', marginBottom: '16px', border: '1px solid rgba(14,165,233,0.3)' }}>
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
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-cyan)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' }}>
                  {selectedPost.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: '700' }}>{selectedPost.author}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{selectedPost.authorRole || 'Contributor'} • Published: {selectedPost.date} • {selectedPost.readTime}</p>
                </div>
              </div>

              {Boolean(selectedPost.coverImage && selectedPost.coverImage.trim() !== '') && (
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  style={{ width: '100%', maxHeight: '440px', objectFit: 'cover', borderRadius: '14px', marginBottom: '32px' }}
                />
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
                      <div key={idx} style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <img src={imgUrl} alt={`Gallery image ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Footer */}
              <div style={{ background: '#0f172a', color: 'white', borderRadius: '16px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
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
                    const hasImage = Boolean(post.coverImage && post.coverImage.trim() !== '');
                    return (
                      <article
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        style={{
                          background: '#ffffff',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                      >
                        <div>
                          {hasImage && (
                            <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                              <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(15, 23, 42, 0.9)', color: 'var(--primary-cyan)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', border: '1px solid rgba(14,165,233,0.3)' }}>
                                {post.category}
                              </span>
                            </div>
                          )}

                          <div style={{ padding: '24px' }}>
                            {!hasImage && (
                              <span style={{ display: 'inline-block', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary-cyan)', padding: '4px 12px', borderRadius: '15px', fontSize: '11px', fontWeight: '800', marginBottom: '12px' }}>
                                {post.category}
                              </span>
                            )}
                            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                              <span>{post.date}</span>
                              <span>•</span>
                              <span>{post.readTime}</span>
                            </div>
                            <h3 style={{ fontSize: '19px', color: '#0f172a', fontWeight: '800', marginBottom: '12px', lineHeight: '1.4' }}>{post.title}</h3>
                            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>{post.excerpt}</p>
                          </div>
                        </div>

                        <div style={{ padding: '18px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>By {post.author}</span>
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
    </div>
  );
};
